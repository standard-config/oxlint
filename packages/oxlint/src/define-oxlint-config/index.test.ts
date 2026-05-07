import { expect, test, vi } from 'vitest';
import defineConfig from '../define-config/index.ts';
import defineOxlintConfig from './index.ts';

vi.mock(import('../define-config/index.ts'), async (importActual) => {
	const actual = await importActual();

	return {
		...actual,
		default: vi.fn(),
	};
});

test('aliases `defineConfig`', () => {
	defineOxlintConfig();

	expect(defineConfig).toHaveBeenCalledExactlyOnceWith();

	defineOxlintConfig({
		options: {
			typeCheck: true,
		},
	});

	expect(defineConfig).toHaveBeenCalledWith({
		options: {
			typeCheck: true,
		},
	});
});
