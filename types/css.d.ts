/**
 * types/css.d.ts
 * ──────────────
 * TypeScript 6.0 introduced TS2882 — it now checks side-effect imports by
 * default (noUncheckedSideEffectImports = true) which caused:
 *
 *   "Cannot find module or type declarations for side-effect import of './foo.css'"
 *
 * Next.js only ships declarations for *.module.css (CSS Modules), not plain CSS.
 * This file fills that gap: plain `.css` files have no exports — they are
 * bundled by webpack as pure side effects (adding styles to the page).
 */

// Allow plain CSS side-effect imports: import './styles.css'
declare module '*.css' {}
