import { expect, test } from 'vitest';
import * as exports from './index.ts';

test('exposes correct public API', () => {
	expect({ ...exports }).toStrictEqual({
		configCoreBase: expect.any(Object),
		configCoreConfigFiles: expect.any(Object),
		configCoreTestFiles: expect.any(Object),
		configCoreTypeDefinitions: expect.any(Object),
		default: expect.any(Object),
		defineConfig: expect.any(Function),
		defineOxlintConfig: expect.any(Function),
		resolvePlugin: expect.any(Function),
	});
});
