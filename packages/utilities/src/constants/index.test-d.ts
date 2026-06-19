import { defineConfig as oxlintDefineConfig } from 'oxlint';
import { expectTypeOf, test } from 'vite-plus/test';
import {
	GLOB_SET_CONFIG_FILES,
	GLOB_SET_JSX_FILES,
	GLOB_SET_TEST_FILES,
	GLOB_SET_TYPE_DEFINITIONS,
} from './index.ts';

test('exposes valid types', () => {
	expectTypeOf(oxlintDefineConfig).toBeCallableWith({
		overrides: [
			{
				files: GLOB_SET_CONFIG_FILES,
				rules: {},
			},
			{
				files: GLOB_SET_JSX_FILES,
				rules: {},
			},
			{
				files: GLOB_SET_TEST_FILES,
				rules: {},
			},
			{
				files: GLOB_SET_TYPE_DEFINITIONS,
				rules: {},
			},
		],
	});
});
