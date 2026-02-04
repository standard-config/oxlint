import { expect, test } from 'vitest';
import clone from './index.ts';

test('clones the input object', () => {
	const object = {};
	const result = clone(object);

	expect(result).toStrictEqual({});
	expect(result).not.toBe(object);
});

test('maintains circular references', () => {
	const object: Record<string, unknown> = { foo: 1 };

	object.bar = object;

	const result = clone(object);

	expect(result).toStrictEqual({ foo: 1, bar: result });
	expect(result).not.toBe(object);
});
