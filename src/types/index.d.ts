import type { OxlintConfig, OxlintOverride } from 'oxlint';

export type LinterConfigEntry = Omit<
	OxlintConfig,
	'files' | 'ignorePatterns' | 'overrides'
>;

export type LinterConfigOverrideEntry = Omit<OxlintOverride, 'files'>;
