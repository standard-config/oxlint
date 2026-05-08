import type { OxlintConfigPluginEntry } from '../types/index.d.ts';
import { fileURLToPath } from 'node:url';

/**
 * Resolve an external plugin specifier.
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
