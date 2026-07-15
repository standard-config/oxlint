import type {
	AllowWarnDeny,
	DummyRuleMap,
	ExternalPluginEntry,
	OxlintConfig,
	OxlintOverride,
} from 'oxlint';

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

export type OxlintRuleSettings<T extends keyof DummyRuleMap> = Extract<
	DummyRuleMap[T],
	readonly [AllowWarnDeny, unknown, ...unknown[]]
>[1];
