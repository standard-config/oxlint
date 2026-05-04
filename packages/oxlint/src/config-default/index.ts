import type { OxlintConfig } from 'oxlint';
import {
	GLOB_SET_CONFIG_FILES,
	GLOB_SET_TEST_FILES,
	GLOB_SET_TYPE_DEFINITIONS,
} from '@standard-config/utilities/constants';
import mergeConfig from '@standard-config/utilities/merge-config';
import configBase from '../config-base/index.ts';
import configConfigFiles from '../config-config-files/index.ts';
import configTestFiles from '../config-test-files/index.ts';
import configTypeDefinitions from '../config-type-definitions/index.ts';

/**
 * Resolved Standard Config core entry.
 */
const config: OxlintConfig = mergeConfig(configBase, {
	overrides: [
		{
			files: GLOB_SET_TYPE_DEFINITIONS,
			...configTypeDefinitions,
		},
		{
			files: GLOB_SET_TEST_FILES,
			...configTestFiles,
		},
		{
			files: GLOB_SET_CONFIG_FILES,
			...configConfigFiles,
		},
	],
});

export default config;
