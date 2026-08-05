import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	extractReleaseNotesFromHtml,
	getDefaultReleaseUrl,
	parseConfigSource,
	parseRuleRegistry,
	RegistryFormatError,
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
