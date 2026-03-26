import type { LinterConfigOverrideEntry } from '@standard-config/utilities/types';
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
