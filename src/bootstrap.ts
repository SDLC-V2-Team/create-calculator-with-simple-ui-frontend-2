import { Calculator } from './core/Calculator.js';
import { FunctionRegistry } from './core/FunctionRegistry.js';
import { basicOperations } from './modules/BasicOperations.js';
import { scientificFunctions } from './modules/ScientificFunctions.js';
import { calculusFunctions } from './modules/CalculusFunctions.js';

/**
 * Wires the registry together with all operation modules and returns a ready
 * Calculator instance. This is the single integration point — adding a new
 * module only requires registering it here.
 */
export function createCalculator(): Calculator {
  const registry = new FunctionRegistry();
  registry.registerAll(basicOperations);
  registry.registerAll(scientificFunctions);
  // Register calculus operations (derivative, integral, limit) per ADR-001.
  registry.registerAll(calculusFunctions);
  return new Calculator(registry);
}
