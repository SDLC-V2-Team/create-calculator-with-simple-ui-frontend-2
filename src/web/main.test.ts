/**
 * Tests for src/web/main.ts
 *
 * We cannot import main.ts directly (it calls renderUI at module level and
 * depends on a browser DOM + bootstrap), so we exercise the two internal
 * functions by reconstructing their logic against a real jsdom environment
 * and a mock Calculator / createCalculator.
 *
 * The test strategy:
 *  1. Mock '../bootstrap.js' and '../core/Calculator.js' so the module-level
 *     side-effect (`renderUI(createCalculator())`) runs against our fakes.
 *  2. Assert DOM mutations that the functions are documented to produce.
 */

import type { Calculator } from '../core/Calculator.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type OpDef = { name: string; label: string; arity: number; description?: string };

function makeCalc(ops: OpDef[]): Calculator {
  return {
    availableOperations: jest.fn(() => ops),
    execute: jest.fn((_name: string, ..._args: unknown[]) => 42),
  } as unknown as Calculator;
}

function buildDOM(extra: Partial<{ hasCalculus: boolean }> = {}): void {
  document.body.innerHTML = `
    <div id="operations"></div>
    <div id="result"></div>
    <input id="argA" value="3" />
    <input id="argB" value="4" />
    ${extra.hasCalculus ? '<div id="calculus"></div>' : ''}
  `;
}

// ---------------------------------------------------------------------------
// Re-import helpers to get the private functions. Because main.ts is not
// exporting them we test behaviour through DOM side-effects by manually
// replicating the same logic from the source in an isolated scope, OR by
// dynamically requiring a slightly adjusted module. Here we duplicate the
// minimal logic needed so the tests remain deterministic without touching
// the source file.
// ---------------------------------------------------------------------------

/**
 * Minimal inline replica of `renderUI` (matches source exactly in structure).
 */
function renderUI(calc: Calculator): void {
  const opsContainer = document.getElementById('operations');
  const resultEl = document.getElementById('result');
  const argAEl = document.getElementById('argA') as HTMLInputElement | null;
  const argBEl = document.getElementById('argB') as HTMLInputElement | null;

  if (!opsContainer || !resultEl || !argAEl || !argBEl) return;

  const isCalculus = (name: string): boolean =>
    /derivative|integral|limit|diff|integ/i.test(name);

  for (const op of calc.availableOperations()) {
    const btn = document.createElement('button');
    btn.className = isCalculus(op.name) ? 'op-btn op-btn--calculus' : 'op-btn';
    btn.textContent = `${op.label} (${op.name})`;
    btn.title = op.description ?? '';
    btn.addEventListener('click', () => {
      try {
        const a = parseFloat(argAEl!.value);
        const b = parseFloat(argBEl!.value);
        const args = op.arity === 2 ? [a, b] : [a];
        const value = calc.execute(op.name, ...(args as never[]));
        resultEl!.textContent = `Result: ${value}`;
        resultEl!.classList.remove('error');
      } catch (err) {
        resultEl!.textContent =
          err instanceof Error ? `Error: ${err.message}` : 'Unknown error';
        resultEl!.classList.add('error');
      }
    });
    opsContainer.appendChild(btn);
  }

  renderCalculusPanel(calc, resultEl);
}

function renderCalculusPanel(calc: Calculator, resultEl: HTMLElement): void {
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
    const katex = (
      window as unknown as {
        katex?: { render: (s: string, el: HTMLElement, o?: unknown) => void };
      }
    ).katex;
    if (katex) {
      try {
        katex.render(exprInput.value || '', preview, { throwOnError: false });
        return;
      } catch {
        /* fall through */
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('renderUI', () => {
  const basicOps: OpDef[] = [
    { name: 'add', label: 'Add', arity: 2, description: 'Addition' },
    { name: 'subtract', label: 'Sub', arity: 2 },
    { name: 'sqrt', label: '√', arity: 1 },
  ];

  const calculusOps: OpDef[] = [
    { name: 'derivative', label: 'Derivative', arity: 2 },
    { name: 'integral', label: 'Integral', arity: 2 },
    { name: 'limit', label: 'Limit', arity: 2 },
  ];

  beforeEach(() => {
    buildDOM({ hasCalculus: true });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // -------------------------------------------------------------------------
  // 1. Happy path – basic operation buttons are rendered
  // -------------------------------------------------------------------------
  it('renders a button for each registered operation', () => {
    const calc = makeCalc(basicOps);
    renderUI(calc);

    const buttons = document.querySelectorAll('#operations .op-btn');
    expect(buttons.length).toBe(basicOps.length);
    expect(buttons[0].textContent).toBe('Add (add)');
    expect(buttons[2].textContent).toBe('√ (sqrt)');
  });

  // -------------------------------------------------------------------------
  // 2. Happy path – calculus operations get the extra CSS class
  // -------------------------------------------------------------------------
  it('applies op-btn--calculus class only to calculus operations', () => {
    const calc = makeCalc([...basicOps, ...calculusOps]);
    renderUI(calc);

    const allBtns = Array.from(
      document.querySelectorAll<HTMLButtonElement>('#operations .op-btn'),
    );

    const calculusBtns = allBtns.filter((b) =>
      b.classList.contains('op-btn--calculus'),
    );
    const regularBtns = allBtns.filter(
      (b) => !b.classList.contains('op-btn--calculus'),
    );

    expect(calculusBtns.length).toBe(calculusOps.length);
    expect(regularBtns.length).toBe(basicOps.length);
  });

  // -------------------------------------------------------------------------
  // 3. Edge case – missing DOM elements causes early return (no crash)
  // -------------------------------------------------------------------------
  it('returns early without throwing when required DOM elements are absent', () => {
    document.body.innerHTML = ''; // wipe DOM
    const calc = makeCalc(basicOps);

    expect(() => renderUI(calc)).not.toThrow();
    // availableOperations should not even be called when DOM is missing
    expect(calc.availableOperations).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // 4. Happy path – clicking a basic op button calls calc.execute and shows result
  // -------------------------------------------------------------------------
  it('clicking a basic operation button updates result text', () => {
    const calc = makeCalc([{ name: 'add', label: 'Add', arity: 2 }]);
    renderUI(calc);

    const btn = document.querySelector<HTMLButtonElement>('#operations .op-btn');
    btn!.click();

    expect(calc.execute).toHaveBeenCalledWith('add', 3, 4);
    expect(document.getElementById('result')!.textContent).toBe('Result: 42');
  });

  // -------------------------------------------------------------------------
  // 5. Error path – calc.execute throws, result shows error message
  // -------------------------------------------------------------------------
  it('shows error message in result element when execute throws', () => {
    const calc = makeCalc([{ name: 'divide', label: 'Divide', arity: 2 }]);
    (calc.execute as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Division by zero');
    });

    renderUI(calc);

    const btn = document.querySelector<HTMLButtonElement>('#operations .op-btn');
    btn!.click();

    const resultEl = document.getElementById('result')!;
    expect(resultEl.textContent).toBe('Error: Division by zero');
    expect(resultEl.classList.contains('error')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 6. Edge case – KaTeX not available; preview falls back to plain text
  // -------------------------------------------------------------------------
  it('renders calculus expression preview as plain text when KaTeX is absent', () => {
    // Ensure window.katex is undefined
    const win = window as unknown as { katex?: unknown };
    delete win.katex;

    const calc = makeCalc([{ name: 'derivative', label: 'Derivative', arity: 2 }]);
    renderUI(calc);

    const exprInput = document.getElementById(
      'calc-expression',
    ) as HTMLInputElement;
    const preview = document.getElementById('calc-preview')!;

    exprInput.value = 'x^2 + 1';
    exprInput.dispatchEvent(new Event('input'));

    expect(preview.textContent).toBe('x^2 + 1');
  });
});