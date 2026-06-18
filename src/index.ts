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
  console.log('\nRegular & Scientific Examples:');
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

  // Calculus examples — only run if the engine exposes calculus operations.
  const names = new Set(calc.availableOperations().map((op) => op.name));
  // eslint-disable-next-line no-console
  console.log('\nCalculus Examples:');
  if (names.has('derivative')) {
    // eslint-disable-next-line no-console
    console.log(`  d/dx[x^2] @ 3 = ${calc.execute('derivative', 'x^2', 3)}`);
  } else {
    // eslint-disable-next-line no-console
    console.log('  (derivative operation not registered)');
  }
  if (names.has('integral')) {
    // eslint-disable-next-line no-console
    console.log(`  ∫ x dx [0,1]  = ${calc.execute('integral', 'x', 0, 1)}`);
  } else {
    // eslint-disable-next-line no-console
    console.log('  (integral operation not registered)');
  }
  if (names.has('limit')) {
    // eslint-disable-next-line no-console
    console.log(`  lim x->0 sin(x)/x = ${calc.execute('limit', 'sin(x)/x', 0)}`);
  } else {
    // eslint-disable-next-line no-console
    console.log('  (limit operation not registered)');
  }
}

main();

export { createCalculator };
