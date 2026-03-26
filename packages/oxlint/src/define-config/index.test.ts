import { expect, test } from 'vitest';
import defineConfig from './index.ts';

test('defines a valid Oxlint config', () => {
	let config = defineConfig();

	expect(config).toHaveProperty('rules', expect.any(Object));
	expect(config.rules).toHaveProperty('unicorn/no-null', 'off');
	expect(config.rules).not.toHaveProperty('react/jsx-key');
	expect(config).toMatchSnapshot();

	config = defineConfig({
		ignorePatterns: ['fixtures/**'],
		rules: {
			'unicorn/no-null': 'error',
		},
	});

	expect(config).toHaveProperty('ignorePatterns', expect.any(Array));
	expect(config.ignorePatterns).toContain('fixtures/**');
	expect(config).toHaveProperty('rules', expect.any(Object));
	expect(config.rules).toHaveProperty('unicorn/no-null', 'error');
	expect(config.rules).not.toHaveProperty('react/jsx-key');

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

	expect(config).toHaveProperty('ignorePatterns', expect.any(Array));
	expect(config.ignorePatterns).toContain('fixtures/**');
	expect(config).toHaveProperty('rules', expect.any(Object));
	expect(config.rules).toHaveProperty('unicorn/no-null', 'error');
	expect(config.rules).toHaveProperty(
		'unicorn/no-useless-undefined',
		'error'
	);
	expect(config.rules).not.toHaveProperty('react/jsx-key');
});

test('supports the `react` option', () => {
	const config = defineConfig({ react: true });

	expect(config).not.toStrictEqual(defineConfig());
	expect(config).not.toHaveProperty('react');
	expect(config.rules).toHaveProperty('unicorn/no-null', 'off');
	expect(config.rules).toHaveProperty('react/jsx-key');
	expect(config).toMatchSnapshot();

	expect(defineConfig({}, { react: true }, {})).toStrictEqual(config);
	expect(defineConfig({}, { react: true }, { react: false })).toStrictEqual(
		defineConfig()
	);
});
