import {
	oxlintConfigBase,
	oxlintConfigConfigFiles,
} from '@standard-config/eslint/utilities';
import { defineConfig } from './src/index.ts';

export default defineConfig(oxlintConfigBase, {
	overrides: [
		{
			files: ['src/config-*/index.ts'],
			...oxlintConfigConfigFiles,
		},
	],
});
