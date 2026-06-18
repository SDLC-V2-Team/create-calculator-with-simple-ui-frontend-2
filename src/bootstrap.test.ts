import { createCalculator } from './bootstrap';
import { Calculator } from './core/Calculator';

describe('createCalculator (bootstrap)', () => {
  it('should return a Calculator instance', () => {
    const calculator = createCalculator();
    expect(calculator).toBeInstanceOf(Calculator);
  });

  it('should have basic operations registered (e.g. add)', () => {
    const calculator = createCalculator();
    // Basic addition: 2 + 3 = 5
    const result = calculator.evaluate('add', [2, 3]);
    expect(result).toBe(5);
  });

  it('should have scientific functions registered (e.g. sqrt)', () => {
    const calculator = createCalculator();
    // Square root of 9 = 3
    const result = calculator.evaluate('sqrt', [9]);
    expect(result).toBeCloseTo(3, 5);
  });

  it('should have calculus functions registered (e.g. derivative)', () => {
    const calculator = createCalculator();
    // Derivative of x^2 at x=3 should be approximately 6
    // Using the registered derivative function with a simple polynomial
    const result = calculator.evaluate('derivative', [(x: number) => x * x, 3]);
    expect(result).toBeCloseTo(6, 1);
  });

  it('should return independent Calculator instances on multiple calls', () => {
    const calculator1 = createCalculator();
    const calculator2 = createCalculator();
    expect(calculator1).not.toBe(calculator2);
    // Both should still work correctly
    expect(calculator1.evaluate('add', [1, 2])).toBe(3);
    expect(calculator2.evaluate('add', [1, 2])).toBe(3);
  });

  it('should throw an error when an unknown function is called', () => {
    const calculator = createCalculator();
    expect(() => calculator.evaluate('nonExistentFunction', [1, 2])).toThrow();
  });
});