# Project Authoring

Use `templates/projects/case-study-product-rnd.json` when adding a product or applied R&D case study: a real problem, a design or technical strategy, implementation evidence, and field or pilot impact.

## Authoring Interface

New projects should use these fields:

- `coverMedia`: the homepage thumbnail and detail hero media.
- `projectFacts`: the small case-study facts under the masthead title, such as Client, Deliverables, Involvement, and Results. Use an array value when a fact should break into multiple short lines.
- `overview`: the first text section, with `heading`, `body`, and optional `points` for short scannable proof statements. Use `{ "label": "...", "body": "..." }` points when the section needs a cleaner visual hierarchy.
- `visualBreakMedia`: the large walkthrough/demo slot after the overview.
- `story.timeline`: optional timeline data for projects that need institutional or phase markers.
- `story.sections`: the repeatable case-study sections.

The renderer reads normalized project data. Legacy fields such as `cover`, `detailSections`, `mediaSlot`, `mediaSlots`, `mediaList`, `mediaLayout`, and `observation` are still supported by `project-authoring.js`, but new projects should avoid them.

## YouTube Media

Paste a regular YouTube link into the existing `src` field. Use `alt` for the player title and an optional `caption` for the text below it:

```json
{
  "src": "https://youtu.be/M7lc1UVf-VE",
  "alt": "Project walkthrough",
  "caption": "A walkthrough of the interaction flow."
}
```

This example video is from YouTube's developer documentation; it is not a portfolio project asset. Supported links include `youtube.com/watch?v=...`, `youtu.be/...`, `/embed/...`, `/shorts/...`, `/live/...`, and the `youtube-nocookie.com` embed format. Start times in `t` or `start` are preserved; tracking and autoplay parameters are discarded.

Use these objects in `visualBreakMedia`, `detailMedia`, or a story section's `media` array. YouTube media plays inside the page, with responsive sizing, a fullscreen control, and no image zoom button. If used as `coverMedia`, the homepage card shows its YouTube thumbnail while the detail hero shows the player.

The normalizer derives a privacy-enhanced embed URL and the renderer creates an `<iframe>`. No API key or YouTube JavaScript API is needed. Videos must permit embedding, and playback depends on access to YouTube. Open previews through an HTTP server rather than `file://`; YouTube requires a Referer header.

See the [short lesson](../lessons/0001-youtube-media.html) and [reference sheet](../reference/youtube-media.html) for a Chinese walkthrough. Primary sources: [player parameters](https://developers.google.com/youtube/player_parameters), [embed identification](https://developers.google.com/youtube/terms/required-minimum-functionality#api-client-identity-and-credentials).

## Story Layouts

Set `title: false` to omit a story section's heading and lead directly with its content. Set `kicker: false` to omit its label, or provide a string to show a label such as `The playful journey`.

Sections with a kicker use a label column beside the content. A section containing only paragraphs, with both `kicker: false` and `title: false`, automatically uses a centered reading column (`is-paragraph`); its text stays left-aligned.

Add `sidebarMedia` with the usual `src`, `alt`, `width`, and `height` fields to show a reference image below the left-hand label. Its text stays in the right column, with steps and other supporting material below both columns. On narrow screens the sidebar stacks above the text.

Add `gallery: { "title": "Gallery", "media": [...] }` to place an image gallery directly after a section's paragraphs, before its supporting steps. Each image uses the usual media fields. The gallery spans the section width, preserves the whole image, and opens images in the existing larger-view dialog. It shows four columns on desktop, two on tablet, and one on mobile.

`text-only` means text only. Use it for context, problem framing, or short reflective sections.

`text-with-media` means text followed by one or more images, videos, or diagrams. Use it for process, strategy, interaction, tooling, and implementation sections.

`evidence-stack` means text followed by a main evidence image or video, a short note, and supporting media. Use it for impact, pilot results, user feedback, field observations, or exhibition evidence.

## Recommended Case Rhythm

`case-study-product-rnd` already supports the preferred media rhythm without adding more layout types:

1. Hero or cover media: `coverMedia`
2. Short overview text: `overview.heading`, `overview.body`, and optional `overview.points`
3. Full-width walkthrough or showreel: `visualBreakMedia`
4. Text-with-media section: a `story.sections` item with `layout: "text-with-media"`
5. Full-width diagram, screenshot, or video proof: another `text-with-media` section, with the proof media placed in `media`
6. Impact section with one large lead photo/video and supporting evidence: `layout: "evidence-stack"`

This keeps the authoring interface small. The renderer only needs the stable section layouts, while the template guides the narrative order.

## Adding A Project

1. Copy `templates/projects/case-study-product-rnd.json`.
2. Replace the placeholder copy and media paths.
3. Add the project object to `data/content.json`.
4. Add a shell file under `projects/` with `data-project-slug` matching the project `slug`.
5. Keep media paths under `assets/projects/<project-slug>/`.

Before publishing, run:

```bash
node scripts/prepublish-check.js
```

This only checks issues that are easy to miss locally: JSON syntax, missing media files, path casing mismatches, and missing media alt text.
