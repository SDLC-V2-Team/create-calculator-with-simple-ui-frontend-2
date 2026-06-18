import type { OperationDefinition } from '../core/types.js';

/**
 * Preserves the original ("existing") calculator behaviour: the four basic
 * arithmetic operations. Kept as its own module so the engine treats basic
 * and scientific operations uniformly via the registry.
 */
export const basicOperations: OperationDefinition[] = [
  {
    name: '+',
    label: 'Add',
    arity: 2,
    category: 'basic',
    description: 'Addition of two numbers.',
    fn: (a, b) => a + b
  },
  {
    name: '-',
    label: 'Subtract',
    arity: 2,
    category: 'basic',
    description: 'Subtraction of two numbers.',
    fn: (a, b) => a - b
  },
  {
    name: '*',
    label: 'Multiply',
    arity: 2,
    category: 'basic',
    description: 'Multiplication of two numbers.',
    fn: (a, b) => a * b
  },
  {
    name: '/',
    label: 'Divide',
    arity: 2,
    category: 'basic',
    description: 'Division of two numbers.',
    fn: (a, b) => {
      if (b === 0) {
        throw new Error('Division by zero is not allowed.');
      }
      return a / b;
    }
  }
];
