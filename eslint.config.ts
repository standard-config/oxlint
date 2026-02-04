import { configConfigFiles, defineConfig } from '@standard-config/eslint';

export default defineConfig([
	{
		files: ['src/config-*/index.ts'],
		extends: [configConfigFiles],
	},
]);
