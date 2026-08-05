import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const SCRIPT_DIRECTORY = import.meta.dirname;
const RULE_NAME_SEPARATOR = '/';
const RELEASE_TIMEOUT_MS = 15_000;

const findRepositoryRoot = (startPath: string): string => {
	let currentPath = resolve(startPath);

	while (true) {
		if (
			existsSync(join(currentPath, 'packages')) &&
			existsSync(join(currentPath, 'pnpm-workspace.yaml'))
		) {
			return currentPath;
		}

		const parentPath = dirname(currentPath);

		if (parentPath === currentPath) {
			throw new Error(
				`Could not find the repository root above ${startPath}.`
			);
		}

		currentPath = parentPath;
	}
};

const REPOSITORY_ROOT = findRepositoryRoot(SCRIPT_DIRECTORY);
const requireFromSkill = createRequire(import.meta.url);
const OXLINT_PACKAGE_PATH = requireFromSkill.resolve('oxlint/package.json');
const OXLINT_BIN_PATH = join(dirname(OXLINT_PACKAGE_PATH), 'bin', 'oxlint');

type CliOptions = {
	help: boolean;
	json: boolean;
	releaseNotes: boolean;
	releaseUrl?: string;
};

type ConfigSource = {
	ownedPlugins: string[];
	rules: string[];
};

type InventoryOptions = {
	registry: RuleRegistry;
	repositoryRoot: string;
	version: string;
};

type PackageInventory = {
	configuredStableRuleCount: number;
	missingBaseRulesForOverrides: Array<{
		configPath: string;
		rule: string;
	}>;
	missingStableRules: string[];
	ownedPlugins: string[];
	packageName: string;
	packagePath: string;
	stableRuleCount: number;
	unrecognizedOwnedPlugins: string[];
	unsupportedConfiguredRules: Array<{
		configPath: string;
		rule: string;
	}>;
};

type ReleaseNotes = {
	body: string;
	requestedUrl: string;
	url: string;
};

export type InventoryReport = {
	hasErrors: boolean;
	packages: PackageInventory[];
	registry: {
		nurseryRuleCount: number;
		stableRuleCount: number;
		totalRuleCount: number;
	};
	releaseUrl: string;
	version: string;
};

export type RegistryRule = {
	category: string;
	name: string;
	source: string;
};

export type RuleRegistry = {
	categoryCounts: Record<string, number>;
	rules: RegistryRule[];
	totalRuleCount: number;
};

export class RegistryFormatError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'RegistryFormatError';
	}
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizePluginName = (plugin: string): string =>
	plugin.replaceAll('_', '-');

const normalizeRuleName = (rule: string): string => {
	const separatorIndex = rule.indexOf(RULE_NAME_SEPARATOR);

	if (separatorIndex === -1) {
		return rule;
	}

	return `${normalizePluginName(rule.slice(0, separatorIndex))}${rule.slice(separatorIndex)}`;
};

const getRuleSource = (rule: string): string =>
	normalizePluginName(rule.split(RULE_NAME_SEPARATOR, 1)[0] ?? '');

const getPropertyName = (name: ts.PropertyName): string | undefined => {
	if (
		ts.isIdentifier(name) ||
		ts.isNumericLiteral(name) ||
		ts.isStringLiteralLike(name)
	) {
		return name.text;
	}

	return undefined;
};

const unwrapExpression = (expression: ts.Expression): ts.Expression => {
	let currentExpression = expression;

	while (
		ts.isAsExpression(currentExpression) ||
		ts.isNonNullExpression(currentExpression) ||
		ts.isParenthesizedExpression(currentExpression) ||
		ts.isSatisfiesExpression(currentExpression) ||
		ts.isTypeAssertionExpression(currentExpression)
	) {
		currentExpression = currentExpression.expression;
	}

	return currentExpression;
};

const collectVariables = (
	sourceFile: ts.SourceFile
): Map<string, ts.Expression> => {
	const variables = new Map<string, ts.Expression>();

	for (const statement of sourceFile.statements) {
		if (!ts.isVariableStatement(statement)) {
			continue;
		}

		for (const declaration of statement.declarationList.declarations) {
			if (ts.isIdentifier(declaration.name) && declaration.initializer) {
				variables.set(declaration.name.text, declaration.initializer);
			}
		}
	}

	return variables;
};

const resolveExpression = (
	expression: ts.Expression,
	variables: ReadonlyMap<string, ts.Expression>,
	seenIdentifiers = new Set<string>()
): ts.Expression => {
	const unwrappedExpression = unwrapExpression(expression);

	if (!ts.isIdentifier(unwrappedExpression)) {
		return unwrappedExpression;
	}

	if (seenIdentifiers.has(unwrappedExpression.text)) {
		return unwrappedExpression;
	}

	const initializer = variables.get(unwrappedExpression.text);

	if (!initializer) {
		return unwrappedExpression;
	}

	seenIdentifiers.add(unwrappedExpression.text);
	return resolveExpression(initializer, variables, seenIdentifiers);
};

const findProperty = (
	objectLiteral: ts.ObjectLiteralExpression,
	propertyName: string
): ts.PropertyAssignment | undefined => {
	for (const property of objectLiteral.properties) {
		if (
			ts.isPropertyAssignment(property) &&
			getPropertyName(property.name) === propertyName
		) {
			return property;
		}
	}

	return undefined;
};

const collectDirectStringArrayEntries = (
	expression: ts.Expression,
	variables: ReadonlyMap<string, ts.Expression>
): string[] => {
	const resolvedExpression = resolveExpression(expression, variables);

	if (!ts.isArrayLiteralExpression(resolvedExpression)) {
		return [];
	}

	const values: string[] = [];

	for (const element of resolvedExpression.elements) {
		const resolvedElement = unwrapExpression(element);

		if (ts.isStringLiteralLike(resolvedElement)) {
			values.push(resolvedElement.text);
		}
	}

	return values;
};

const collectRuleMapEntries = (
	expression: ts.Expression,
	variables: ReadonlyMap<string, ts.Expression>,
	rules: Set<string>,
	seenIdentifiers = new Set<string>()
): void => {
	const unwrappedExpression = unwrapExpression(expression);

	if (ts.isIdentifier(unwrappedExpression)) {
		if (seenIdentifiers.has(unwrappedExpression.text)) {
			return;
		}

		const initializer = variables.get(unwrappedExpression.text);

		if (initializer) {
			seenIdentifiers.add(unwrappedExpression.text);
			collectRuleMapEntries(
				initializer,
				variables,
				rules,
				seenIdentifiers
			);
		}

		return;
	}

	if (ts.isConditionalExpression(unwrappedExpression)) {
		collectRuleMapEntries(
			unwrappedExpression.whenTrue,
			variables,
			rules,
			new Set(seenIdentifiers)
		);
		collectRuleMapEntries(
			unwrappedExpression.whenFalse,
			variables,
			rules,
			new Set(seenIdentifiers)
		);
		return;
	}

	if (!ts.isObjectLiteralExpression(unwrappedExpression)) {
		return;
	}

	for (const property of unwrappedExpression.properties) {
		if (ts.isSpreadAssignment(property)) {
			collectRuleMapEntries(
				property.expression,
				variables,
				rules,
				new Set(seenIdentifiers)
			);
			continue;
		}

		if (!ts.isPropertyAssignment(property)) {
			continue;
		}

		const propertyName = getPropertyName(property.name);

		if (propertyName?.includes(RULE_NAME_SEPARATOR)) {
			rules.add(normalizeRuleName(propertyName));
		}
	}
};

/**
 * Parse the statically declared plugin ownership and rule names from a config
 * source file. Direct `plugins` entries are owned; spread entries are
 * supplemental.
 */
export const parseConfigSource = (
	sourceText: string,
	fileName = 'config.ts'
): ConfigSource => {
	const sourceFile = ts.createSourceFile(
		fileName,
		sourceText,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	);
	const variables = collectVariables(sourceFile);
	const configInitializer = variables.get('config');

	if (!configInitializer) {
		throw new Error(
			`Could not find a \`config\` declaration in ${fileName}.`
		);
	}

	const configExpression = resolveExpression(configInitializer, variables);

	if (!ts.isObjectLiteralExpression(configExpression)) {
		throw new Error(
			`The \`config\` declaration in ${fileName} is not an object.`
		);
	}

	const pluginsProperty = findProperty(configExpression, 'plugins');
	const ownedPlugins = pluginsProperty
		? collectDirectStringArrayEntries(
				pluginsProperty.initializer,
				variables
			)
		: [];

	const rules = new Set<string>();
	const rulesProperty = findProperty(configExpression, 'rules');

	if (rulesProperty) {
		collectRuleMapEntries(rulesProperty.initializer, variables, rules);
	}

	return {
		ownedPlugins: [
			...new Set(ownedPlugins.map(normalizePluginName)),
		].toSorted(),
		rules: [...rules].toSorted(),
	};
};

const parseRegistryTableRow = (
	line: string,
	category: string,
	lineNumber: number
): RegistryRule | undefined => {
	if (!line.startsWith('|')) {
		return undefined;
	}

	const cells = line
		.split('|')
		.slice(1, -1)
		.map((cell) => cell.trim());

	if (
		cells[0] === 'Rule name' ||
		cells[0] === undefined ||
		/^-+$/.test(cells[0])
	) {
		return undefined;
	}

	if (cells.length !== 5 || !cells[0] || !cells[1]) {
		throw new RegistryFormatError(
			`Unexpected rule table row at line ${lineNumber}: ${line}`
		);
	}

	return {
		category,
		name: cells[0],
		source: normalizePluginName(cells[1]),
	};
};

/**
 * Parse and validate the Markdown registry emitted by `oxlint --rules`.
 */
export const parseRuleRegistry = (output: string): RuleRegistry => {
	const categoryCounts = new Map<string, number>();
	const parsedCategoryCounts = new Map<string, number>();
	const rules: RegistryRule[] = [];
	let currentCategory: string | undefined;
	let declaredTotal: number | undefined;

	for (const [lineIndex, rawLine] of output.split(/\r?\n/).entries()) {
		const line = rawLine.trimEnd();
		const categoryMatch = /^## (.+?) \((\d+)\)$/.exec(line);
		const totalMatch = /^Total: (\d+)$/.exec(line);

		if (categoryMatch) {
			const [, category, categoryCount] = categoryMatch;

			if (!category || !categoryCount) {
				throw new RegistryFormatError(
					`Unexpected category heading at line ${String(lineIndex + 1)}.`
				);
			}

			currentCategory = category;
			categoryCounts.set(currentCategory, Number(categoryCount));
			continue;
		}

		if (totalMatch?.[1]) {
			declaredTotal = Number(totalMatch[1]);
			continue;
		}

		if (!currentCategory) {
			continue;
		}

		const rule = parseRegistryTableRow(
			line,
			currentCategory,
			lineIndex + 1
		);

		if (!rule) {
			continue;
		}

		rules.push(rule);
		parsedCategoryCounts.set(
			currentCategory,
			(parsedCategoryCounts.get(currentCategory) ?? 0) + 1
		);
	}

	if (categoryCounts.size === 0) {
		throw new RegistryFormatError('No Oxlint rule categories were found.');
	}

	if (declaredTotal === undefined) {
		throw new RegistryFormatError(
			'The Oxlint registry did not declare a total.'
		);
	}

	for (const [category, expectedCount] of categoryCounts) {
		const parsedCount = parsedCategoryCounts.get(category) ?? 0;

		if (parsedCount !== expectedCount) {
			throw new RegistryFormatError(
				`Category ${category} declared ${expectedCount} rules but ${parsedCount} were parsed.`
			);
		}
	}

	if (rules.length !== declaredTotal) {
		throw new RegistryFormatError(
			`The registry declared ${declaredTotal} rules but ${rules.length} were parsed.`
		);
	}

	const ruleKeys = new Set<string>();

	for (const rule of rules) {
		const ruleKey = `${rule.source}/${rule.name}`;

		if (ruleKeys.has(ruleKey)) {
			throw new RegistryFormatError(
				`Duplicate registry rule: ${ruleKey}.`
			);
		}

		ruleKeys.add(ruleKey);
	}

	return {
		categoryCounts: Object.fromEntries(categoryCounts),
		rules,
		totalRuleCount: declaredTotal,
	};
};

const runOxlint = (arguments_: string[]): string => {
	const result = spawnSync(
		process.execPath,
		[OXLINT_BIN_PATH, ...arguments_],
		{
			cwd: REPOSITORY_ROOT,
			encoding: 'utf8',
			env: {
				...process.env,
				FORCE_COLOR: '0',
				NO_COLOR: '1',
			},
		}
	);

	if (result.error) {
		throw new Error(`Could not execute Oxlint: ${result.error.message}`, {
			cause: result.error,
		});
	}

	if (result.status !== 0) {
		const detail = [result.stderr, result.stdout]
			.filter(Boolean)
			.join('\n')
			.trim();

		throw new Error(
			`Oxlint exited with status ${String(result.status)}${detail ? `:\n${detail}` : '.'}`
		);
	}

	return result.stdout;
};

const parseOxlintVersion = (output: string): string => {
	const version = /(?:Version:\s*)?(\d+\.\d+\.\d+(?:-[\w.-]+)?)/.exec(
		output
	)?.[1];

	if (!version) {
		throw new Error(
			`Could not parse the installed Oxlint version from: ${output}`
		);
	}

	return version;
};

const readConfigSource = (configPath: string): ConfigSource =>
	parseConfigSource(readFileSync(configPath, 'utf8'), configPath);

const readPackageName = (packagePath: string): string => {
	const packageJson: unknown = JSON.parse(readFileSync(packagePath, 'utf8'));

	if (!isRecord(packageJson) || typeof packageJson.name !== 'string') {
		throw new Error(`Could not read a package name from ${packagePath}.`);
	}

	return packageJson.name;
};

const isNurseryRule = (rule: RegistryRule): boolean =>
	rule.category.toLowerCase() === 'nursery';

export const buildInventory = ({
	registry,
	repositoryRoot,
	version,
}: InventoryOptions): InventoryReport => {
	const packagesPath = join(repositoryRoot, 'packages');
	const registryRuleKeys = new Set(
		registry.rules.map((rule) => `${rule.source}/${rule.name}`)
	);
	const registrySources = new Set(registry.rules.map((rule) => rule.source));
	const stableRules = registry.rules.filter((rule) => !isNurseryRule(rule));
	const packageInventories: PackageInventory[] = [];

	for (const packageEntry of readdirSync(packagesPath, {
		withFileTypes: true,
	}).toSorted((left, right) => left.name.localeCompare(right.name))) {
		if (!packageEntry.isDirectory()) {
			continue;
		}

		const packagePath = join(packagesPath, packageEntry.name);
		const packageJsonPath = join(packagePath, 'package.json');
		const sourcePath = join(packagePath, 'src');
		const baseConfigPath = join(sourcePath, 'config-base', 'index.ts');

		if (!existsSync(packageJsonPath) || !existsSync(baseConfigPath)) {
			continue;
		}

		const baseConfig = readConfigSource(baseConfigPath);
		const ownedPluginSet = new Set(baseConfig.ownedPlugins);
		const ownedStableRules = stableRules.filter((rule) =>
			ownedPluginSet.has(rule.source)
		);
		const missingStableRules = ownedStableRules
			.map((rule) => `${rule.source}/${rule.name}`)
			.filter((rule) => !baseConfig.rules.includes(rule))
			.toSorted();
		const overrideConfigs = readdirSync(sourcePath, {
			withFileTypes: true,
		})
			.filter(
				(entry) =>
					entry.isDirectory() &&
					entry.name.startsWith('config-') &&
					entry.name !== 'config-base' &&
					entry.name !== 'config-default'
			)
			.map((entry) => join(sourcePath, entry.name, 'index.ts'))
			.filter(existsSync)
			.toSorted();
		const missingBaseRulesForOverrides: PackageInventory['missingBaseRulesForOverrides'] =
			[];
		const unsupportedConfiguredRules: PackageInventory['unsupportedConfiguredRules'] =
			[];
		const configs = [baseConfigPath, ...overrideConfigs];

		for (const configPath of configs) {
			const config =
				configPath === baseConfigPath
					? baseConfig
					: readConfigSource(configPath);

			for (const rule of config.rules) {
				const source = getRuleSource(rule);

				if (
					registrySources.has(source) &&
					!registryRuleKeys.has(rule)
				) {
					unsupportedConfiguredRules.push({
						configPath: relative(repositoryRoot, configPath),
						rule,
					});
				}

				if (
					configPath !== baseConfigPath &&
					ownedPluginSet.has(source) &&
					!baseConfig.rules.includes(rule)
				) {
					missingBaseRulesForOverrides.push({
						configPath: relative(repositoryRoot, configPath),
						rule,
					});
				}
			}
		}

		const unrecognizedOwnedPlugins = baseConfig.ownedPlugins.filter(
			(plugin) => !registrySources.has(plugin)
		);

		packageInventories.push({
			configuredStableRuleCount:
				ownedStableRules.length - missingStableRules.length,
			missingBaseRulesForOverrides,
			missingStableRules,
			ownedPlugins: baseConfig.ownedPlugins,
			packageName: readPackageName(packageJsonPath),
			packagePath: relative(repositoryRoot, packagePath),
			stableRuleCount: ownedStableRules.length,
			unrecognizedOwnedPlugins,
			unsupportedConfiguredRules,
		});
	}

	const nurseryRuleCount = registry.rules.filter(isNurseryRule).length;
	const hasErrors = packageInventories.some(
		(packageInventory) =>
			packageInventory.missingBaseRulesForOverrides.length > 0 ||
			packageInventory.missingStableRules.length > 0 ||
			packageInventory.unrecognizedOwnedPlugins.length > 0 ||
			packageInventory.unsupportedConfiguredRules.length > 0
	);

	return {
		hasErrors,
		packages: packageInventories,
		registry: {
			nurseryRuleCount,
			stableRuleCount: registry.totalRuleCount - nurseryRuleCount,
			totalRuleCount: registry.totalRuleCount,
		},
		releaseUrl: getDefaultReleaseUrl(version),
		version,
	};
};

export const getDefaultReleaseUrl = (version: string): string =>
	`https://github.com/oxc-project/oxc/releases/tag/oxlint_v${encodeURIComponent(version)}`;

const decodeHtmlEntities = (value: string): string =>
	value
		.replaceAll(/&#x([\da-f]+);/gi, (_entity, codePoint: string) =>
			String.fromCodePoint(Number.parseInt(codePoint, 16))
		)
		.replaceAll(/&#(\d+);/g, (_entity, codePoint: string) =>
			String.fromCodePoint(Number(codePoint))
		)
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'")
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&amp;', '&');

export const extractReleaseNotesFromHtml = (html: string): string => {
	const releaseNotes =
		/<pre class="text-small color-fg-muted"[^>]*>([\s\S]*?)<\/pre>/.exec(
			html
		)?.[1];

	if (!releaseNotes) {
		throw new Error(
			'Could not find release notes in the GitHub release page.'
		);
	}

	return decodeHtmlEntities(releaseNotes).trim();
};

export const fetchReleaseNotes = async (
	version: string,
	releaseUrl = getDefaultReleaseUrl(version)
): Promise<ReleaseNotes> => {
	const response = await fetch(releaseUrl, {
		headers: {
			'Accept': 'text/html, application/vnd.github+json;q=0.9',
			'User-Agent': 'standard-config-oxlint-rule-inventory',
			'X-GitHub-Api-Version': '2022-11-28',
		},
		signal: AbortSignal.timeout(RELEASE_TIMEOUT_MS),
	});

	if (!response.ok) {
		throw new Error(
			`Release-note request failed with ${String(response.status)} ${response.statusText}.`
		);
	}

	const contentType = response.headers.get('content-type') ?? '';

	if (!contentType.includes('application/json')) {
		const responseBody = await response.text();

		return {
			body: contentType.includes('text/html')
				? extractReleaseNotesFromHtml(responseBody)
				: responseBody,
			requestedUrl: releaseUrl,
			url: response.url,
		};
	}

	const responseBody: unknown = await response.json();

	if (!isRecord(responseBody)) {
		throw new Error('The release-note response was not a JSON object.');
	}

	return {
		body:
			typeof responseBody.body === 'string'
				? responseBody.body
				: JSON.stringify(responseBody, undefined, 2),
		requestedUrl: releaseUrl,
		url:
			typeof responseBody.html_url === 'string'
				? responseBody.html_url
				: response.url,
	};
};

const parseCliOptions = (arguments_: string[]): CliOptions => {
	const options: CliOptions = {
		help: false,
		json: false,
		releaseNotes: false,
	};

	for (let index = 0; index < arguments_.length; index += 1) {
		const argument = arguments_[index];

		switch (argument) {
			case '--json':
				options.json = true;
				break;

			case '--release-notes':
				options.releaseNotes = true;
				break;

			case '--release-url': {
				const releaseUrl = arguments_[index + 1];

				if (!releaseUrl) {
					throw new Error('`--release-url` requires a URL.');
				}

				options.releaseNotes = true;
				options.releaseUrl = releaseUrl;
				index += 1;
				break;
			}

			case '--help':
				options.help = true;
				process.stdout.write(
					[
						'Usage: node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts [--json] [--release-notes] [--release-url <url>]',
						'',
						'  --json           Print machine-readable audit output.',
						'  --release-notes  Fetch release notes; failures are nonfatal.',
						'  --release-url    Fetch release notes from an explicit URL.',
						'',
					].join('\n')
				);
				process.exitCode = 0;
				return options;

			default:
				throw new Error(`Unknown argument: ${String(argument)}`);
		}
	}

	return options;
};

const formatIssueList = (
	label: string,
	issues: string[],
	output: string[]
): void => {
	if (issues.length === 0) {
		output.push(`  ${label}: no gaps`);
		return;
	}

	output.push(`  ${label}:`);

	for (const issue of issues) {
		output.push(`    ${issue}`);
	}
};

const formatInventory = (report: InventoryReport): string => {
	const output = [
		'Oxlint rule inventory',
		`Installed version: ${report.version}`,
		`Registry: ${String(report.registry.totalRuleCount)} total, ${String(report.registry.stableRuleCount)} stable, ${String(report.registry.nurseryRuleCount)} nursery excluded`,
		`Release URL: ${report.releaseUrl}`,
	];

	for (const packageInventory of report.packages) {
		output.push(
			'',
			`${packageInventory.packageName} (${packageInventory.packagePath})`,
			`  Owned core plugins: ${packageInventory.ownedPlugins.join(', ') || 'none'}`,
			`  Stable core rules: ${String(packageInventory.configuredStableRuleCount)}/${String(packageInventory.stableRuleCount)} configured`
		);
		formatIssueList(
			'Stable-rule inventory',
			packageInventory.missingStableRules,
			output
		);
		formatIssueList(
			'Base/override parity',
			packageInventory.missingBaseRulesForOverrides.map(
				(issue) => `${issue.rule} (${issue.configPath})`
			),
			output
		);
		formatIssueList(
			'Unsupported configured core rules',
			packageInventory.unsupportedConfiguredRules.map(
				(issue) => `${issue.rule} (${issue.configPath})`
			),
			output
		);
		formatIssueList(
			'Unrecognized owned core plugins',
			packageInventory.unrecognizedOwnedPlugins,
			output
		);
	}

	return `${output.join('\n')}\n`;
};

const runInventory = (): InventoryReport => {
	const version = parseOxlintVersion(runOxlint(['--version']));
	const registry = parseRuleRegistry(runOxlint(['--rules']));

	return buildInventory({
		registry,
		repositoryRoot: REPOSITORY_ROOT,
		version,
	});
};

const main = async (): Promise<void> => {
	const options = parseCliOptions(process.argv.slice(2));

	if (options.help) {
		return;
	}

	const report = runInventory();
	let releaseNotes: ReleaseNotes | undefined;
	let releaseNotesError: string | undefined;

	if (options.releaseNotes) {
		try {
			releaseNotes = await fetchReleaseNotes(
				report.version,
				options.releaseUrl
			);
		} catch (error) {
			releaseNotesError =
				error instanceof Error ? error.message : String(error);
		}
	}

	if (options.json) {
		process.stdout.write(
			`${JSON.stringify(
				{
					report,
					releaseNotes,
					releaseNotesError,
				},
				undefined,
				2
			)}\n`
		);
	} else {
		process.stdout.write(formatInventory(report));

		if (releaseNotes) {
			process.stdout.write(
				`\nRelease notes\nURL: ${releaseNotes.url}\n\n${releaseNotes.body.trim()}\n`
			);
		} else if (releaseNotesError) {
			process.stderr.write(
				`\nRelease notes could not be fetched; continuing with the installed registry: ${releaseNotesError}\n`
			);
		}
	}

	if (report.hasErrors) {
		process.exitCode = 1;
	}
};

const isMainModule =
	process.argv[1] !== undefined &&
	import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMainModule) {
	try {
		await main();
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		process.stderr.write(`Rule inventory failed: ${message}\n`);
		process.exitCode = 1;
	}
}
