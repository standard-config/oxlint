import type { OxlintConfig } from 'oxlint';
import mergeConfig from '@standard-config/utilities/merge-config';
import { defineConfig as oxlintDefineConfig } from 'oxlint';
import configCore from '../config-default/index.ts';

const SUPPLEMENTAL_CONFIGS: OxlintConfig[] = [];

for (const config of [
	'@standard-config/oxlint-react',
	'@standard-config/oxlint-stylistic',
] as const) {
	let resolvedConfig: OxlintConfig | undefined;

	try {
		/* oxlint-disable-next-line typescript/no-unsafe-assignment */
		const module = await import(config);
		/* oxlint-disable-next-line typescript/no-unsafe-member-access */
		resolvedConfig = module.default as OxlintConfig;
	} catch {}

	if (typeof resolvedConfig === 'object') {
		SUPPLEMENTAL_CONFIGS.push(resolvedConfig);
	}
}

export default function defineConfig(...configs: OxlintConfig[]): OxlintConfig {
	let mergedConfig: OxlintConfig = {};

	for (const config of [configCore, ...SUPPLEMENTAL_CONFIGS, ...configs]) {
		mergedConfig = mergeConfig(mergedConfig, config);
	}

	return oxlintDefineConfig(mergedConfig);
}
