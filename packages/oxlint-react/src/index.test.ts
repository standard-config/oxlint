import { expect, test } from 'vite-plus/test';
import * as exports from './index.ts';

test('exposes correct public API', () => {
	expect({ ...exports }).toStrictEqual({
		configReactBase: expect.any(Object),
		configReactJSXFiles: expect.any(Object),
		configReactTestFiles: expect.any(Object),
		default: expect.any(Object),
	});
});
