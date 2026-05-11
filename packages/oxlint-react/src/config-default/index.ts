import type { OxlintConfig } from 'oxlint';
import {
	GLOB_SET_JSX_FILES,
	GLOB_SET_TEST_FILES,
} from '@standard-config/utilities/constants';
import mergeConfig from '@standard-config/utilities/merge-config';
import configReactBase from '../config-base/index.ts';
import configReactJSXFiles from '../config-jsx-files/index.ts';
import configReactTestFiles from '../config-test-files/index.ts';

/**
 * Resolved Standard Config entry containing React-related rules.
 */
const config: OxlintConfig = mergeConfig(configReactBase, {
	overrides: [
		{
			files: GLOB_SET_JSX_FILES,
			...configReactJSXFiles,
		},
		{
			files: GLOB_SET_TEST_FILES,
			...configReactTestFiles,
		},
	],
});

export default config;
