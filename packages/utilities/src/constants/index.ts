import type {
	OxlintConfigGlobSet,
	OxlintRuleSettings,
} from '../types/index.d.ts';

export const GLOB_SET_CONFIG_FILES: OxlintConfigGlobSet = [
	'**/*.config.{js,ts,cjs,cts,mjs,mts}',
	'**/*.setup.{js,ts,cjs,cts,mjs,mts}',
] as const;

export const GLOB_SET_JSX_FILES: OxlintConfigGlobSet = [
	'**/*.{jsx,tsx}',
] as const;

export const GLOB_SET_TEST_FILES: OxlintConfigGlobSet = [
	'**/*.test.{js,jsx,ts,tsx,cjs,cts,mjs,mts}',
	'**/*.test-d.{ts,cts,mts}',
] as const;

export const GLOB_SET_TYPE_DEFINITIONS: OxlintConfigGlobSet = [
	'**/*.d.{ts,cts,mts}',
	'**/*.test-d.{ts,cts,mts}',
] as const;

export const RESTRICTED_TYPES: OxlintRuleSettings<'typescript/no-restricted-types'>['types'] =
	{
		'[]': true,
		'null': true,
		'object': true,
	} as const;
