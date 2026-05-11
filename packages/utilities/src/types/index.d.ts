import type { ExternalPluginEntry, OxlintConfig, OxlintOverride } from 'oxlint';

export type OxlintConfigBaseEntry = Omit<
	OxlintConfig,
	'categories' | 'files' | 'ignorePatterns' | 'overrides'
>;

export type OxlintConfigCoreBaseEntry = Omit<
	OxlintConfigBaseEntry,
	'jsPlugins'
>;

export type OxlintConfigOverrideEntry = Omit<
	OxlintOverride,
	'categories' | 'files' | 'jsPlugins' | 'plugins'
>;

export type OxlintConfigGlobSet = OxlintOverride['files'];

export type OxlintConfigPluginEntry = Exclude<ExternalPluginEntry, string>;
