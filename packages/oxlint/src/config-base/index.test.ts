import type { OxlintConfigCoreBaseEntry } from '@standard-config/utilities/types';
import { defineConfig } from 'oxlint';
import { expect, expectTypeOf, test } from 'vite-plus/test';
import config from './index.ts';

test('is a valid Oxlint config', () => {
	expectTypeOf(config).toEqualTypeOf<OxlintConfigCoreBaseEntry>();
	expect(defineConfig(config)).toBeTypeOf('object');

	expect(config).toMatchSnapshot();
});
