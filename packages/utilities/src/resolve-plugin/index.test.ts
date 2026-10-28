import { isAbsolute } from 'node:path';
import { expect, test } from 'vite-plus/test';
import resolvePlugin from './index.ts';

const PLUGINS = [
	['@eslint-react/eslint-plugin', 'react-x'],
	['@stylistic/eslint-plugin', 'stylistic'],
	['eslint-plugin-perfectionist', 'perfectionist'],
	['eslint-plugin-react-you-might-not-need-an-effect', 'react-effect'],
] as const;

test.each(PLUGINS)('resolves `%s`', (plugin, name) => {
	const result = resolvePlugin(name, plugin);

	expect(result).toStrictEqual({
		name,
		specifier: expect.any(String),
	});

	const { specifier } = result;

	expect(specifier).toContain(plugin);
	expect(specifier).not.toBe(plugin);
	expect(isAbsolute(specifier)).toBe(true);
});

test('keeps the specifier of unavailable modules', () => {
	expect(resolvePlugin('js', '@eslint/js')).toStrictEqual({
		name: 'js',
		specifier: '@eslint/js',
	});
});
