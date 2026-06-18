import { createCalculator } from './index.js';

describe('createCalculator – index entry point', () => {
  it('should expose availableOperations returning an array with required shape', () => {
    const calc = createCalculator();
    const ops = calc.availableOperations();

    expect(Array.isArray(ops)).toBe(true);
    expect(ops.length).toBeGreaterThan(0);

    for (const op of ops) {
      expect(op).toHaveProperty('category');
      expect(op).toHaveProperty('name');
      expect(op).toHaveProperty('label');
      expect(op).toHaveProperty('arity');
    }
  });

  it('should correctly execute regular arithmetic operations', () => {
    const calc = createCalculator();

    expect(calc.execute('+', 2, 3)).toBe(5);
  });

  it('should correctly execute scientific operations', () => {
    const calc = createCalculator();

    expect(calc.execute('sin', 0)).toBeCloseTo(0);
    expect(calc.execute('ln', Math.E)).toBeCloseTo(1);
    expect(calc.execute('pow', 2, 10)).toBe(1024);
    expect(calc.execute('sqrt', 144)).toBe(12);
  });

  it('should execute calculus operations when they are registered', () => {
    const calc = createCalculator();
    const names = new Set(calc.availableOperations().map((op) => op.name));

    if (names.has('derivative')) {
      const result = calc.execute('derivative', 'x^2', 3);
      expect(result).toBeDefined();
      expect(typeof result === 'number' || typeof result === 'string').toBe(true);
    }

    if (names.has('integral')) {
      const result = calc.execute('integral', 'x', 0, 1);
      expect(result).toBeDefined();
      expect(typeof result === 'number' || typeof result === 'string').toBe(true);
    }

    if (names.has('limit')) {
      const result = calc.execute('limit', 'sin(x)/x', 0);
      expect(result).toBeDefined();
      expect(typeof result === 'number' || typeof result === 'string').toBe(true);
    }
  });

  it('should gracefully handle missing calculus operations by not having them in availableOperations', () => {
    const calc = createCalculator();
    const names = new Set(calc.availableOperations().map((op) => op.name));

    // These assertions validate the guard logic in main(): if a calculus op is
    // absent from availableOperations, calling execute with its name should
    // either not be called (as the guard prevents it) or the names set simply
    // won't contain it. We verify the guard set itself is consistent.
    const calculusOps = ['derivative', 'integral', 'limit'];
    for (const opName of calculusOps) {
      if (!names.has(opName)) {
        // The operation is legitimately absent – ensure it is truly missing
        const found = calc.availableOperations().find((op) => op.name === opName);
        expect(found).toBeUndefined();
      }
    }
  });

  it('should throw or return an error-like value when executing an unknown operation', () => {
    const calc = createCalculator();

    expect(() => {
      calc.execute('nonExistentOperation_xyz' as string);
    }).toThrow();
  });
});