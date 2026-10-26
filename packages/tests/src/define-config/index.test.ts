import '@standard-config/utilities/mocks/resolve-plugin';
import { beforeEach, expect, test, vi } from 'vite-plus/test';

const NO_MODULE = () => undefined as never;

beforeEach(() => {
	vi.resetModules();
});

test('resolves `@standard-config/oxlint` when no supplemental configs are available', async () => {
	vi.doMock('@standard-config/oxlint-react', NO_MODULE);
	vi.doMock('@standard-config/oxlint-stylistic', NO_MODULE);

	const { default: configCore, defineConfig } =
		await import('@standard-config/oxlint');

	const config = defineConfig();

	expect(config).toStrictEqual(configCore);
	expect(config).not.toHaveProperty('jsPlugins');
	expect(config).toHaveProperty(['rules', 'unicorn/no-null'], 'off');
	expect(config).not.toHaveProperty(['rules', 'perfectionist/sort-imports']);
	expect(config).not.toHaveProperty(['rules', 'react/jsx-key']);
});

test('resolves `@standard-config/oxlint-react` when it’s available', async () => {
	vi.doUnmock('@standard-config/oxlint-react');
	vi.doMock('@standard-config/oxlint-stylistic', NO_MODULE);

	const { default: configCore, defineConfig } =
		await import('@standard-config/oxlint');

	const config = defineConfig();

	expect(config).not.toStrictEqual(configCore);
	expect(config).toHaveProperty('jsPlugins', expect.any(Array));
	expect(config).toHaveProperty(['rules', 'react/jsx-key'], 'error');
	expect(config).toHaveProperty(['rules', 'unicorn/no-null'], 'off');

	expect(config).not.toHaveProperty(['rules', 'perfectionist/sort-imports']);
	expect(config).toMatchSnapshot();
});

test('resolves `@standard-config/oxlint-stylistic` when it’s available', async () => {
	vi.doMock('@standard-config/oxlint-react', NO_MODULE);
	vi.doUnmock('@standard-config/oxlint-stylistic');

	const { default: configCore, defineConfig } =
		await import('@standard-config/oxlint');

	const config = defineConfig();

	expect(config).not.toStrictEqual(configCore);
	expect(config).toHaveProperty('jsPlugins', expect.any(Array));
	expect(config).toHaveProperty(
		['rules', 'perfectionist/sort-imports'],
		expect.arrayContaining(['error'])
	);
	expect(config).toHaveProperty(['rules', 'unicorn/no-null'], 'off');
	expect(config).not.toHaveProperty(['rules', 'react/jsx-key']);
	expect(config).toMatchSnapshot();
});

test('resolves all available supplemental configs by default', async () => {
	vi.doUnmock('@standard-config/oxlint-react');
	vi.doUnmock('@standard-config/oxlint-stylistic');

	const { default: configCore, defineConfig } =
		await import('@standard-config/oxlint');

	const config = defineConfig();

	expect(config).not.toStrictEqual(configCore);
	expect(config).toHaveProperty('jsPlugins', expect.any(Array));
	expect(config).toHaveProperty(
		['rules', 'perfectionist/sort-imports'],
		expect.arrayContaining(['error'])
	);
	expect(config).toHaveProperty(['rules', 'react/jsx-key'], 'error');
	expect(config).toHaveProperty(['rules', 'unicorn/no-null'], 'off');
	expect(config).toMatchSnapshot();
});
