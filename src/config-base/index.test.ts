import type { LinterConfigEntry } from '../types/index.d.ts';
import { defineConfig } from 'oxlint';
import { expect, expectTypeOf, test } from 'vitest';
import config from './index.ts';

test('is a valid Oxlint config', () => {
	expectTypeOf(config).toEqualTypeOf<LinterConfigEntry>();
	expect(defineConfig(config)).toBeTypeOf('object');

	expect(config).toMatchSnapshot();
});
