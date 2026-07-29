import { defineConfig } from 'vite-plus';

export default defineConfig({
	test: {
		typecheck: {
			enabled: true,
		},
	},
	pack: {
		deps: {
			alwaysBundle: [/^@standard-config\/utilities\//],
			neverBundle: true,
		},
		dts: {
			eager: true,
		},
		entry: 'src/index.ts',
		failOnWarn: true,
		publint: true,
		workspace: true,
	},
});
