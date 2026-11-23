/* oxlint-disable eslint/no-unsafe-member-access */

import type { OxlintConfig } from 'oxlint';
import type {
	OxlintConfigBaseEntry,
	OxlintConfigOverrideEntry,
} from '../types/index.ts';
import clone from '../clone/index.ts';

/**
 * Merges two Oxlint configs, combining arrays and merging objects shallowly.
 * The extension can remove a top-level property with `null` or `undefined`.
 */
export default function mergeConfig(
	baseConfig: OxlintConfig,
	extensionConfig:
		OxlintConfig | OxlintConfigBaseEntry | OxlintConfigOverrideEntry
): OxlintConfig {
	if (!(isObject(baseConfig) && isObject(extensionConfig))) {
		throw new TypeError(
			'Standard Config error: expected config to be an object'
		);
	}

	const result = clone(baseConfig);

	for (const [key, value] of Object.entries(
		clone(extensionConfig)
	) as ReadonlyArray<[keyof OxlintConfig, unknown]>) {
		if (value === undefined || value === null) {
			/* oxlint-disable-next-line typescript/no-dynamic-delete */
			delete result[key];
			continue;
		}

		if (result[key] === undefined) {
			(result as any)[key] = value;
			continue;
		}

		if (isArray(value) && isArray(result[key])) {
			const values = [...new Set([...result[key], ...value])];

			(result as any)[key] =
				key === 'plugins'
					? (values as ReadonlyArray<string>).toSorted()
					: values;

			continue;
		}

		(result as any)[key] = { ...result[key], ...value };
	}

	return result;
}

/**
 * Checks whether a value is an array.
 */
function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

/**
 * Checks whether a value is a non-null object, including an array.
 */
function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}
