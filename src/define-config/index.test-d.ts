import type { OxlintConfig } from 'oxlint';
import { defineConfig as defineOxlintConfig } from 'oxlint';
import { defineConfig as defineViteConfig } from 'vite-plus';
import { expectTypeOf, test } from 'vitest';
import defineConfig from './index.ts';

test('defines a valid Oxlint config', () => {
	let config = defineConfig();

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expectTypeOf(defineOxlintConfig(config)).toEqualTypeOf<
		ReturnType<typeof defineOxlintConfig>
	>();
	expectTypeOf(defineViteConfig({ lint: config })).toEqualTypeOf<
		ReturnType<typeof defineViteConfig>
	>();

	config = defineConfig({
		ignorePatterns: ['fixtures/**'],
		options: {
			typeCheck: true,
		},
	});

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expectTypeOf(defineOxlintConfig(config)).toEqualTypeOf<
		ReturnType<typeof defineOxlintConfig>
	>();
	expectTypeOf(defineViteConfig({ lint: config })).toEqualTypeOf<
		ReturnType<typeof defineViteConfig>
	>();
});

test('supports the `react` option', () => {
	let config = defineConfig({ react: true });

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expectTypeOf(defineOxlintConfig(config)).toEqualTypeOf<
		ReturnType<typeof defineOxlintConfig>
	>();
	expectTypeOf(defineViteConfig({ lint: config })).toEqualTypeOf<
		ReturnType<typeof defineViteConfig>
	>();

	config = defineConfig({
		react: true,
		ignorePatterns: ['fixtures/**'],
		options: {
			typeCheck: true,
		},
	});

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expectTypeOf(defineOxlintConfig(config)).toEqualTypeOf<
		ReturnType<typeof defineOxlintConfig>
	>();
	expectTypeOf(defineViteConfig({ lint: config })).toEqualTypeOf<
		ReturnType<typeof defineViteConfig>
	>();
});
