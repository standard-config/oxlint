import type { OxlintConfigBaseEntry } from '@standard-config/utilities/types';
import resolvePlugin from '@standard-config/utilities/resolve-plugin';

/**
 * Base config entry containing stylistic rules. No overrides included.
 */
const config: OxlintConfigBaseEntry = {
	jsPlugins: [
		resolvePlugin('perfectionist', 'eslint-plugin-perfectionist'),
		resolvePlugin('stylistic', '@stylistic/eslint-plugin'),
	],
	rules: {
		'perfectionist/sort-array-includes': ['error', { type: 'natural' }],
		'perfectionist/sort-exports': ['error', { type: 'natural' }],
		'perfectionist/sort-imports': [
			'error',
			{
				customGroups: [
					{
						groupName: 'mock-side-effect',
						elementNamePattern: '^.*/_*(mocks)_*/.*$',
						selector: 'side-effect',
					},
					{
						groupName: 'mock',
						elementNamePattern: '^.*/_*(mocks)_*/.*$',
						selector: 'import',
					},
				],
				groups: [
					'mock-side-effect',
					'mock',
					['type-builtin', 'type-external'],
					'type-internal',
					['type-parent', 'type-sibling', 'type-index'],
					['value-builtin', 'value-external'],
					'value-internal',
					['value-parent', 'value-sibling', 'value-index'],
					'unknown',
					'style',
					'side-effect',
					'side-effect-style',
				],
				internalPattern: ['^(#|@/).*'],
				newlinesBetween: 0,
				sortSideEffects: true,
				type: 'natural',
			},
		],
		'perfectionist/sort-interfaces': [
			'error',
			{
				groups: ['index-signature', 'unknown', 'method'],
				type: 'natural',
			},
		],
		'perfectionist/sort-intersection-types': ['error', { type: 'natural' }],
		'perfectionist/sort-named-exports': ['error', { type: 'natural' }],
		'perfectionist/sort-named-imports': ['error', { type: 'natural' }],
		'perfectionist/sort-object-types': [
			'error',
			{
				groups: ['index-signature', 'unknown', 'method'],
				type: 'natural',
			},
		],
		'perfectionist/sort-objects': [
			'error',
			{
				type: 'natural',
				useConfigurationIf: {
					objectType: 'destructured',
				},
			},
			{
				type: 'unsorted',
				useConfigurationIf: {
					objectType: 'non-destructured',
				},
			},
		],
		'perfectionist/sort-union-types': [
			'error',
			{
				customGroups: [
					{
						groupName: 'false',
						elementNamePattern: '^false$',
					},
					{
						groupName: 'never',
						elementNamePattern: '^never$',
					},
					{
						groupName: 'react',
						elementNamePattern: '^react.+',
					},
				],
				groups: [
					'react',
					'unknown',
					'tuple',
					'false',
					'nullish',
					'never',
				],
				type: 'natural',
			},
		],
		'stylistic/lines-between-class-members': [
			'error',
			'always',
			{ exceptAfterSingleLine: true },
		],
		'stylistic/padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				next: '*',
				prev: [
					'block-like',
					'directive',
					'export',
					'function',
					'import',
					'interface',
					'type',
				],
			},
			{
				blankLine: 'always',
				next: [
					'block-like',
					'directive',
					'export',
					'function',
					'import',
					'interface',
					'type',
				],
				prev: '*',
			},
			{
				blankLine: 'any',
				next: ['break', 'continue', 'return', 'throw'],
				prev: 'block-like',
			},
			{
				blankLine: 'always',
				next: '*',
				prev: ['case', 'default'],
			},
			{
				blankLine: 'never',
				next: 'directive',
				prev: 'directive',
			},
			{
				blankLine: 'any',
				next: 'export',
				prev: 'export',
			},
			{
				blankLine: 'never',
				next: ['function', 'function-overload'],
				prev: 'function-overload',
			},
			{
				blankLine: 'never',
				next: 'import',
				prev: 'import',
			},
			{
				blankLine: 'any',
				next: 'interface',
				prev: 'interface',
			},
			{
				blankLine: 'any',
				next: 'type',
				prev: 'type',
			},
		],
		'stylistic/spaced-comment': [
			'error',
			'always',
			{
				block: {
					balanced: true,
				},
				line: {
					markers: ['/'],
				},
			},
		],
	},
};

export default config;
