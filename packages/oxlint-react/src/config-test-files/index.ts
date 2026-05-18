import type { OxlintConfigOverrideEntry } from '@standard-config/utilities/types';

/**
 * Optional config entry containing React-related rules that target test files.
 * Intended for explicit overrides.
 */
const config: OxlintConfigOverrideEntry = {
	rules: {
		'jsx-a11y/alt-text': 'off',
		'jsx-a11y/anchor-ambiguous-text': 'off',
		'jsx-a11y/anchor-has-content': 'off',
		'jsx-a11y/anchor-is-valid': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/control-has-associated-label': 'off',
		'jsx-a11y/heading-has-content': 'off',
		'jsx-a11y/html-has-lang': 'off',
		'jsx-a11y/iframe-has-title': 'off',
		'jsx-a11y/interactive-supports-focus': 'off',
		'jsx-a11y/label-has-associated-control': 'off',
		'jsx-a11y/lang': 'off',
		'jsx-a11y/mouse-events-have-key-events': 'off',
		'jsx-a11y/no-access-key': 'off',
		'jsx-a11y/no-autofocus': 'off',
		'jsx-a11y/no-distracting-elements': 'off',
		'jsx-a11y/no-interactive-element-to-noninteractive-role': 'off',
		'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
		'jsx-a11y/no-noninteractive-tabindex': 'off',
		'jsx-a11y/no-redundant-roles': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'jsx-a11y/prefer-tag-over-role': 'off',
		'jsx-a11y/scope': 'off',
		'jsx-a11y/tabindex-no-positive': 'off',
		'react-perf/jsx-no-new-array-as-prop': 'off',
		'react/button-has-type': 'off',
		'react/checked-requires-onchange-or-readonly': 'off',
		'react/jsx-no-target-blank': 'off',
		'react/jsx-no-useless-fragment': 'off',
		'react/no-array-index-key': 'off',
		'react/no-children-prop': 'off',
		'react/no-danger': 'off',
	},
};

export default config;
