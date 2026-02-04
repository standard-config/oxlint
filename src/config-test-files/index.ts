import type { LinterConfigOverrideEntry } from '../types/index.d.ts';

const config: LinterConfigOverrideEntry = {
	rules: {
		'eslint/no-alert': 'off',
		'import/unambiguous': 'off',
		'promise/prefer-await-to-then': 'off',
		'typescript/ban-ts-comment': 'off',
		'typescript/no-confusing-void-expression': 'off',
		'typescript/no-empty-function': 'off',
		'typescript/no-extraneous-class': 'off',
		'typescript/no-unsafe-assignment': 'off',
		'typescript/no-unsafe-member-access': 'off',
		'unicorn/consistent-function-scoping': 'off',
		'unicorn/error-message': 'off',
		'unicorn/no-empty-file': 'off',
		'vitest/no-conditional-tests': 'off',
		'vitest/prefer-to-be-falsy': 'off',
		'vitest/prefer-to-be-truthy': 'off',
		'vitest/require-top-level-describe': 'off',
	},
};

export default config;
