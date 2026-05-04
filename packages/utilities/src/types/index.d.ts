import type { OxlintConfig, OxlintOverride } from 'oxlint';

export type OxlintConfigEntry = Omit<
	OxlintConfig,
	'categories' | 'files' | 'ignorePatterns' | 'overrides'
>;

export type OxlintConfigOverrideEntry = Omit<
	OxlintOverride,
	'categories' | 'files'
>;

export type OxlintConfigGlobSet = OxlintOverride['files'];

export type StandardConfig = OxlintConfig & {
	/**
	 * Enable React-specific rules.
	 * @default false
	 */
	react?: boolean;
};
