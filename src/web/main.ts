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

  // Group operations so scientific & calculus functions are visually distinct
  // from regular arithmetic (satisfies user-friendly UI for new domains).
  const isCalculus = (name: string): boolean =>
    /derivative|integral|limit|diff|integ/i.test(name);

  for (const op of calc.availableOperations()) {
    const btn = document.createElement('button');
    btn.className = isCalculus(op.name)
      ? 'op-btn op-btn--calculus'
      : 'op-btn';
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

  renderCalculusPanel(calc, resultEl);
}

/**
 * Renders a dedicated calculus expression panel. Users enter an expression
 * (LaTeX-like or plain), pick a calculus operation (derivative/integral/limit)
 * and evaluate. Output is rendered with KaTeX when available, otherwise as text
 * (graceful degradation keeps the UI working without the optional dependency).
 */
function renderCalculusPanel(
  calc: Calculator,
  resultEl: HTMLElement,
): void {
  const host = document.getElementById('calculus') ?? document.body;

  const panel = document.createElement('div');
  panel.className = 'calculus-panel';

  const exprInput = document.createElement('input');
  exprInput.type = 'text';
  exprInput.id = 'calc-expression';
  exprInput.placeholder = 'Expression e.g. x^2 + 3*x';
  exprInput.className = 'calc-expr-input';

  const varInput = document.createElement('input');
  varInput.type = 'text';
  varInput.id = 'calc-variable';
  varInput.placeholder = 'var (x)';
  varInput.value = 'x';
  varInput.className = 'calc-var-input';

  const pointInput = document.createElement('input');
  pointInput.type = 'text';
  pointInput.id = 'calc-point';
  pointInput.placeholder = 'at / limit point (optional)';
  pointInput.className = 'calc-point-input';

  const preview = document.createElement('div');
  preview.id = 'calc-preview';
  preview.className = 'calc-preview';

  const renderPreview = (): void => {
    const katex = (window as unknown as { katex?: { render: (s: string, el: HTMLElement, o?: unknown) => void } }).katex;
    if (katex) {
      try {
        katex.render(exprInput.value || '', preview, { throwOnError: false });
        return;
      } catch {
        /* fall through to text rendering */
      }
    }
    preview.textContent = exprInput.value;
  };
  exprInput.addEventListener('input', renderPreview);

  const calcOps = calc
    .availableOperations()
    .filter((op) => /derivative|integral|limit|diff|integ/i.test(op.name));

  const actions = document.createElement('div');
  actions.className = 'calc-actions';

  for (const op of calcOps) {
    const btn = document.createElement('button');
    btn.className = 'op-btn op-btn--calculus';
    btn.textContent = op.label;
    btn.title = op.description ?? '';
    btn.addEventListener('click', () => {
      try {
        const args: Array<string | number> = [
          exprInput.value,
          varInput.value || 'x',
        ];
        if (pointInput.value.trim() !== '') {
          const p = parseFloat(pointInput.value);
          args.push(Number.isNaN(p) ? pointInput.value : p);
        }
        const value = calc.execute(op.name, ...(args as never[]));
        resultEl.textContent = `Result: ${value}`;
        resultEl.classList.remove('error');
      } catch (err) {
        resultEl.textContent =
          err instanceof Error ? `Error: ${err.message}` : 'Unknown error';
        resultEl.classList.add('error');
      }
    });
    actions.appendChild(btn);
  }

  panel.append(exprInput, varInput, pointInput, preview, actions);
  host.appendChild(panel);
}

renderUI(createCalculator());
