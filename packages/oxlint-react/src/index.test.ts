import { expect, test } from 'vitest';
import * as exports from './index.ts';

test('exposes correct public API', () => {
	expect({ ...exports }).toStrictEqual({
		configReactBase: expect.any(Object),
		configReactTestFiles: expect.any(Object),
	});
});
