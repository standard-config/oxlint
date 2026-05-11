import type { OxlintConfigOverrideEntry } from '@standard-config/utilities/types';

/**
 * Optional config entry containing stylistic rules that target JSX files.
 * Intended for explicit overrides.
 */
const config: OxlintConfigOverrideEntry = {
	rules: {
		'perfectionist/sort-jsx-props': [
			'error',
			{
				customGroups: [
					{
						groupName: 'as',
						elementNamePattern: '^as$',
					},
					{
						groupName: 'callback',
						elementNamePattern: '^on.+',
					},
					{
						groupName: 'children',
						elementNamePattern: '^children$',
					},
					{
						groupName: 'key',
						elementNamePattern: '^key$',
					},
					{
						groupName: 'ref',
						elementNamePattern: '^ref$',
					},
					{
						groupName: 'unsafe',
						elementNamePattern: '^dangerously.+',
					},
				],
				groups: [
					'key',
					'ref',
					'as',
					'unknown',
					'shorthand-prop',
					'callback',
					'children',
					'unsafe',
				],
				type: 'unsorted',
			},
		],
	},
};

export default config;
