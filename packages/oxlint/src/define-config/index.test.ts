import { beforeEach, expect, test, vi } from 'vitest';
import configCore from '../config-default/index.ts';

beforeEach(() => {
	vi.resetModules();
});

test('defines a valid Oxlint config', async () => {
	/* @ts-expect-error */
	vi.doMock('@standard-config/oxlint-react', () => undefined);

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
