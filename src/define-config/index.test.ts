import type { OxlintConfig } from 'oxlint';
import { expect, expectTypeOf, test } from 'vitest';
import defineConfig from './index.ts';

test('defines a valid Oxlint config', () => {
	let config = defineConfig();

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expect(config).toHaveProperty('rules', expect.any(Object));
	expect(config.rules).toHaveProperty('unicorn/no-null', 'off');

	config = defineConfig({
		rules: {
			'unicorn/no-null': 'error',
		},
	});

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expect(config).toHaveProperty('rules', expect.any(Object));
	expect(config.rules).toHaveProperty('unicorn/no-null', 'error');
});
