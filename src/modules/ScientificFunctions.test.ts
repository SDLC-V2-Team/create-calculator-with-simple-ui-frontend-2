import { scientificFunctions } from './ScientificFunctions';
import type { OperationDefinition } from '../core/types';

const getOp = (name: string): OperationDefinition => {
  const op = scientificFunctions.find((f) => f.name === name);
  if (!op) throw new Error(`Operation "${name}" not found in scientificFunctions`);
  return op;
};

describe('scientificFunctions', () => {
  describe('structure', () => {
    it('exports an array of OperationDefinition objects with required fields', () => {
      expect(Array.isArray(scientificFunctions)).toBe(true);
      expect(scientificFunctions.length).toBeGreaterThan(0);

      for (const op of scientificFunctions) {
        expect(typeof op.name).toBe('string');
        expect(typeof op.label).toBe('string');
        expect(typeof op.arity).toBe('number');
        expect(typeof op.category).toBe('string');
        expect(typeof op.fn).toBe('function');
      }
    });
  });

  describe('happy path — trigonometry (radians)', () => {
    it('sin computes the sine of an angle', () => {
      const sin = getOp('sin');
      expect(sin.fn(0)).toBeCloseTo(0);
      expect(sin.fn(Math.PI / 2)).toBeCloseTo(1);
      expect(sin.fn(Math.PI)).toBeCloseTo(0);
    });

    it('cos computes the cosine of an angle', () => {
      const cos = getOp('cos');
      expect(cos.fn(0)).toBeCloseTo(1);
      expect(cos.fn(Math.PI / 2)).toBeCloseTo(0);
      expect(cos.fn(Math.PI)).toBeCloseTo(-1);
    });

    it('tan computes the tangent of an angle', () => {
      const tan = getOp('tan');
      expect(tan.fn(0)).toBeCloseTo(0);
      expect(tan.fn(Math.PI / 4)).toBeCloseTo(1);
    });
  });

  describe('happy path — logarithms', () => {
    it('ln computes the natural logarithm for positive numbers', () => {
      const ln = getOp('ln');
      expect(ln.fn(1)).toBeCloseTo(0);
      expect(ln.fn(Math.E)).toBeCloseTo(1);
      expect(ln.fn(Math.E * Math.E)).toBeCloseTo(2);
    });

    it('log10 computes the base-10 logarithm for positive numbers', () => {
      const log10 = getOp('log10');
      expect(log10.fn(1)).toBeCloseTo(0);
      expect(log10.fn(10)).toBeCloseTo(1);
      expect(log10.fn(100)).toBeCloseTo(2);
    });
  });

  describe('happy path — exponentials and powers', () => {
    it('exp raises e to the power x', () => {
      const exp = getOp('exp');
      expect(exp.fn(0)).toBeCloseTo(1);
      expect(exp.fn(1)).toBeCloseTo(Math.E);
      expect(exp.fn(2)).toBeCloseTo(Math.E * Math.E);
    });

    it('pow raises a base to a given exponent', () => {
      const pow = getOp('pow');
      expect(pow.fn(2, 3)).toBeCloseTo(8);
      expect(pow.fn(5, 0)).toBeCloseTo(1);
      expect(pow.fn(9, 0.5)).toBeCloseTo(3);
    });

    it('sqrt computes the square root of a non-negative number', () => {
      const sqrt = getOp('sqrt');
      expect(sqrt.fn(0)).toBeCloseTo(0);
      expect(sqrt.fn(4)).toBeCloseTo(2);
      expect(sqrt.fn(9)).toBeCloseTo(3);
    });
  });

  describe('edge cases — boundary values', () => {
    it('ln throws for zero (boundary of positive domain)', () => {
      const ln = getOp('ln');
      expect(() => ln.fn(0)).toThrow('ln is only defined for positive numbers.');
    });

    it('log10 throws for zero (boundary of positive domain)', () => {
      const log10 = getOp('log10');
      expect(() => log10.fn(0)).toThrow('log10 is only defined for positive numbers.');
    });

    it('sqrt returns 0 for input 0 (boundary of non-negative domain)', () => {
      const sqrt = getOp('sqrt');
      expect(sqrt.fn(0)).toBe(0);
    });

    it('sin and cos handle large angle values', () => {
      const sin = getOp('sin');
      const cos = getOp('cos');
      expect(sin.fn(2 * Math.PI)).toBeCloseTo(0);
      expect(cos.fn(2 * Math.PI)).toBeCloseTo(1);
    });
  });

  describe('error path — invalid inputs', () => {
    it('ln throws for negative numbers', () => {
      const ln = getOp('ln');
      expect(() => ln.fn(-1)).toThrow('ln is only defined for positive numbers.');
      expect(() => ln.fn(-100)).toThrow('ln is only defined for positive numbers.');
    });

    it('log10 throws for negative numbers', () => {
      const log10 = getOp('log10');
      expect(() => log10.fn(-1)).toThrow('log10 is only defined for positive numbers.');
    });

    it('sqrt throws for negative numbers', () => {
      const sqrt = getOp('sqrt');
      expect(() => sqrt.fn(-1)).toThrow('sqrt is only defined for non-negative numbers.');
      expect(() => sqrt.fn(-0.0001)).toThrow('sqrt is only defined for non-negative numbers.');
    });
  });
});