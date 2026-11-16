---
name: "Ye Mai Portfolio"
description: "A fresh, bold portfolio for creative technology, immersive media, and technical work."
colors:
  noomo-paper: "#c9d2e7"
  noomo-paper-light: "#dee7f1"
  noomo-paper-menu: "#dbe0ef"
  noomo-ink: "#181520"
  noomo-ink-soft: "#231b35"
  noomo-muted: "#6d6d76"
  noomo-line: "#18152033"
  noomo-card: "#ffffff29"
  noomo-card-hover: "#ffffff47"
  noomo-overlay: "#1815203d"
typography:
  display:
    fontFamily: "Montserrat Hero, Arial, sans-serif"
    fontSize: "clamp(4rem, 13vw, 10rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0"
  headline:
    fontFamily: "NeueMachina, Montserrat, Arial, sans-serif"
    fontSize: "clamp(1.7rem, 4vw, 3rem)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "0"
  title:
    fontFamily: "NeueMachina, Montserrat, Arial, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "0"
  body:
    fontFamily: "NeueRoman, Work Sans, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "NeueRoman, Work Sans, Arial, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0"
rounded:
  none: "0"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "22px"
  lg: "34px"
  section: "110px"
components:
  contact-link:
    backgroundColor: "{colors.noomo-ink-soft}"
    textColor: "{colors.noomo-paper-light}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "52px"
  contact-link-hover:
    backgroundColor: "{colors.noomo-ink}"
    textColor: "{colors.noomo-paper-light}"
  skill-capsule:
    backgroundColor: "#ffffff2e"
    textColor: "{colors.noomo-ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  project-card:
    backgroundColor: "{colors.noomo-card}"
    textColor: "{colors.noomo-ink}"
    rounded: "6px"
---

# Design System: Ye Mai Portfolio

## 1. Overview

**Creative North Star: "Cold Paper Studio"**

The system should feel like a young creative technologist's editorial studio: calm, strange, technical, and media-forward. It uses Noomo-inspired cold paper surfaces, deep ink text, oversized identity type, video-first composition, and motion details to make creative output feel immediate.

The design rejects corporate portfolio polish, generic SaaS structure, and interchangeable template sections. It should make Ye Mai feel commercially valuable and technically credible while keeping a positive, fresh, human presence.

**Key Characteristics:**
- Cold mist-blue surfaces with deep ink hierarchy.
- Thin dark rules, pale translucent panels, and restrained ink-filled actions.
- Large expressive type balanced by restrained body copy.
- Minimal chrome, visible media, and direct contact paths.
- Motion that feels alive while respecting reduced-motion preferences.

## 2. Colors

The whole site uses a Noomo-inspired cold paper palette: mist blue surfaces (#c9d2e7, #dee7f1, #dbe0ef), deep ink text (#181520, #231b35), muted supporting copy (#6d6d76), and thin dark rules. Project media, hero video, and image content provide the emotional color.

### Primary
- **Cold Paper** (#c9d2e7): Body background and main surface.
- **Light Paper** (#dee7f1): Soft section gradients and hero veil.
- **Menu Paper** (#dbe0ef): Header, media wells, and pale UI surfaces.
- **Deep Ink** (#181520): Primary text and strongest action hover.
- **Soft Ink** (#231b35): Labels, metadata, and filled contact actions.
- **Muted Ink** (#6d6d76): Supporting copy.

### Named Rules

**The Ink Discipline Rule.** Use deep ink for hierarchy, action, and active states. Avoid adding extra accent colors unless they come from real project media.

**The Cold Paper Rule.** All sections live in the mist-blue paper palette. Do not reintroduce a dark section unless a specific project page needs a media-led exception.

## 3. Typography

**Display Font:** NeueMachina with Montserrat and Arial fallback  
**Hero Identity Font:** Locally hosted Montserrat (`Montserrat Hero`), weight 700, preloaded on the homepage.

**Body Font:** NeueRoman with Work Sans and Arial fallback  
**Supporting Font:** NeueRoman for metadata and capsules

**Character:** The pairing mirrors the Noomo reference while keeping the static site dependency-light. Neue-style display type gives sections an editorial agency feeling; the body fallback remains readable and practical.

### Hierarchy
- **Display** (700, `clamp(4rem, 13vw, 10rem)`, 1): Hero identity only. Keep lowercase as a brand gesture; retain the existing mobile size and line-height overrides.
- **Headline** (300, `clamp(1.7rem, 4vw, 3rem)`, 1.08): Section statements and artist positioning.
- **Title** (300 to 600, `1.15rem` to `1.45rem`): Skill and project titles.
- **Body** (400, `16px`, 1.6): Artist copy, summaries, and project descriptions. Keep paragraph lines comfortably scannable.
- **Label** (600, `0.78rem`, uppercase allowed): Kicker, section eyebrow, and metadata. Use sparingly, not above every possible block.

### Named Rules

**Lowercase With Intent.** Lowercase works for the hero and ambient identity moments. Do not force all interface labels into lowercase when clarity suffers.

## 4. Elevation

The current system is mostly flat and tonal. Depth comes from media layering, opacity, hover translation, overlays, and stacked image proportions rather than box shadows.

Use elevation as movement, not decoration:
- Cards may lift by `translateY(-4px)` on hover.
- Media overlays may fade in to imply interactivity.
- Layered portrait/process blocks may overlap to show creative process.
- Avoid generic floating cards and heavy drop shadows.

## 5. Components

### Header

Fixed on desktop with a transparent cold-paper gradient so the navigation stays legible over hero media. Hover changes link color only; keyboard focus and active scroll state move the sliding indicator.

### Hero

The hero is a full-bleed media stage with video as the preferred asset and a styled placeholder as fallback. Hero copy sits over the media, not inside a card. The title is the first-viewport identity signal.

The identity title uses a dedicated local Montserrat font face and stays visually hidden, with its layout space reserved, until that face loads. If loading fails, reveal it with a fixed system fallback so there is no later font swap. Keep this readiness behavior free of scale or size animations. Chinese characters use the system's Han glyph fallback.

### Skill Cards

Skill cards are intentionally sparse content groups with no default box fill: icon monogram, title, and grouped tool capsules sit directly on the cold paper surface. Avoid paragraph body copy inside the cards; the tool taxonomy should carry the technical proof. Hover should use the same box-shadow implementation as project cards on the skill card itself, while the pseudo-element only renders the top lamp; avoid visible card rectangles, rules, or shifting titles.

### Artist Disclosure

The artist introduction is a single expandable chapter. Its closed state keeps the hello ghost, eyebrow, artist heading, and a quiet `More →` control visible. Only the More control triggers the disclosure; the heading remains non-interactive. The open state reveals the biography, Skills, Education, Industry, and future artist-context sections in one continuous flow. Use the native details/summary semantics, preserve a clear focus ring, and automatically open the chapter when a navigation link targets content inside it.

### Resume Rows

Education and Industry share one data-driven resume-row pattern: a compact institution mark or logo at left, then the institution as the primary line with degree or role and dates beneath it. Keep rows borderless and separated by whitespace rather than card containers. Institution links may use a restrained underline. Placeholder content must remain visibly provisional and must not imply unverified credentials.

### Tool Capsules

Capsules are pill-shaped, compact, and technical. They should help recruiters and collaborators scan credible tools quickly. Keep wrapping clean on mobile.

### Project Cards

Project cards are borderless, media-first cold-paper objects with 6px corners, deep ink typography, concise uppercase metadata, and controlled hover motion. Homepage work is grouped into XR Projects and Playground, with card summaries limited to one short line. Hover should animate the media, a cool mist-blue top light, and a restrained blue-gray elevation shadow while keeping text position stable; real project imagery should remain the strongest visual signal.

### Project Detail Facts

Project detail pages may use a lightweight facts column under the masthead title for Client, Deliverables, Involvement, Results, or similar case-study metadata. Keep it typographic and rule-based, not card-like. Labels use title case and muted color; values stay regular weight. Multi-item values render as quiet line lists, not comma piles.

### Embedded Project Videos

YouTube media uses the official iframe player within the existing media slots. Keep it borderless, full width, normally 16:9, and at least 200px tall so controls remain usable on narrow screens. Preserve the native playback and fullscreen controls; start playback on user action. The homepage uses a thumbnail for a YouTube cover, while detail pages show the player. Embedded videos must not be placed inside the image zoom button.

The Pagoda trailer after Overview and walkthrough after Gallery share the same official YouTube player, centered 1000px maximum width, and unpadded, centered caption. Both shrink to fit narrower screens. Keep YouTube's own preview overlay and controls.

### Project Documents

Document lists follow a publication-style vertical layout: a section title, then indented entries with a small document type, title, optional author line, and PDF icon. Keep the paper surface open, with no cards or borders. Empty PDF destinations show a non-interactive icon and “PDF to be added”; only supplied file paths or URLs become links. On Pagoda, the walkthrough and two document entries replace all former content after Gallery.

### Project Story Text

On the Pagoda page, the story shell and its section list share the Overview's 1280px maximum width so their labels align on the same left edge. Labeled story blocks also share Overview's 22% / 78% column proportions and responsive column gap on desktop. Paragraphs keep their own reading measure inside this shared width.

Labeled story blocks place the small label at left and content at right on desktop, then stack on narrow screens. Blocks containing only paragraphs, with no label or heading, use one centered reading column with a 70ch maximum measure and left-aligned text. Keep the empty label column out of these paragraph blocks.

A labeled block can include a small reference image below its left-hand label. Keep its original proportions, with no frame or crop, and let the related paragraphs run together in the right column. Supporting steps and media span both columns below.

Story image galleries sit directly below the related paragraphs and span the story width. The Gallery heading uses the same body font, 0.78rem size, 600 weight, and uppercase treatment as the story kicker. Use four columns on desktop, two on tablet, and one on mobile by default. Center each complete image inside a 4:3 slot; keep the surrounding surface transparent and omit frames and visible captions. Reuse the image enlargement control and keyboard focus style.

The Pagoda gallery uses three separate groups: three storyboards across the first desktop row, followed by five interior images and five event photographs in two left-aligned flex rows. Flex images fill the 240px row height and keep their original proportions. The right chevron moves by the width of the rightmost visible image; the left chevron uses the leftmost visible image, including partially visible images. Movement uses time-based lerp deceleration, with an immediate change for reduced motion. There is no visible scrollbar; disable the corresponding button at either end. Place arrows in the outer gutter on wide screens and over the row edges when space is tight. Keep the 16px horizontal gap and preserve the author's original GIF files. Grid groups wrap on smaller screens.

On desktop the first row's image slots are 240px tall, with storyboard images aligned to the top. The flex row also displays images at 240px high.

Expanded media uses an image-sized, transparent dialog with no border or padding. Keep the image at its natural size, shrinking only to fit the viewport. Place the close button above the image so it does not cover the content. GIFs retain their original animation and are not forcibly enlarged.

### Contact Links

Contact links are pill actions with deep ink fills. Labels should be short and explicit, such as Email, GitHub, LinkedIn, Itch.io, or Portfolio PDF.

## 6. Do's and Don'ts

**Do:**
- Lead with actual media and project proof wherever possible.
- Keep technical capability visible through tools, process, and project framing.
- Use motion to support a fresh, positive, alive feeling.
- Maintain strong contrast and responsive text sizing on every viewport.
- Make the site feel personal, confident, and commercially useful.

**Don't:**
- Do not make it feel like a corporate homepage or SaaS template.
- Do not overuse identical card grids, decorative glass, gradient text, or stock-tech aesthetics.
- Do not bury the person behind generic visual polish.
- Do not add unrelated accent colors that fight the cold paper palette.
- Do not let Chinese placeholder content or long bilingual strings break layout when localized content is completed.
