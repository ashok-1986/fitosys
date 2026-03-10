---
name: ui-ux-pro
description: >
  Comprehensive UI/UX design intelligence skill for web and mobile applications.
  Use this skill whenever the user asks to design, build, create, implement, review,
  fix, or improve any UI — including landing pages, dashboards, SaaS products,
  components, forms, or any visual interface. Contains 50+ styles, 97 color palettes,
  57 font pairings, 99 UX guidelines, and 25 chart types across 9 technology stacks.
  Always trigger this skill when the user mentions: landing page, dashboard, UI, design
  system, component, dark mode, color palette, typography, accessibility, animations,
  or responsive layout — even if they don't use the word "design."
---

# UI/UX Pro — Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles,
97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across
9 technology stacks.

---

## When to Apply

Reference these guidelines when:
- Designing new UI components or pages
- Choosing color palettes and typography
- Reviewing code for UX issues
- Building landing pages or dashboards
- Implementing accessibility requirements

---

## Rule Categories by Priority

| Priority | Category | Impact | Domain |
|---|---|---|---|
| 1 | Accessibility | CRITICAL | `ux` |
| 2 | Touch & Interaction | CRITICAL | `ux` |
| 3 | Performance | HIGH | `ux` |
| 4 | Layout & Responsive | HIGH | `ux` |
| 5 | Typography & Color | MEDIUM | `typography`, `color` |
| 6 | Animation | MEDIUM | `ux` |
| 7 | Style Selection | MEDIUM | `style`, `product` |
| 8 | Charts & Data | LOW | `chart` |

---

## Quick Reference Rules

### 1. Accessibility (CRITICAL)
- `color-contrast` — Minimum 4.5:1 ratio for normal text
- `focus-states` — Visible focus rings on all interactive elements
- `alt-text` — Descriptive alt text for meaningful images
- `aria-labels` — aria-label for icon-only buttons
- `keyboard-nav` — Tab order matches visual order
- `form-labels` — Use label with for attribute

### 2. Touch & Interaction (CRITICAL)
- `touch-target-size` — Minimum 44×44px touch targets
- `hover-vs-tap` — Use click/tap for primary interactions
- `loading-buttons` — Disable button during async operations
- `error-feedback` — Clear error messages near the problem
- `cursor-pointer` — Add cursor-pointer to all clickable elements

### 3. Performance (HIGH)
- `image-optimization` — Use WebP, srcset, lazy loading
- `reduced-motion` — Always check prefers-reduced-motion
- `content-jumping` — Reserve space for async content to prevent CLS

### 4. Layout & Responsive (HIGH)
- `viewport-meta` — width=device-width, initial-scale=1
- `readable-font-size` — Minimum 16px body text on mobile
- `horizontal-scroll` — Ensure content fits viewport width
- `z-index-management` — Define z-index scale: 10, 20, 30, 50

### 5. Typography & Color (MEDIUM)
- `line-height` — Use 1.5–1.75 for body text
- `line-length` — Limit to 65–75 characters per line
- `font-pairing` — Match heading/body font personalities

### 6. Animation (MEDIUM)
- `duration-timing` — Use 150–300ms for micro-interactions
- `transform-performance` — Animate transform/opacity only, not width/height
- `loading-states` — Skeleton screens or spinners for async

### 7. Style Selection (MEDIUM)
- `style-match` — Match style to product type and industry
- `consistency` — Use same style system across all pages
- `no-emoji-icons` — Use SVG icons (Heroicons, Lucide), never emoji as UI icons

### 8. Charts & Data (LOW)
- `chart-type` — Match chart type to data relationship
- `color-guidance` — Use accessible color palettes for data viz
- `data-table` — Provide table alternative for screen reader accessibility

---

## Workflow — Apply on Every UI Task

### Step 1: Analyze Requirements
Extract from the user's request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page
- **Style keywords**: minimal, playful, professional, elegant, dark mode
- **Industry**: healthcare, fintech, gaming, education, fitness
- **Stack**: React, Vue, Next.js — default to `html-tailwind` if unspecified

### Step 2: Design System Decisions (REQUIRED)
Always define these before writing any code:

**Pattern**: What layout/interaction pattern fits this product?
**Style**: What visual style fits (glassmorphism, flat, minimal, etc.)?
**Colors**: Primary, surface, text, accent — with contrast ratios confirmed
**Typography**: Heading font + body font pairing with weights and sizes
**Effects**: Shadows, borders, blurs, motion

Domains to consider: product → style → color → typography → landing → ux

### Step 3: Supplement with Specific Rules
Based on what you're building:

| Need | Domain | Apply When |
|---|---|---|
| Style direction | `style` | Visual treatment unclear |
| Chart recommendations | `chart` | Data visualisation involved |
| UX best practices | `ux` | Animation, accessibility, forms |
| Alternative fonts | `typography` | More pairing options needed |
| Landing page structure | `landing` | Hero, social-proof, CTA layout |

### Step 4: Stack Guidelines
Apply stack-specific best practices:

| Stack | Key Focus |
|---|---|
| `html-tailwind` | Tailwind utilities, responsive, a11y (DEFAULT) |
| `react` | State, hooks, performance patterns |
| `nextjs` | SSR, routing, images, API routes |
| `vue` | Composition API, Pinia, Vue Router |
| `svelte` | Runes, stores, SvelteKit |
| `shadcn` | shadcn/ui components, theming, forms |
| `react-native` | Components, Navigation, Lists |
| `flutter` | Widgets, State, Layout, Theming |

---

## Common Professional UI Rules

### Icons & Visual Elements
| Rule | Do | Don't |
|---|---|---|
| No emoji icons | Use SVG (Heroicons, Lucide, Simple Icons) | Use 🎨 🚀 ⚙️ as UI icons |
| Stable hover states | Color/opacity transitions | Scale transforms that shift layout |
| Correct brand logos | Official SVG from Simple Icons | Guess or approximate logo paths |
| Consistent icon sizing | Fixed viewBox (24×24) with w-6 h-6 | Mix different icon sizes |

### Interaction & Cursor
| Rule | Do | Don't |
|---|---|---|
| Cursor pointer | `cursor-pointer` on all clickable elements | Leave default cursor on cards |
| Hover feedback | Color, shadow, or border change | No visual indication of interactivity |
| Smooth transitions | `transition-colors duration-200` | Instant changes or >500ms delays |

### Light/Dark Mode Contrast
| Rule | Do | Don't |
|---|---|---|
| Glass card (light) | `bg-white/80` or higher opacity | `bg-white/10` (invisible) |
| Text (light mode) | `#0F172A` (slate-900) for body | `#94A3B8` (slate-400) for body |
| Muted text (light) | `#475569` (slate-600) minimum | gray-400 or lighter |
| Border visibility | `border-gray-200` in light mode | `border-white/10` (invisible) |

### Layout & Spacing
| Rule | Do | Don't |
|---|---|---|
| Floating navbar | `top-4 left-4 right-4` spacing | Stick to `top-0 left-0 right-0` |
| Content padding | Account for fixed navbar height | Let content hide behind nav |
| Container width | Consistent `max-w-6xl` or `max-w-7xl` | Mix different container widths |

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

### Visual Quality
- [ ] No emojis used as icons — all SVG
- [ ] Icons from one consistent set (Heroicons or Lucide)
- [ ] Brand logos verified from Simple Icons
- [ ] Hover states do not cause layout shift
- [ ] Theme colors used directly (bg-primary, not var() wrappers)

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback
- [ ] Transitions are smooth (150–300ms)
- [ ] Focus states visible for keyboard navigation

### Light/Dark Mode
- [ ] Light mode text contrast meets 4.5:1 minimum
- [ ] Glass/transparent elements visible in light mode
- [ ] Borders visible in both modes

### Layout
- [ ] Floating elements have proper spacing from edges
- [ ] No content hidden behind fixed navbars
- [ ] Responsive tested at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Color is not the only information conveyor
- [ ] `prefers-reduced-motion` respected in all animations

---

## Fitosys-Specific Design Tokens (Override Layer)

When building anything for the Fitosys project, apply these tokens on top of
general UI/UX recommendations. These override generic suggestions.

```css
--red:     #F20000   /* Primary accent — use sparingly, max 2-3 elements/section */
--black:   #0A0A0A   /* Page background */
--surface: #111111   /* Cards, panels */
--card:    #141414   /* Elevated cards */
--border:  #222222   /* All borders */
--white:   #FFFFFF   /* Primary text */
--grey:    #A0A0A0   /* Secondary text — minimum contrast level */
--dim:     #555555   /* Disabled, ghost */
--wa:      #25D366   /* WhatsApp elements only */

/* Fonts */
--font-display: 'Barlow Condensed'  /* Headlines only. Max weight 500. Always uppercase. */
--font-body:    'Urbanist'          /* All body, labels, buttons, forms */
--font-serif:   'Instrument Serif'  /* Quotes and mission text only */
```

**Fitosys layout rules:**
- Every section: `min-height: 100vh`
- Section padding: `clamp(80px, 10vw, 140px)` top/bottom
- Body copy max-width: 560px
- Max content width: 1280px
- Three breakpoints only: 1025px+, 769–1024px, 768px-
- Hide complex visual elements (phone mockups, floats) below 1024px

**Fitosys animation rules (GSAP):**
- Library: GSAP + ScrollTrigger only. No mixing.
- Entrance easing: `power3.out`
- Transition easing: `power2.inOut`
- Loop easing: `sine.inOut`
- Max duration: 1.2s. Stagger: 0.08s–0.15s.
- Max 3 scroll-triggered animations per section.
- All scroll animations wrapped in `gsap.matchMedia()` for reduced-motion.

---

## Source
Adapted from ui-ux-pro-max by nextlevelbuilder
https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max
GitHub: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
