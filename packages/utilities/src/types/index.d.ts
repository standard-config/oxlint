import type { OxlintConfig, OxlintOverride } from 'oxlint';

export type LinterConfigEntry = Omit<
	OxlintConfig,
	'categories' | 'files' | 'ignorePatterns' | 'overrides'
>;

export type LinterConfigOverrideEntry = Omit<
	OxlintOverride,
	'categories' | 'files'
>;

export type StandardConfig = OxlintConfig & {
	/**
	 * Enable React-specific rules.
	 * @default false
	 */
	react?: boolean;
};
