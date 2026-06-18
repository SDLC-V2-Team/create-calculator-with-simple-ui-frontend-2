import { Calculator } from './Calculator';
import { FunctionRegistry } from './FunctionRegistry';
import type { OperationDefinition } from './types';

const makeRegistry = (ops: OperationDefinition[] = []): FunctionRegistry => {
  const registry = new FunctionRegistry();
  ops.forEach((op) => registry.register(op));
  return registry;
};

describe('Calculator', () => {
  describe('execute', () => {
    it('happy path: executes a registered binary operation correctly', () => {
      const addOp: OperationDefinition = {
        name: 'add',
        arity: 2,
        category: 'arithmetic',
        fn: (a: number, b: number) => a + b,
      };
      const calculator = new Calculator(makeRegistry([addOp]));

      const result = calculator.execute('add', 3, 7);

      expect(result).toBe(10);
    });

    it('happy path: executes a registered unary operation correctly', () => {
      const sqrtOp: OperationDefinition = {
        name: 'sqrt',
        arity: 1,
        category: 'math',
        fn: (a: number) => Math.sqrt(a),
      };
      const calculator = new Calculator(makeRegistry([sqrtOp]));

      const result = calculator.execute('sqrt', 16);

      expect(result).toBe(4);
    });

    it('error path: throws when the operation name is not registered', () => {
      const calculator = new Calculator(makeRegistry());

      expect(() => calculator.execute('nonExistent', 1)).toThrow(
        'Unknown operation: "nonExistent".'
      );
    });

    it('error path: throws when the argument count does not match arity', () => {
      const multiplyOp: OperationDefinition = {
        name: 'multiply',
        arity: 2,
        category: 'arithmetic',
        fn: (a: number, b: number) => a * b,
      };
      const calculator = new Calculator(makeRegistry([multiplyOp]));

      expect(() => calculator.execute('multiply', 5)).toThrow(
        'Operation "multiply" expects 2 argument(s) but received 1.'
      );
    });

    it('error path: throws when the operation produces a NaN result', () => {
      const nanOp: OperationDefinition = {
        name: 'badOp',
        arity: 1,
        category: 'test',
        fn: (_a: number) => NaN,
      };
      const calculator = new Calculator(makeRegistry([nanOp]));

      expect(() => calculator.execute('badOp', 42)).toThrow(
        'Operation "badOp" produced an invalid (NaN) result.'
      );
    });
  });

  describe('availableOperations', () => {
    it('edge case: returns filtered operations when a category is provided', () => {
      const addOp: OperationDefinition = {
        name: 'add',
        arity: 2,
        category: 'arithmetic',
        fn: (a: number, b: number) => a + b,
      };
      const sqrtOp: OperationDefinition = {
        name: 'sqrt',
        arity: 1,
        category: 'math',
        fn: (a: number) => Math.sqrt(a),
      };
      const calculator = new Calculator(makeRegistry([addOp, sqrtOp]));

      const arithmeticOps = calculator.availableOperations('arithmetic');

      expect(arithmeticOps).toHaveLength(1);
      expect(arithmeticOps[0].name).toBe('add');
    });
  });
});