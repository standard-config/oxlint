import {
	oxlintConfigBase,
	oxlintConfigConfigFiles,
} from '@standard-config/eslint/utilities';
import { defineConfig } from '@standard-config/oxlint';

export default defineConfig(oxlintConfigBase, {
	overrides: [
		{
			files: ['**/config-*/index.ts'],
			...oxlintConfigConfigFiles,
		},
	],
});
