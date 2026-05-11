import type { OxlintConfigPluginEntry } from '../types/index.d.ts';
import { fileURLToPath } from 'node:url';

/**
 * Resolve an external plugin specifier to a file path.
 *
 * @example
 *
 * ```ts
 * import { resolvePlugin } from '@standard-config/oxlint';
 * import { defineConfig } from 'oxlint';
 *
 * const config = defineConfig({
 *     jsPlugins: [
 *         resolvePlugin(
 *             'react-x',
 *             '@eslint-react/eslint-plugin',
 *         ),
 *     ],
 *     rules: {
 *         'react-x/refs': 'error',
 *     },
 * });
 * ```
 */
export default function resolvePlugin(
	name: string,
	specifier: string
): OxlintConfigPluginEntry {
	try {
		/* oxlint-disable-next-line eslint/no-param-reassign */
		specifier = fileURLToPath(import.meta.resolve(specifier));
	} catch {}

	return { name, specifier };
}
