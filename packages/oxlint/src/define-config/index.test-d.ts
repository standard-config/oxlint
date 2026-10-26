import type { OxlintConfig } from 'oxlint';
import { defineConfig as oxlintDefineConfig } from 'oxlint';
import { defineConfig as viteDefineConfig } from 'vite-plus';
import { expectTypeOf, test } from 'vite-plus/test';
import defineConfig from './index.ts';

test('returns an Oxlint config', () => {
	expectTypeOf(defineConfig).returns.toEqualTypeOf<OxlintConfig>();
});

test('returns a config that Oxlint and Vite+ accept', () => {
	const config = defineConfig();

	expectTypeOf(oxlintDefineConfig).toBeCallableWith(config);
	expectTypeOf(viteDefineConfig).toBeCallableWith({ lint: config });
});

test('accepts a custom config', () => {
	expectTypeOf(defineConfig).toBeCallableWith({
		ignorePatterns: ['fixtures/**'],
		options: {
			typeCheck: true,
		},
	});
});
