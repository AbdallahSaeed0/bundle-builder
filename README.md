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
public/images/              # product photos + the satisfaction-guarantee badge
src/
  data/products.json        # all product/step content — the app renders from this
  lib/bundleLogic.js        # pure helpers: selection state, totals, review-line grouping
  hooks/useLocalStorage.js  # "Save my system for later" persistence
  components/
    AccordionStep.jsx       # one step: header, N-selected count, product grid, Next button
    ProductCard.jsx         # badge, image, description, variant selector, stepper, price
    VariantSelector.jsx     # color/variant chip row
    QuantityStepper.jsx     # shared by product cards AND review panel lines
    ReviewPanel.jsx         # grouped line items, shipping, guarantee, totals, checkout
    Icon.jsx                # small inline-SVG icon set (step icons, chevrons, truck)
    WyzeShield.jsx          # the WYZE shield mark used for the plan card/line
  App.jsx                   # top-level state + wiring
  App.css                   # all styling
```

## Key design decisions

**State shape for variants.** Each product's selection state is:
```js
{ activeVariantId: 'red', quantities: { red: 2, blue: 0 } }
```
Products with no color options use a single implicit `'default'` variant key, so the stepper/quantity logic never has to branch on "does this product have variants" — it's uniform everywhere. Switching the active color swaps which quantity the stepper reads/writes, but never touches other variants' counts. The review panel independently renders every variant (across every product) with a quantity above zero as its own line, which is what makes "2 Red + switch card to Blue + Red still shows in review" work correctly.

**Data-driven rendering.** Everything (steps, products, badges, variants, shipping, guarantee copy, financing line) comes from `src/data/products.json`. No product markup is hardcoded — adding a product to the JSON is enough to have it appear correctly in both the card grid and, once selected, the review panel.

**Persistence.** "Save my system for later" writes `{ selections, openStepId, savedAt }` to `localStorage` under one key. On load, the app checks for a saved payload and restores it silently (including which step was open) before falling back to the seeded defaults from the JSON — reload or return later and the system is exactly as it was left.

**Font.** Body/heading text targets **Gilroy** (`src/App.css`), matching the Figma. The genuine SemiBold cut used for body copy is a commercial file not available on free CDNs, so the `@font-face` tries, in order: a locally installed `Gilroy-SemiBold`, an optional `public/fonts/Gilroy-SemiBold.woff2` (drop the real file there and it's picked up automatically, no code change needed), then the closest free cut as a fallback. Headings/prices use the free Bold/Heavy cuts directly.

## Responsive breakpoints

Both desktop Figma frames are implemented, mapped by viewport:

- **≥ 1400px (wide, Frame 1735)** — builder on the left, sticky review panel (340px) on the right, product cards in a 2-column grid with image-left/content-right layout. An odd trailing card centers itself at half width, like the Battery Cam Pro in the design.
- **1000–1399px (laptop, Frame 1736)** — builder full width with a 5-across grid of vertical cards; the review section sits below in two columns (line items left; satisfaction stamp + 30-day returns copy, financing, total, savings, and checkout on the right).
- **< 1000px** — single column, review panel stacks below the accordion; a "Let's get started!" heading appears (matching the iPhone frame).
- **< 640px** — product cards go single-column.

The exact pixel breakpoints are my estimate, not pulled from Figma directly — flagging that here as requested.

## Not implemented (out of scope per the brief)

- No backend/API — a static JSON file, as the brief says is fine.
- Checkout button is a visual placeholder only — it has no `onClick` at all, since there's nowhere for it to go in this prototype.
