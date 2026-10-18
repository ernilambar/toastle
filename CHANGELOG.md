# Changelog

## 2.1.0 - 2026-03-25
- Added: Global `globalThis` registry so duplicate bundles share stack.

## 2.0.0 - 2026-03-22
- Added: `package.json` `exports` map (entry + `./style.css`).
- Added: No-op without `document` / `document.body` (SSR-safe).
- Added: Normalize `options`; coerce `text`; clamp `duration` / `top`; unknown `type` → `success`.
- Added: Screen reader live region (role, aria-live, aria-atomic, aria-relevant).
- Changed: **Breaking** - ESM-only; CommonJS `require('toastle')` no longer supported.
- Changed: Stack layout from measured height + `requestAnimationFrame` reflow (replaces fixed height).

## 1.0.2 - 2025-09-15
- Changed: Refine vertical spacing between stacked toasts.

## 1.0.1 - 2025-09-15
- Added: README and package metadata updates.
- Changed: Reduce default toast height and gap between stacked toasts.

## 1.0.0 - 2025-03-14
- Added: Initial release: vanilla toast with types, stacking, and CSS.
