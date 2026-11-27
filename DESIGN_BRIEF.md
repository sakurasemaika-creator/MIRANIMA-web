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
- Motion is limited to three places, each showing something real: the hero mirror canvas, the name parting into its two readings, and the NIARIM playback demo. All stop off-screen, can be paused or settle on their own, and are still under reduced motion.
- The hero mirror canvas: the mark draws itself, anything the visitor draws is reflected across the centre axis (MIRROR), and lines gently "boil" at 8 drawings per second like hand-drawn animation (ANIMA) and settle 6 seconds after the last activity (hovering wakes them). It pauses off-screen, and with reduced motion the mark is shown still. On touch screens drawing is opt-in (「指で描く」) so the panel never traps scrolling.
- Lime is never used for text on paper (too little contrast); on paper the mark sits on an ink tile or panel.
- Minimum sizes: body 15–16px, labels 12px. Japanese headings break by phrase (word-break: auto-phrase) and short paragraphs are balanced so no line ends with a stranded 「す。」.

## Product distinction
MIRANIMA and NIARIM must not share one undifferentiated color system:
- MIRANIMA is the parent brand. Its mark and restrained lime detail identify the studio.
- NIARIM is the hand-drawn animation app. Its product area can use the app's coral accent (#FF5C7A), but only within the product presentation.

## NIARIM presentation
- Show real NIARIM application captures hosted by the official NIARIM website: canvas, onion-skin and timeline (each language page uses the capture in its own language, e.g. canvas-en.webp). canvas replaced layers because it shows the actual drawing screen and the same ball sample as the playback demo.
- Explain a real creation sequence: drawing on the canvas, checking motion with onion skin, and arranging work in the timeline.
- The playback demo plays the "ball bounce" sample one frame at a time (8 frames, 8 fps) with an onion-skin toggle. Its frames are the ones the NIARIM official site uses for its own demo; the same sample appears in the real timeline capture. If an animation exported from the app becomes available, it can replace this demo.
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

## Languages
- Same seven languages as the NIARIM official site: ja (root), en, es, fr, ko, zh-Hans, zh-Hant. Use NIARIM's own terminology for each language (onion skin, timeline, frames, the Specified Commercial Transactions Act notice).
- Headlines use Shippori Mincho for Japanese and Latin scripts, Noto Serif KR / SC / TC for Korean and Chinese; body text uses Noto Sans JP / KR / SC / TC, or DM Sans for Latin scripts.
- Legal facts stay identical across languages: trade name MIRANIMA (ミラニマ), sole proprietorship, disclosure on request, and the NIARIM Premium notice link (opened in the same language).

## Implementation
- Static HTML, CSS and vanilla JavaScript; no runtime framework and no build step at deploy time.
- Pages are generated from src/template.html, src/404.html and src/locales/*.json by `node tools/build.mjs`; the generated HTML is committed. Never edit the generated index.html / 404.html / language folders directly.
- styles/core.css holds tokens, per-language typography, header, language switcher, menu and footer; styles/home.css holds the sections and responsive rules.
- script.js applies site.config.js addresses, the mobile menu, language switcher, current-section navigation, the name motion and the NIARIM reel indicator. mirror.js runs the hero mirror canvas; flipbook.js runs the playback demo.
- Web fonts load without blocking first paint, and each language page loads only its own fonts.
- NIARIM screenshots load from its official site, so no duplicate copies are stored in this repository.
- dev_branch is the implementation branch. Keep main as the lightweight repository landing branch.
