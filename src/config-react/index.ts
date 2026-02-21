import type { LinterConfigOverrideEntry } from '../types/index.d.ts';

const config: LinterConfigOverrideEntry = {
	plugins: ['jsx-a11y', 'react', 'react-perf'],
	rules: {
		'jsx-a11y/click-events-have-key-events': 'warn',
		'jsx-a11y/img-redundant-alt': 'off',
		'jsx-a11y/media-has-caption': 'off',
		'jsx-a11y/mouse-events-have-key-events': 'warn',
		'react-perf/jsx-no-new-array-as-prop': 'error',
		'react/display-name': 'off',
		'react/jsx-curly-brace-presence': [
			'error',
			{
				children: 'never',
				propElementValues: 'always',
				props: 'never',
			},
		],
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
		'react/jsx-max-depth': 'off',
		'react/jsx-no-target-blank': [
			'error',
			{ warnOnSpreadAttributes: true },
		],
		'react/jsx-props-no-spreading': 'off',
		'react/no-did-mount-set-state': 'off',
		'react/no-direct-mutation-state': 'off',
		'react/no-find-dom-node': 'off',
		'react/no-is-mounted': 'off',
		'react/no-multi-comp': 'off',
		'react/no-redundant-should-component-update': 'off',
		'react/no-render-return-value': 'off',
		'react/no-set-state': 'off',
		'react/no-string-refs': 'off',
		'react/no-this-in-sfc': 'off',
		'react/no-unsafe': 'off',
		'react/no-will-update-set-state': 'off',
		'react/only-export-components': 'off',
		'react/prefer-es6-class': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/require-render-return': 'off',
		'react/state-in-constructor': 'off',
		'react_perf/jsx-no-jsx-as-prop': 'off',
		'react_perf/jsx-no-new-function-as-prop': 'off',
		'react_perf/jsx-no-new-object-as-prop': 'off',
	},
};

export default config;
