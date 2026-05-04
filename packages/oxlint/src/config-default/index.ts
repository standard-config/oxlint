import type { OxlintConfig } from 'oxlint';
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
			files: [
				/* prettier-ignore */
				'**/*.d.{ts,cts,mts}',
				'**/*.test-d.{ts,cts,mts}',
			],
			...configTypeDefinitions,
		},
		{
			files: [
				/* prettier-ignore */
				'**/*.test.{ts,tsx,cts,mts}',
				'**/*.test-d.{ts,cts,mts}',
			],
			...configTestFiles,
		},
		{
			files: [
				/* prettier-ignore */
				'**/*.config.{ts,cts,mts}',
				'**/*.setup.{ts,cts,mts}',
			],
			...configConfigFiles,
		},
	],
});

export default config;
