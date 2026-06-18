import { Calculator } from './core/Calculator.js';
import { FunctionRegistry } from './core/FunctionRegistry.js';
import { basicOperations } from './modules/BasicOperations.js';
import { scientificFunctions } from './modules/ScientificFunctions.js';

/**
 * Wires the registry together with all operation modules and returns a ready
 * Calculator instance. This is the single integration point — adding a new
 * module only requires registering it here.
 */
export function createCalculator(): Calculator {
  const registry = new FunctionRegistry();
  registry.registerAll(basicOperations);
  registry.registerAll(scientificFunctions);
  return new Calculator(registry);
}
