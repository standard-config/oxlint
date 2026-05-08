import { vi } from 'vitest';

// Do not expand dependency paths in snapshots
vi.mock(import('../transform-plugin/index.ts'), () => ({
	default: (name, specifier) => ({
		name,
		specifier,
	}),
}));
