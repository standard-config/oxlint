import type { OxlintConfig } from 'oxlint';
import type { StandardConfig } from '../types/index.d.ts';
import defineConfig from '../define-config/index.ts';

/**
 * Alias for `defineConfig`.
 */
export default function defineOxlintConfig(
	...configs: StandardConfig[]
): OxlintConfig {
	return defineConfig(...configs);
}
