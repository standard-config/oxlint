import { isAbsolute } from 'node:path';
import { expect, test } from 'vite-plus/test';
import resolvePlugin from './index.ts';

const PLUGINS = [
	'@eslint-react/eslint-plugin',
	'@stylistic/eslint-plugin',
	'eslint-plugin-perfectionist',
	'eslint-plugin-react-you-might-not-need-an-effect',
];

test.each(PLUGINS)('resolves `%s`', (plugin) => {
	const result = resolvePlugin('plugin', plugin);

	expect(result).toStrictEqual({
		name: 'plugin',
		specifier: expect.any(String),
	});

	const { specifier } = result;

	expect(specifier).toContain(plugin);
	expect(specifier).not.toBe(plugin);
	expect(isAbsolute(specifier)).toBe(true);
});

test('handles unavailable modules', () => {
	expect(resolvePlugin('js', '@eslint/js')).toStrictEqual({
		name: 'js',
		specifier: '@eslint/js',
	});
});
