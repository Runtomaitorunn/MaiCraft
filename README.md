# MaiCraft

Static portfolio for Ye Mai.

## Edit content

- Main page: `index.html`
- Visual system and responsive layout: `styles.css`
- Project rendering and page animations: `script.js`
- Project data for GitHub Pages: `data/projects.json`
- Media assets: `assets/`

## Replace project cards

Add project cover images to `assets/projects/`, then update
`data/projects.json`:

```json
{
  "title": "Project Title",
  "year": "2026",
  "role": "Creative Technologist",
  "summary": "One or two short sentences about the project.",
  "cover": "assets/projects/project-cover.jpg",
  "mediaLabel": "Project media",
  "link": "https://example.com",
  "featured": true
}
```

Use `"featured": true` for the large two-column project cards. Use
`"featured": false` for compact cards.

## Hero media

When ready, add a short muted reel at `assets/hero.mp4`, then add
`src="assets/hero.mp4"` to the hero video in `index.html`. The current page uses
a styled placeholder until real media is connected.
