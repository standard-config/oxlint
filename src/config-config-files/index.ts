import type { LinterConfigOverrideEntry } from '../types/index.d.ts';

const config: LinterConfigOverrideEntry = {
	rules: {
		'import/unambiguous': 'off',
		'unicorn/no-empty-file': 'off',
		'vitest/require-hook': 'off',
	},
};

export default config;
