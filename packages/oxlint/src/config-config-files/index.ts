import type { OxlintConfigOverrideEntry } from '@standard-config/utilities/types';

/**
 * Optional config entry containing core rules that target config files.
 * Intended for explicit overrides.
 */
const config: OxlintConfigOverrideEntry = {
	rules: {
		'import/no-anonymous-default-export': ['error', { allowObject: true }],
		'import/no-empty-named-blocks': 'off',
		'import/no-unassigned-import': 'off',
		'import/unambiguous': 'off',
		'typescript/no-useless-empty-export': 'off',
		'unicorn/no-empty-file': 'off',
		'unicorn/require-module-specifiers': 'off',
	},
};

export default config;
