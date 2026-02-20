import type { LinterConfigOverrideEntry } from '../types/index.d.ts';

const config: LinterConfigOverrideEntry = {
	plugins: ['jsx-a11y', 'react', 'react-perf'],
	rules: {
		'jsx-a11y/img-redundant-alt': 'off',
		'jsx-a11y/media-has-caption': 'off',
		'react-perf/jsx-no-new-array-as-prop': 'error',
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
		'react/jsx-max-depth': 'off',
		'react/jsx-no-target-blank': [
			'error',
			{ warnOnSpreadAttributes: true },
		],
		'react/jsx-props-no-spreading': 'off',
		'react/no-multi-comp': 'off',
		'react/only-export-components': 'off',
		'react/react-in-jsx-scope': 'off',
		'react_perf/jsx-no-jsx-as-prop': 'off',
		'react_perf/jsx-no-new-function-as-prop': 'off',
		'react_perf/jsx-no-new-object-as-prop': 'off',
	},
};

export default config;
