import { resolvePlugin } from '@standard-config/oxlint';
import { expect, test } from 'vite-plus/test';

test('keeps the specifier of unavailable modules', () => {
	expect(
		resolvePlugin('react-x', '@eslint-react/eslint-plugin')
	).toStrictEqual({
		name: 'react-x',
		specifier: '@eslint-react/eslint-plugin',
	});
});
