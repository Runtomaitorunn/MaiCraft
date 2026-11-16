import { startHeadingReveal } from "./heading-reveal.js";

const CONTENT_URL = "../data/content.json";
const FALLBACK_LOCALE = "en";

const getRequestedLocale = (content) => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("lang") || window.localStorage.getItem("portfolioLocale");
  const defaultLocale = content.defaultLocale || FALLBACK_LOCALE;

  if (requested && content.locales[requested]) {
    return requested;
  }

  return defaultLocale;
};

const normalizeAssetPath = (path) => {
  if (!path || path.startsWith("http") || path.startsWith("../")) return path;
  return `../${path}`;
};

const escapeAttribute = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const toClassToken = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isVideoAsset = (path = "") => /\.(mp4|webm|mov)$/i.test(path);

const renderMedia = (item, className = "") => {
  const src = normalizeAssetPath(item.src);
  const label = item.alt || item.title || "Project media";
  const sizeAttributes = [item.width ? `width="${escapeAttribute(item.width)}"` : "", item.height ? `height="${escapeAttribute(item.height)}"` : ""]
    .filter(Boolean)
    .join(" ");
  const dimensions = sizeAttributes ? ` ${sizeAttributes}` : "";

  if (item.youtube) {
    return `<iframe class="${className} project-youtube-player" src="${escapeAttribute(item.youtube.embedSrc)}" title="${escapeAttribute(label)}"${dimensions} loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  }

  if (isVideoAsset(src)) {
    return `<video class="${className}" src="${escapeAttribute(src)}" aria-label="${escapeAttribute(label)}"${dimensions} autoplay muted loop playsinline disablepictureinpicture></video>`;
  }

  return `<img class="${className}" src="${escapeAttribute(src)}" alt="${escapeAttribute(label)}"${dimensions} loading="lazy" />`;
};

const renderLogoSlot = (item) => {
  if (!item.logo) {
    return '<span class="timeline-logo-slot" aria-hidden="true"></span>';
  }

  return `
    <span class="timeline-logo-slot has-logo">
      <img src="${normalizeAssetPath(item.logo)}" alt="${item.logoAlt || ""}" loading="lazy" />
    </span>
  `;
};

const renderProjectHeader = (localeContent) => {
  const navItems = (localeContent.nav || [])
    .map((item) => {
      const href = item.href?.startsWith("#") ? `../index.html${item.href}` : item.href;
      return `<a href="${href}">${item.label}</a>`;
    })
    .join("");

  return `
    <header class="site-header" data-project-header>
      <a class="brand" href="../index.html" aria-label="${localeContent.brand.ariaLabel || localeContent.brand.name}">
        ${localeContent.brand.name}
      </a>
      <nav class="nav-links" aria-label="${localeContent.header?.ariaLabel || "Project navigation"}">
        ${navItems}
      </nav>
    </header>
  `;
};

const renderTimelineGhost = (timeline = [], label = "Project timeline") => {
  if (!timeline.length) return "";

  return `
    <aside class="project-timeline-ghost" aria-label="${label}">
      ${timeline
        .map(
          (item) => `
            <div class="project-timeline-ghost-item">
              <span class="timeline-dot" aria-hidden="true"></span>
              <span class="timeline-period">${item.period}</span>
              ${renderLogoSlot(item)}
            </div>
          `
        )
        .join("")}
    </aside>
  `;
};

const renderSectionObservation = (observation) => {
  if (!observation) return "";

  const label = typeof observation === "string" ? "Pilot observation" : observation.label || "Pilot observation";
  const body = typeof observation === "string" ? observation : observation.body;

  if (!body) return "";

  return `
    <aside class="project-section-observation">
      <span>${label}</span>
      <p>${body}</p>
    </aside>
  `;
};

const renderSectionMedia = (section) => {
  const mediaItems = section.media || [];
  const isEvidenceStack = section.layout === "evidence-stack";
  const observation = renderSectionObservation(section.note);

  if (!mediaItems.length && !observation) return "";

  const renderMediaItem = (media, index) => {
    const caption = media.caption ? `<figcaption>${media.caption}</figcaption>` : "";
    const featuredClass = media.featured || (isEvidenceStack && index === 0) ? " is-featured" : "";

    if (media.src) {
      const isContained = media.fit === "contain" || /\.svg$/i.test(media.src);
      const src = normalizeAssetPath(media.src);
      const label = media.alt || media.title || section.title || "Project media";
      const canExpand = !isVideoAsset(src) && !media.youtube;
      const mediaMarkup = renderMedia({ ...media, title: media.title || section.title }, "project-section-media-asset");

      return `
        <figure class="project-section-media${isContained ? " is-contained" : ""}${featuredClass}">
          ${
            canExpand
              ? `<button class="project-media-open" type="button" data-project-media-open data-media-src="${escapeAttribute(src)}" data-media-alt="${escapeAttribute(label)}" aria-label="Open larger view: ${escapeAttribute(label)}">${mediaMarkup}<span>View larger</span></button>`
              : mediaMarkup
          }
          ${caption}
        </figure>
      `;
    }

    return `
      <figure class="project-section-media is-placeholder${featuredClass}" aria-label="${media.label || "Project image slot"}">
        <span>${media.label || "Image slot"}</span>
        ${caption}
      </figure>
    `;
  };

  if (isEvidenceStack) {
    const leadMedia = mediaItems[0] ? renderMediaItem(mediaItems[0], 0) : "";
    const supportingMedia = mediaItems
      .slice(1)
      .map((media, index) => renderMediaItem(media, index + 1))
      .join("");

    return `
      <div class="project-section-media-list is-impact-gallery">
        ${leadMedia}
        ${observation}
        ${supportingMedia}
      </div>
    `;
  }

  return `
    <div class="project-section-media-list${mediaItems.length > 1 ? " is-multi" : ""}">
      ${mediaItems.map(renderMediaItem).join("")}
    </div>
  `;
};

const renderMediaDialog = () => `
  <dialog class="project-media-dialog" data-project-media-dialog aria-label="Expanded project media">
    <button class="project-media-dialog-close" type="button" data-project-media-dialog-close aria-label="Close image">Close</button>
    <img alt="" data-project-media-dialog-image />
  </dialog>
`;

const renderStoryGallery = (gallery) => {
  const hasRows = Boolean(gallery?.rows?.length);
  const rows = (hasRows ? gallery.rows : [{ media: gallery?.media }])
    .map((row) => ({
      ...row,
      media: (row.media || []).filter((media) => media.src ? !isVideoAsset(media.src) && !media.youtube : media.label),
    }))
    .filter((row) => row.media.length);
  if (!rows.length) return "";
  const title = escapeAttribute(gallery.title || "Gallery");
  const renderArrow = (direction) => `
    <button class="project-gallery-arrow is-${direction}" type="button" data-gallery-direction="${direction}" aria-label="${direction === "previous" ? "Previous image" : "Next image"}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction === "previous" ? "M15 5 8 12l7 7" : "m9 5 7 7-7 7"}" /></svg>
    </button>
  `;

  return `
    <section class="project-story-gallery" aria-label="${title}">
      <h3 class="project-story-gallery-title">${title}</h3>
      ${rows.map((row) => `
      ${row.layout === "flex" ? `<div class="project-gallery-carousel" data-gallery-carousel>${renderArrow("previous")}` : ""}
      <div class="${row.layout === "flex" ? "project-story-gallery-flex" : "project-story-gallery-grid"}" style="--gallery-columns: ${hasRows ? row.media.length : 4}" role="group" aria-label="${escapeAttribute(row.label || "Gallery images")}"${row.layout === "flex" ? ' tabindex="0"' : ""}>
        ${row.media.map((media) => {
          if (!media.src) return `
            <figure class="project-story-gallery-item">
              <div class="project-story-gallery-placeholder">${escapeAttribute(media.label)}</div>
            </figure>
          `;
          const src = escapeAttribute(normalizeAssetPath(media.src));
          const label = escapeAttribute(media.alt || media.title || "Project image");
          return `
            <figure class="project-story-gallery-item">
              <button class="project-media-open" type="button" data-project-media-open data-media-src="${src}" data-media-alt="${label}" aria-label="Open larger view: ${label}">
                ${renderMedia(media, "project-story-gallery-media")}
                <span>View larger</span>
              </button>
            </figure>
          `;
        }).join("")}
      </div>
      ${row.layout === "flex" ? `${renderArrow("next")}</div>` : ""}
      `).join("")}
    </section>
  `;
};

const renderVisualBreakItem = (media, project) => {
  if (media?.src) {
    const caption = media.caption ? `<figcaption>${escapeAttribute(media.caption)}</figcaption>` : "";
    return `
      <figure class="project-visual-break-item">
        ${renderMedia({ ...media, title: project.title }, "project-visual-break-media")}
        ${caption}
      </figure>
    `;
  }

  const label = media?.label || "Project visual slot";
  const caption = media?.caption ? `<figcaption>${media.caption}</figcaption>` : "";

  return `
    <figure class="project-visual-break-placeholder project-visual-break-item" aria-label="${label}">
      <span>${label}</span>
      ${caption}
    </figure>
  `;
};

const renderVisualBreakMedia = (media, project) => {
  const mediaItems = Array.isArray(media) ? media : [media];

  return `
    <div class="project-visual-break-list${mediaItems.length > 1 ? " is-multi" : ""}">
      ${mediaItems.map((item) => renderVisualBreakItem(item, project)).join("")}
    </div>
  `;
};

const renderProjectFacts = (facts = []) => {
  const entries = Array.isArray(facts)
    ? facts
    : Object.entries(facts).map(([label, value]) => ({ label, value }));
  const items = entries
    .map((item) => {
      const value = Array.isArray(item.value)
        ? `
          <ul class="project-fact-list">
            ${item.value.map((line) => `<li>${escapeAttribute(line)}</li>`).join("")}
          </ul>
        `
        : escapeAttribute(item.value);
      return {
        label: item.label,
        value,
      };
    })
    .filter((item) => item.label && item.value);

  if (!items.length) return "";

  return `
    <dl class="project-facts" aria-label="Project facts">
      ${items
        .map(
          (item) => `
            <div class="project-fact">
              <dt>${escapeAttribute(item.label)}</dt>
              <dd>${item.value}</dd>
            </div>
          `
        )
        .join("")}
    </dl>
  `;
};

const renderOverviewPoints = (points = []) => {
  if (!points.length) return "";

  const renderPoint = (point) => {
    const label = typeof point === "object" ? point.label : "";
    const body = typeof point === "object" ? point.body : point;

    if (!body) return "";

    return `
      <li>
        ${label ? `<span class="project-overview-point-label">${escapeAttribute(label)}</span>` : ""}
        <span class="project-overview-point-body">${escapeAttribute(body)}</span>
      </li>
    `;
  };

  return `
    <ul class="project-overview-points">
      ${points.map(renderPoint).join("")}
    </ul>
  `;
};

const renderStoryPoints = (points = []) => {
  if (!points.length) return "";

  return `
    <ul class="project-story-points">
      ${points
        .map(
          (point) => `
            <li>
              ${point.label ? `<span>${escapeAttribute(point.label)}</span>` : ""}
              <p>${escapeAttribute(point.body || point)}</p>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
};

const renderStorySteps = (steps = []) => {
  if (!steps.length) return "";

  return `
    <ol class="project-story-steps">
      ${steps
        .map(
          (step, index) => `
            <li>
              <span class="project-story-step-marker">${escapeAttribute(step.label || String(index + 1).padStart(2, "0"))}</span>
              <div>
                <h3>${escapeAttribute(step.title)}</h3>
                <p>${escapeAttribute(step.body)}</p>
              </div>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
};

const renderStoryMapping = (rows = []) => {
  if (!rows.length) return "";

  return `
    <div class="project-story-mapping" role="list" aria-label="Interaction logic">
      <div class="project-story-mapping-head" aria-hidden="true">
        <span>Action</span>
        <span>System response</span>
        <span>Narrative meaning</span>
      </div>
      ${rows
        .map(
          (row) => `
            <article class="project-story-mapping-row" role="listitem">
              <p data-label="Action">${escapeAttribute(row.action)}</p>
              <p data-label="System response">${escapeAttribute(row.response)}</p>
              <p data-label="Narrative meaning">${escapeAttribute(row.meaning)}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
};

const renderSectionTimeline = (timeline = []) => {
  if (!timeline.length) return "";

  return `
    <ol class="project-section-timeline" aria-label="Project development timeline">
      ${timeline
        .map(
          (item) => `
            <li>
              <span class="project-section-timeline-period">${escapeAttribute(item.period)}</span>
              ${renderLogoSlot(item)}
              <div>
                <h3>${escapeAttribute(item.title)}</h3>
                <p>${escapeAttribute(item.body)}</p>
              </div>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
};

const renderStoryColumns = (columns = []) => {
  if (!columns.length) return "";

  return `
    <div class="project-story-columns${columns.length === 1 ? " is-single" : ""}">
      ${columns
        .map(
          (column) => `
            <section>
              <h3>${escapeAttribute(column.title)}</h3>
              <ul>
                ${(column.items || []).map((item) => `<li>${escapeAttribute(item)}</li>`).join("")}
              </ul>
            </section>
          `
        )
        .join("")}
    </div>
  `;
};

const renderStoryExtras = (section) => `
  ${renderStoryPoints(section.points)}
  ${renderStorySteps(section.steps)}
  ${renderStoryMapping(section.mapping)}
  ${renderSectionTimeline(section.timeline)}
  ${renderStoryColumns(section.columns)}
  ${section.closing ? `<p class="project-story-closing">${escapeAttribute(section.closing)}</p>` : ""}
`;

const renderSectionBlock = (section, index, labels = {}) => {
  const sectionMedia = renderSectionMedia(section);
  const sectionGallery = renderStoryGallery(section.gallery);
  const sectionExtras = renderStoryExtras(section);
  const variant = toClassToken(section.variant);
  const hasKicker = section.kicker !== false;
  const kicker = hasKicker ? `<p class="project-story-kicker">${section.kicker || `${labels.sectionFallbackLabel || "Part"} ${index + 1}`}</p>` : "";
  const sidebarMedia = section.sidebarMedia?.src ? renderMedia(section.sidebarMedia, "project-story-sidebar-media") : "";
  const isParagraph = !hasKicker && section.title === false && !sectionMedia && !sectionGallery && !sidebarMedia && !sectionExtras.trim();
  const mediaClasses = [
    section.layout ? `has-${section.layout}` : "",
    sectionMedia || sectionGallery ? "has-wide-media" : "",
    variant ? `is-${variant}` : "",
    hasKicker ? "has-kicker" : "has-no-kicker",
    sidebarMedia ? "has-sidebar-media" : "",
    isParagraph ? "is-paragraph" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const mediaLayoutClass = mediaClasses ? ` ${mediaClasses}` : "";

  return `
  <section class="project-story-block${mediaLayoutClass}">
    ${sidebarMedia ? `<div class="project-story-sidebar">${kicker}${sidebarMedia}</div>` : kicker}
    <div class="project-story-content">
      ${section.title === false ? "" : `<h2>${section.title || labels.sectionTitleSlot || "Section title slot"}</h2>`}
      ${(section.body || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
      ${sidebarMedia || sectionGallery ? "" : sectionExtras}
    </div>
    ${sectionGallery}
    ${sidebarMedia || sectionGallery ? sectionExtras : ""}
    ${sectionMedia}
  </section>
`;
};

const renderProjectDocuments = (documents) => {
  if (!documents?.items?.length) return "";
  const pdfIcon = `<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M8 2h12l8 8v22a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 2v8h8" fill="none" stroke="currentColor" stroke-width="2"/><rect x="1" y="16" width="24" height="13" rx="2" fill="currentColor"/><text x="13" y="25" fill="var(--noomo-paper-light)" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="700">PDF</text></svg>`;

  return `
    <section class="project-documents" aria-label="${escapeAttribute(documents.title || "Documents")}">
      <h2 class="project-documents-title">${escapeAttribute(documents.title || "Documents")}</h2>
      <div class="project-document-list">
        ${documents.items.map((item) => `
          <article class="project-document">
            ${item.type ? `<p class="project-document-type">${escapeAttribute(item.type)}</p>` : ""}
            <h3 class="project-document-title">${escapeAttribute(item.title)}</h3>
            ${item.authors ? `<p class="project-document-authors">${escapeAttribute(item.authors)}</p>` : ""}
            <div class="project-document-actions">
              ${item.href
                ? `<a class="project-document-pdf" href="${escapeAttribute(normalizeAssetPath(item.href))}" target="_blank" rel="noopener noreferrer" aria-label="Open PDF: ${escapeAttribute(item.title)}">${pdfIcon}</a>`
                : `<span class="project-document-pdf is-placeholder" aria-hidden="true">${pdfIcon}</span><p class="project-document-status">PDF to be added</p>`}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
};

const renderWipProjectPage = (root, project, localeContent) => {
  const detailLabels = localeContent.projectDetail || {};
  const wip = project.wip || {};
  const contactLink = (localeContent.contact?.links || []).find((item) => item.href?.startsWith("mailto:"));
  const footer = localeContent.footer || {};
  const year = new Date().getFullYear();

  root.classList.add("is-wip");
  root.innerHTML = `
    ${renderProjectHeader(localeContent)}
    <article class="project-detail-article project-detail-article--wip">
      <header class="project-detail-masthead project-wip-masthead">
        <a class="back-link" href="../index.html#projects">${detailLabels.backLabel || "Back to projects"}</a>
        <h1>${project.title}</h1>
        <p class="project-wip-summary">${project.summary}</p>
      </header>

      <section class="project-wip" aria-labelledby="project-wip-title">
        <div class="project-wip-status">
          <p>${wip.kicker || "still taking shape :)"}</p>
          <span class="project-wip-rule" aria-hidden="true"></span>
        </div>
        <div class="project-wip-content">
          <h2 id="project-wip-title">${wip.heading || "Stay tuned."}</h2>
          <p>${wip.body || "This section is finding its form. More visual notes are on the way."}</p>
          <div class="project-wip-actions">
            <a class="project-wip-action is-primary" href="../index.html#projects">
              <span>${wip.backActionLabel || detailLabels.backLabel || "Back to projects"}</span>
              <span class="project-wip-action-mark" aria-hidden="true">←</span>
            </a>
            <a class="project-wip-action is-secondary" href="${contactLink?.href || "../index.html#contact"}">
              <span>${wip.contactActionLabel || "Say hello"}</span>
              <span class="project-wip-action-mark" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer class="project-wip-footer">
        <p>${footer.copyrightPrefix || "Copyright"} ${year} ${footer.copyrightSuffix || localeContent.brand.name}</p>
      </footer>
    </article>
  `;
};

const renderProjectPage = (project, localeContent, locale) => {
  const root = document.querySelector("#project-detail");
  if (!root) return;

  document.documentElement.lang = locale;
  document.title = `${project.title} | ${localeContent.brand.name}`;

  if (project.wip) {
    renderWipProjectPage(root, project, localeContent);
    return;
  }

  root.classList.remove("is-wip");

  const detailLabels = localeContent.projectDetail || {};
  const overview = project.overview || {};
  const sectionBlocks = project.detailSections || [];
  const media = project.detailMedia || [project.coverMedia].filter(Boolean);
  const hasVisualBreak = project.visualBreakMedia !== false;
  const visualBreakMedia = hasVisualBreak ? project.visualBreakMedia || media[1] || media[0] || project.coverMedia : null;
  const gallery = media
    .map((item) => `<figure>${renderMedia({ ...item, title: project.title })}</figure>`)
    .join("");
  const gallerySection = media.length > 1 ? `<section class="project-detail-gallery">${gallery}</section>` : "";
  const storyLayoutClass = project.timeline?.length ? "has-timeline" : "has-no-timeline";

  root.innerHTML = `
    ${renderProjectHeader(localeContent)}
    <article class="project-detail-article">
      <header class="project-detail-masthead">
        <a class="back-link" href="../index.html#projects">${detailLabels.backLabel || "Back to projects"}</a>
        <span class="project-meta">${[project.year, project.role].filter(Boolean).join(localeContent.projectsSection.metaSeparator)}</span>
        <h1>${project.title}</h1>
        <div class="project-hero-info">
          ${renderProjectFacts(project.projectFacts)}
          <p class="project-tagline">${project.tagline || detailLabels.taglineSlot || project.detailHeading || project.summary}</p>
        </div>
      </header>

      <section class="project-detail-hero" aria-label="${project.mediaLabel || project.title}">
        ${renderMedia({ ...project.coverMedia, title: project.title }, "project-detail-cover")}
      </section>

      <section class="project-overview">
        <p class="project-overview-label">${detailLabels.overviewLabel || "Overview"}</p>
        <div class="project-overview-copy${overview.points?.length ? " has-points" : ""}">
          <h2>${overview.heading || project.detailHeading || project.summary}</h2>
          <p class="project-overview-lead">${overview.body || project.detailHeading || project.summary}</p>
          ${renderOverviewPoints(overview.points)}
        </div>
      </section>

      ${
        hasVisualBreak
          ? `<section class="project-visual-break" aria-label="${detailLabels.visualBreakLabel || "Project visual"}">
        ${renderVisualBreakMedia(visualBreakMedia, project)}
      </section>`
          : ""
      }

      <section class="project-story ${storyLayoutClass}">
        ${renderTimelineGhost(project.timeline, detailLabels.timelineLabel || "Project timeline")}
        <div class="project-story-list">
          ${sectionBlocks.map((section, index) => renderSectionBlock(section, index, detailLabels)).join("")}
        </div>
      </section>

      ${project.walkthroughMedia?.length ? `
        <section class="project-visual-break" aria-label="${escapeAttribute(project.walkthroughMedia[0].alt)}">
          ${renderVisualBreakMedia(project.walkthroughMedia, project)}
        </section>
      ` : ""}
      ${renderProjectDocuments(project.documents)}
      ${gallerySection}
    </article>
    ${renderMediaDialog()}
  `;
};

const startHeaderScrollBehavior = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    header.classList.toggle("is-hidden", currentScrollY > lastScrollY);
    lastScrollY = currentScrollY;
  });
};

const startGalleryCarousels = () => {
  document.querySelectorAll("[data-gallery-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".project-story-gallery-flex");
    const items = Array.from(track.children);
    const previous = carousel.querySelector('[data-gallery-direction="previous"]');
    const next = carousel.querySelector('[data-gallery-direction="next"]');
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastTime = 0;
    let position = track.scrollLeft;
    let target = position;
    const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

    const update = () => {
      const destination = frame ? target : track.scrollLeft;
      previous.disabled = destination <= 1;
      next.disabled = destination >= maxScroll() - 1;
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      position = target = track.scrollLeft;
      update();
    };

    const animate = (time) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 1000 / 60;
      lastTime = time;
      target = Math.min(target, maxScroll());
      // Time-based lerp keeps the deceleration consistent across refresh rates.
      position += (target - position) * (1 - Math.exp(-elapsed / 70));
      if (Math.abs(target - position) < 0.5 || reducedMotion.matches) {
        track.scrollLeft = target;
        stop();
        return;
      }
      track.scrollLeft = position;
      frame = requestAnimationFrame(animate);
      update();
    };

    const move = (direction) => {
      const viewport = track.getBoundingClientRect();
      const visible = items.map((item) => item.getBoundingClientRect())
        .filter((rect) => rect.right > viewport.left + 1 && rect.left < viewport.right - 1);
      const edge = direction > 0 ? visible.at(-1) : visible[0];
      if (!edge) return;

      const continuing = frame && Math.sign(target - track.scrollLeft) === direction;
      const origin = continuing ? target : track.scrollLeft;
      position = track.scrollLeft;
      target = Math.max(0, Math.min(maxScroll(), origin + direction * edge.width));
      if (reducedMotion.matches) {
        track.scrollLeft = target;
        stop();
      } else if (!frame) {
        frame = requestAnimationFrame(animate);
      }
      update();
    };

    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    track.addEventListener("scroll", () => {
      if (!frame) position = target = track.scrollLeft;
      update();
    }, { passive: true });
    track.addEventListener("load", update, true);
    track.addEventListener("focusin", stop);
    track.addEventListener("keydown", (event) => {
      if (event.target !== track || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    });
    window.addEventListener("resize", stop);
    update();
  });
};

const startProjectMediaDialog = () => {
  const dialog = document.querySelector("[data-project-media-dialog]");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const image = dialog.querySelector("[data-project-media-dialog-image]");
  const closeButton = dialog.querySelector("[data-project-media-dialog-close]");
  const openButtons = document.querySelectorAll("[data-project-media-open]");
  if (!image || !closeButton || !openButtons.length) return;

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      image.src = button.dataset.mediaSrc || "";
      image.alt = button.dataset.mediaAlt || "";
      dialog.showModal();
      document.body.classList.add("has-media-dialog");
      closeButton.focus({ preventScroll: true });
    });
  });

  closeButton.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    image.alt = "";
    document.body.classList.remove("has-media-dialog");
  });
};

const init = async () => {
  const response = await fetch(CONTENT_URL);
  const content = await response.json();
  const locale = getRequestedLocale(content);
  const localeContent = content.locales[locale];
  const slug = document.body.dataset.projectSlug;
  const rawProject = localeContent.projects.find((item) => item.slug === slug);

  if (!rawProject) {
    document.querySelector("#project-detail").innerHTML = `
      ${renderProjectHeader(localeContent)}
      <header class="project-detail-masthead">
        <a class="back-link" href="../index.html#projects">${localeContent.projectDetail?.backLabel || "Back to projects"}</a>
        <h1>${localeContent.projectDetail?.notFoundTitle || "Project not found"}</h1>
      </header>
    `;
    startHeadingReveal(".project-detail h1, .project-detail h2, .project-detail h3");
    startHeaderScrollBehavior();
    return;
  }

  const normalizeProject = window.ProjectAuthoring?.normalizeProject || ((item) => item);
  const project = normalizeProject(rawProject);

  renderProjectPage(project, localeContent, locale);
  window.PortfolioMedia?.startViewportVideoPlayback();
  startHeadingReveal(".project-detail h1, .project-detail h2, .project-detail h3");
  startHeaderScrollBehavior();
  startProjectMediaDialog();
  startGalleryCarousels();
};

init();
