import { describe, it, expect } from 'vitest';
import { createCalculator } from '../src/bootstrap.js';

describe('Calculator engine (registry-driven)', () => {
  const calc = createCalculator();

  it('performs basic arithmetic', () => {
    expect(calc.execute('+', 2, 3)).toBe(5);
    expect(calc.execute('-', 10, 4)).toBe(6);
    expect(calc.execute('*', 6, 7)).toBe(42);
    expect(calc.execute('/', 20, 5)).toBe(4);
  });

  it('throws on division by zero', () => {
    expect(() => calc.execute('/', 1, 0)).toThrow(/Division by zero/);
  });

  it('throws on unknown operation', () => {
    expect(() => calc.execute('mod', 5, 2)).toThrow(/Unknown operation/);
  });

  it('validates argument count (arity)', () => {
    expect(() => calc.execute('+', 1)).toThrow(/expects 2 argument/);
    expect(() => calc.execute('sin', 1, 2)).toThrow(/expects 1 argument/);
  });

  it('lists operations and supports category filtering', () => {
    expect(calc.availableOperations().length).toBeGreaterThan(0);
    const trig = calc.availableOperations('trigonometry');
    expect(trig.map((o) => o.name).sort()).toEqual(['cos', 'sin', 'tan']);
  });
});
