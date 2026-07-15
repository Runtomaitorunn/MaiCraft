---
target: "http://127.0.0.1:5501/projects/midnight-at-the-pagoda.html"
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-07-15T08-48-52Z
slug: projects-midnight-at-the-pagoda-html
---
# Midnight at the Pagoda: Design Critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2/4 | No chapter or reading-position cue on a long page. |
| 2 | Match System / Real World | 3/4 | Story order is natural; research evidence remains abstract. |
| 3 | User Control and Freedom | 3/4 | Back and media-close paths exist; the ending has no next action. |
| 4 | Consistency and Standards | 4/4 | Rules, captions, spacing, and interaction treatment are cohesive. |
| 5 | Error Prevention | 3/4 | Few error paths; media affordances are explicit. |
| 6 | Recognition Rather Than Recall | 3/4 | Strong headings and mappings, but no persistent chapter structure. |
| 7 | Flexibility and Efficiency | 2/4 | No accelerated skim path for time-poor evaluators. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Focused, with some redundant media and repeated chapter grammar. |
| 9 | Error Recovery | 3/4 | Back and dialog close work; the static page has limited recovery needs. |
| 10 | Help and Documentation | 2/4 | HCI method, study scale, and evidence provenance are not explained. |
| **Total** |  | **28/40** | **Good** |

## Anti-Patterns Verdict

**LLM assessment:** This does not look generically AI-made. The stepped ascent composition, Unity route evidence, candid hackathon photography, and cold-paper visual identity feel authored. The residual template signal is the repeated giant uppercase heading plus ruled editorial grouping across every chapter; it is coherent, but the evidence and process chapters could receive more project-specific art direction.

**Deterministic scan:** Two warnings were reported in `projects/midnight-at-the-pagoda.html:12`.

- `overused-font`: materially valid. CSS names NeueMachina and NeueRoman first, but the repository does not load those faces, so the live page falls back to Montserrat and Work Sans.
- `single-font`: false positive. The page has distinct display and body stacks; the detector only interpreted the Google Fonts declaration incompletely.

**Browser evidence:** Twelve visible media assets loaded without broken sources, visible project media has alt text, the 1280 px desktop view has no horizontal overflow, and story text contrast ranges from approximately 5.47:1 to 6.63:1 against the cold-paper gradient. Mutable browser injection was unavailable, so no reliable user-visible overlay exists for this run.

## Overall Impression

The new layout succeeds as a spatial-design case study. It has a real idea, a memorable middle, and a disciplined visual system. Its largest weakness is evidence hierarchy: it currently proves that Ye can conceive, build, and present a spatial narrative more convincingly than it proves the page's HCI research and award claims.

## Cognitive Load

Low to moderate. Five chapters, clear headings, and one dominant idea per fold create useful chunking. No decision point exceeds four visible options. The main burden is orientation: a time-poor evaluator must remember the chapter structure across roughly fifteen desktop folds, with no contents or progress cue.

## Emotional Journey

The ascent diagram is the main peak because it converts the concept into a visual mechanism. Hackathon photography provides a second, human peak. The route screenshots form a useful but visually low-fidelity valley. The final evidence section gains trust through its honest limitations, but the page ends emotionally flat because it offers no next project, contact action, or future-facing statement.

## What's Working

- **The climb is a signature composition.** Its stepped geometry makes the narrative interface understandable in seconds and gives the page a project-specific visual memory.
- **The interaction mapping is genuinely useful.** Action, system response, and narrative meaning distinguish implementation from decoration.
- **The limitations increase credibility.** “Still to validate” avoids overstating early qualitative evidence and reads as research maturity rather than weakness.

## Priority Issues

### [P1] The evidence hierarchy is weaker than the claims

**Why it matters:** The masthead promises an HCI research thesis and lists an award plus a 77/100 result. The page shows no research setup, method, participant or reviewer context, finding artifact, certificate, grade excerpt, or thesis spread. Employers can trust the making process, but mentors and research partners cannot assess the research contribution.

**Fix:** Replace part of the process-gallery length with one compact “Research evidence” composition: research question, method and scale, one observable finding, and a pictured source artifact. Pair the award and course result with documentary proof rather than another bullet.

**Suggested command:** `/impeccable shape`

### [P1] The portfolio journey ends without a next action

**Why it matters:** After a substantial read, a convinced evaluator reaches a role statement and then nothing. The page does not convert attention into continued exploration or contact.

**Fix:** Add a restrained end module with one next project and one explicit contact action. Keep the role statement as the bridge into it.

**Suggested command:** `/impeccable polish`

### [P2] The intended brand fonts are not actually loaded

**Why it matters:** DESIGN.md defines NeueMachina and NeueRoman as part of the “Cold Paper Studio” identity, but the live implementation falls back to common Google fonts. The page is visually competent, yet less ownable than the documented system promises.

**Fix:** Load licensed font files through `@font-face`, or formally choose and document a more distinctive available pair. Remove unused Roboto if it remains outside the system.

**Suggested command:** `/impeccable typeset`

### [P2] Heading motion temporarily damages readability

**Why it matters:** Headings begin at opacity zero and translate 112% over 980 ms. During fast scrolling, multi-line chapter and step titles visibly appear clipped and overlap the following copy before settling. If the observer fails, critical headings remain hidden.

**Fix:** Make headings visible by default, shorten the reveal, and animate a mask or subtle transform that never places text over adjacent content. Preserve the instant reduced-motion state.

**Suggested command:** `/impeccable animate`

### [P2] Two media moments have weak evidence provenance

**Why it matters:** The visual-break caption describes a proposal, but the image reads as a museum exhibition photograph. Three hackathon photos then occupy more space than the research evidence itself. This confuses what is source material, design proposal, and proof.

**Fix:** Correct the visual-break caption or replace the image with the actual proposal. Keep the two strongest event photographs and give the recovered space to research or award evidence.

**Suggested command:** `/impeccable layout`

## Persona Red Flags

**Jordan, first-time evaluator:** The problem, climb, and interaction logic are understandable without specialist knowledge. Jordan may still interpret “research thesis” as an unverified label because the method and finding never become visible objects.

**Casey, distracted mobile user:** The responsive stacking is readable, but a long case study with no chapter shortcuts is difficult to resume after interruption. Three process images delay the final proof and next decision.

**Hiring manager or research mentor:** The role and multidisciplinary range are clear. The strongest claims are not inspectable, and the page gives no direct continuation into another project or a conversation.

## Minor Observations

- The three process photographs are credible; the first two already communicate teamwork and presentation.
- The evidence table is honest and highly scannable, but the bullets currently carry more weight than the underlying artifacts.
- The page avoids generic card grids, dark-tech styling, gradient text, glass effects, and SaaS language.
- No broken visible images, missing visible alt text, or desktop horizontal overflow were detected.

## Questions to Consider

- Is the primary promise “I can design and build spatial narratives” or “I can conduct HCI research”? The current page names both but visually proves the first.
- Which single artifact best proves the research: a method diagram, participant setup, results table, or thesis spread?
- Should the ending leave evaluators with humility about limitations, or confidence about what Ye can contribute next?
