import '@standard-config/utilities/mocks/resolve-plugin';
import { expect, test } from 'vite-plus/test';
import defineConfig from './index.ts';

test('includes the core config by default', () => {
	const config = defineConfig();

	expect(config).toHaveProperty(['rules', 'unicorn/no-null'], 'off');
});

test('overrides the core config with a custom config', () => {
	const config = defineConfig({
		ignorePatterns: ['fixtures/**'],
		rules: {
			'unicorn/no-null': 'error',
		},
	});

	expect(config).toHaveProperty(
		'ignorePatterns',
		expect.arrayContaining(['fixtures/**'])
	);
	expect(config).toHaveProperty(['rules', 'unicorn/no-null'], 'error');
});

test('gives later configs precedence over earlier ones', () => {
	const config = defineConfig(
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
	expect(config).toHaveProperty(['rules', 'unicorn/no-null'], 'error');
	expect(config).toHaveProperty(
		['rules', 'unicorn/no-useless-undefined'],
		'error'
	);
});
