import {
	oxlintConfigBase,
	oxlintConfigConfigFiles,
} from '@standard-config/eslint/utilities';
import { defineConfig } from 'vite-plus';
import { defineOxlintConfig } from './src/index.ts';

export default defineConfig({
	test: {
		typecheck: {
			enabled: true,
		},
	},
	lint: defineOxlintConfig(oxlintConfigBase, {
		overrides: [
			{
				files: ['src/config-*/index.ts'],
				...oxlintConfigConfigFiles,
			},
		],
	}),
	pack: {
		deps: {
			skipNodeModulesBundle: true,
		},
		dts: {
			sourcemap: true,
		},
		entry: 'src/index.ts',
		failOnWarn: true,
		publint: true,
		sourcemap: true,
	},
	staged: {
		'*': [
			() => 'pnpm install --ignore-scripts',
			'prettier --ignore-unknown --write',
			() => 'pnpm prepack',
		],
	},
});
