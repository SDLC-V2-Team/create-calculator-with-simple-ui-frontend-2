import { basicOperations } from './BasicOperations';

describe('basicOperations', () => {
  const getOp = (name: string) => {
    const op = basicOperations.find(o => o.name === name);
    if (!op) throw new Error(`Operation "${name}" not found`);
    return op;
  };

  describe('registry metadata', () => {
    it('should export exactly 4 operations with correct structure', () => {
      expect(basicOperations).toHaveLength(4);
      basicOperations.forEach(op => {
        expect(op).toHaveProperty('name');
        expect(op).toHaveProperty('label');
        expect(op).toHaveProperty('arity', 2);
        expect(op).toHaveProperty('category', 'basic');
        expect(op).toHaveProperty('description');
        expect(typeof op.fn).toBe('function');
      });
    });
  });

  describe('addition (+)', () => {
    it('should correctly add two numbers', () => {
      const add = getOp('+');
      expect(add.fn(3, 5)).toBe(8);
      expect(add.fn(-2, 7)).toBe(5);
      expect(add.fn(0, 0)).toBe(0);
      expect(add.fn(1.5, 2.5)).toBeCloseTo(4);
    });
  });

  describe('subtraction (-)', () => {
    it('should correctly subtract two numbers', () => {
      const subtract = getOp('-');
      expect(subtract.fn(10, 4)).toBe(6);
      expect(subtract.fn(0, 5)).toBe(-5);
      expect(subtract.fn(-3, -3)).toBe(0);
    });
  });

  describe('multiplication (*)', () => {
    it('should correctly multiply two numbers', () => {
      const multiply = getOp('*');
      expect(multiply.fn(6, 7)).toBe(42);
      expect(multiply.fn(-4, 3)).toBe(-12);
      expect(multiply.fn(0, 999)).toBe(0);
      expect(multiply.fn(2.5, 4)).toBeCloseTo(10);
    });
  });

  describe('division (/)', () => {
    it('should correctly divide two numbers', () => {
      const divide = getOp('/');
      expect(divide.fn(10, 2)).toBe(5);
      expect(divide.fn(7, 2)).toBeCloseTo(3.5);
      expect(divide.fn(-9, 3)).toBe(-3);
    });

    it('should throw an error when dividing by zero', () => {
      const divide = getOp('/');
      expect(() => divide.fn(5, 0)).toThrow('Division by zero is not allowed.');
      expect(() => divide.fn(0, 0)).toThrow('Division by zero is not allowed.');
      expect(() => divide.fn(-10, 0)).toThrow(Error);
    });
  });
});