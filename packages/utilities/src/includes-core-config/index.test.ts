import { expect, test } from 'vite-plus/test';
import includesCoreConfig from './index.ts';

test('detects the installed core config', () => {
	expect(includesCoreConfig()).toBe(true);
});
