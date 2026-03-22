# Changelog

## [2.0.0] - 2026-03-22

* **Breaking** - ESM-only: use `import Toastle from 'toastle'`; CommonJS `require('toastle')` is no longer supported.
* Added - `package.json` `exports` map (entry + `./style.css`).
* Added - No-op without `document` / `document.body` (SSR-safe).
* Added - Normalize `options`; coerce `text`; clamp `duration` / `top`; unknown `type` → `success`.
* Changed - Stack layout from measured height + `requestAnimationFrame` reflow (replaces fixed height).
* Added - Screen reader live region (`role="status"`, `aria-live`, `aria-atomic`, `aria-relevant`).

## [1.0.2] - 2025-09-15

* Changed - Refine vertical spacing between stacked toasts.

## [1.0.1] - 2025-09-15

* Changed - Reduce default toast height and gap between stacked toasts.
* Added - README and package metadata updates.

## [1.0.0] - 2025-03-14

* Added - Initial release: vanilla toast with types, stacking, and CSS.
