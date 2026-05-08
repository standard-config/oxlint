import type { ExternalPluginEntry, OxlintConfig, OxlintOverride } from 'oxlint';

export type OxlintConfigEntry = Omit<
	OxlintConfig,
	'categories' | 'files' | 'ignorePatterns' | 'overrides'
>;

export type OxlintConfigOverrideEntry = Omit<
	OxlintOverride,
	'categories' | 'files'
>;

export type OxlintConfigGlobSet = OxlintOverride['files'];

export type OxlintConfigPluginEntry = Exclude<ExternalPluginEntry, string>;
