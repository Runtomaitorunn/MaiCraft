---
target: homepage hero
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-07-15T07-28-36Z
slug: index-html-hero
---
# Homepage hero critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2/4 | No video loading or failure state; no current-section feedback. |
| 2 | Match system / real world | 3/4 | Labels are familiar, but XR and the stacked role list need context for non-specialists. |
| 3 | User control and freedom | 2/4 | Navigation exits are clear, but the autoplay loop has no pause and reduced motion does not stop it. |
| 4 | Consistency and standards | 4/4 | The cold-paper palette, typography, navigation, and scroll cue feel cohesive. |
| 5 | Error prevention | 2/4 | The fallback remains hidden whenever `src` exists, including playback failure. |
| 6 | Recognition rather than recall | 3/4 | Navigation is visible; the scroll cue's explanatory text is visually hidden. |
| 7 | Flexibility and efficiency | 2/4 | Anchor navigation works, but there is no motion control or alternate media path. |
| 8 | Aesthetic and minimalist design | 3/4 | Focused and distinctive, but there is no single action hierarchy. |
| 9 | Error recovery | 1/4 | Video failure has no explanation or recovery path. |
| 10 | Help and documentation | 2/4 | The hero is simple, but the first-time next step is an unlabeled-looking animated mark. |
| **Total** |  | **24/40** | **Acceptable** |

## Anti-patterns verdict

The hero passes the AI-slop test with a trope warning. The custom illustrated reel, cold-paper palette, oversized lowercase name, and bespoke scroll cue feel authored. The remaining structure, a name over full-bleed video, slash-separated roles, and four equal header links, is familiar portfolio grammar. The custom art saves it; the message does not yet.

The detector returned two warnings at `index.html:13`: `overused-font` for Montserrat and `single-font`. `single-font` is a false positive because linked CSS assigns separate display and body stacks. `overused-font` remains relevant because no `@font-face` loads NeueMachina or NeueRoman, making Montserrat a real runtime fallback for the hero title.

No reliable browser overlay was produced. Mutable script injection is unavailable in the selected browser, so only screenshots, computed geometry, console checks, source inspection, reel-frame inspection, and CLI detector output were used.

## Overall impression

The hero has real personality and a memorable visual world. Its biggest weakness is category clarity: the reel reads as one illustrated animation project while the copy promises XR development, web development, and creative technology. The visual peak is stronger than the professional takeaway.

## What's working

1. Real authored media rejects stock-tech and AI-SaaS aesthetics.
2. The oversized lowercase name and cold-paper palette create a recognizable identity.
3. The sparse information architecture keeps cognitive load low and the scroll target is touch-friendly.

## Cognitive load

Low overall, with one checklist failure: minimal choices/action hierarchy. Brand, four equal navigation links, and the scroll cue create six first-fold paths without one explicit priority. This is under-direction, not clutter. There is no memory bridge.

## Emotional journey

The opening visual creates curiosity and warmth. Confidence dips when the animation implies a narrower practice than the role list. The scroll cue maintains momentum, but the fold ends with a generic invitation to continue rather than a strong promise such as viewing selected work.

## Priority issues

### [P1] The hero proves the wrong thing

The reel reads primarily as a single illustrated film while the kicker claims XR, web, and creative technology. A hiring visitor may classify Ye as an animator before reaching the projects.

Fix: either cut a short three-part reel showing spatial interaction, web/system UI, and visual storytelling, or treat this as an authorship statement and rewrite the positioning to explain what it demonstrates.

Suggested command: `/impeccable shape homepage hero positioning`.

### [P1] Text contrast changes with the reel

Deep-ink text sits directly on moving imagery and the contrast veil is commented out. The sampled desktop frame is readable, but reel frames vary from orange/yellow to navy and black, and moving lines visibly cross the title.

Fix: reserve protected negative space in every shot or add localized, brand-colored contrast treatment behind the header and lower copy. Validate representative frames rather than one screenshot.

Suggested command: `/impeccable audit homepage hero contrast`.

### [P1] Autoplay motion has no pause or robust fallback

The 9.2-second loop has no pause control. Reduced-motion CSS changes the scroll cue but does not stop the video. The fallback is hidden whenever the video has a `src`, even on load or codec failure.

Fix: add pause/play, use a poster beneath the video, honor reduced motion by showing the poster or disabling autoplay, and toggle fallback on error or rejected playback.

Suggested command: `/impeccable harden homepage hero media`.

### [P2] The mobile composition is not art-directed

At 390 x 844 the header grows to about 119px, Contact wraps to a second row, the role line wraps, and the landscape reel becomes a narrow central slice. The screenshot shows mostly abstract orange and purple forms rather than a deliberate scene.

Fix: export a 9:16 cut or define shot-tested mobile positioning, reduce the mobile video scale, and restructure the header so navigation does not wrap over moving imagery.

Suggested command: `/impeccable adapt homepage hero`.

### [P2] The primary portfolio action is implicit

Projects is one of four equal links and the visible scroll cue has no text label. Employers can admire the hero without knowing the intended next step.

Fix: turn the lower affordance into a visible `View selected projects` action or deliberately emphasize Projects in the header without making the page feel corporate.

Suggested command: `/impeccable clarify homepage hero CTA`.

## Persona red flags

- **Jordan, first-time visitor:** XR is unexplained, the role list reads like keywords, and the animated scroll mark does not clearly describe the next action.
- **Riley, stress tester:** blocked video playback leaves the fallback hidden; reduced motion still plays the loop; the Chinese locale still exposes placeholder hero copy.
- **Casey, mobile visitor:** the landscape reel loses most of its composition, navigation wraps at the top, and the autoplay asset loads before the user chooses to watch.
- **Morgan, creative-tech hiring lead:** has seconds to judge technical depth and commercial range. The hero shows authorship and energy but little technical proof, outcome, client context, or multi-medium range.

## Minor observations

- The `aria-label` is placed on a plain media `div`; either make the reel decorative or label the actual video semantics.
- The header hides after any downward scroll delta, which may feel evasive during small touch movements.
- The 5fps reel can read as intentional limited animation, but it may also be interpreted as poor playback.
- The English hero is polished; the Chinese hero remains placeholder content.
- No console errors or warnings appeared in the desktop or mobile captures.

## Questions to consider

1. If a hiring lead watches only eight seconds muted, should they remember Ye Mai, an XR/web builder, or the single animated film? The current answer is the film.
2. Is this a reel of range or an authorship statement? Trying to imply both makes the proof and positioning disagree.
3. What is the one action this hero should earn: view selected work, understand the practice, or make contact?
