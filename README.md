# Simple Calculator

A minimal, dependency-free calculator implemented as a **single HTML file** with
inline CSS and JavaScript, per [ADR-001](#architecture).

## Capabilities

- Perform basic arithmetic operations: `+`, `-`, `*`, `/`, `%`, parentheses, and unary +/-.
- Display a simple, responsive user interface.

## Architecture

This project follows **ADR-001 — "Use a single HTML file with embedded JavaScript
 for UI and arithmetic logic"**.

Key points:

- **Single-file deployment** — everything lives in `index.html`.
- **No external dependencies** — no build step, no package manager required.
- **Safe evaluation** — arithmetic is evaluated by a custom tokenizer +
  recursive-descent parser. We deliberately **avoid `eval()`** to remove the
  associated security risk (see ADR-001 consequences).

## Running

Because it is a static file, just open it in a browser:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows (PowerShell)
start index.html
```

Or serve it with any static file server:

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000

# Node (if installed)
npx serve .
```

## Usage

- Click the on-screen buttons, **or** use your keyboard:
  - Digits `0-9`, `.`, and operators `+ - * / % ( )`
  - `Enter` or `=` to evaluate
  - `Backspace` to delete the last character
  - `Escape` to clear (AC)

## Testing the evaluator

The parser is exposed on `window.Calculator` for quick checks in the browser
console:

```js
Calculator.evaluate('2 + 3 * (4 - 1)'); // 11
Calculator.evaluate('10 % 3');          // 1
Calculator.evaluate('-5 + 2');          // -3
```

## Project Structure

```
.
├── index.html   # UI + safe arithmetic parser (entire app)
├── README.md
└── .gitignore
```

## License

MIT
