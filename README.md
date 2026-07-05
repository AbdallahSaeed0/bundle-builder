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

## Things I couldn't verify precisely (worth a look before submitting)

I didn't have Figma Dev Mode access, only screenshots, so a few things are best-effort and worth double-checking against the actual file if you have access:

- **Exact prices/hex colors/spacing values** — I read these off the screenshots as closely as I could, but they aren't guaranteed pixel/cent-perfect. All prices live in one place (`products.json`), and all colors/spacing are CSS custom properties at the top of `App.css`, so both are quick to correct.
- **The Figma mock is internally inconsistent on Wyze Cam Pan v3's price.** Its product card shows ~~$39.98~~ **$34.98**, but the review panel line shows ~~$57.98~~ **$47.98** for ×2 (i.e. $28.99 → $23.99 each), and the mock's $187.89 total is built on the *review* numbers. Since the app is data-driven, one price has to win; I kept the card's $34.98 (the brief emphasizes reproducing the cards), so the computed total is $209.87 instead of $187.89. Changing `cam-pan-v3` to `"price": 23.99, "compareAtPrice": 28.99` in `products.json` reproduces the mock's total instead.
- **Product images** — real product photos live in `public/images/`, referenced by filename from `products.json` (including a separate image per color variant, where provided, so the card and review-panel thumbnail track whichever color is selected). One mapping worth noting: the source assets had no plain "Wyze Cam v4" photo, so the only otherwise-unmatched file was used for that card — worth double-checking against Figma if you have access. The Cam Unlimited plan has no photo asset (it's a software plan, not a physical product), so its card/review line shows the WYZE shield mark instead.
- **The "Choose your plan" step's expanded contents** — not visible open in any screenshot, only its collapsed row and the single line it contributes to the review panel ("Cam Unlimited"). I built it as a single plan card; if the real design has multiple plan tiers to choose between, that step will need more than one product entry.
- Variant swatch colors are approximate (I didn't have exact color values for "White/Grey/Black" chips beyond the visual read).

## Not implemented (out of scope per the brief)

- No backend/API — a static JSON file, as the brief says is fine.
- Checkout button is a visual placeholder only — it has no `onClick` at all, since there's nowhere for it to go in this prototype.
