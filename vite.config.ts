import {
	oxlintConfigBase,
	oxlintConfigConfigFiles,
} from '@standard-config/eslint/utilities';
import { defineOxlintConfig } from '@standard-config/oxlint';
import { defineConfig } from 'vite-plus';

export default defineConfig({
	test: {
		projects: ['packages/*'],
	},
	lint: defineOxlintConfig(oxlintConfigBase, {
		overrides: [
			{
				files: ['**/config-*/index.ts'],
				...oxlintConfigConfigFiles,
			},
		],
	}),
	staged: {
		'*': [
			() => 'pnpm install --ignore-scripts',
			'prettier --ignore-unknown --write',
			() => 'pnpm --recursive build',
			'oxlint --deny-warnings --fix --type-check',
		],
	},
});
