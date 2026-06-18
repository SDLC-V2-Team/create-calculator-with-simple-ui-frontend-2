import { describe, it, expect } from 'vitest';
import { createCalculator } from '../src/bootstrap.js';

describe('Scientific functions module', () => {
  const calc = createCalculator();

  it('computes trigonometric functions', () => {
    expect(calc.execute('sin', 0)).toBeCloseTo(0);
    expect(calc.execute('cos', 0)).toBeCloseTo(1);
    expect(calc.execute('tan', 0)).toBeCloseTo(0);
  });

  it('computes logarithms', () => {
    expect(calc.execute('ln', Math.E)).toBeCloseTo(1);
    expect(calc.execute('log10', 1000)).toBeCloseTo(3);
  });

  it('rejects logarithms of non-positive numbers', () => {
    expect(() => calc.execute('ln', 0)).toThrow(/positive/);
    expect(() => calc.execute('log10', -5)).toThrow(/positive/);
  });

  it('computes exponentials and powers', () => {
    expect(calc.execute('exp', 0)).toBeCloseTo(1);
    expect(calc.execute('pow', 2, 10)).toBe(1024);
    expect(calc.execute('sqrt', 144)).toBe(12);
  });

  it('rejects square root of negatives', () => {
    expect(() => calc.execute('sqrt', -1)).toThrow(/non-negative/);
  });
});
