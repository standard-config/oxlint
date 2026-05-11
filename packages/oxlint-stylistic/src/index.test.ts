import { expect, test } from 'vitest';
import * as exports from './index.ts';

test('exposes correct public API', () => {
	expect({ ...exports }).toStrictEqual({
		configStylisticBase: expect.any(Object),
		configStylisticConfigFiles: expect.any(Object),
		configStylisticJSXFiles: expect.any(Object),
		default: expect.any(Object),
	});
});
