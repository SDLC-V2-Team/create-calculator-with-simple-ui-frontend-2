import type { OperationFn, OperationDefinition } from './types';

describe('OperationFn type', () => {
  it('happy path: accepts a function that takes two numbers and returns a number', () => {
    const add: OperationFn = (a: number, b: number): number => a + b;
    expect(add(2, 3)).toBe(5);
  });

  it('edge case: accepts variadic arguments and sums them all', () => {
    const sum: OperationFn = (...args: number[]): number =>
      args.reduce((acc, val) => acc + val, 0);
    expect(sum(1, 2, 3, 4)).toBe(10);
  });

  it('edge case: works with zero arguments (zero-arity constant)', () => {
    const pi: OperationFn = (): number => Math.PI;
    expect(pi()).toBeCloseTo(3.14159, 5);
  });
});

describe('OperationDefinition interface', () => {
  it('happy path: creates a valid OperationDefinition without optional description', () => {
    const multiplyDef: OperationDefinition = {
      name: '*',
      label: 'Multiply',
      arity: 2,
      category: 'basic',
      fn: (a: number, b: number): number => a * b,
    };

    expect(multiplyDef.name).toBe('*');
    expect(multiplyDef.label).toBe('Multiply');
    expect(multiplyDef.arity).toBe(2);
    expect(multiplyDef.category).toBe('basic');
    expect(multiplyDef.fn(3, 4)).toBe(12);
    expect(multiplyDef.description).toBeUndefined();
  });

  it('happy path: creates a valid OperationDefinition with optional description', () => {
    const sinDef: OperationDefinition = {
      name: 'sin',
      label: 'Sine',
      arity: 1,
      category: 'trigonometry',
      fn: (x: number): number => Math.sin(x),
      description: 'Computes the sine of an angle in radians.',
    };

    expect(sinDef.name).toBe('sin');
    expect(sinDef.label).toBe('Sine');
    expect(sinDef.arity).toBe(1);
    expect(sinDef.category).toBe('trigonometry');
    expect(sinDef.fn(Math.PI / 2)).toBeCloseTo(1, 5);
    expect(sinDef.description).toBe('Computes the sine of an angle in radians.');
  });

  it('error path: fn returning NaN when called with wrong number of args reflects JS behaviour', () => {
    const divideDef: OperationDefinition = {
      name: '/',
      label: 'Divide',
      arity: 2,
      category: 'basic',
      fn: (a: number, b: number): number => a / b,
    };

    // Calling with only one argument: b is undefined → NaN
    const result = divideDef.fn(10);
    expect(result).toBeNaN();
  });
});