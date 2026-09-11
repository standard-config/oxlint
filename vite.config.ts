import { defineConfig } from 'vite-plus';

export default defineConfig({
	test: {
		projects: [
			/* prettier-ignore */
			'packages/**/vite.config.ts',
		],
	},
	staged: {
		'*': [
			() => 'pnpm install --ignore-scripts',
			() => 'pnpm build',
			() => "pnpm --filter '{packages/oxlint*}' exec publint --strict",
			() => 'pnpm test',
			'oxlint --deny-warnings --fix --no-error-on-unmatched-pattern --type-check',
			'prettier --ignore-unknown --write',
		],
	},
});
