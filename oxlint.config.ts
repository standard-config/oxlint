import { getOxlintConfigs } from '@standard-config/eslint/utilities';
import { defineConfig } from './src/index.ts';

const { configBase, configConfigFiles } = getOxlintConfigs();

export default defineConfig(configBase, {
	overrides: [
		{
			files: ['src/*-config/index.ts'],
			...configConfigFiles,
		},
	],
});
