/* oxlint-disable eslint/no-unsafe-member-access */

import type { OxlintConfig } from 'oxlint';
import clone from '../clone/index.ts';

export default function mergeConfig(
	baseConfig: OxlintConfig,
	extensionConfig: OxlintConfig
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
			(result as any)[key] = [...result[key], ...value];
			continue;
		}

		/* oxlint-disable-next-line typescript/no-misused-spread */
		(result as any)[key] = { ...result[key], ...value };
	}

	return result;
}

function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}
