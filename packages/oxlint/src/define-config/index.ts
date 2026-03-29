import type { StandardConfig } from '@standard-config/utilities/types';
import type { OxlintConfig } from 'oxlint';
import { configReactBase } from '@standard-config/oxlint-react';
import mergeConfig from '@standard-config/utilities/merge-config';
import { defineConfig as oxlintDefineConfig } from 'oxlint';
import configBase from '../config-base/index.ts';
import configConfigFiles from '../config-config-files/index.ts';
import configTestFiles from '../config-test-files/index.ts';
import configTypeDefinitions from '../config-type-definitions/index.ts';

export default function defineConfig(
	...configs: StandardConfig[]
): OxlintConfig {
	let extensionConfig: OxlintConfig = {};
	let includeReactConfig = false;

	for (const config of configs) {
		const { react, ...otherConfig } = config;

		extensionConfig = mergeConfig(extensionConfig, otherConfig);

		if (react !== undefined) {
			includeReactConfig = react;
		}
	}

	const baseConfig: OxlintConfig = {
		...(includeReactConfig
			? mergeConfig(configBase, configReactBase)
			: configBase),

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
	};

	const extendedConfig = mergeConfig(baseConfig, extensionConfig);
	return oxlintDefineConfig(extendedConfig);
}
