import type { OxlintConfigOverrideEntry } from '@standard-config/utilities/types';

/**
 * Optional config entry containing stylistic rules that target test files.
 * Intended for explicit overrides.
 */
const config: OxlintConfigOverrideEntry = {
	rules: {
		'perfectionist/sort-objects': [
			'error',
			{
				customGroups: [
					{
						groupName: 'extends',
						elementNamePattern: '^extends$',
					},
					{
						groupName: 'files',
						elementNamePattern: '^files$',
					},
					{
						groupName: 'ignores',
						elementNamePattern: '^(ignores|ignorePatterns)$',
					},
					{
						groupName: 'name',
						elementNamePattern: '^(name|groupName)$',
					},
					{
						groupName: 'overrides',
						elementNamePattern: '^overrides$',
					},
					{
						groupName: 'parser',
						elementNamePattern: '^parser$',
					},
					{
						groupName: 'plugins',
						elementNamePattern: '^plugins$',
					},
					{
						groupName: 'rules',
						elementNamePattern: '^rules$',
					},
					{
						groupName: 'test',
						elementNamePattern: '^(test|tests)$',
					},
				],
				groups: [
					'name',
					'files',
					'extends',
					'ignores',
					'plugins',
					'parser',
					'test',
					'unknown',
					'rules',
					'overrides',
				],
				newlinesBetween: 0,
				type: 'natural',
			},
		],
	},
};

export default config;
