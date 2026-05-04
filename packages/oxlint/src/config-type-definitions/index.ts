import type { OxlintConfigOverrideEntry } from '@standard-config/utilities/types';

/**
 * Optional config entry containing rules that target type definition files.
 * Intended for explicit overrides.
 */
const config: OxlintConfigOverrideEntry = {
	rules: {
		'import/no-empty-named-blocks': 'off',
		'import/no-unassigned-import': 'off',
		'import/unambiguous': 'off',
		'typescript/consistent-type-definitions': 'off',
		'typescript/no-empty-object-type': 'off',
		'typescript/no-restricted-types': 'off',
		'typescript/no-useless-empty-export': 'off',
		'unicorn/require-module-specifiers': 'off',
	},
};

export default config;
