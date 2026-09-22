import type { RuleRegistry } from './inventory.ts';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
	buildInventory,
	fetchReleaseNotes,
	getDefaultReleaseUrl,
	parseConfigSource,
	parseRuleRegistry,
	RegistryFormatError,
	resolveRuleRegistry,
	resolveTrackedPaths,
} from './inventory.ts';

const VALID_REGISTRY = `## Correctness (2)
Code that is outright wrong or useless.
| Rule name | Source | Default | Enabled? | Fixable? |
| --------- | ------ | ------- | -------- | -------- |
| no-broken | eslint | ✅ | ✅ | |
| use-label | jsx_a11y | | | |

## Nursery (1)
New lints that are still under development.
| Rule name | Source | Default | Enabled? | Fixable? |
| --------- | ------ | ------- | -------- | -------- |
| experimental | eslint | | | |

Default: 1
Total: 3
`;

const DISCOVERY_REGISTRY: RuleRegistry = {
	categoryCounts: {
		Correctness: 1,
	},
	rules: [
		{
			category: 'Correctness',
			name: 'no-broken',
			source: 'eslint',
		},
	],
	totalRuleCount: 1,
};

const writePackageFixture = (
	repositoryRoot: string,
	packageDirectory: string,
	overrideDirectories: string[]
): void => {
	const packagePath = join(repositoryRoot, 'packages', packageDirectory);
	const baseConfigPath = join(packagePath, 'src', 'config-base');

	mkdirSync(baseConfigPath, { recursive: true });
	writeFileSync(
		join(packagePath, 'package.json'),
		`${JSON.stringify({ name: `@test/${packageDirectory}` })}\n`
	);
	writeFileSync(
		join(baseConfigPath, 'index.ts'),
		`const config = {
	plugins: ['eslint'],
	rules: {
		'eslint/no-broken': 'error',
	},
};
`
	);

	for (const overrideDirectory of overrideDirectories) {
		const overridePath = join(packagePath, 'src', overrideDirectory);

		mkdirSync(overridePath, { recursive: true });
		writeFileSync(
			join(overridePath, 'index.ts'),
			`const config = {
	rules: {
		'eslint/${overrideDirectory}': 'error',
	},
};
`
		);
	}
};

const createInventoryFixture = (): string => {
	const repositoryRoot = mkdtempSync(
		join(tmpdir(), 'sconfig-rule-inventory-')
	);

	writePackageFixture(repositoryRoot, 'tracked', [
		'config-tracked',
		'config-untracked',
	]);
	writePackageFixture(repositoryRoot, 'untracked', [
		'config-untracked-package',
	]);

	return repositoryRoot;
};

const assertRegistryFormatError = (
	callback: () => unknown,
	message: string
): void => {
	assert.throws(callback, (error: unknown) => {
		assert.ok(error instanceof RegistryFormatError);
		assert.equal(error.message, message);
		return true;
	});
};

void test('documents the proxy-aware invocation in CLI help', () => {
	const scriptPath = fileURLToPath(new URL('inventory.ts', import.meta.url));
	const result = spawnSync(process.execPath, [scriptPath, '--help'], {
		encoding: 'utf8',
	});

	assert.equal(result.error, undefined);
	assert.equal(result.status, 0);
	assert.equal(result.stderr, '');
	assert.equal(
		result.stdout.split('\n')[0],
		'Usage: NODE_USE_ENV_PROXY=1 node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts [--json] [--release-notes] [--tracked-only]'
	);
});

void test('parses and validates the Oxlint rule registry', () => {
	assert.deepEqual(parseRuleRegistry(VALID_REGISTRY), {
		categoryCounts: {
			Correctness: 2,
			Nursery: 1,
		},
		rules: [
			{
				category: 'Correctness',
				name: 'no-broken',
				source: 'eslint',
			},
			{
				category: 'Correctness',
				name: 'use-label',
				source: 'jsx-a11y',
			},
			{
				category: 'Nursery',
				name: 'experimental',
				source: 'eslint',
			},
		],
		totalRuleCount: 3,
	});
});

void test('rejects output without registry categories', () => {
	assertRegistryFormatError(
		() => parseRuleRegistry(''),
		'No Oxlint rule categories were found.'
	);
});

void test('rejects a registry category count mismatch', () => {
	assertRegistryFormatError(
		() =>
			parseRuleRegistry(
				VALID_REGISTRY.replace('Correctness (2)', 'Correctness (3)')
			),
		'Category Correctness declared 3 rules but 2 were parsed.'
	);
});

void test('rejects a registry total mismatch', () => {
	assertRegistryFormatError(
		() => parseRuleRegistry(VALID_REGISTRY.replace('Total: 3', 'Total: 4')),
		'The registry declared 4 rules but 3 were parsed.'
	);
});

void test('requests the Oxlint rule registry with an explicit output format', () => {
	let invocationCount = 0;

	const registry = resolveRuleRegistry((arguments_) => {
		invocationCount += 1;

		assert.deepEqual(arguments_, ['--rules', '--format=default']);

		return VALID_REGISTRY;
	});

	assert.equal(invocationCount, 1);
	assert.equal(registry.totalRuleCount, 3);
});

void test('infers ownership from direct plugin entries only', () => {
	const config = parseConfigSource(`
		const config = {
			plugins: [
				'react',
				...(includesCoreConfig() ? ['typescript'] as const : []),
			],
			rules: {
				'react/button-has-type': 'error',
				...(includesCoreConfig()
					? { 'typescript/no-restricted-types': 'off' }
					: {}),
			},
		};
	`);

	assert.deepEqual(config, {
		ownedPlugins: ['react'],
		rules: ['react/button-has-type', 'typescript/no-restricted-types'],
	});
});

void test('derives the exact GitHub release URL', () => {
	assert.equal(
		getDefaultReleaseUrl('1.77.0'),
		'https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.77.0'
	);
});

void test('fetches release Markdown from the GitHub API without decoding HTML entities', async () => {
	const body = '# Oxlint\n- Keep `<Thing>` &amp; unchanged\n';
	const url =
		'https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.85.0';
	let invocationCount = 0;

	const notes = await fetchReleaseNotes('1.85.0', async (input, options) => {
		invocationCount += 1;
		assert.equal(
			input,
			'https://api.github.com/repos/oxc-project/oxc/releases/tags/oxlint_v1.85.0'
		);
		assert.deepEqual(options?.headers, {
			'Accept': 'application/vnd.github+json',
			'User-Agent': 'standard-config-oxlint-rule-inventory',
			'X-GitHub-Api-Version': '2022-11-28',
		});
		assert.ok(options?.signal instanceof AbortSignal);
		assert.equal(options.signal.aborted, false);

		return Promise.resolve(Response.json({ body, html_url: url }));
	});

	assert.equal(invocationCount, 1);
	assert.deepEqual(notes, { body, url });
});

void test('accepts an empty release and falls back to its human-readable URL', async () => {
	assert.deepEqual(
		await fetchReleaseNotes('1.85.0', async () =>
			Promise.resolve(Response.json({ body: null }))
		),
		{
			body: '',
			url: 'https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.85.0',
		}
	);
});

void test('rejects a release API response that is not an object', async () => {
	await assert.rejects(
		fetchReleaseNotes('1.85.0', async () =>
			Promise.resolve(Response.json(null))
		),
		{ message: 'The release note response was not a JSON object.' }
	);
});

void test('rejects release metadata without a Markdown body', async () => {
	await assert.rejects(
		fetchReleaseNotes('1.85.0', async () =>
			Promise.resolve(Response.json({}))
		),
		{
			message:
				'The release note response must contain a Markdown body or null.',
		}
	);
});

void test('rejects an HTML response instead of scraping a release page', async () => {
	await assert.rejects(
		fetchReleaseNotes('1.85.0', async () =>
			Promise.resolve(new Response('<html>Release page</html>'))
		),
		SyntaxError
	);
});

void test('reports release API HTTP failures', async () => {
	await assert.rejects(
		fetchReleaseNotes('1.85.0', async () =>
			Promise.resolve(
				new Response(null, { status: 403, statusText: 'Forbidden' })
			)
		),
		{ message: 'Release note request failed with 403 Forbidden.' }
	);
});

void test('preserves release request network failures', async () => {
	const error = new TypeError('fetch failed');

	await assert.rejects(
		fetchReleaseNotes('1.85.0', async () => Promise.reject(error)),
		error
	);
});

void test('includes successful release notes in the JSON envelope', () => {
	const scriptPath = fileURLToPath(new URL('inventory.ts', import.meta.url));
	const arguments_ = [scriptPath, '--json', '--tracked-only'];
	const baseline = spawnSync(process.execPath, arguments_, {
		encoding: 'utf8',
	});
	const releaseNotes = {
		body: '# Oxlint\n',
		url: 'https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.85.0',
	};
	const preload = `globalThis.fetch = () => Promise.resolve(Response.json(${JSON.stringify(
		{
			body: releaseNotes.body,
			html_url: releaseNotes.url,
		}
	)}));`;
	const result = spawnSync(
		process.execPath,
		[
			'--import',
			`data:text/javascript,${encodeURIComponent(preload)}`,
			...arguments_,
			'--release-notes',
		],
		{ encoding: 'utf8' }
	);

	assert.equal(baseline.error, undefined);
	assert.equal(result.error, undefined);
	assert.notEqual(baseline.status, null);
	assert.equal(result.status, baseline.status);

	const baselineOutput: unknown = JSON.parse(baseline.stdout);

	assert.ok(typeof baselineOutput === 'object' && baselineOutput !== null);
	assert.deepEqual(Object.keys(baselineOutput), ['report']);
	assert.deepEqual(JSON.parse(result.stdout) as unknown, {
		...baselineOutput,
		releaseNotes,
	});
});

void test('preserves the inventory report and exit status when the release API fails', () => {
	const scriptPath = fileURLToPath(new URL('inventory.ts', import.meta.url));
	const arguments_ = [scriptPath, '--json', '--tracked-only'];
	const baseline = spawnSync(process.execPath, arguments_, {
		encoding: 'utf8',
	});
	const preload =
		"globalThis.fetch = () => Promise.resolve(new Response(null, { status: 403, statusText: 'Forbidden' }));";
	const result = spawnSync(
		process.execPath,
		[
			'--import',
			`data:text/javascript,${encodeURIComponent(preload)}`,
			...arguments_,
			'--release-notes',
		],
		{ encoding: 'utf8' }
	);

	assert.equal(baseline.error, undefined);
	assert.equal(result.error, undefined);
	assert.notEqual(baseline.status, null);
	assert.equal(result.status, baseline.status);

	const baselineOutput: unknown = JSON.parse(baseline.stdout);

	assert.ok(typeof baselineOutput === 'object' && baselineOutput !== null);
	assert.deepEqual(Object.keys(baselineOutput), ['report']);
	assert.deepEqual(JSON.parse(result.stdout) as unknown, {
		...baselineOutput,
		releaseNotesError: 'Release note request failed with 403 Forbidden.',
	});
});

void test('tracked-only inventory includes only tracked packages and overrides', () => {
	const repositoryRoot = createInventoryFixture();

	try {
		const report = buildInventory({
			registry: DISCOVERY_REGISTRY,
			repositoryRoot,
			trackedPaths: new Set([
				'packages/tracked/package.json',
				'packages/tracked/src/config-base/index.ts',
				'packages/tracked/src/config-tracked/index.ts',
			]),
			version: '1.0.0',
		});

		assert.deepEqual(
			report.packages.map(({ packageName }) => packageName),
			['@test/tracked']
		);

		const [trackedPackage] = report.packages;

		assert.ok(trackedPackage);
		assert.deepEqual(trackedPackage.unsupportedConfiguredRules, [
			{
				configPath: 'packages/tracked/src/config-tracked/index.ts',
				rule: 'eslint/config-tracked',
			},
		]);
	} finally {
		rmSync(repositoryRoot, { force: true, recursive: true });
	}
});

void test('default inventory retains filesystem package and override discovery', () => {
	const repositoryRoot = createInventoryFixture();

	try {
		const report = buildInventory({
			registry: DISCOVERY_REGISTRY,
			repositoryRoot,
			version: '1.0.0',
		});

		assert.deepEqual(
			report.packages.map(({ packageName }) => packageName),
			['@test/tracked', '@test/untracked']
		);

		const trackedPackage = report.packages.find(
			({ packageName }) => packageName === '@test/tracked'
		);

		assert.ok(trackedPackage);
		assert.deepEqual(
			trackedPackage.unsupportedConfiguredRules.map(
				({ configPath }) => configPath
			),
			[
				'packages/tracked/src/config-tracked/index.ts',
				'packages/tracked/src/config-untracked/index.ts',
			]
		);
	} finally {
		rmSync(repositoryRoot, { force: true, recursive: true });
	}
});

void test('resolves NUL-delimited tracked paths through Git on PATH', () => {
	const trackedPaths = resolveTrackedPaths(
		'/repository',
		(command, arguments_, cwd) => {
			assert.equal(command, 'git');
			assert.deepEqual(arguments_, ['ls-files', '-z', '--', 'packages']);
			assert.equal(cwd, '/repository');

			return {
				error: undefined,
				status: 0,
				stderr: '',
				stdout: './packages/tracked/package.json\0packages\\tracked\\src\\config-base\\index.ts\0',
			};
		}
	);

	assert.deepEqual(
		[...trackedPaths],
		[
			'packages/tracked/package.json',
			'packages/tracked/src/config-base/index.ts',
		]
	);
});

void test('fails closed when Git cannot resolve tracked paths', () => {
	let invocationCount = 0;

	assert.throws(
		() =>
			resolveTrackedPaths('/repository', () => {
				invocationCount += 1;

				return {
					error: undefined,
					status: 128,
					stderr: 'fatal: not a git repository',
					stdout: '',
				};
			}),
		(error: unknown) => {
			assert.ok(error instanceof Error);
			assert.match(
				error.message,
				/Could not resolve tracked package paths with `git ls-files -z -- packages`\./
			);
			assert.match(error.message, /valid Git checkout/);
			return true;
		}
	);
	assert.equal(invocationCount, 1);
});
