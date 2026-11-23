let hasCoreConfig = false;

try {
	import.meta.resolve('@standard-config/oxlint');
	hasCoreConfig = true;
} catch {}

/**
 * Checks whether `@standard-config/oxlint` is available.
 */
export default function includesCoreConfig(): boolean {
	return hasCoreConfig;
}
