import type { OxlintConfig } from 'oxlint';
import { expect, expectTypeOf, test } from 'vite-plus/test';
import mergeConfig from './index.ts';

test('returns an Oxlint config', () => {
	expectTypeOf(mergeConfig).returns.toEqualTypeOf<OxlintConfig>();
});

test('merges two empty configs', () => {
	expect(mergeConfig({}, {})).toStrictEqual({});
});

test('merges two valid configs', () => {
	const result = mergeConfig(
		{
			ignorePatterns: ['coverage/**'],
			plugins: ['eslint'],
			rules: {
				'eslint/func-names': 'off',
				'eslint/func-style': [
					'error',
					'declaration',
					{ allowArrowFunctions: true },
				],
			},
		},
		{
			ignorePatterns: ['fixtures/**'],
			plugins: ['eslint', 'unicorn'],
			rules: {
				'eslint/arrow-body-style': 'off',
				'eslint/func-style': 'off',
			},
		}
	);

	expect(result).toStrictEqual({
		ignorePatterns: ['coverage/**', 'fixtures/**'],
		plugins: ['eslint', 'unicorn'],
		rules: {
			'eslint/arrow-body-style': 'off',
			'eslint/func-names': 'off',
			'eslint/func-style': 'off',
		},
	});
});

test('throws a `TypeError` when a config is missing', () => {
	/* @ts-expect-error */
	expect(() => mergeConfig()).toThrow(TypeError);

	/* @ts-expect-error */
	expect(() => mergeConfig({})).toThrow(TypeError);

	/* @ts-expect-error */
	expect(() => mergeConfig(undefined, {})).toThrow(TypeError);
});

test('removes config properties that resolve to `undefined`', () => {
	const result = mergeConfig(
		{
			settings: {
				vitest: {
					typecheck: true,
				},
			},
			rules: {
				'vitest/require-top-level-describe': 'off',
			},
		},
		{
			settings: undefined,
		}
	);

	expect(result).toStrictEqual({
		rules: {
			'vitest/require-top-level-describe': 'off',
		},
	});
});
