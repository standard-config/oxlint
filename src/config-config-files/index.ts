import type { LinterConfigOverrideEntry } from '../types/index.d.ts';

const config: LinterConfigOverrideEntry = {
	rules: {
		'import/no-anonymous-default-export': ['error', { allowObject: true }],
		'import/no-unassigned-import': 'off',
		'import/unambiguous': 'off',
		'typescript/no-useless-empty-export': 'off',
		'unicorn/no-empty-file': 'off',
	},
};

export default config;
