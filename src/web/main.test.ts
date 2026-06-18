import type { Calculator } from '../core/Calculator.js';

// ── helpers ────────────────────────────────────────────────────────────────

function makeCalc(overrides: Partial<Calculator> = {}): Calculator {
  return {
    availableOperations: jest.fn().mockReturnValue([]),
    execute: jest.fn(),
    ...overrides,
  } as unknown as Calculator;
}

// Re-import renderUI after DOM + mocks are ready
let renderUI: (calc: Calculator) => void;

// ── DOM setup ──────────────────────────────────────────────────────────────

function buildDOM(): void {
  document.body.innerHTML = `
    <div id="operations"></div>
    <div id="result"></div>
    <input id="argA" value="0" />
    <input id="argB" value="0" />
  `;
}

function clearDOM(): void {
  document.body.innerHTML = '';
}

// ── module isolation ───────────────────────────────────────────────────────

jest.mock('../bootstrap.js', () => ({
  createCalculator: jest.fn().mockReturnValue({
    availableOperations: jest.fn().mockReturnValue([]),
    execute: jest.fn(),
  }),
}));

beforeAll(async () => {
  buildDOM(); // DOM must exist before the module self-executes
  ({ renderUI } = await import('./main.js'));
});

// ── tests ──────────────────────────────────────────────────────────────────

describe('renderUI', () => {
  beforeEach(() => {
    buildDOM();
  });

  afterEach(() => {
    clearDOM();
    jest.clearAllMocks();
  });

  // 1. happy path – buttons are rendered for each registered operation
  it('renders one button per available operation', () => {
    const calc = makeCalc({
      availableOperations: jest.fn().mockReturnValue([
        { name: 'add', label: 'Add', arity: 2, description: 'Addition' },
        { name: 'sqrt', label: 'Sqrt', arity: 1, description: 'Square root' },
      ]),
    });

    renderUI(calc);

    const buttons = document.querySelectorAll('#operations .op-btn');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toBe('Add (add)');
    expect(buttons[1].textContent).toBe('Sqrt (sqrt)');
  });

  // 2. happy path – clicking a binary-arity button calls execute with two args
  it('calls execute with two arguments for a binary operation and displays the result', () => {
    const calc = makeCalc({
      availableOperations: jest.fn().mockReturnValue([
        { name: 'add', label: 'Add', arity: 2, description: 'Addition' },
      ]),
      execute: jest.fn().mockReturnValue(42),
    });

    renderUI(calc);

    (document.getElementById('argA') as HTMLInputElement).value = '10';
    (document.getElementById('argB') as HTMLInputElement).value = '32';

    const btn = document.querySelector('#operations .op-btn') as HTMLButtonElement;
    btn.click();

    expect(calc.execute).toHaveBeenCalledWith('add', 10, 32);
    expect(document.getElementById('result')!.textContent).toBe('Result: 42');
    expect(document.getElementById('result')!.classList.contains('error')).toBe(false);
  });

  // 3. happy path – clicking a unary-arity button calls execute with one arg
  it('calls execute with one argument for a unary operation', () => {
    const calc = makeCalc({
      availableOperations: jest.fn().mockReturnValue([
        { name: 'sqrt', label: 'Sqrt', arity: 1, description: 'Square root' },
      ]),
      execute: jest.fn().mockReturnValue(3),
    });

    renderUI(calc);

    (document.getElementById('argA') as HTMLInputElement).value = '9';

    const btn = document.querySelector('#operations .op-btn') as HTMLButtonElement;
    btn.click();

    expect(calc.execute).toHaveBeenCalledWith('sqrt', 9);
    expect(document.getElementById('result')!.textContent).toBe('Result: 3');
  });

  // 4. error path – missing DOM elements causes early return (no crash)
  it('returns early without throwing when required DOM elements are absent', () => {
    clearDOM(); // intentionally remove all elements

    const calc = makeCalc({
      availableOperations: jest.fn().mockReturnValue([
        { name: 'add', label: 'Add', arity: 2 },
      ]),
    });

    expect(() => renderUI(calc)).not.toThrow();
    // availableOperations should never have been iterated
    expect(calc.availableOperations).not.toHaveBeenCalled();
  });

  // 5. error path – execute throws an Error instance
  it('displays an error message and adds "error" class when execute throws an Error', () => {
    const calc = makeCalc({
      availableOperations: jest.fn().mockReturnValue([
        { name: 'div', label: 'Divide', arity: 2, description: 'Division' },
      ]),
      execute: jest.fn().mockImplementation(() => {
        throw new Error('Division by zero');
      }),
    });

    renderUI(calc);

    const btn = document.querySelector('#operations .op-btn') as HTMLButtonElement;
    btn.click();

    const resultEl = document.getElementById('result')!;
    expect(resultEl.textContent).toBe('Error: Division by zero');
    expect(resultEl.classList.contains('error')).toBe(true);
  });

  // 6. edge case – execute throws a non-Error value
  it('displays "Unknown error" when execute throws a non-Error value', () => {
    const calc = makeCalc({
      availableOperations: jest.fn().mockReturnValue([
        { name: 'bad', label: 'Bad', arity: 1 },
      ]),
      execute: jest.fn().mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw 'something went wrong';
      }),
    });

    renderUI(calc);

    const btn = document.querySelector('#operations .op-btn') as HTMLButtonElement;
    btn.click();

    const resultEl = document.getElementById('result')!;
    expect(resultEl.textContent).toBe('Unknown error');
    expect(resultEl.classList.contains('error')).toBe(true);
  });
});