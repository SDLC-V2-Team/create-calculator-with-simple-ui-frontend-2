import { createCalculator } from '../bootstrap.js';
import type { Calculator } from '../core/Calculator.js';

/**
 * Browser UI controller. Dynamically renders buttons for every registered
 * operation (basic + scientific) so the UI automatically reflects new modules
 * (satisfies the "UI must be updated to expose new functions" consequence).
 */
function renderUI(calc: Calculator): void {
  const opsContainer = document.getElementById('operations');
  const resultEl = document.getElementById('result');
  const argAEl = document.getElementById('argA') as HTMLInputElement | null;
  const argBEl = document.getElementById('argB') as HTMLInputElement | null;

  if (!opsContainer || !resultEl || !argAEl || !argBEl) {
    return;
  }

  for (const op of calc.availableOperations()) {
    const btn = document.createElement('button');
    btn.className = 'op-btn';
    btn.textContent = `${op.label} (${op.name})`;
    btn.title = op.description ?? '';
    btn.addEventListener('click', () => {
      try {
        const a = parseFloat(argAEl.value);
        const b = parseFloat(argBEl.value);
        const args = op.arity === 2 ? [a, b] : [a];
        const value = calc.execute(op.name, ...args);
        resultEl.textContent = `Result: ${value}`;
        resultEl.classList.remove('error');
      } catch (err) {
        resultEl.textContent =
          err instanceof Error ? `Error: ${err.message}` : 'Unknown error';
        resultEl.classList.add('error');
      }
    });
    opsContainer.appendChild(btn);
  }
}

renderUI(createCalculator());
