import type { OxlintConfig } from 'oxlint';
import defineConfig from '../define-config/index.ts';

/**
 * Alias for `defineConfig`.
 */
export default function defineOxlintConfig(
	...configs: OxlintConfig[]
): OxlintConfig {
	return defineConfig(...configs);
}
