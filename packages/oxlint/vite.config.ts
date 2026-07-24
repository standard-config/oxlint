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
			sourcemap: true,
		},
		entry: 'src/index.ts',
		failOnWarn: true,
		publint: true,
		sourcemap: true,
		workspace: true,
	},
});
