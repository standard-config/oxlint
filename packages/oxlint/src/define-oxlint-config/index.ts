import type { StandardConfig } from '@standard-config/utilities/types';
import type { OxlintConfig } from 'oxlint';
import defineConfig from '../define-config/index.ts';

/**
 * Alias for `defineConfig`.
 */
export default function defineOxlintConfig(
	...configs: StandardConfig[]
): OxlintConfig {
	return defineConfig(...configs);
}
