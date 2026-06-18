import { Calculator } from './Calculator';
import { FunctionRegistry } from './FunctionRegistry';
import type { OperationDefinition } from './types';

// ---------------------------------------------------------------------------
// Helpers – build a minimal FunctionRegistry stub/mock
// ---------------------------------------------------------------------------

function makeRegistry(ops: OperationDefinition[]): FunctionRegistry {
  const registry = {
    get: (name: string) => ops.find((o) => o.name === name) ?? undefined,
    list: (category?: string) =>
      category ? ops.filter((o) => (o as any).category === category) : ops,
  } as unknown as FunctionRegistry;
  return registry;
}

const addOp: OperationDefinition = {
  name: 'add',
  arity: 2,
  fn: (a: number, b: number) => a + b,
};

const squareOp: OperationDefinition = {
  name: 'square',
  arity: 1,
  fn: (x: number) => x * x,
};

const sinOp: OperationDefinition = {
  name: 'sin',
  arity: 1,
  fn: (x: number) => Math.sin(x),
};

const identityOp: OperationDefinition = {
  name: 'identity',
  arity: 1,
  fn: (x: number) => x,
};

const nanOp: OperationDefinition = {
  name: 'nanOp',
  arity: 1,
  fn: (_x: number) => NaN,
};

const infDerivOp: OperationDefinition = {
  name: 'infDeriv',
  arity: 1,
  fn: (x: number) => (x === 0 ? Infinity : 1 / x),
};

// ---------------------------------------------------------------------------
// execute
// ---------------------------------------------------------------------------

describe('Calculator.execute', () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator(makeRegistry([addOp, squareOp, nanOp]));
  });

  it('happy path: executes a registered binary operation correctly', () => {
    expect(calc.execute('add', 3, 7)).toBe(10);
  });

  it('happy path: executes a registered unary operation correctly', () => {
    expect(calc.execute('square', 5)).toBe(25);
  });

  it('error path: throws for unknown operation', () => {
    expect(() => calc.execute('unknown')).toThrow('Unknown operation: "unknown".');
  });

  it('error path: throws when argument count is wrong', () => {
    expect(() => calc.execute('add', 1)).toThrow(
      'Operation "add" expects 2 argument(s) but received 1.'
    );
  });

  it('error path: throws when operation returns NaN', () => {
    expect(() => calc.execute('nanOp', 1)).toThrow(
      'Operation "nanOp" produced an invalid (NaN) result.'
    );
  });
});

// ---------------------------------------------------------------------------
// derivative
// ---------------------------------------------------------------------------

describe('Calculator.derivative', () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator(makeRegistry([squareOp, addOp, sinOp, infDerivOp]));
  });

  it('happy path: approximates derivative of x^2 at x=3 (expected ~6)', () => {
    const result = calc.derivative('square', 3);
    expect(result).toBeCloseTo(6, 4);
  });

  it('edge case: derivative of sin(x) at x=0 is close to cos(0)=1', () => {
    const result = calc.derivative('sin', 0);
    expect(result).toBeCloseTo(1, 5);
  });

  it('error path: throws for unknown function', () => {
    expect(() => calc.derivative('unknown', 1)).toThrow('Unknown function: "unknown".');
  });

  it('error path: throws when function has arity != 1', () => {
    expect(() => calc.derivative('add', 1)).toThrow(
      'Calculus operations require a unary function but "add" has arity 2.'
    );
  });

  it('error path: throws when derivative is not finite', () => {
    // infDerivOp returns Infinity at x=0 from both sides → NaN or Infinity result
    const registry = makeRegistry([
      {
        name: 'diverge',
        arity: 1,
        fn: (x: number) => (x >= 0 ? Infinity : -Infinity),
      },
    ]);
    const c = new Calculator(registry);
    expect(() => c.derivative('diverge', 0)).toThrow(/Derivative of "diverge" at 0 is undefined/);
  });
});

// ---------------------------------------------------------------------------
// integral
// ---------------------------------------------------------------------------

describe('Calculator.integral', () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator(makeRegistry([squareOp, addOp, sinOp, identityOp]));
  });

  it('happy path: integral of x^2 over [0,3] ≈ 9', () => {
    const result = calc.integral('square', 0, 3);
    expect(result).toBeCloseTo(9, 3);
  });

  it('happy path: integral of identity (x) over [0,2] ≈ 2', () => {
    const result = calc.integral('identity', 0, 2);
    expect(result).toBeCloseTo(2, 5);
  });

  it('edge case: integral over zero-width interval [a,a] returns 0', () => {
    const result = calc.integral('square', 5, 5);
    expect(result).toBeCloseTo(0, 10);
  });

  it('error path: throws for odd step count', () => {
    expect(() => calc.integral('square', 0, 1, 3)).toThrow(
      'Integral step count must be a positive even number.'
    );
  });

  it('error path: throws for non-positive step count', () => {
    expect(() => calc.integral('square', 0, 1, 0)).toThrow(
      'Integral step count must be a positive even number.'
    );
  });

  it('error path: throws for unknown function', () => {
    expect(() => calc.integral('unknown', 0, 1)).toThrow('Unknown function: "unknown".');
  });

  it('error path: throws when function has arity != 1', () => {
    expect(() => calc.integral('add', 0, 1)).toThrow(
      'Calculus operations require a unary function but "add" has arity 2.'
    );
  });
});

// ---------------------------------------------------------------------------
// limit
// ---------------------------------------------------------------------------

describe('Calculator.limit', () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator(makeRegistry([identityOp, squareOp, addOp, sinOp]));
  });

  it('happy path: limit of identity(x) as x→3 ≈ 3', () => {
    const result = calc.limit('identity', 3);
    expect(result).toBeCloseTo(3, 5);
  });

  it('edge case: limit of x^2 as x→0 ≈ 0', () => {
    const result = calc.limit('square', 0);
    expect(result).toBeCloseTo(0, 5);
  });

  it('error path: throws for unknown function', () => {
    expect(() => calc.limit('unknown', 1)).toThrow('Unknown function: "unknown".');
  });

  it('error path: throws when function has arity != 1', () => {
    expect(() => calc.limit('add', 1)).toThrow(
      'Calculus operations require a unary function but "add" has arity 2.'
    );
  });

  it('error path: throws when limit does not converge (Infinity)', () => {
    const registry = makeRegistry([
      {
        name: 'divByX',
        arity: 1,
        fn: (x: number) => 1 / x,
      },
    ]);
    const c = new Calculator(registry);
    // At x=0 the samples blow up to ±Infinity → average is NaN
    expect(() => c.limit('divByX', 0, 1e-300)).toThrow(
      /Limit of "divByX" at 0 does not converge/
    );
  });
});

// ---------------------------------------------------------------------------
// availableOperations
// ---------------------------------------------------------------------------

describe('Calculator.availableOperations', () => {
  it('happy path: returns all operations when no category is provided', () => {
    const ops = [addOp, squareOp, sinOp];
    const calc = new Calculator(makeRegistry(ops));
    expect(calc.availableOperations()).toHaveLength(3);
  });

  it('happy path: returns only operations matching the given category', () => {
    const categoryOp: OperationDefinition & { category: string } = {
      ...(squareOp as any),
      name: 'squareCat',
      category: 'algebra',
    };
    const registry = makeRegistry([addOp, categoryOp]);
    const calc = new Calculator(registry);
    const result = calc.availableOperations('algebra');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('squareCat');
  });
});