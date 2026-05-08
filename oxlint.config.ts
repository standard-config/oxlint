import { defineConfig } from '@standard-config/oxlint';
import { configStylisticConfigFiles } from '@standard-config/oxlint-stylistic';

export default defineConfig({
	overrides: [
		{
			files: ['**/config-*/index.ts'],
			...configStylisticConfigFiles,
		},
	],
});
