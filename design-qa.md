# Project video dialog design QA

- Source visual truth path: unavailable; no target mock, screenshot, or Figma frame was supplied.
- Baseline implementation evidence: browser capture in the active Codex task at 1280 x 720, Habibi dialog open.
- Revised implementation screenshot path: unavailable; the post-change browser capture was blocked when the embedded YouTube URL triggered browser security policy.
- Viewport: 1280 x 720.
- State: Habibi project video dialog open.

## Full-view comparison evidence

The baseline capture showed a 1120 x 662 dialog with a 76px footer. The 16:9 player plus footer exceeded the dialog's maximum height, clipping the title and `View project` control below the viewport. The backdrop, blur, dark filled controls, and focus treatment also competed with the video.

The implementation was revised to cap the dialog at 960px, derive its width from viewport height, reduce backdrop opacity and blur, use a compact 58px information bar, replace the filled project pill with a text link, and soften the close control and elevation.

## Focused region comparison evidence

The baseline footer and close-control regions were inspected in the full-view capture. A post-change focused capture could not be produced because the embedded YouTube request was blocked by browser security policy.

## Findings

- [Resolved P1] Footer content was clipped at a 1280 x 720 viewport.
- [Resolved P2] The backdrop and controls carried more visual weight than the video.
- [Blocked P2] The revised rendered state could not be visually verified against a source target.

## Comparison history

1. Baseline: oversized frame, clipped footer, heavy overlay and filled controls.
2. Fixes: height-aware width cap, lighter overlay, compact footer, lighter link and close treatments, restrained entry motion.
3. Post-fix evidence: blocked by browser security policy when loading the YouTube embed.

## Primary interactions tested

Before the visual refinement, both project cards opened the correct YouTube embeds; `View project` used the correct destination; closing removed the iframe source and stopped playback; no console errors were present.

## Final result

final result: blocked

Blocker: Design QA requires a separate source visual target and a browser-rendered post-change screenshot. No target was supplied, and the post-change YouTube embed capture was blocked by browser security policy.
