import type { OxlintConfig } from 'oxlint';
import { defineConfig as oxlintDefineConfig } from 'oxlint';
import configBase from '../config-base/index.ts';
import configConfigFiles from '../config-config-files/index.ts';
import configTestFiles from '../config-test-files/index.ts';
import configTypeDefinitions from '../config-type-definitions/index.ts';
import mergeConfig from '../merge-config/index.ts';

export default function defineConfig(config: OxlintConfig = {}): OxlintConfig {
	const baseConfig: OxlintConfig = {
		...configBase,
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

	const extendedConfig = mergeConfig(baseConfig, config);
	return oxlintDefineConfig(extendedConfig);
}
