export default function clone<T>(value: T): T {
	try {
		/* oxlint-disable-next-line eslint/no-param-reassign */
		value = structuredClone(value);
	} catch {}

	return value;
}
