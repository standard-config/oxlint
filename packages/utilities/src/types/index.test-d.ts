import type {
	LinterConfigEntry,
	LinterConfigOverrideEntry,
	StandardConfig,
} from './index.d.ts';
import { expectTypeOf, test } from 'vitest';

test('exposes valid types', () => {
	expectTypeOf<LinterConfigEntry>().toBeObject();
	expectTypeOf<LinterConfigOverrideEntry>().toBeObject();

	expectTypeOf<StandardConfig>().toBeObject();
	expectTypeOf<StandardConfig>().toHaveProperty('react');
});
