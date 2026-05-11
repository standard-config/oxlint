import '@standard-config/utilities/mocks/resolve-plugin';
import { beforeEach, expect, test, vi } from 'vitest';

beforeEach(() => {
	vi.resetModules();
});

const NO_MODULE = () => undefined as never;

test('resolves `@standard-config/oxlint` when no supplemental configs are available', async () => {
	vi.doMock('@standard-config/oxlint-react', NO_MODULE);
	vi.doMock('@standard-config/oxlint-stylistic', NO_MODULE);

	const { default: configCore, defineConfig } =
		await import('@standard-config/oxlint');

	const config = defineConfig();

	expect(config).toStrictEqual(configCore);
	expect(config).not.toHaveProperty('jsPlugins');
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'unicorn/no-null': 'off',
		})
	);
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
	expect(config).toHaveProperty(
		'rules',
		expect.objectContaining({
			'react/jsx-key': 'error',
			'unicorn/no-null': 'off',
		})
	);
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
		'rules',
		expect.objectContaining({
			'perfectionist/sort-imports': expect.arrayContaining(['error']),
			'unicorn/no-null': 'off',
		})
	);
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
		'rules',
		expect.objectContaining({
			'perfectionist/sort-imports': expect.arrayContaining(['error']),
			'react/jsx-key': 'error',
			'unicorn/no-null': 'off',
		})
	);
	expect(config).toMatchSnapshot();
});
