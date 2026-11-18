# Shwapno homepage research brief

## Route

| Source | Local route | Notes |
|---|---|---|
| `https://www.shwapno.com/?srsltid=ARcRdnrNeoLHuI6cq6BzG0NRPg26peAzdyaQHpHyHlYOkkVAedFNFHmn` | `/` | The `srsltid` query is tracking-only; the homepage is the requested page. |
| `https://www.shwapno.com/checkout` | `/checkout` | Checkout reached from the cart drawer's Place order action. The sign-in dialog opens by default. |

Implementation: [ShwapnoHome](../../../src/components/sites/shwapno/shwapno-home.tsx), scoped styles in [shwapno-home.css](../../../src/components/sites/shwapno/shwapno-home.css), and locally downloaded media in [public/sites/shwapno/assets](../../../public/sites/shwapno/assets).
Checkout implementation: [ShwapnoCheckout](../../../src/components/sites/shwapno/shwapno-checkout.tsx) with its route in [page.tsx](../../../src/app/checkout/page.tsx). Cart contents are transferred through browser storage.

## Observed layout

- Inspected at 1440×950 desktop and 390×844 mobile.
- Typeface: Rubik. Desktop has a red top header, a left department list, a wide hero carousel, and full-width product shelves. Mobile compresses the header, makes categories and products horizontally scrollable, uses a short hero, and adds a fixed bottom action dock.
- Main content order: app promotion (mobile), header, departments and hero, trust benefits, product categories, recommended products, deal shelves, food promotions, additional product collections, brands, coverage information, and footer.
- Desktop uses a persistent header and a broad centered content area. Mobile cards and hero use narrower crops and horizontal rails to avoid page-level overflow.
- A first-visit promotional dialog appears over a dimmed page. Its first visible campaign is Chal Daal; its previous-slide control switches to the Himalaya campaign. The opposite next-slide control returns to Chal Daal.

## Interactions

- Hero arrows and dots change the active campaign.
- Department navigation and the mobile menu expose category links.
- Search shows matching product suggestions.
- Deal tabs replace the visible product collection.
- Product add buttons update the bag count and cart contents.
- Location selection, account, and cart controls open dialogs/drawers.
- The promotional dialog opens initially, closes via its close button or backdrop, and has two campaign slides.
- Selecting Place order from the cart drawer opens `/checkout` with the current basket. The checkout screen shows the delivery time, address, and order total; a phone/Gmail sign-in dialog opens initially, can be dismissed, and can be reopened through Confirm.
- Mobile has a fixed bottom navigation dock; horizontal category and product rails can be scrolled.

## Asset map

All downloaded media is under `public/sites/shwapno/assets/`. The component refers to those files through the `/sites/shwapno/assets/` URL prefix.

| Source asset / purpose | Local asset |
|---|---|
| Source popup, Chal Daal campaign: `https://d2t8nl1y0ie1km.cloudfront.net/images/6af9598873083ef7748d2ca0_3032a73f39a848c4ae80ae0e5bd35213.webp?width=1200&format=webp` | `promo-popup-daal.webp` (1000×600 WebP; initial dialog slide) |
| Source popup, Himalaya campaign: `https://d2t8nl1y0ie1km.cloudfront.net/images/6afd785bd730f84c0d8fd836_ca6e6702a0bd464a8c12347306e69837.png?width=640&format=webp` | `promo-popup.webp` (alternate dialog slide) |
| Homepage campaign carousel | `hero-*.webp` and `hero-*.jpeg` |
| Department/category illustrations | `category-*` |
| Product collections and promotional shelves | `product-*`, `weekday-*`, `himalaya-*`, `featured-*`, `clean-*`, `snack-*`, `spice-*`, `vegetable-*`, `diabetic-*`, `spray-*`, and `trending-*` |
| Trust strip, brand rail, and app promotion | `trust-*`, `brand-*`, and `app-download*` |
| Source typography | `rubik-regular.ttf`, `rubik-medium.ttf`, and `rubik-bold.ttf` |

The source coverage-map image returned 403 when fetched. The page uses the observed city/outlet text list instead; the unavailable map is not represented by a substitute image.

## Fidelity notes

- Source homepage direct HTTP retrieval was blocked by Cloudflare; visual and interaction inspection was performed in a browser.
- Outbound links whose destination pages are not part of this clone remain external/source links.
- The supplied homepage URL maps to `/`; no separate route is created for the tracking query string.
