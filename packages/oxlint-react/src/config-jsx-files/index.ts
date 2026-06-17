import type { OxlintConfigOverrideEntry } from '@standard-config/utilities/types';

/**
 * Optional config entry containing React-related rules that target JSX files.
 * Intended for explicit overrides.
 */
const config: OxlintConfigOverrideEntry = {
	rules: {
		'react-effect/no-adjust-state-on-prop-change': 'error',
		'react-effect/no-chain-state-updates': 'error',
		'react-effect/no-derived-state': 'error',
		'react-effect/no-event-handler': 'error',
		'react-effect/no-external-store-subscription': 'error',
		'react-effect/no-pass-data-to-parent': 'error',
		'react-effect/no-pass-live-state-to-parent': 'error',
		'react-effect/no-reset-all-state-on-prop-change': 'error',
		'react-x/dom-no-flush-sync': 'error',
		'react-x/dom-no-unsafe-iframe-sandbox': 'error',
		'react-x/dom-no-use-form-state': 'error',
		'react-x/error-boundaries': 'error',
		'react-x/immutability': 'error',
		'react-x/jsx-no-key-after-spread': 'error',
		'react-x/jsx-no-leaked-dollar': 'error',
		'react-x/jsx-no-leaked-semicolon': 'error',
		'react-x/jsx-no-useless-fragment': 'error',
		'react-x/naming-convention-context-name': 'error',
		'react-x/naming-convention-id-name': 'error',
		'react-x/naming-convention-ref-name': 'error',
		'react-x/no-access-state-in-setstate': 'error',
		'react-x/no-class-component': 'error',
		'react-x/no-context-provider': 'error',
		'react-x/no-duplicate-key': 'error',
		'react-x/no-forward-ref': 'error',
		'react-x/no-misused-capture-owner-stack': 'error',
		'react-x/no-nested-lazy-component-declarations': 'error',
		'react-x/no-unnecessary-use-prefix': 'error',
		'react-x/no-unstable-context-value': 'error',
		'react-x/no-unstable-default-props': 'error',
		'react-x/no-use-context': 'error',
		'react-x/purity': 'error',
		'react-x/refs': 'error',
		'react-x/set-state-in-render': 'error',
		'react-x/unsupported-syntax': 'error',
		'react-x/use-memo': 'error',
		'react-x/use-state': 'error',
		'react-x/web-api-no-leaked-event-listener': 'error',
		'react-x/web-api-no-leaked-intersection-observer': 'error',
		'react-x/web-api-no-leaked-interval': 'error',
		'react-x/web-api-no-leaked-resize-observer': 'error',
		'react-x/web-api-no-leaked-timeout': 'error',
	},
};

export default config;
