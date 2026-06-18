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

  /** Expose the available operations (useful for building UIs). */
  availableOperations(category?: string): OperationDefinition[] {
    return this.registry.list(category);
  }
}
