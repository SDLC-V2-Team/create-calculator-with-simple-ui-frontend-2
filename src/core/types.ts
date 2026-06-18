/**
 * Shared type definitions for the calculator engine.
 */

/**
 * A calculator operation function. Receives an ordered list of numeric
 * arguments and returns a numeric result.
 */
export type OperationFn = (...args: number[]) => number;

/**
 * Metadata describing a single registered operation.
 */
export interface OperationDefinition {
  /** Unique identifier / symbol used to invoke the operation (e.g. "sin", "+"). */
  name: string;
  /** Human-readable label for UI display. */
  label: string;
  /** Number of numeric arguments the operation expects. */
  arity: number;
  /** Logical grouping ("basic", "trigonometry", "logarithm", "exponential"). */
  category: string;
  /** The actual implementation. */
  fn: OperationFn;
  /** Optional description for documentation / tooltips. */
  description?: string;
}
