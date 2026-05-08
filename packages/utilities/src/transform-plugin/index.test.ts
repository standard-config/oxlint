import { isAbsolute } from 'node:path';
import { expect, test } from 'vitest';
import resolvePlugin from './index.ts';

const PLUGINS = [
	/* prettier-ignore */
	'@stylistic/eslint-plugin',
	'eslint-plugin-perfectionist',
];

test.each(PLUGINS)('resolves `%s`', (plugin) => {
	const result = resolvePlugin('plugin', plugin);

	expect(result).toHaveProperty('name', 'plugin');
	expect(result).toHaveProperty('specifier', expect.any(String));

	const { specifier } = result;

	expect(specifier).toContain(plugin);
	expect(specifier).not.toBe(plugin);
	expect(isAbsolute(specifier)).toBe(true);
});

test('handles incorrect values', () => {
	const result = resolvePlugin('plugin', 'nonexistent-plugin');

	expect(result).toHaveProperty('name', 'plugin');
	expect(result).toHaveProperty('specifier', 'nonexistent-plugin');
});
