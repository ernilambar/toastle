# AGENTS.md

## Overview

Toastle is a lightweight, zero-dependency vanilla JavaScript toast notification library (ESM-only). Core stack is plain JS + CSS (`index.js`, `style.css`) tested with Vitest + happy-dom and linted with Neostandard (ESLint 9) on Node >= 22.

## Setup

Requires Node.js >= 22, no env vars or extra config.

```sh
npm ci
```

## Commands

- Build: N/A — no build step, ship `index.js` and `style.css` as-is.
- Test: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`
- Typecheck: N/A — no TypeScript, JSDoc types only.

## Conventions

- ESM-only, zero dependencies: keep `import Toastle from 'toastle'` working and do not add runtime deps or CommonJS.
- SSR-safe by contract: no-op (no throw) when `document` / `document.body` is missing; keep `toastle.ssr.test.js` (node env) passing.
- Shared global stack: use `Symbol.for('toastle.registry.v1')` with `{ apiVersion: 1, stacks: Map }` keyed by `String(top)` so duplicate bundles share queues.
- Single spacing source: stacking gap lives in `SPACING = 9` in `index.js`; keep `.toastle { margin-bottom: 0; }` and position via measured height + `requestAnimationFrame` reflow.
- Defensive, accessible output: coerce `text` with `String()`, clamp `duration` (0–86400000, default 3000) and `top` (-10000–10000, default 40), map unknown `type` to `success`, set `textContent` (never `innerHTML`), and keep `role="status"` live-region attributes.

## Quality Gate

Run in order; each must exit 0 before declaring a task complete:

```sh
npm ci
npm run lint
npm test
```
