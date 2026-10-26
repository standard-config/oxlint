import { beforeEach, expect, test, vi } from 'vite-plus/test';

beforeEach(() => {
	vi.resetModules();
});

test('includes TypeScript overrides in `@standard-config/oxlint-react` when `@standard-config/oxlint` is available', async () => {
	vi.doUnmock('@standard-config/utilities/includes-core-config');

	const { configReactBase, configReactJSXFiles } =
		await import('../../../oxlint-react/src/index.ts');

	expect(configReactBase.plugins).toContain('typescript');
	expect(configReactJSXFiles).toHaveProperty(
		['rules', 'typescript/no-restricted-types'],
		expect.arrayContaining(['error'])
	);
});

test('excludes TypeScript overrides from `@standard-config/oxlint-react` when `@standard-config/oxlint` is unavailable', async () => {
	vi.doMock('@standard-config/utilities/includes-core-config', () => ({
		default: () => false,
	}));

	const { configReactBase, configReactJSXFiles } =
		await import('../../../oxlint-react/src/index.ts');

	expect(configReactBase.plugins).not.toContain('typescript');
	expect(configReactJSXFiles).not.toHaveProperty([
		'rules',
		'typescript/no-restricted-types',
	]);
});
