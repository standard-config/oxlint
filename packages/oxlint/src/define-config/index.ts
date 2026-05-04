import type { StandardConfig } from '@standard-config/utilities/types';
import type { OxlintConfig } from 'oxlint';
import configReact from '@standard-config/oxlint-react';
import mergeConfig from '@standard-config/utilities/merge-config';
import { defineConfig as oxlintDefineConfig } from 'oxlint';
import configCore from '../config-default/index.ts';

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

	const baseConfig = includeReactConfig
		? mergeConfig(configCore, configReact)
		: configCore;

	const extendedConfig = mergeConfig(baseConfig, extensionConfig);
	return oxlintDefineConfig(extendedConfig);
}
