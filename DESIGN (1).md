# Design System Reference

Use this file as the default design language for all frontend work unless explicitly told otherwise.

## Core Principles

- **2026 minimal aesthetic.** Confident, clean, current. Nothing that looks like 2020 SaaS.
- **Structure over decoration.** The layout does the work, not ornaments or gradients.
- **Whitespace is a feature.** Sections breathe. Nothing feels cramped.
- **Single-purpose sections.** One idea per block, one heading, one supporting message.

## Apple Design Influence

The overall design philosophy is heavily inspired by Apple's web presence. This affects everything from layout to motion to how content is revealed. Key characteristics to carry into every build:

- **Product/visual as hero.** Let images and visuals dominate. Remove anything that competes with them.
- **Typography as architecture.** Headlines aren't just text, they're spatial elements. Oversized, bold, sometimes spanning the full viewport width.
- **Scroll-driven storytelling.** The page unfolds as a narrative. Each scroll reveals the next beat. Users discover, they don't scan.
- **Sticky/pinned sections.** Sections that lock in the viewport while content, images, or data animate within them. Use for feature breakdowns and product showcases.
- **Parallax depth.** Subtle layered movement between foreground and background elements to create a sense of dimension.
- **Dark sections with glowing visuals.** Product shots or UI screenshots on dark backgrounds with soft lighting, gradients, or bloom effects.
- **Precision spacing.** Padding and margins feel mathematically intentional. Nothing is "close enough."
- **Reduction over addition.** Every element earns its place. If removing something doesn't hurt the message, remove it.
- **Smooth, physics-based motion.** Animations feel like real objects with mass. Ease-out curves, no linear movement, no hard stops.
- **Full-bleed media.** Images and videos that stretch edge to edge. No unnecessary containers or borders boxing them in.
- **Progressive disclosure.** Don't show everything at once. Layer information so the user gets the headline first, then detail on scroll or interaction.

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

## Tech Stack

### Defaults
- **Framework:** Next.js (App Router) + React
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Deployment:** Vercel
- **Fonts:** Load via `next/font` (Google Fonts or local files)
- **Images:** Use `next/image` for all images

Use Vite + React only for pure web apps (dashboards, SPAs) where SEO is irrelevant.

### Tailwind Guidelines
- Use Tailwind's utility classes directly. No custom CSS unless absolutely necessary.
- Define brand tokens in `tailwind.config.js` (colors, fonts, spacing scale, border-radius).
- Use `@apply` sparingly, only for repeated multi-class patterns in component-level styles.
- Dark mode: use Tailwind's `dark:` variant with class strategy if the project needs both themes.

### Framer Motion Implementation

#### Philosophy
Animations should feel intentional and subtle. Nothing should bounce, overshoot, or feel playful unless the brand calls for it. Default to smooth, confident motion.

#### Default Transition
```js
const defaultTransition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier, smooth decel
}
```

#### Scroll-Triggered Reveals
Use `whileInView` for section and card entrance animations. Elements should fade up into place.

```jsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
>
```

#### Staggered Children
For card grids, feature lists, and stats. Stagger each child by 0.08-0.12s.

```jsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
```

#### Page Transitions
Wrap page content in `AnimatePresence` with a simple fade or slide.

```jsx
<motion.main
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
```

#### Hover Interactions
Keep them subtle. Slight scale, opacity shift, or y-translate on cards and CTAs.

```jsx
<motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
```

#### Scroll-Linked Animations (Apple-style)
Use `useScroll` and `useTransform` for scroll-driven effects. These are key to the Apple feel.

```jsx
import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

function StickyReveal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.3], [60, 0])

  return (
    <section ref={ref} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <motion.div style={{ opacity, scale, y }}>
          {/* Content that transforms as you scroll */}
        </motion.div>
      </div>
    </section>
  )
}
```

#### Parallax Layers
Different elements moving at different speeds based on scroll position.

```jsx
function ParallaxSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  const fgY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {/* Background layer */}
      </motion.div>
      <motion.div style={{ y: fgY }} className="relative z-10">
        {/* Foreground content */}
      </motion.div>
    </section>
  )
}
```

#### Text Reveal on Scroll
Words or lines appearing one at a time as the user scrolls. Great for hero headlines.

```jsx
function ScrollTextReveal({ text }) {
  const words = text.split(" ")

  return (
    <p className="flex flex-wrap gap-x-2">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.4 }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}
```

#### Number Count-Up
For stats sections. Animate from 0 to target value when scrolling into view.

```jsx
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

function CountUp({ target, duration = 1.5 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = target / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref}>{count}</span>
}
```

#### What to Animate
- Section entrances (fade up on scroll)
- Card grids (staggered reveal)
- Hero text (staggered word or line reveal)
- Stats/numbers (count-up on scroll)
- Navigation (smooth mobile menu open/close)
- Page transitions (fade between routes)
- Sticky scroll sections with content transforming within them
- Parallax depth between foreground and background layers
- Full-bleed images scaling or fading as they enter/exit the viewport
- Feature reveals pinned to scroll progress

#### What NOT to Animate
- Large background elements (performance cost, no real value)
- Every single element on the page (less is more)
- Anything that delays content visibility by more than 0.8s
- Looping or bouncing effects (feels cheap)

### Project Structure (Next.js)
```
src/
  app/
    layout.jsx        — root layout, fonts, metadata
    page.jsx          — homepage
    [slug]/page.jsx   — dynamic pages
  components/
    ui/               — reusable primitives (Button, Card, Badge)
    sections/         — page sections (Hero, Features, Pricing, FAQ)
    layout/           — Nav, Footer
  lib/
    utils.js          — helper functions
    constants.js      — site-wide config, links, metadata
  styles/
    globals.css       — Tailwind base imports, custom properties if any
tailwind.config.js
next.config.js
DESIGN.md             — this file
```

## Reference Templates

These sites represent the target aesthetic. Use them as visual benchmarks:

- [Fabrica](https://fabrica.framer.media/) — dark, editorial, studio-confident
- [Pearl](https://pearl.framer.website/) — light, stripped-to-essentials, portfolio-minimal
- [Radison](https://radison.framer.website/) — dark SaaS, product-forward, interactive cards
- [Stratex](https://stratex.framer.website/) — light, professional, conversion-oriented
- [Perform](https://perform.framer.website/) — dark, personal brand, storytelling
- [Walter Living](https://walterliving.com/nl/en/) — light, real product, clean trust-building
