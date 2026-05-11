import type {
	OxlintConfigBaseEntry,
	OxlintConfigCoreBaseEntry,
	OxlintConfigGlobSet,
	OxlintConfigOverrideEntry,
	OxlintConfigPluginEntry,
} from './index.d.ts';
import { expectTypeOf, test } from 'vitest';

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
});
