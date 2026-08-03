import { beforeEach, expect, test, vi } from 'vite-plus/test';

beforeEach(() => {
	vi.resetModules();
});

test('`@standard-config/oxlint-react` includes TypeScript overrides when `@standard-config/oxlint` is available', async () => {
	vi.doUnmock('@standard-config/utilities/includes-core-config');

	const { configReactBase, configReactJSXFiles } =
		await import('../../../oxlint-react/src/index.ts');

	expect(configReactBase.plugins).toContain('typescript');
	expect(configReactJSXFiles.rules).toHaveProperty(
		'typescript/no-restricted-types',
		expect.arrayContaining(['error'])
	);
});

test('`@standard-config/oxlint-react` excludes TypeScript overrides when `@standard-config/oxlint` is unavailable', async () => {
	vi.doMock('@standard-config/utilities/includes-core-config', () => ({
		default: () => false,
	}));

	const { configReactBase, configReactJSXFiles } =
		await import('../../../oxlint-react/src/index.ts');

	expect(configReactBase.plugins).not.toContain('typescript');
	expect(configReactJSXFiles.rules).not.toHaveProperty(
		'typescript/no-restricted-types'
	);
});
