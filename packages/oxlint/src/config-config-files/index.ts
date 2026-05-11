import type { OxlintConfigOverrideEntry } from '@standard-config/utilities/types';

/**
 * Optional config entry containing core rules that target config files.
 * Intended for explicit overrides.
 */
const config: OxlintConfigOverrideEntry = {
	rules: {
		'import/no-anonymous-default-export': ['error', { allowObject: true }],
		'import/no-unassigned-import': 'off',
		'import/unambiguous': 'off',
		'typescript/no-useless-empty-export': 'off',
		'unicorn/no-empty-file': 'off',
	},
};

export default config;
