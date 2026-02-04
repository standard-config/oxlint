import type {
	LinterConfigEntry,
	LinterConfigOverrideEntry,
} from './index.d.ts';
import { expectTypeOf, test } from 'vitest';

test('exposes valid types', () => {
	expectTypeOf<LinterConfigEntry>().toBeObject();
	expectTypeOf<LinterConfigOverrideEntry>().toBeObject();
});
