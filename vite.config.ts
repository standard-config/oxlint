import { defineConfig } from 'vite-plus';

export default defineConfig({
	test: {
		projects: ['packages/**/vite.config.ts'],
	},
	staged: {
		'*': [
			() => 'cp README.md packages/oxlint/README.md',
			() => 'pnpm install --ignore-scripts',
			() => 'pnpm --recursive build',
			() => 'pnpm test',
			'oxlint --deny-warnings --fix --no-error-on-unmatched-pattern --type-check',
			'prettier --ignore-unknown --write',
		],
	},
});
