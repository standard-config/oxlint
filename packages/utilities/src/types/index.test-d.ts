import type {
	OxlintConfigBaseEntry,
	OxlintConfigCoreBaseEntry,
	OxlintConfigGlobSet,
	OxlintConfigOverrideEntry,
	OxlintConfigPluginEntry,
	OxlintRuleSettings,
} from './index.d.ts';
import { expectTypeOf, test } from 'vite-plus/test';

test('exposes valid types', () => {
	expectTypeOf<OxlintConfigBaseEntry>().toBeObject();
	expectTypeOf<OxlintConfigBaseEntry>().not.toHaveProperty('categories');

	expectTypeOf<OxlintConfigCoreBaseEntry>().toBeObject();
	expectTypeOf<OxlintConfigCoreBaseEntry>().not.toHaveProperty('jsPlugins');

	expectTypeOf<OxlintConfigOverrideEntry>().toBeObject();
	expectTypeOf<OxlintConfigOverrideEntry>().not.toHaveProperty('files');
	expectTypeOf<OxlintConfigOverrideEntry>().not.toHaveProperty('plugins');

	expectTypeOf<OxlintConfigGlobSet>().toBeArray();

	expectTypeOf<OxlintConfigPluginEntry>().toBeObject();
	expectTypeOf<OxlintConfigPluginEntry>().toHaveProperty('name');
	expectTypeOf<OxlintConfigPluginEntry>().toHaveProperty('specifier');

	expectTypeOf<
		OxlintRuleSettings<'typescript/consistent-type-definitions'>
	>().toEqualTypeOf<'interface' | 'type'>();
	expectTypeOf<
		OxlintRuleSettings<'typescript/no-array-delete'>
	>().toBeNever();
	expectTypeOf<
		OxlintRuleSettings<'typescript/no-restricted-types'>
	>().toBeObject();
	expectTypeOf<
		OxlintRuleSettings<'typescript/no-restricted-types'>
	>().toHaveProperty('types');
});
