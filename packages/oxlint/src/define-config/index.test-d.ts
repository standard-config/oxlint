import type { OxlintConfig } from 'oxlint';
import { defineConfig as oxlintDefineConfig } from 'oxlint';
import { defineConfig as viteDefineConfig } from 'vite-plus';
import { expectTypeOf, test } from 'vitest';
import defineConfig from './index.ts';

test('defines a valid Oxlint config', () => {
	let config = defineConfig();

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expectTypeOf(oxlintDefineConfig).toBeCallableWith(config);
	expectTypeOf(viteDefineConfig).toBeCallableWith({ lint: config });

	config = defineConfig({
		ignorePatterns: ['fixtures/**'],
		options: {
			typeCheck: true,
		},
	});

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expectTypeOf(oxlintDefineConfig).toBeCallableWith(config);
	expectTypeOf(viteDefineConfig).toBeCallableWith({ lint: config });
});

test('supports the `react` option', () => {
	let config = defineConfig({ react: true });

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expectTypeOf(oxlintDefineConfig).toBeCallableWith(config);
	expectTypeOf(viteDefineConfig).toBeCallableWith({ lint: config });

	config = defineConfig({
		react: true,
		ignorePatterns: ['fixtures/**'],
		options: {
			typeCheck: true,
		},
	});

	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expectTypeOf(oxlintDefineConfig).toBeCallableWith(config);
	expectTypeOf(viteDefineConfig).toBeCallableWith({ lint: config });
});
