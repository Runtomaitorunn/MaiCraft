# Noomo Motion Reference

Sources:
- [The power of digital storytelling](https://storytelling.noomoagency.com/)
- [Middle Finance case study](https://noomoagency.com/work/middle-finance-interactive-design)

This note breaks down the motion and frontend techniques in the two Noomo references, then translates them into practical moves for Ye Mai's portfolio. The goal is not to copy Noomo's agency identity. The useful reference is its pacing: large media, sparse text, deliberate entrance motion, and case-study pages that let visual proof carry the argument.

## 1. What The References Are Doing

### Storytelling microsite

Observed stack and structure:
- Nuxt/Vue-style build output, visible through `/_nuxt/` script and CSS assets.
- Mostly DOM/CSS-driven composition. No visible canvas, WebGL, GSAP, Lenis, ScrollTrigger, or Three.js globals were exposed during inspection.
- Text is split into small spans and lines, with classes such as `char`, `animated-text`, `text-line`, `gradient-text`, and `from-scale`.
- The page uses fixed and absolute layers, opacity transitions, scale transitions, and responsive utility classes.
- It has a guided narrative pattern: an opening statement, a small "tap to explore" interaction, then short conceptual sections.

Motion techniques:
- Character or word-level text reveal.
- Line-by-line text reveal for large statements.
- Scale-in moments for graphic assets and text groups.
- Fixed-stage composition where content feels like it is entering a scene, not simply scrolling down a page.
- Lightweight opacity and transform transitions for state changes.

Design effect:
- The page feels immersive without relying on heavy 3D.
- Motion is concentrated around the story's key beats.
- The interaction is simple, but it gives the visitor a sense of entering the narrative.

### Middle Finance case study

Observed stack and structure:
- Nuxt/Vue-style build output, with case-specific CSS bundles such as `caseHeroObjects`, `nextCase`, and `homeFooter`.
- Uses CDN-hosted Prismic media assets.
- Uses MP4 media as first-class product proof. The inspected page includes multiple videos, mostly muted and looping.
- Loads Swiper CSS, suggesting reusable carousel or slider capability in the site system, although the page itself reads mostly as editorial scrolling.
- No visible canvas, WebGL, GSAP, Lenis, ScrollTrigger, or Three.js globals were exposed during inspection.

Motion and layout techniques:
- Case hero with animated or layered objects.
- Large cover media block near the top.
- Paired image layouts for comparison and product detail.
- Full-width media moments that reset the visual rhythm.
- Review or quote block as impact proof.
- Next-project transition area at the end.

Design effect:
- The page does not make every section equally animated.
- It alternates between text context and visual evidence.
- Videos are used as evidence, not decoration.
- The case-study structure feels commercially polished because each media block has a clear job.

## 2. Technical Translation For This Portfolio

The current portfolio already has the right foundation:
- `IntersectionObserver` controls `.reveal` and `.heading-reveal`.
- `heading-reveal` already wraps heading text for entrance motion.
- CSS transitions are built around `transform` and `opacity`.
- `prefers-reduced-motion` is already present.
- Project detail pages already render video and image media through reusable project data.

Because of that, the best next step is not to add a big animation library. A small DOM/CSS motion layer will match the references well and keep the static site easy to maintain.

Recommended implementation model:
- Keep the existing `IntersectionObserver` pattern.
- Add one small reusable media observer for videos: play videos when visible, pause them when mostly offscreen.
- Add optional reveal variants through data attributes, for example `data-reveal="line"`, `data-reveal="media"`, and `data-reveal="group"`.
- Use CSS custom properties for reveal delay and distance instead of hard-coded one-off classes.
- Preserve instant or near-instant states under `prefers-reduced-motion`.

Avoid for now:
- GSAP, Lenis, Three.js, or WebGL. The references do not appear to need them for the effects being borrowed.
- Global smooth scrolling. It can make a portfolio feel slick, but it also adds accessibility and browser-behavior risk.
- Gradient text as a direct reference. It exists in the storytelling site, but it conflicts with this portfolio's current Cold Paper Studio discipline.
- Applying the same fade-up to every section. The stronger lesson from Noomo is varied pacing, not repeated animation.

## 3. What To Borrow

### A. Opening project page choreography

Use a stronger first-load sequence for project detail pages:
- Cover media appears first, with a subtle scale settle or clipped reveal.
- Project title reveals line by line.
- Metadata and intro copy arrive after the title, not at the exact same moment.

Why it fits:
- Ye's site is media-forward.
- Recruiters and collaborators need a strong first impression quickly.
- This creates a premium case-study feeling without changing the authoring model.

Implementation:
- Reuse `heading-reveal` for the title.
- Add a `.media-reveal` class for cover video/image.
- Set stagger using CSS variables like `--reveal-delay`.

### B. Large proof media as section rhythm

Keep the current direction from the Vislab page: large near-full-width images and videos. Noomo's Middle Finance page succeeds because media is not squeezed into small cards.

Recommended project page rhythm:
- Hero or cover media.
- Short overview text.
- Full-width walkthrough or showreel.
- Text-with-media section.
- Full-width diagram, screenshot, or video proof.
- Impact section with one large lead photo/video and supporting evidence.

Why it fits:
- This gives every project a readable case-study arc.
- It supports the new `case-study-product-rnd` authoring template.
- It makes technical work legible through evidence rather than long explanation.

### C. Selective text splitting

Borrow the storytelling site's text choreography only for important statements:
- Project title.
- Big section claim.
- Maybe one impact quote.

Do not split normal paragraphs into animated characters. It hurts readability and makes maintenance harder.

Implementation:
- Keep heading splitting inside JavaScript.
- Do not require authors to manually wrap words.
- Consider line-level reveal before character-level reveal. It is simpler and more elegant for this site.

### D. Viewport-aware video behavior

The Middle Finance page uses video heavily. For this portfolio, a small performance improvement would make video pages feel more deliberate:
- Autoplay muted loop videos as they do now.
- Pause section videos when they leave the viewport.
- Resume when they re-enter, unless the user manually paused the video.

Why it fits:
- Project pages now contain several MP4 assets.
- It reduces background CPU/GPU work.
- It keeps motion feeling intentional instead of noisy.

Implementation status:
- Added `media-playback.js` as a shared viewport video controller.
- Homepage and project detail pages load it before their page renderer.
- User-paused videos stay paused when they re-enter the viewport until the user plays them again.

### E. End-of-case transition

Borrow the "next project" idea later, not immediately:
- A large final block with the next project title and one media preview.
- It should feel like a continuation of Ye's portfolio, not a generic CTA.

This is useful after there are more complete project detail pages.

## 4. What Not To Borrow Directly

Do not copy:
- Noomo's exact agency pacing, where every page feels like a studio campaign.
- The gradient-text treatment from the storytelling site.
- The repeated tiny navigation labels and dense utility-class feeling.
- Full-screen conceptual interaction for every project. Ye's portfolio needs fast evaluation, not a puzzle before every case.
- A heavy frontend framework just to reproduce these effects.

The portfolio should keep its own identity: cold mist-blue paper, deep ink typography, large project media, and direct technical evidence.

## 5. Suggested Priority

### Priority 1: Motion primitives

Add a small reusable project motion layer:
- `media-reveal`
- `group-reveal`
- `line-reveal` or improved `heading-reveal`
- viewport video play/pause

Keep it in the existing JS/CSS system unless the file gets hard to scan. If it grows, split to a tiny `project-motion.js`.

### Priority 2: Case-study media rhythm

Refine the authoring template and renderer so each project can naturally express:
- cover media
- overview text
- visual break media
- text-with-media section
- evidence stack or impact gallery

This is more important than adding fancy animation. The Noomo case study works because its media hierarchy is clear.

### Priority 3: Project-end navigation

Add a reusable next-project block once at least two or three project pages have polished media. It should use a large preview, not a small card.

## 6. Concrete Frontend Notes

Suggested CSS direction:

```css
.media-reveal {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 900ms ease,
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 900ms ease;
}

.media-reveal:not(.is-visible) {
  opacity: 0.001;
  transform: translateY(24px);
  filter: blur(8px);
}
```

Use this only when the element is safe to show by default or becomes visible quickly. Content should not remain blank if JavaScript fails.

Suggested JS direction:

```js
function startViewportMediaPlayback() {
  const videos = document.querySelectorAll("video[autoplay][muted]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  videos.forEach((video) => observer.observe(video));
}
```

The production implementation keeps the same shape, with an added manual-pause guard so user intent wins over viewport autoplay.

## 7. Design Rule For This Portfolio

Use motion to make evidence arrive with confidence:
- Titles reveal.
- Media breathes into view.
- Videos behave politely.
- Impact evidence gets scale.

Do not animate just because a section exists. The visitor should feel the work is alive, not that the page is performing over the work.
