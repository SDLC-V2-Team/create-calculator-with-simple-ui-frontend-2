import { createCalculator } from './bootstrap.js';

/**
 * CLI / Node entry point. Demonstrates the engine end-to-end and prints the
 * catalogue of available operations.
 */
function main(): void {
  const calc = createCalculator();

  // eslint-disable-next-line no-console
  console.log('=== Scientific Calculator ===');
  // eslint-disable-next-line no-console
  console.log('Available operations:');
  for (const op of calc.availableOperations()) {
    // eslint-disable-next-line no-console
    console.log(`  [${op.category}] ${op.name} (${op.label}) - arity ${op.arity}`);
  }

  // eslint-disable-next-line no-console
  console.log('\nExamples:');
  // eslint-disable-next-line no-console
  console.log(`  2 + 3        = ${calc.execute('+', 2, 3)}`);
  // eslint-disable-next-line no-console
  console.log(`  sin(0)       = ${calc.execute('sin', 0)}`);
  // eslint-disable-next-line no-console
  console.log(`  ln(e)        = ${calc.execute('ln', Math.E)}`);
  // eslint-disable-next-line no-console
  console.log(`  pow(2, 10)   = ${calc.execute('pow', 2, 10)}`);
  // eslint-disable-next-line no-console
  console.log(`  sqrt(144)    = ${calc.execute('sqrt', 144)}`);
}

main();

export { createCalculator };
