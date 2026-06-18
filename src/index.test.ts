import { createCalculator } from './index';

describe('createCalculator (re-exported from index)', () => {
  it('should create a calculator instance with expected methods', () => {
    const calc = createCalculator();
    expect(calc).toBeDefined();
    expect(typeof calc.execute).toBe('function');
    expect(typeof calc.availableOperations).toBe('function');
  });

  it('should list available operations with required shape', () => {
    const calc = createCalculator();
    const ops = calc.availableOperations();
    expect(Array.isArray(ops)).toBe(true);
    expect(ops.length).toBeGreaterThan(0);
    for (const op of ops) {
      expect(op).toHaveProperty('name');
      expect(op).toHaveProperty('label');
      expect(op).toHaveProperty('category');
      expect(op).toHaveProperty('arity');
    }
  });

  it('should perform basic arithmetic operations correctly', () => {
    const calc = createCalculator();
    expect(calc.execute('+', 2, 3)).toBe(5);
    expect(calc.execute('-', 10, 4)).toBe(6);
    expect(calc.execute('*', 3, 7)).toBe(21);
    expect(calc.execute('/', 20, 4)).toBe(5);
  });

  it('should compute trigonometric operations correctly', () => {
    const calc = createCalculator();
    expect(calc.execute('sin', 0)).toBeCloseTo(0);
    expect(calc.execute('cos', 0)).toBeCloseTo(1);
    expect(calc.execute('tan', 0)).toBeCloseTo(0);
  });

  it('should compute logarithm and power operations correctly', () => {
    const calc = createCalculator();
    expect(calc.execute('ln', Math.E)).toBeCloseTo(1);
    expect(calc.execute('pow', 2, 10)).toBe(1024);
  });

  it('should compute sqrt of 144 as 12', () => {
    const calc = createCalculator();
    expect(calc.execute('sqrt', 144)).toBeCloseTo(12);
  });
});