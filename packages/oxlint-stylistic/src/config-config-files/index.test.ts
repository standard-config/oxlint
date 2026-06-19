import type { OxlintConfigOverrideEntry } from '@standard-config/utilities/types';
import { defineConfig } from 'oxlint';
import { expect, expectTypeOf, test } from 'vite-plus/test';
import config from './index.ts';

test('is a valid Oxlint config override', () => {
	expectTypeOf(config).toEqualTypeOf<OxlintConfigOverrideEntry>();
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
