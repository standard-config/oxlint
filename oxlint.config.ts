import { configCoreTestFiles, defineConfig } from '@standard-config/oxlint';
import { configStylisticConfigFiles } from '@standard-config/oxlint-stylistic';

export default defineConfig({
	ignorePatterns: ['.claude/**'],
	overrides: [
		{
			files: [
				/* prettier-ignore */
				'**/config-*/index.ts',
			],
			...configStylisticConfigFiles,
		},
		{
			files: [
				/* prettier-ignore */
				'**/mocks/**/*.ts',
			],
			...configCoreTestFiles,
		},
		{
			files: [
				/* prettier-ignore */
				'.agents/**/*.test.ts',
			],
			rules: {
				'vitest/no-import-node-test': 'off',
			},
		},
	],
});
