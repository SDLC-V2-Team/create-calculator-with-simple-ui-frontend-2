import { FunctionRegistry } from './FunctionRegistry.js';
import type { OperationDefinition } from './types.js';

/**
 * Calculator is the core calculation engine. It delegates all operations to
 * the FunctionRegistry, so adding new functions (e.g. hyperbolic) never
 * requires changing this class (Open/Closed Principle, per ADR-001).
 */
export class Calculator {
  constructor(private readonly registry: FunctionRegistry) {}

  /**
   * Execute a registered operation by name with the provided arguments.
   *
   * @throws Error if the operation is unknown or the argument count is wrong.
   */
  execute(name: string, ...args: number[]): number {
    const op = this.registry.get(name);
    if (!op) {
      throw new Error(`Unknown operation: "${name}".`);
    }
    if (args.length !== op.arity) {
      throw new Error(
        `Operation "${name}" expects ${op.arity} argument(s) but received ${args.length}.`
      );
    }
    const result = op.fn(...args);
    if (Number.isNaN(result)) {
      throw new Error(`Operation "${name}" produced an invalid (NaN) result.`);
    }
    return result;
  }

  /**
   * Resolve a single-variable real function registered as a unary operation,
   * so calculus routines can sample it numerically (ADR-001).
   */
  private resolveUnary(name: string): (x: number) => number {
    const op = this.registry.get(name);
    if (!op) {
      throw new Error(`Unknown function: "${name}".`);
    }
    if (op.arity !== 1) {
      throw new Error(
        `Calculus operations require a unary function but "${name}" has arity ${op.arity}.`
      );
    }
    return (x: number) => op.fn(x);
  }

  /**
   * Numerically approximate the derivative f'(x) of a registered unary
   * function using the symmetric difference quotient (ADR-001: calculus tasks).
   *
   * @throws Error if the function is unknown or the result is invalid.
   */
  derivative(name: string, x: number, h = 1e-6): number {
    const f = this.resolveUnary(name);
    const result = (f(x + h) - f(x - h)) / (2 * h);
    if (!Number.isFinite(result)) {
      throw new Error(`Derivative of "${name}" at ${x} is undefined.`);
    }
    return result;
  }

  /**
   * Numerically approximate the definite integral of a registered unary
   * function over [a, b] using the composite Simpson's rule
   * (ADR-001: calculus tasks).
   *
   * @throws Error if the function is unknown or the result is invalid.
   */
  integral(name: string, a: number, b: number, steps = 1000): number {
    if (steps <= 0 || steps % 2 !== 0) {
      throw new Error('Integral step count must be a positive even number.');
    }
    const f = this.resolveUnary(name);
    const h = (b - a) / steps;
    let sum = f(a) + f(b);
    for (let i = 1; i < steps; i++) {
      sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
    }
    const result = (h / 3) * sum;
    if (!Number.isFinite(result)) {
      throw new Error(`Integral of "${name}" over [${a}, ${b}] is undefined.`);
    }
    return result;
  }

  /**
   * Numerically approximate the limit of a registered unary function as x
   * approaches a target value, averaging the left- and right-hand samples
   * (ADR-001: calculus tasks).
   *
   * @throws Error if the function is unknown or the limit does not converge.
   */
  limit(name: string, x: number, epsilon = 1e-6): number {
    const f = this.resolveUnary(name);
    const left = f(x - epsilon);
    const right = f(x + epsilon);
    const result = (left + right) / 2;
    if (!Number.isFinite(result)) {
      throw new Error(`Limit of "${name}" at ${x} does not converge.`);
    }
    return result;
  }

  /** Expose the available operations (useful for building UIs). */
  availableOperations(category?: string): OperationDefinition[] {
    return this.registry.list(category);
  }
}
