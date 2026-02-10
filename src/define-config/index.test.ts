import type { OxlintConfig } from 'oxlint';
import { expect, expectTypeOf, test } from 'vitest';
import defineConfig from './index.ts';

test('defines a valid Oxlint config', () => {
	let config = defineConfig();

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expect(config).toMatchSnapshot();

	expect(config).toHaveProperty('rules', expect.any(Object));
	expect(config.rules).toHaveProperty('unicorn/no-null', 'off');
	expect(config.rules).not.toHaveProperty('react/jsx-filename-extension');

	config = defineConfig({
		ignorePatterns: ['fixtures/**'],
		rules: {
			'unicorn/no-null': 'error',
		},
	});

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expect(config).toHaveProperty('ignorePatterns', expect.any(Array));
	expect(config.ignorePatterns).toContain('fixtures/**');
	expect(config).toHaveProperty('rules', expect.any(Object));
	expect(config.rules).toHaveProperty('unicorn/no-null', 'error');
	expect(config.rules).not.toHaveProperty('react/jsx-filename-extension');
});

test('supports the `react` option', () => {
	const config = defineConfig({ react: true });

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expect(config).toMatchSnapshot();

	expect(config).not.toStrictEqual(defineConfig());
	expect(config).not.toHaveProperty('react');
	expect(config.rules).toHaveProperty('unicorn/no-null', 'off');
	expect(config.rules).toHaveProperty('react/jsx-filename-extension');
});
