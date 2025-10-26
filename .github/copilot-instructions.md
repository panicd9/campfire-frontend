# Campfire Copilot Instructions

## Architecture
- Next.js 16 app router project under `src/app`, with top-level routes for dashboard, portfolio, swap, liquidity, and funding pools.
- `src/app/layout.tsx` wraps every page in `WalletContextProvider`, so keep new providers inside it or compose them below to preserve Solana context.
- Client interactivity is handled inside page components (e.g. `swap/page.tsx`, `liquidity/page.tsx`) via `"use client"` and local state; server components are reserved for static shells like `app/page.tsx`.
- Dynamic funding pool detail lives at `app/funding-pool/[id]/page.tsx` and uses React 19 `use(params)`; stick to that pattern when reading route params in client components.

## Data & Utilities
- Static placeholder data and formatting helpers live in `src/lib/data.ts`; update or extend there before touching UI logic.
- Funding pool metadata comes from `src/lib/fundingPools.ts`; use `getAllFundingPools`/`getFundingPoolById` instead of manual array lookups.
- Reuse helpers like `getTradingPairChartData`, `getLiquidityPoolData`, and the `format*` functions to keep pricing/math consistent.
- Path aliases (`@/*`) are configured in `tsconfig.json`; prefer them over long relative imports.

## Styling & Components
- Global styling is centralized in `src/app/globals.css` with utility-like classes exported from Webflow; match existing class names when adding UI.
- Shared UI primitives live in `src/components/Global` (navbar, footer, wallet, progress bar, range slider); import from there instead of rewriting controls.
- Dashboard and portfolio tables format currency/volume within their card components—follow those helpers when adding new rows or data cells.
- Complex popups (coin selector, slippage modal) are defined inline within the page files; mirror their pattern (state + `document` listeners + cleanup) for similar overlays.

## Solana Integration
- Wallet connectivity relies on `@solana/wallet-adapter` packages; register additional adapters in `WalletProvider.tsx`.
- Use `useWallet`/`useWalletModal` from the adapter hooks (see `WalletAdapter.tsx` and `swap/page.tsx`) to gate actions behind wallet connection.
- Anchor IDLs and generated types reside under `solana/idls` and `solana/types`; import these when wiring real RPC calls or client-side account decoding.

## Workflows
- Install deps with `npm install`; run locally with `npm run dev`, build with `npm run build`, lint with `npm run lint` (ESLint 9 + Next presets).
- There are no automated tests yet; rely on lint and manual runs of critical pages (swap/liquidity/funding pool) after changes.
- Deploy settings are captured in `vercel.json`; ensure build output remains at `.next` if tweaking configs.

## Gotchas
- Many assets live in `public/assets`; place new icons there and reference via absolute `/assets/...` paths to keep Next Image happy.
- Guard browser-only APIs with `typeof window !== "undefined"` as in the swap/liquidity pages to avoid hydration warnings.
- Keep numeric inputs sanitized (regex pattern in swap/liquidity handlers) to prevent NaN cascading when computing conversions.
- When adding new coins or pools, update both the static data objects and any dependent enum lists (e.g. default selectors, `dashboardAssets`).
