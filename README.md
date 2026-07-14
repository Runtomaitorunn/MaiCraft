# MaiCraft

Static portfolio for Ye Mai.

## Edit content

- Main page: `index.html`
- Visual system and responsive layout: `styles.css`
- Project rendering and page animations: `script.js`
- Site copy, locale text, contact links, and project data: `data/content.json`
- Media assets: `assets/`

## Language hook

The site reads all visible copy from `data/content.json`. English is the default
locale, and a Chinese placeholder locale is already reserved under `zh`.

Preview a locale with a query string:

```txt
index.html?lang=en
index.html?lang=zh
```

You can also persist a locale in the browser console:

```js
localStorage.setItem("portfolioLocale", "zh");
```

Because the page loads JSON, preview it through GitHub Pages or a small local
server instead of double-clicking the HTML file.

## Replace project cards

Use `templates/projects/case-study-product-rnd.json` when adding a product or
applied R&D case study. The authoring guide lives in
`docs/project-authoring.md`.

Add project cover images to `assets/projects/<project-slug>/`, then update the `projects`
array inside `data/content.json`:

```json
{
  "title": "Project Title",
  "year": "2026",
  "role": "Creative Technologist",
  "summary": "One or two short sentences about the project.",
  "coverMedia": {
    "src": "assets/projects/project-slug/project-cover.jpg",
    "alt": "Project cover image"
  },
  "mediaLabel": "Project media",
  "link": "https://example.com",
  "featured": true
}
```

Use `"featured": true` for the large two-column project cards. Use
`"featured": false` for compact cards.

## Hero media

When ready, add a short muted reel under `assets/hero/` using the asset naming
and size rules in `assets/README.md`, then update the hero video `src` in
`index.html`.
