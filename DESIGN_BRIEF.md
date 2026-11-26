# MIRANIMA Website — Design Brief

## Purpose
MIRANIMA is the trade name / brand behind creator-focused software. The site should explain what the name means, what kind of tools are being made, and where to contact the operator. It is not a generic SaaS landing page and should not read like an AI-generated company manifesto.

## Brand meaning
- **MIRROR + ANIMA** — a mirror-like tool that reflects the creator's inner image, sensibility and intent.
- **MIRAI + ANIMATION** — helping people who make animation and new forms of expression shape what comes next.
- Core thought: the tool should adapt to the maker's expression, not make the maker adapt to the tool.

## Visual direction
The visual language is restrained and editorial:
- Warm paper-like background (#f5f3ed), dark ink (#20251f), hairline borders and generous but controlled margins.
- Japanese headlines use Shippori Mincho; body copy uses Noto Sans JP; English labels use DM Sans.
- The MIRANIMA lime (#e3ff36) is reserved for the supplied symbol and a few precise details. It is not used as a large background wash.
- A framed, offset mirror motif refers directly to the MIRROR part of the name. It replaces decorative or unexplained circles, floating ornaments and generic abstract diagrams.
- Layout rhythm comes from editorial type hierarchy, aligned baselines, short section labels and deliberate rules rather than a repeated set of rounded cards.
- No unnecessary hover or motion. Motion must communicate an actual action or state.

## Product distinction
MIRANIMA and NIARIM must not share one undifferentiated color system:
- MIRANIMA is the parent brand. Its mark and restrained lime detail identify the studio.
- NIARIM is the hand-drawn animation app. Its product area can use the app's coral accent (#FF5C7A), but only within the product presentation.

## NIARIM presentation
- Show real NIARIM application captures hosted by the official NIARIM website: layers.webp, onion-skin.webp, and timeline.webp.
- Explain a real creation sequence: drawing on layers, checking motion with onion skin, and arranging work in the timeline.
- Do not invent interface screens, feature claims, platform availability or status.
- NIARIM is an Android hand-drawn animation app. The official site and Google Play links are provided.
- These reference principles were informed by studying how the supplied Bite and Peek & Claw pages make different products feel distinct. Do not reproduce their copy, illustrations, layouts, logos, or exact effects. Borrow only the general principle that the content and visual language should grow from the product itself.

## Information architecture
1. Hero — the brand's concrete point of view: the tool should not dictate expression.
2. Name — the two meanings behind MIRANIMA.
3. First product — NIARIM, presented through actual app screens and the sequence of creating an animation.
4. Studio — trade name, business form, statutory information link and contact addresses.
5. Contact — direct mail destinations.

Avoid duplicate manifesto / about / philosophy sections that repeat the same message.

## Accuracy and legal rules
- MIRANIMA is a trade name / brand, not the operator's personal name. Use 屋号：MIRANIMA（ミラニマ）.
- Business form is 個人事業.
- Do not invent the representative name, address or telephone number. The site states that they are disclosed without delay upon request, following the operator's supplied policy.
- Keep the NIARIM Premium statutory disclosure link. Explain that it relates to NIARIM Premium's sales terms.
- General inquiries: contact@miranima-studio.com.
- NIARIM support: support@miranima-studio.com.

## Implementation
- Static HTML, CSS and vanilla JavaScript; no runtime framework or build step.
- index.html contains the complete Japanese page.
- styles.css imports styles/core.css, styles/components.css, styles/responsive.css and styles/studio.css.
- script.js handles mobile navigation, dynamic year, contact address and official NIARIM links.
- NIARIM screenshots load from its official site, so no duplicate copies are stored in this repository.
- dev_branch is the implementation branch. Keep main as the lightweight repository landing branch.
