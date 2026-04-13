import { defineConfig } from 'vite-plus';

export default defineConfig({
	test: {
		projects: ['packages/**/vite.config.ts'],
	},
	staged: {
		'*': [
			() => 'pnpm install --ignore-scripts',
			() => 'pnpm test',
			() => 'pnpm --recursive build',
			'oxlint --deny-warnings --fix --type-check',
			'prettier --ignore-unknown --write',
		],
	},
});
