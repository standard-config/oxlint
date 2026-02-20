import type { LinterConfigOverrideEntry } from '../types/index.d.ts';

const config: LinterConfigOverrideEntry = {
	rules: {
		'eslint/no-alert': 'off',
		'eslint/no-param-reassign': 'off',
		'eslint/no-promise-executor-return': 'off',
		'import/no-unassigned-import': 'off',
		'import/unambiguous': 'off',
		'jsx-a11y/anchor-is-valid': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/mouse-events-have-key-events': 'off',
		'promise/prefer-await-to-then': 'off',
		'react-perf/jsx-no-new-array-as-prop': 'off',
		'react/jsx-no-useless-fragment': 'off',
		'react/no-children-prop': 'off',
		'typescript/ban-ts-comment': 'off',
		'typescript/no-confusing-void-expression': 'off',
		'typescript/no-empty-function': 'off',
		'typescript/no-extraneous-class': 'off',
		'typescript/no-unsafe-argument': 'off',
		'typescript/no-unsafe-assignment': 'off',
		'typescript/no-unsafe-member-access': 'off',
		'unicorn/consistent-function-scoping': 'off',
		'unicorn/error-message': 'off',
		'unicorn/no-empty-file': 'off',
		'vitest/no-commented-out-tests': 'warn',
		'vitest/no-disabled-tests': 'warn',
	},
};

export default config;
