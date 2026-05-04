import type { OxlintConfig } from 'oxlint';
import mergeConfig from '@standard-config/utilities/merge-config';
import configReactBase from '../config-base/index.ts';
import configReactTestFiles from '../config-test-files/index.ts';

/**
 * Resolved Standard Config entry containing React-related rules.
 */
const config: OxlintConfig = mergeConfig(configReactBase, {
	overrides: [
		{
			files: [
				/* prettier-ignore */
				'**/*.test.{ts,tsx,cts,mts}',
				'**/*.test-d.{ts,cts,mts}',
			],
			...configReactTestFiles,
		},
	],
});

export default config;
