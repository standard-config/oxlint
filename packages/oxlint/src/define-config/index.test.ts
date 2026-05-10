import '@standard-config/utilities/mocks/resolve-plugin';
import { expect, test } from 'vitest';
import defineConfig from './index.ts';

test('defines a valid Oxlint config', () => {
	let config = defineConfig();

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
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'unicorn/no-null': 'error',
		})
	);

	config = defineConfig(
		{},
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
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'unicorn/no-null': 'error',
			'unicorn/no-useless-undefined': 'error',
		})
	);
});
