import { expect, test } from 'vitest';
import * as exports from './index.ts';

test('exposes correct public API', () => {
	expect({ ...exports }).toStrictEqual({
		configBase: expect.any(Object),
		configConfigFiles: expect.any(Object),
		configReact: expect.any(Object),
		configTestFiles: expect.any(Object),
		configTypeDefinitions: expect.any(Object),
		defineConfig: expect.any(Function),
	});
});
