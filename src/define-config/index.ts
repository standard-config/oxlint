import type { OxlintConfig } from 'oxlint';
import type { StandardConfig } from '../types/index.js';
import { defineConfig as oxlintDefineConfig } from 'oxlint';
import configBase from '../config-base/index.ts';
import configConfigFiles from '../config-config-files/index.ts';
import configReact from '../config-react/index.ts';
import configTestFiles from '../config-test-files/index.ts';
import configTypeDefinitions from '../config-type-definitions/index.ts';
import mergeConfig from '../merge-config/index.ts';

export default function defineConfig(
	config: StandardConfig = {}
): OxlintConfig {
	const { react, ...extensionConfig } = config;

	const baseConfig: OxlintConfig = {
		...(react ? mergeConfig(configBase, configReact) : configBase),
		overrides: [
			{
				files: ['**/*.d.{ts,cts,mts}'],
				...configTypeDefinitions,
			},
			{
				files: ['**/*.test.{ts,tsx,cts,mts}'],
				...configTestFiles,
			},
			{
				files: ['**/*.config.{ts,cts,mts}', '**/*.setup.{ts,cts,mts}'],
				...configConfigFiles,
			},
		],
	};

	const extendedConfig = mergeConfig(baseConfig, extensionConfig);
	return oxlintDefineConfig(extendedConfig);
}
