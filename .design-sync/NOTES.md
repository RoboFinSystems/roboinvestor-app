# design-sync NOTES — RoboInvestor app (landing / brand surface)

This project syncs **RoboInvestor's own app components** to the RoboInvestor
claude.ai/design project (`9c82a8ad-…`). It is NOT the shared `@robosystems/core`
design system — that is owned by the **robosystems-app** design project and must
not be re-mirrored here. Refocused 2026-06-29 (was a `@robosystems/core` mirror).

Scope = **Phase 1: the landing / brand surface** (`src/components/landing/`): the
emerald-branded marketing sections nothing else captures. App-distinctive _views_
(portfolio, console, entity browser) are a deferred Phase 2 — they need provider/
data mocking (see EntitySelectorDropdown below).

## Shape & discovery (the load-bearing trick)

The app is a Next app, not a component library — no `dist/`, no `types`. Every
landing section is a **default export**, and the package-shape converter only
surfaces components reachable through `export *`, which skips defaults. So:

- **`.design-sync/entry.ts`** — a hand-authored barrel that re-exports each
  section as a NAMED export (`export { default as HeroSection } from …`). This is
  `cfg.entry`, so it becomes the IIFE bundle entry → `window.RoboinvestorApp.*`
  gets every named component. Relative paths keep the barrel alias-free.
- **`cfg.componentSrcMap`** pins all 12 names → their source paths. With `cfg.entry`
  set, the converter is in dist-mode (no `deriveComponentsFromSrc` source-scan
  fallback) and the app exposes no `.d.ts` exports, so the pins ARE the component
  list. The pin path also drives the card **group** (everything under `landing/`
  → group `landing`).
- `cfg.srcDir: "src/components"` bounds the source walk used for grouping/enrichment.

Net: **12 components**, all in group `landing`. Props are synth stubs
(`[key:string]: unknown`) — fine for upload; enrich later via `cfg.dtsPropsFor`
if a component's props matter to the design agent.

## Module resolution — the dedicated tsconfig (`cfg.tsconfig`)

`cfg.tsconfig` points at **`.design-sync/tsconfig.json`**, NOT the app's root
tsconfig. Three reasons, all of which bit during the refocus:

1. **`@/` alias.** Landing sections formerly imported `@/lib/core/*` — since the
   2026-07-11 npm migration they import the bare `@robosystems/core` package
   instead, resolved natively from `node_modules` (the `@/lib/core*` exact-match
   entries were removed with the subtree). The engine's `tsconfigPathsPlugin`
   (lib/bundle.mjs) reads `compilerOptions.paths` to resolve the remaining `@/*`
   aliases. `baseUrl: ".."` makes paths resolve from the app root.
2. **Directory barrels.** That plugin returns the first `existsSync` hit and tries
   the bare path BEFORE `/index.ts`, so a directory-barrel import of an `@/…`
   _directory_ resolves to the directory and esbuild dies with `"… is a
directory"`. Fix: **exact-match path entries** for each directory barrel
   pointing straight at its `index.ts`, listed BEFORE the `@/*` wildcard (rules
   match in key order). Add a new entry here whenever a featured component
   imports another `@/…` _directory_. (Bare `@robosystems/core*` imports don't
   need this — node-modules resolution handles the package's directories.)
3. **`next/image`.** Its default export bundles as an object in the static bundle →
   React throws `Element type is invalid … got: object`. Aliased to
   **`.design-sync/shims/next-image.tsx`** (a plain `<img>`). `next/link` is fine —
   no shim needed. Only `HeroSection` imports `next/image`, but the alias is global.

**Do NOT put a `"//"` comment key (or any `//` line comment) in
`.design-sync/tsconfig.json`** — the engine's comment-stripper regex mangles the
`"//"` key, `JSON.parse` throws, and the paths plugin silently returns `null`
(then `@/` falls back to esbuild-native resolution and `next/image` is NOT shimmed
— exactly the failure that masked itself during the refocus). Keep it clean JSON.

## CSS, fonts, process shim (unchanged mechanics, new paths)

- **`.design-sync/compile-css.mjs`** compiles `src/app/globals.css` →
  **`.design-sync/.cache/ds-compiled.css`** (gitignored under `.cache/`). `cfg.cssEntry`
  points there. globals.css carries the emerald `@theme`; `tailwind.config.ts`
  content glob `./src/**` already covers `src/components/landing`, so section
  utilities are generated. `tw-safelist.txt` ships the full brand palette.
- **`cfg.extraFonts: [".design-sync/ds-fonts.css"]`** (Space Grotesk + Orbitron;
  url()s resolve `../public/fonts/…`). `runtimeFontPrefixes: ["JetBrains"]` suppresses
  the system-mono fallback, matching the app.
- **`.design-sync/patch-bundle.mjs`** injects the `process` shim + `NEXT_PUBLIC_APP_NAME=
roboinvestor` as line 2 of `_ds_bundle.js` and refreshes `bundleSha12`. **Re-run
  after every full build** — core components read `process.env.*` at module scope.

## Authored previews & overrides

Auto-rendered floor cards are fine for full-bleed sections; 4 needed authoring or
framing (in `.design-sync/previews/` + `cfg.overrides`):

- **HeroSection** — `min-h-screen`; needs a tall card. `overrides.viewport 1280x1000`.
- **Header** — `fixed top-0` (escapes flow → 0-height). Preview wraps it on a black
  backdrop; `overrides.cardMode "single" + viewport 1280x200`.
- **ContactModal** — Flowbite Modal via a **portal**: the card root measures 0px so
  validate flags `[RENDER_THIN]` — **benign**, the dialog renders correctly (see the
  screenshot). `overrides.cardMode "single" + viewport 640x600`.
- **FloatingElementsVariant** — decorative absolute blobs; preview wraps in a sized
  `relative` dark frame and shows the `hero` + `research` variants.

The other 8 sections render their real UI from the auto preview — author nicer
demos incrementally if desired.

## Excluded — EntitySelectorDropdown (Phase 2)

`src/components/EntitySelectorDropdown.tsx` reads `useGraphContext` / `useEntity` /
`useSSO` and throws `must be used within a GraphProvider` → floor card only. Left
out of the barrel + componentSrcMap. To feature it (and other app views), add a
`cfg.provider` wrapper that supplies the graph/entity contexts with mock state.

## Run order (every re-sync)

```
node .design-sync/compile-css.mjs src/app/globals.css .design-sync/.cache/ds-compiled.css
node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --out ./ds-bundle
node .design-sync/patch-bundle.mjs ./ds-bundle      # <-- do NOT skip
node .ds-sync/package-validate.mjs ./ds-bundle
node .design-sync/gen-manifest.mjs ./ds-bundle      # <-- do NOT skip (see below)
```

No `node_modules/<pkg>` symlink and no `build:types` step are needed (both were
`@robosystems/core`-only). Upload is the 12 cards under `components/landing/` to the
RoboInvestor project, deleting the old `@core` card tree.

## `_ds_manifest.json` — the card index (MUST upload manually)

The pane's card grid is driven by `_ds_manifest.json`. The package-build CLI does
NOT emit it; normally the claude.ai/design app's **server-side self-check** rebuilds
it from the bundle. **That self-check does NOT fire on raw DesignSync file uploads**
(confirmed 2026-06-29 — uploading the `_ds_needs_recompile` marker did nothing). So a
CLI sync leaves the project's OLD manifest in place and the pane shows the previous
components, every card reading **"file not found"** (their HTML was deleted).

Fix / contract: after the build, run **`node .design-sync/gen-manifest.mjs ./ds-bundle`**
(derives namespace + components from the `_ds_bundle.js` `@ds-bundle` header, cards
from each HTML's `@dsCard` marker, tokens from `_ds_bundle.css`, fonts from
`fonts/fonts.css`) and **include `_ds_manifest.json` in the upload write set**. Verify
remotely with `get_file _ds_manifest.json` — `namespace` must be `RoboinvestorApp` and
`cards` must list the `landing` HTML, not `@core`.

## Sibling apps

robosystems-app / roboledger-app still mirror `@robosystems/core` in THEIR design
projects. This refocus is RoboInvestor-only; replicate the pattern for RoboLedger's
own landing surface separately if/when desired (different brand: violet).

## Sibling apps

robosystems-app / roboledger-app still mirror `@robosystems/core` in THEIR design
projects. This refocus is RoboInvestor-only; replicate the pattern for RoboLedger's
own landing surface separately if/when desired (different brand: violet).
