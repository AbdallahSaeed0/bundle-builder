# Bundle Builder — Frontend Take-Home

A React implementation of the multi-step security-system bundle builder, with a live-updating review panel.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build, output in dist/
npm run preview  # serve the production build locally
```

Node 18+ recommended.

## Project structure

```
public/images/            # product photos + satisfaction badge
src/
  data/products.json      # all product/step content — the app renders from this
  lib/bundleLogic.js      # selection state, totals, review-line grouping
  hooks/useLocalStorage.js
  components/             # AccordionStep, ProductCard, VariantSelector,
                           # QuantityStepper, ReviewPanel, Icon, WyzeShield
  App.jsx / App.css
```

## Decisions & tradeoffs

- **Variants** each carry their own quantity (`{ activeVariantId, quantities: { red: 2, blue: 0 } }`). Products with no colors use an implicit `'default'` key, so stepper logic stays uniform. Switching color swaps which quantity the stepper edits without touching the others; the review panel lists every variant with quantity > 0 as its own line.
- **Fully data-driven** — everything renders from `src/data/products.json`; no per-product markup is hardcoded.
- **Persistence** — "Save my system for later" writes selections + open step to `localStorage`; restored silently on load.
- **Font** — targets Gilroy, matching the Figma. The real SemiBold cut used for body text is a commercial file, so it falls back (locally installed → optional `public/fonts/Gilroy-SemiBold.woff2` → closest free cut) if not present.
- **Breakpoints** are estimated from screenshots, not exact Figma values: ≥1400px uses the sidebar layout (Frame 1735), 1000–1399px uses the stacked laptop layout (Frame 1736), and below that it collapses to a single column down to phone width.

## Not implemented

- No backend — a static JSON file, per the brief.
- Checkout button is a visual placeholder with no `onClick`.
