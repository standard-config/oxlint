import '@standard-config/utilities/mocks/transform-plugin';
import { beforeEach, expect, test, vi } from 'vitest';
import configCore from '../config-default/index.ts';

beforeEach(() => {
	vi.resetModules();
});

const NO_MODULE = () => undefined as never;

test('defines a valid Oxlint config', async () => {
	vi.doMock('@standard-config/oxlint-react', NO_MODULE);
	vi.doMock('@standard-config/oxlint-stylistic', NO_MODULE);

	const { default: defineConfig } = await import('./index.ts');

	let config = defineConfig();

	expect(config).toStrictEqual(configCore);
	expect(config).not.toHaveProperty('jsPlugins');
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'unicorn/no-null': 'off',
		})
	);

	config = defineConfig({
		ignorePatterns: ['fixtures/**'],
		rules: {
			'unicorn/no-null': 'error',
		},
	});

	expect(config).toHaveProperty(
		'ignorePatterns',
		expect.arrayContaining(['fixtures/**'])
	);
	expect(config).not.toHaveProperty('jsPlugins');
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'unicorn/no-null': 'error',
		})
	);

	config = defineConfig(
		{
			rules: {
				'unicorn/no-null': 'warn',
				'unicorn/no-useless-undefined': 'error',
			},
		},
		{
			ignorePatterns: ['fixtures/**'],
			rules: {
				'unicorn/no-null': 'error',
			},
		}
	);

	expect(config).toHaveProperty(
		'ignorePatterns',
		expect.arrayContaining(['fixtures/**'])
	);
	expect(config).not.toHaveProperty('jsPlugins');
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'unicorn/no-null': 'error',
			'unicorn/no-useless-undefined': 'error',
		})
	);
});

test('includes `@standard-config/oxlint-react` when it’s available', async () => {
	vi.doUnmock('@standard-config/oxlint-react');
	vi.doMock('@standard-config/oxlint-stylistic', NO_MODULE);

	const { default: defineConfig } = await import('./index.ts');

	const config = defineConfig();

	expect(config).not.toStrictEqual(configCore);
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'react/jsx-key': 'error',
			'unicorn/no-null': 'off',
		})
	);
	expect(config).toMatchSnapshot();
});

test('includes `@standard-config/oxlint-stylistic` when it’s available', async () => {
	vi.doMock('@standard-config/oxlint-react', NO_MODULE);
	vi.doUnmock('@standard-config/oxlint-stylistic');

	const { default: defineConfig } = await import('./index.ts');

	const config = defineConfig();

	expect(config).not.toStrictEqual(configCore);
	expect(config).toHaveProperty('jsPlugins', expect.any(Array));
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'perfectionist/sort-imports': expect.arrayContaining(['error']),
			'unicorn/no-null': 'off',
		})
	);
	expect(config).toMatchSnapshot();
});

test('includes all available supplemental configs', async () => {
	vi.doUnmock('@standard-config/oxlint-react');
	vi.doUnmock('@standard-config/oxlint-stylistic');

	const { default: defineConfig } = await import('./index.ts');

	const config = defineConfig();

	expect(config).not.toStrictEqual(configCore);
	expect(config).toHaveProperty('jsPlugins', expect.any(Array));
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'perfectionist/sort-imports': expect.arrayContaining(['error']),
			'react/jsx-key': 'error',
			'unicorn/no-null': 'off',
		})
	);
	expect(config).toMatchSnapshot();
});
