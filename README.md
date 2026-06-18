# Scientific Calculator

A modular scientific calculator built in **TypeScript**, extending a basic
calculator engine with scientific operations (trigonometry, logarithms,
exponentials) using a **function registry pattern** as defined in **ADR-001**.

## Why this design?

Per ADR-001, scientific operations are encapsulated in a dedicated
`ScientificFunctions` module and integrated into the calculation engine via a
**registry**. This keeps the core engine **closed for modification but open for
extension** — new categories (e.g. hyperbolic functions) can be added by
registering a new module without changing the engine.

## Architecture

```
src/
  core/
    types.ts             # OperationFn, OperationDefinition contracts
    FunctionRegistry.ts  # Registry pattern (register/list/get)
    Calculator.ts        # Engine — resolves & executes via registry only
  modules/
    BasicOperations.ts    # +, -, *, / (existing behaviour preserved)
    ScientificFunctions.ts# sin, cos, tan, ln, log10, exp, pow, sqrt
  bootstrap.ts            # Composition root — wires registry + modules
  index.ts                # Node CLI entry point (demo)
  web/main.ts             # Browser UI controller (auto-renders ops)
index.html                # Web UI shell
public/styles.css         # Web UI styles
tests/                    # Vitest unit tests
```

## Requirements

- Node.js >= 18
- npm >= 9

## Setup

```bash
npm install
```

## Run (CLI demo)

```bash
npm run build
npm start
```

## Run (Web UI)

```bash
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173). The UI renders a
button for every registered operation automatically.

## Test

```bash
npm test
```

## Extending with new operations

1. Create a new module exporting `OperationDefinition[]` (see
   `src/modules/ScientificFunctions.ts`).
2. Register it in `src/bootstrap.ts` via `registry.registerAll(...)`.
3. No changes to `Calculator.ts` are required — and the UI updates itself.

## Traceability

- **ADR-001** — Extend Calculator with Modular Scientific Operations
- **FR-001** — scientific arithmetic (trigonometry, logarithms, exponentials, etc.)

## License

MIT
