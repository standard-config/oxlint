import type { RuleRegistry } from './inventory.ts';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { describe, mock, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
	buildInventory,
	fetchReleaseNotes,
	getDefaultReleaseUrl,
	loadTypeScript,
	OPTIONS,
	parseConfigSource,
	parseRuleRegistry,
	RegistryFormatError,
	resolveRuleRegistry,
	resolveTrackedPaths,
} from './inventory.ts';

await loadTypeScript();

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
	const repositoryRoot = mkdtempSync(join(tmpdir(), 'audit-rules-'));

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

type Result = { status: number | null; stderr: string; stdout: string };

const SCRIPT_PATH = fileURLToPath(new URL('inventory.ts', import.meta.url));

const run = async (params: ReadonlyArray<string>): Promise<Result> =>
	new Promise((resolve, reject) => {
		const child = spawn(process.execPath, params);
		let stderr = '';
		let stdout = '';

		child.stderr.setEncoding('utf8').on('data', (chunk: string) => {
			stderr += chunk;
		});
		child.stdout.setEncoding('utf8').on('data', (chunk: string) => {
			stdout += chunk;
		});
		child.on('error', reject);
		child.on('close', (status) => {
			resolve({ status, stderr, stdout });
		});
	});

void describe('inventory', { concurrency: true }, () => {
	void test('documents the proxy-aware invocation in CLI help', async () => {
		const result = await run([SCRIPT_PATH, '--help']);

		assert.equal(result.status, 0);
		assert.equal(result.stderr, '');
		assert.equal(
			result.stdout.split('\n')[0],
			'Usage: NODE_USE_ENV_PROXY=1 node .agents/skills/audit-rules/scripts/inventory.ts [--json] [--release-notes] [--tracked-only]'
		);
	});

	void test('documents exactly the options the parser accepts', async () => {
		const { stdout } = await run([SCRIPT_PATH, '--help']);
		const [usage = '', ...lines] = stdout.split('\n');
		const usageOptions = [...usage.matchAll(/\[(--[a-z-]+)\]/g)].map(
			([, option]) => option
		);
		const documented = lines
			.filter((line) => line.startsWith('  --'))
			.map((line) => line.trim().split(/\s+/)[0]);

		assert.deepEqual(usageOptions, [...OPTIONS]);
		assert.deepEqual(documented, [...OPTIONS]);
	});

	void test('rejects unknown arguments with status 2', async () => {
		const result = await run([SCRIPT_PATH, '--bogus']);

		assert.equal(result.status, 2);
		assert.equal(result.stdout, '');
		assert.equal(
			result.stderr,
			'Rule inventory failed: Unknown argument: --bogus\n'
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
			() =>
				parseRuleRegistry(
					VALID_REGISTRY.replace('Total: 3', 'Total: 4')
				),
			'The registry declared 4 rules but 3 were parsed.'
		);
	});

	void test('requests the Oxlint rule registry with an explicit output format', () => {
		const execute = mock.fn((_params: string[]) => VALID_REGISTRY);

		const registry = resolveRuleRegistry(execute);

		assert.equal(execute.mock.callCount(), 1);
		assert.deepEqual(execute.mock.calls[0]?.arguments, [
			['--rules', '--format=default'],
		]);
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
		const request = mock.fn<typeof fetch>(async (_input, options) => {
			assert.ok(options?.signal instanceof AbortSignal);
			assert.equal(options.signal.aborted, false);

			return Promise.resolve(Response.json({ body, html_url: url }));
		});

		const notes = await fetchReleaseNotes('1.85.0', request);
		const [input, init] = request.mock.calls[0]?.arguments ?? [];

		assert.equal(request.mock.callCount(), 1);
		assert.equal(
			input,
			'https://api.github.com/repos/oxc-project/oxc/releases/tags/oxlint_v1.85.0'
		);
		assert.deepEqual(init?.headers, {
			'Accept': 'application/vnd.github+json',
			'User-Agent': 'standard-config-oxlint-rule-inventory',
			'X-GitHub-Api-Version': '2022-11-28',
		});
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
			(caughtError) => caughtError === error
		);
	});

	void test('includes successful release notes in the JSON envelope', async () => {
		const params = [SCRIPT_PATH, '--json', '--tracked-only'];
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
		const [baseline, result] = await Promise.all([
			run(params),
			run([
				'--import',
				`data:text/javascript,${encodeURIComponent(preload)}`,
				...params,
				'--release-notes',
			]),
		]);

		assert.notEqual(baseline.status, null);
		assert.equal(result.status, baseline.status);

		const baselineOutput: unknown = JSON.parse(baseline.stdout);

		assert.ok(
			typeof baselineOutput === 'object' && baselineOutput !== null
		);
		assert.deepEqual(Object.keys(baselineOutput), ['report']);
		assert.deepEqual(JSON.parse(result.stdout) as unknown, {
			...baselineOutput,
			releaseNotes,
		});
	});

	void test('preserves the inventory report and exit status when the release API fails', async () => {
		const params = [SCRIPT_PATH, '--json', '--tracked-only'];
		const preload =
			"globalThis.fetch = () => Promise.resolve(new Response(null, { status: 403, statusText: 'Forbidden' }));";
		const [baseline, result] = await Promise.all([
			run(params),
			run([
				'--import',
				`data:text/javascript,${encodeURIComponent(preload)}`,
				...params,
				'--release-notes',
			]),
		]);

		assert.notEqual(baseline.status, null);
		assert.equal(result.status, baseline.status);

		const baselineOutput: unknown = JSON.parse(baseline.stdout);

		assert.ok(
			typeof baselineOutput === 'object' && baselineOutput !== null
		);
		assert.deepEqual(Object.keys(baselineOutput), ['report']);
		assert.deepEqual(JSON.parse(result.stdout) as unknown, {
			...baselineOutput,
			releaseNotesError:
				'Release note request failed with 403 Forbidden.',
		});
	});

	void test('limits the inventory to tracked packages and overrides', () => {
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

	void test('discovers packages and overrides from the filesystem by default', () => {
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

	void test('resolves NUL-delimited tracked paths through Git on `PATH`', () => {
		const execute = mock.fn(
			(_command: string, _params: string[], _cwd: string) => ({
				error: undefined,
				status: 0,
				stderr: '',
				stdout: './packages/tracked/package.json\0packages\\tracked\\src\\config-base\\index.ts\0',
			})
		);

		const trackedPaths = resolveTrackedPaths('/repository', execute);

		assert.equal(execute.mock.callCount(), 1);
		assert.deepEqual(execute.mock.calls[0]?.arguments, [
			'git',
			['ls-files', '-z', '--', 'packages'],
			'/repository',
		]);
		assert.deepEqual(
			[...trackedPaths],
			[
				'packages/tracked/package.json',
				'packages/tracked/src/config-base/index.ts',
			]
		);
	});

	void test('fails closed when Git cannot resolve tracked paths', () => {
		const execute = mock.fn(() => ({
			error: undefined,
			status: 128,
			stderr: 'fatal: not a git repository',
			stdout: '',
		}));

		assert.throws(
			() => resolveTrackedPaths('/repository', execute),
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
		assert.equal(execute.mock.callCount(), 1);
	});
});
