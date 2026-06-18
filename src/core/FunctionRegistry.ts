import type { OperationDefinition } from './types.js';

/**
 * FunctionRegistry implements the registry pattern described in ADR-001.
 *
 * Operations (basic or scientific) register themselves here, allowing the
 * calculation engine to remain closed for modification but open for extension.
 */
export class FunctionRegistry {
  private readonly operations = new Map<string, OperationDefinition>();

  /**
   * Register a new operation. Throws if the name is already registered to
   * prevent silent overrides.
   */
  register(definition: OperationDefinition): void {
    if (this.operations.has(definition.name)) {
      throw new Error(`Operation "${definition.name}" is already registered.`);
    }
    this.operations.set(definition.name, definition);
  }

  /**
   * Register many operations at once (convenience for module bootstrapping).
   */
  registerAll(definitions: OperationDefinition[]): void {
    definitions.forEach((d) => this.register(d));
  }

  /** Returns true if an operation with the given name exists. */
  has(name: string): boolean {
    return this.operations.has(name);
  }

  /** Retrieve a registered operation definition or undefined. */
  get(name: string): OperationDefinition | undefined {
    return this.operations.get(name);
  }

  /** List all registered operations (optionally filtered by category). */
  list(category?: string): OperationDefinition[] {
    const all = Array.from(this.operations.values());
    return category ? all.filter((op) => op.category === category) : all;
  }

  /** Unregister an operation. Returns true if it existed. */
  unregister(name: string): boolean {
    return this.operations.delete(name);
  }
}
