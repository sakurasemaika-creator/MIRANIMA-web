# MIRANIMA Website — Design Intent

## Identity
- The symbol mark is a vector redraw of the image supplied for this repository: a rounded geometric M with an inverted triangular opening.
- Primary accent: electric lime `#e3ff36`, sampled to match the supplied mark. Use it sparingly for the mark, links and selected details.
- Dark green-black sections create a consistent backdrop for the luminous symbol; warm pale sections provide reading contrast and rhythm.
- English labels act as section identifiers. Japanese copy carries the explanation and should not be replaced with generic corporate slogans.

## Information architecture
1. Hero — brand proposition and routes to the name origins and first product.
2. Manifesto — belief that the tool supports rather than replaces the creator.
3. Name origins — Mirror + Anima and Mirai + Animation.
4. Products — NIARIM, the current first product.
5. About — the role and approach of the MIRANIMA brand.
6. Principles — creator-first, intuitive tools, and future-facing creation.
7. Studio information — business identity, contact addresses and legal link.
8. Contact — direct email routes.

## Accuracy rules
- NIARIM is in development. Do not present it as released or commercially available until that status changes.
- MIRANIMA is a trade name / brand, not the operator’s personal name. The operator block labels it `屋号`; business form is `個人事業`.
- Representative name, address and telephone details are not guessed. The site states that they are disclosed without delay upon request, reflecting the supplied NIARIM legal-information approach.
- NIARIM Premium statutory disclosure remains linked from studio information. Product-specific pricing and payment terms are not repeated as general brand facts.

## Technical choices
- Static HTML, CSS and vanilla JavaScript; no build step or runtime framework.
- Styles are separated by concern and loaded through `styles.css`.
- Mobile navigation is handled in `script.js`.
- Contact uses `mailto:`; no user data is collected through a web form.
- `dev_branch` is the implementation branch. `main` remains the lightweight project landing branch.
