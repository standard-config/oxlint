let hasCoreConfig = false;

try {
	import.meta.resolve('@standard-config/oxlint');
	hasCoreConfig = true;
} catch {}

export default function includesCoreConfig(): boolean {
	return hasCoreConfig;
}
