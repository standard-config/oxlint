import type { RuleRegistry } from './inventory.ts';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
	buildInventory,
	extractReleaseNotesFromHtml,
	getDefaultReleaseUrl,
	parseConfigSource,
	parseRuleRegistry,
	RegistryFormatError,
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

void test('extracts Markdown from a GitHub release page', () => {
	assert.equal(
		extractReleaseNotesFromHtml(`
			<div class="commit-desc border-bottom">
				<pre class="text-small color-fg-muted" ># Oxlint
- Don’t add nursery rules
- A &amp; B</pre>
			</div>
		`),
		'# Oxlint\n- Don’t add nursery rules\n- A & B'
	);
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
