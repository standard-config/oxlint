import type { OxlintConfig } from 'oxlint';
import { expect, expectTypeOf, test } from 'vitest';
import mergeConfig from './index.ts';

test('merges two valid configs', () => {
	let result = mergeConfig({}, {});

	expectTypeOf(result).toEqualTypeOf<OxlintConfig>();
	expect(result).toStrictEqual({});

	result = mergeConfig(
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

	expectTypeOf(result).toEqualTypeOf<OxlintConfig>();
	expect(result).toStrictEqual({
		ignorePatterns: ['coverage/**', 'fixtures/**'],
		plugins: ['eslint', 'unicorn'],
		rules: {
			'eslint/arrow-body-style': 'off',
			'eslint/func-names': 'off',
			'eslint/func-style': 'off',
		},
	});

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

	expectTypeOf(result).toEqualTypeOf<OxlintConfig>();
	expect(result).toStrictEqual({
		rules: {
			'vitest/require-top-level-describe': 'off',
		},
	});
});
