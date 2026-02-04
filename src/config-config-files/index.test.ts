import type { LinterConfigOverrideEntry } from '../types/index.d.ts';
import { defineConfig } from 'oxlint';
import { expect, expectTypeOf, test } from 'vitest';
import config from './index.ts';

test('is a valid Oxlint config override', () => {
	expectTypeOf(config).toEqualTypeOf<LinterConfigOverrideEntry>();
	expect(
		defineConfig({
			overrides: [
				{
					files: [],
					...config,
				},
			],
		})
	).toBeTypeOf('object');

	expect(config).toMatchSnapshot();
});
