import { configDefaults, defineConfig } from 'vite-plus';

export default defineConfig({
	test: {
		exclude: [
			/* prettier-ignore */
			...configDefaults.exclude,
			'.agent-*/**',
		],
		projects: [
			/* prettier-ignore */
			'packages/**/vite.config.ts',
		],
	},
	staged: {
		'*': [
			() => 'pnpm install --ignore-scripts',
			() => 'pnpm --recursive build',
			() => 'pnpm test',
			'oxlint --deny-warnings --fix --no-error-on-unmatched-pattern --type-check',
			'prettier --ignore-unknown --write',
		],
	},
});
