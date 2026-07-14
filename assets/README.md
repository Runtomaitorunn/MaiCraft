Place optimized portfolio delivery media here.

This folder should contain files that are ready for the public site, not raw
captures, editor exports, or camera names such as `IMG_6398.MP4`.

## Folders

- `brand/`: favicon and site identity assets.
- `hero/`: homepage reel, poster, and scroll cue media.
- `portraits/`: artist portraits and profile photos.
- `logos/institutions/`: partner, school, and institution marks.
- `projects/<project-slug>/`: project-specific covers, diagrams, photos, and videos.

## Naming

Use lowercase kebab-case with a lowercase extension:

```txt
<subject>-<role>[-state|-sequence|-year].ext
```

Good examples:

- `hero-video-2026.mp4`
- `cover.webp`
- `thumbnail.jpg`
- `walkthrough.mp4`
- `sjtu-logo-ink.png`
- `scroll-down-cue.svg`

Rules:

- Use ASCII letters, numbers, and hyphens only.
- Do not use spaces, underscores, uppercase extensions, or camera export names.
- Let the folder carry broad context. Inside a project folder, `cover.webp` is fine.
- Add a year or version only when it helps distinguish a replacement asset.

## Size Budgets

The hard caps below are enforced by `scripts/prepublish-check.js`. Aim lower when
possible, especially for first-viewport media.

| Asset type | Target | Hard cap | Notes |
| --- | ---: | ---: | --- |
| Hero MP4/WebM | 2 MB | 3 MB | 6-12 seconds, no audio, H.264 MP4 preferred. |
| Project MP4/WebM | 8 MB | 15 MB | Use for short evidence clips. Host long source reels elsewhere. |
| PNG | 1.5 MB | 3 MB | Use only for transparency, sharp UI, diagrams, or screenshots. |
| WebP/AVIF | 500 KB | 800 KB | Preferred for photographic covers and large raster imagery. |
| JPG/JPEG | 1 MB | 4 MB | Allowed for legacy photos; prefer WebP for new large images. |
| SVG | 80 KB | 200 KB | Keep vectors hand-cleaned and dependency-free. |
| GIF | 1 MB | 2 MB | Prefer MP4/WebM for motion. |

## Intake Checklist

Before adding media:

1. Rename the file into lowercase kebab-case.
2. Check dimensions, codec, duration, and file size.
3. Compress or convert anything above the target.
4. Add only the optimized delivery file under `assets/`.
5. Update the reference in HTML or `data/content.json`.
6. Run `node scripts/prepublish-check.js`.

If the file fails the hard cap, do not commit it as-is. Compress, resize, trim,
or convert it, then run the check again.

## Compression Recipes

Hero or short project video:

```bash
ffmpeg -i input.mp4 -vf "scale='min(1920,iw)':-2,fps=24" -an -movflags +faststart -c:v libx264 -crf 26 -preset slow output.mp4
```

Already-small H.264 MP4 that only needs web-friendly playback:

```bash
ffmpeg -i input.mp4 -map 0:v:0 -c:v copy -an -movflags +faststart output.mp4
```

Photo or cover image to WebP:

```bash
ffmpeg -i input.png -vf "scale='min(1800,iw)':-2" -compression_level 6 -quality 82 output.webp
```
