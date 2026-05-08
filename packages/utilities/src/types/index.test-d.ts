import type {
	OxlintConfigEntry,
	OxlintConfigGlobSet,
	OxlintConfigOverrideEntry,
	OxlintConfigPluginEntry,
} from './index.d.ts';
import { expectTypeOf, test } from 'vitest';

test('exposes valid types', () => {
	expectTypeOf<OxlintConfigEntry>().toBeObject();
	expectTypeOf<OxlintConfigEntry>().not.toHaveProperty('categories');

	expectTypeOf<OxlintConfigOverrideEntry>().toBeObject();
	expectTypeOf<OxlintConfigOverrideEntry>().not.toHaveProperty('files');

	expectTypeOf<OxlintConfigGlobSet>().toBeArray();

	expectTypeOf<OxlintConfigPluginEntry>().toBeObject();
	expectTypeOf<OxlintConfigPluginEntry>().toHaveProperty('name');
	expectTypeOf<OxlintConfigPluginEntry>().toHaveProperty('specifier');
});
