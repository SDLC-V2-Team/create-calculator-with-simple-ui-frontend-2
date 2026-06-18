import type { OperationDefinition } from '../core/types.js';

/**
 * ScientificFunctions module (ADR-001).
 *
 * Encapsulates all scientific operations — trigonometry, logarithms,
 * exponentials and roots — as self-describing registry definitions. New
 * categories (e.g. hyperbolic) can be added here without touching the engine.
 */
export const scientificFunctions: OperationDefinition[] = [
  // ---- Trigonometry (radians) ----
  {
    name: 'sin',
    label: 'Sine',
    arity: 1,
    category: 'trigonometry',
    description: 'Sine of an angle in radians.',
    fn: (x) => Math.sin(x)
  },
  {
    name: 'cos',
    label: 'Cosine',
    arity: 1,
    category: 'trigonometry',
    description: 'Cosine of an angle in radians.',
    fn: (x) => Math.cos(x)
  },
  {
    name: 'tan',
    label: 'Tangent',
    arity: 1,
    category: 'trigonometry',
    description: 'Tangent of an angle in radians.',
    fn: (x) => Math.tan(x)
  },

  // ---- Logarithms ----
  {
    name: 'ln',
    label: 'Natural Log',
    arity: 1,
    category: 'logarithm',
    description: 'Natural logarithm (base e).',
    fn: (x) => {
      if (x <= 0) {
        throw new Error('ln is only defined for positive numbers.');
      }
      return Math.log(x);
    }
  },
  {
    name: 'log10',
    label: 'Log base 10',
    arity: 1,
    category: 'logarithm',
    description: 'Common logarithm (base 10).',
    fn: (x) => {
      if (x <= 0) {
        throw new Error('log10 is only defined for positive numbers.');
      }
      return Math.log10(x);
    }
  },

  // ---- Exponentials & powers ----
  {
    name: 'exp',
    label: 'e^x',
    arity: 1,
    category: 'exponential',
    description: 'Euler\'s number raised to the power x.',
    fn: (x) => Math.exp(x)
  },
  {
    name: 'pow',
    label: 'Power',
    arity: 2,
    category: 'exponential',
    description: 'Raise base to the given exponent.',
    fn: (base, exponent) => Math.pow(base, exponent)
  },
  {
    name: 'sqrt',
    label: 'Square Root',
    arity: 1,
    category: 'exponential',
    description: 'Square root of a non-negative number.',
    fn: (x) => {
      if (x < 0) {
        throw new Error('sqrt is only defined for non-negative numbers.');
      }
      return Math.sqrt(x);
    }
  }
];
