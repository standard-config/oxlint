import '@standard-config/utilities/mocks/resolve-plugin';
import type { OxlintConfig } from 'oxlint';
import { defineConfig } from 'oxlint';
import { expect, expectTypeOf, test } from 'vite-plus/test';
import config from './index.ts';

test('is a valid Oxlint config', () => {
	expectTypeOf(config).toEqualTypeOf<OxlintConfig>();
	expect(defineConfig(config)).toBeTypeOf('object');

	expect(config).toMatchSnapshot();
});
