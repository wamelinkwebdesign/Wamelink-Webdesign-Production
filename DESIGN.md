# Design System Reference

Use this file as the default design language for all frontend work unless explicitly told otherwise.

## Core Principles

- **2026 minimal aesthetic.** Confident, clean, current. Nothing that looks like 2020 SaaS.
- **Structure over decoration.** The layout does the work, not ornaments or gradients.
- **Whitespace is a feature.** Sections breathe. Nothing feels cramped.
- **Single-purpose sections.** One idea per block, one heading, one supporting message.

## Typography Hierarchy

Every section follows this rhythm:

1. **Label** (small, uppercase or muted) — category or context
2. **Headline** (large, bold) — the main statement
3. **Body** (regular weight, smaller) — supporting detail

Headlines should feel confident and concise. Not salesy, not clever. Just clear.

### Font Recommendations

- Headlines: geometric sans-serif (Inter, Satoshi, General Sans, Plus Jakarta Sans)
- Body: clean and legible (Inter, DM Sans, Geist)
- Monospace (if needed): JetBrains Mono, Fira Code

## Color

- Dark or light base, both work depending on context.
- Palette stays mostly neutral (near-black, off-white, grays).
- **Accent colors used sparingly.** One or two max, applied to CTAs, active states, highlights.
- Let photography and contrast do the heavy lifting over color.

## Layout Patterns

### Navigation
- Minimal, 4-6 items max.
- Logo left, links center or right, single CTA button if needed.

### Hero
- Large headline, supporting paragraph, one or two CTAs.
- Optional trust signal (rating, client count, social proof).
- Can include a hero image or keep it text-only.

### Stats / Numbers
- Horizontal strip or bento grid of 3-4 large numbers with small labels.
- Examples: "50+ projects", "98% satisfaction", "3.6x faster".

### Cards
- Always visual-forward: lead with an image, UI mockup, or illustration.
- Text underneath or overlaid, never text-only cards.
- Clean structure, no heavy borders or drop shadows.

### Services / Features
- Grid of cards with image + title + short description.
- Or accordion-style list for compact presentation.

### Pricing
- 2-3 tier horizontal card layout.
- Plan name, price, feature list, CTA.
- Optional image on card (more visual, less spreadsheet).
- Annual/monthly toggle if relevant.

### Process / How It Works
- Numbered steps (01, 02, 03).
- Alternating image + text blocks, or horizontal step cards.
- Timeline/progress style also works.

### Testimonials
- Quote + name + role + company.
- Scrolling carousel or grid.
- Keep individual testimonials compact.

### Comparison (Us vs Them)
- Side-by-side layout showing pain points vs value props.
- Good for conversion-focused pages.

### FAQ
- Clean accordion with toggle icon.
- No heavy styling, just question + expandable answer.

### Footer CTA
- Strong closing section: bold headline + single action.
- Optional atmospheric image underneath.

### Footer
- Logo, nav links, social links, copyright.
- Two or three column layout, nothing heavy.

## Component Style

- CTAs can be text links or buttons depending on context. Keep them understated.
- Rounded corners: subtle (4-8px), not pill-shaped unless it's a tag/badge.
- Shadows: minimal or none. Use spacing and background contrast for depth.
- Borders: thin and light if used at all.
- Icons: simple line style, not filled. Use sparingly.

## Avoid

- Excessive gradients or glassmorphism.
- Heavy drop shadows or 3D effects.
- Cluttered sections with multiple competing elements.
- Generic stock illustration style (the blob people).
- Overly decorative typography or script fonts.
- Bullet-heavy layouts where prose or cards would work better.

## Reference Templates

These sites represent the target aesthetic. Use them as visual benchmarks:

- [Fabrica](https://fabrica.framer.media/) — dark, editorial, studio-confident
- [Pearl](https://pearl.framer.website/) — light, stripped-to-essentials, portfolio-minimal
- [Radison](https://radison.framer.website/) — dark SaaS, product-forward, interactive cards
- [Stratex](https://stratex.framer.website/) — light, professional, conversion-oriented
- [Perform](https://perform.framer.website/) — dark, personal brand, storytelling
- [Walter Living](https://walterliving.com/nl/en/) — light, real product, clean trust-building
