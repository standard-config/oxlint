import type { LinterConfigOverrideEntry } from '../types/index.d.ts';

const config: LinterConfigOverrideEntry = {
	rules: {
		'import/no-anonymous-default-export': ['error', { allowObject: true }],
		'import/unambiguous': 'off',
		'unicorn/no-empty-file': 'off',
	},
};

export default config;
