import type {
	OxlintConfigEntry,
	OxlintConfigOverrideEntry,
	StandardConfig,
} from './index.d.ts';
import { expectTypeOf, test } from 'vitest';

test('exposes valid types', () => {
	expectTypeOf<OxlintConfigEntry>().toBeObject();
	expectTypeOf<OxlintConfigOverrideEntry>().toBeObject();

	expectTypeOf<StandardConfig>().toBeObject();
	expectTypeOf<StandardConfig>().toHaveProperty('react');
});
