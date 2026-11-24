import { defineConfig } from 'vite-plus';

export default defineConfig({
	test: {
		coverage: {
			exclude: [
				/* prettier-ignore */
				'**/coverage/**',
				'**/dist/**',
			],
			enabled: true,
			reporter: [
				/* prettier-ignore */
				'json',
				['text', { skipFull: true }],
			],
			thresholds: {
				100: true,
			},
		},
		projects: [
			/* prettier-ignore */
			'packages/**/vite.config.ts',
		],
	},
	staged: {
		'*': [
			() => 'pnpm install --frozen-lockfile --ignore-scripts',
			() => 'pnpm build',
			() => "pnpm --filter '{packages/oxlint*}' exec publint --strict",
			() => 'pnpm test',
			'oxlint --deny-warnings --fix --no-error-on-unmatched-pattern --type-check',
			'prettier --ignore-unknown --write',
		],
	},
});
