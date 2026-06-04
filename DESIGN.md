---
name: "Ye Mai Portfolio"
description: "A fresh, bold portfolio for creative technology, immersive media, and technical work."
colors:
  midnight-bg: "#060606"
  panel: "#101015"
  panel-soft: "#161620"
  text: "#f5f4fa"
  muted: "#aeb4c3"
  ghost: "#a5b7bc5e"
  lavender-accent: "#acb9ff"
  violet-strong: "#6136d8"
  violet-deep: "#482d9b"
  card-hover: "#e7e6ff3d"
  overlay: "#00000085"
typography:
  display:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(4rem, 13vw, 10rem)"
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: "0"
  headline:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(1.7rem, 4vw, 3rem)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "0"
  title:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "0"
  body:
    fontFamily: "Work Sans, Montserrat, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Montserrat, sans-serif"
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
    backgroundColor: "{colors.violet-deep}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "52px"
  contact-link-hover:
    backgroundColor: "{colors.violet-strong}"
    textColor: "{colors.text}"
  skill-capsule:
    backgroundColor: "#acb9ff1c"
    textColor: "#dfe4ff"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  project-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
---

# Design System: Ye Mai Portfolio

## 1. Overview

**Creative North Star: "Electric Studio Reel"**

The system should feel like a young creative technologist's working studio: dark, cinematic, energetic, and precise. It uses a black stage, lavender-violet technical light, oversized lowercase identity type, video-first composition, and motion details to make creative output feel immediate.

The design rejects corporate portfolio polish, generic SaaS structure, and interchangeable template sections. It should make Ye Mai feel commercially valuable and technically credible while keeping a positive, fresh, human presence.

**Key Characteristics:**
- Dark full-bleed media surfaces with clear text hierarchy.
- Violet and lavender accents used as technical energy, not decoration everywhere.
- Large expressive type balanced by restrained body copy.
- Minimal chrome, visible media, and direct contact paths.
- Motion that feels alive while respecting reduced-motion preferences.

## 2. Colors

The palette is a midnight stage with lavender technical light and deep violet action color.

### Primary
- **Lavender Signal** (#acb9ff): Used for section labels, metadata, skill icons, and technical emphasis. Keep it rare enough to feel intentional.
- **Deep Violet Action** (#482d9b): Used for contact link buttons and decisive interactive surfaces.
- **Strong Violet Hover** (#6136d8): Used when actions respond to pointer interaction.

### Neutral
- **Black Stage** (#060606): Body background and hero base. It should feel cinematic, not corporate-dark.
- **Studio Panel** (#101015): Project cards and media placeholders.
- **Soft Panel** (#161620): Thumbnail wells and secondary surfaces.
- **Bright Ink** (#f5f4fa): Primary readable text.
- **Cool Muted Ink** (#aeb4c3): Supporting copy where contrast remains acceptable.
- **Ghost Ink** (#a5b7bc5e): Oversized background words and ambient labels only.
- **Media Overlay** (#00000085): Hover overlays that reveal depth without hiding content permanently.

### Named Rules

**The Signal Rarity Rule.** Lavender and violet should guide attention to identity, metadata, tools, and actions. Do not wash the whole page in purple.

**The Black Stage Rule.** Keep the dark base clean and sharp. Avoid muddy blue-black gradients, glass cards, and generic sci-fi fog.

## 3. Typography

**Display Font:** Montserrat with sans-serif fallback  
**Body Font:** Work Sans with Montserrat and Arial fallback  
**Supporting Font:** Roboto for compact metadata and tool capsules

**Character:** The pairing is clean, young, and technical. Montserrat carries identity and section structure; Work Sans keeps reading approachable and professional; Roboto adds compact engineering clarity inside metadata.

### Hierarchy
- **Display** (600, `clamp(4rem, 13vw, 10rem)`, 0.88): Hero identity only. Keep lowercase as a brand gesture.
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

Fixed on desktop with a transparent-to-dark gradient so the navigation stays legible over hero media. The brand is lowercase and compact. Navigation is light, muted, and direct.

### Hero

The hero is a full-bleed media stage with video as the preferred asset and a styled placeholder as fallback. Hero copy sits over the media, not inside a card. The title is the first-viewport identity signal.

### Skill Cards

Skill cards are intentionally sparse: icon monogram, title, short capability statement, and tool capsules. Hover should add energy through subtle background and vertical motion without turning the section into a generic feature grid.

### Tool Capsules

Capsules are pill-shaped, compact, and technical. They should help recruiters and collaborators scan credible tools quickly. Keep wrapping clean on mobile.

### Project Cards

Project cards are media-first with rectangular corners, dark panels, concise metadata, and controlled hover lift. Featured projects use wider media proportions. Real project imagery should replace placeholders whenever available.

### Contact Links

Contact links are pill actions with deep violet fills. Labels should be short and explicit, such as Email, GitHub, LinkedIn, or Portfolio PDF.

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
- Do not use lavender/violet so heavily that every surface has the same emotional temperature.
- Do not let Chinese placeholder content or long bilingual strings break layout when localized content is completed.
