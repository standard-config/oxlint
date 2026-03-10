import type { LinterConfigOverrideEntry } from '../types/index.d.ts';

const config: LinterConfigOverrideEntry = {
	rules: {
		'import/no-empty-named-blocks': 'off',
		'import/no-unassigned-import': 'off',
		'import/unambiguous': 'off',
		'typescript/consistent-type-definitions': 'off',
		'typescript/no-empty-interface': 'off',
		'typescript/no-empty-object-type': 'off',
		'typescript/no-restricted-types': 'off',
		'typescript/no-useless-empty-export': 'off',
		'unicorn/require-module-specifiers': 'off',
	},
};

export default config;
