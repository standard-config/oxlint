import { defineConfig } from 'vite-plus';

export default defineConfig({
	pack: {
		deps: {
			alwaysBundle: [/^@standard-config\/utilities\//],
			neverBundle: true,
		},
		entry: 'src/index.ts',
		failOnWarn: true,
		publint: true,
		workspace: true,
	},
});
