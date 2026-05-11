import type { OxlintConfig } from 'oxlint';
import {
	GLOB_SET_CONFIG_FILES,
	GLOB_SET_JSX_FILES,
} from '@standard-config/utilities/constants';
import mergeConfig from '@standard-config/utilities/merge-config';
import configStylisticBase from '../config-base/index.ts';
import configStylisticConfigFiles from '../config-config-files/index.ts';
import configStylisticJSXFiles from '../config-jsx-files/index.ts';

/**
 * Resolved Standard Config entry containing stylistic rules.
 */
const config: OxlintConfig = mergeConfig(configStylisticBase, {
	overrides: [
		{
			files: GLOB_SET_JSX_FILES,
			...configStylisticJSXFiles,
		},
		{
			files: GLOB_SET_CONFIG_FILES,
			...configStylisticConfigFiles,
		},
	],
});

export default config;
