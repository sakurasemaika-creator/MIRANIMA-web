# CLAUDE.md

Before UI work, read README.md, DESIGN_BRIEF.md, docs/ui/MATERIAL_DESIGN_3_ADOPTION.md and the local material-design-3-ui Skill. Preserve brand identity, factual/legal/contact accuracy and static implementation; no unrequested redesign.

## MIRANIMA web constraints
`DESIGN_BRIEF.md` is the brand source of truth. Keep the editorial premium studio identity, warm paper, dark ink, purposeful typography, restrained lime and mirror motif. Apply M3 semantics and accessibility/responsive practices selectively; plain editorial layout is often preferable to component/card patterns. Do not create generic SaaS layouts, repeated cards, default Material-purple styling, filler copy, meaningless decorations, or AI-template aesthetics. Preserve legal/contact/product accuracy and the static HTML/CSS/JS architecture. See `docs/ui/MATERIAL_DESIGN_3_ADOPTION.md`.

## Generated pages
The site has seven language versions generated from `src/template.html`, `src/404.html` and `src/locales/*.json`. Edit those files (never the generated `index.html`, `404.html` or language folders), then run `node tools/build.mjs`.
