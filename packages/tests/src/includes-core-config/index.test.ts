import { beforeEach, expect, test, vi } from 'vite-plus/test';

beforeEach(() => {
	vi.resetModules();
});

test('`@standard-config/oxlint-react` includes `typescript/no-restricted-types` when `@standard-config/oxlint` is available', async () => {
	vi.doUnmock('@standard-config/utilities/includes-core-config');

	const { default: config } =
		await import('../../../oxlint-react/src/config-jsx-files/index.ts');

	expect(config.rules).toHaveProperty(
		'typescript/no-restricted-types',
		expect.arrayContaining(['error'])
	);
});

test('`@standard-config/oxlint-react` excludes `typescript/no-restricted-types` when `@standard-config/oxlint` is unavailable', async () => {
	vi.doMock('@standard-config/utilities/includes-core-config', () => ({
		default: () => false,
	}));

	const { default: config } =
		await import('../../../oxlint-react/src/config-jsx-files/index.ts');

	expect(config.rules).not.toHaveProperty('typescript/no-restricted-types');
});
