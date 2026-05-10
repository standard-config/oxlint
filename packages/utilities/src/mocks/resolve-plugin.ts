import { vi } from 'vitest';

// Causing `fileURLToPath` to throw an error forces `resolvePlugin` to leave
// dependency specifiers unresolved in snapshots (even when packaged)
vi.mock(import('node:url'), async (importActual) => {
	const actual = await importActual();

	return {
		...actual,
		fileURLToPath: () => {
			throw new Error();
		},
	};
});
