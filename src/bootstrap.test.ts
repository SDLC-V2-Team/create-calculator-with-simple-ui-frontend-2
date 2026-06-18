import { createCalculator } from './bootstrap';
import { Calculator } from './core/Calculator';

describe('createCalculator', () => {
  it('should return a Calculator instance', () => {
    const calculator = createCalculator();
    expect(calculator).toBeInstanceOf(Calculator);
  });

  it('should have basic arithmetic operations registered (addition)', () => {
    const calculator = createCalculator();
    // Basic operations should include add/+
    const result = calculator.evaluate('add(2, 3)');
    expect(result).toBe(5);
  });

  it('should have scientific functions registered (sqrt)', () => {
    const calculator = createCalculator();
    const result = calculator.evaluate('sqrt(9)');
    expect(result).toBeCloseTo(3, 5);
  });

  it('should return a new independent instance on each call', () => {
    const calc1 = createCalculator();
    const calc2 = createCalculator();
    expect(calc1).not.toBe(calc2);
  });

  it('should support chained / nested operations combining basic and scientific', () => {
    const calculator = createCalculator();
    // sqrt(add(7, 9)) => sqrt(16) => 4
    const result = calculator.evaluate('sqrt(add(7, 9))');
    expect(result).toBeCloseTo(4, 5);
  });

  it('should throw an error when an unknown function is evaluated', () => {
    const calculator = createCalculator();
    expect(() => calculator.evaluate('unknownFn(1, 2)')).toThrow();
  });
});