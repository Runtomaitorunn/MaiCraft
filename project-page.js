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

const isVideoAsset = (path = "") => /\.(mp4|webm|mov)$/i.test(path);

const renderMedia = (item, className = "") => {
  const src = normalizeAssetPath(item.src);
  const label = item.alt || item.title || "Project media";
  const sizeAttributes = [item.width ? `width="${escapeAttribute(item.width)}"` : "", item.height ? `height="${escapeAttribute(item.height)}"` : ""]
    .filter(Boolean)
    .join(" ");
  const dimensions = sizeAttributes ? ` ${sizeAttributes}` : "";

  if (isVideoAsset(src)) {
    return `<video class="${className}" src="${escapeAttribute(src)}" aria-label="${escapeAttribute(label)}"${dimensions} autoplay muted loop playsinline controls></video>`;
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
      const canExpand = !isVideoAsset(src);
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

const renderVisualBreakItem = (media, project) => {
  if (media?.src) {
    return `
      <figure class="project-visual-break-item">
        ${renderMedia({ ...media, title: project.title }, "project-visual-break-media")}
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

const renderSectionBlock = (section, index, labels = {}) => {
  const sectionMedia = renderSectionMedia(section);
  const mediaClasses = [
    section.layout ? `has-${section.layout}` : "",
    sectionMedia ? "has-wide-media" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const mediaLayoutClass = mediaClasses ? ` ${mediaClasses}` : "";

  return `
  <section class="project-story-block${mediaLayoutClass}">
    <p class="project-story-kicker">${section.kicker || `${labels.sectionFallbackLabel || "Part"} ${index + 1}`}</p>
    <div class="project-story-content">
      <h2>${section.title || labels.sectionTitleSlot || "Section title slot"}</h2>
      ${(section.body || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
    ${sectionMedia}
  </section>
`;
};

const renderProjectPage = (project, localeContent, locale) => {
  const root = document.querySelector("#project-detail");
  if (!root) return;

  document.documentElement.lang = locale;
  document.title = `${project.title} | ${localeContent.brand.name}`;

  const detailLabels = localeContent.projectDetail || {};
  const overview = project.overview || {};
  const sectionBlocks = project.detailSections || [];
  const media = project.detailMedia || [project.coverMedia].filter(Boolean);
  const visualBreakMedia = project.visualBreakMedia || media[1] || media[0] || project.coverMedia;
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
        <p class="project-tagline">${project.tagline || detailLabels.taglineSlot || project.detailHeading || project.summary}</p>
      </header>

      <section class="project-detail-hero" aria-label="${project.mediaLabel || project.title}">
        ${renderMedia({ ...project.coverMedia, title: project.title }, "project-detail-cover")}
      </section>

      <section class="project-overview">
        <p class="project-overview-label">${detailLabels.overviewLabel || "Overview"}</p>
        <div class="project-overview-copy">
          <h2>${overview.heading || project.detailHeading || project.summary}</h2>
          <p>${overview.body || project.detailHeading || project.summary}</p>
        </div>
      </section>

      <section class="project-visual-break" aria-label="${detailLabels.visualBreakLabel || "Project visual"}">
        ${renderVisualBreakMedia(visualBreakMedia, project)}
      </section>

      <section class="project-story ${storyLayoutClass}">
        ${renderTimelineGhost(project.timeline, detailLabels.timelineLabel || "Project timeline")}
        <div class="project-story-list">
          ${sectionBlocks.map((section, index) => renderSectionBlock(section, index, detailLabels)).join("")}
        </div>
      </section>

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

const startHeadingRevealObserver = () => {
  const headings = document.querySelectorAll(".project-detail h1, .project-detail h2, .project-detail h3");
  if (!headings.length) return;

  headings.forEach((heading) => {
    if (heading.classList.contains("heading-reveal")) return;

    const inner = document.createElement("span");
    inner.className = "heading-reveal-inner";

    while (heading.firstChild) {
      inner.append(heading.firstChild);
    }

    heading.classList.add("heading-reveal");
    heading.append(inner);
  });

  const headingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          headingObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.24, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".heading-reveal").forEach((heading) => {
    headingObserver.observe(heading);
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
    startHeadingRevealObserver();
    startHeaderScrollBehavior();
    return;
  }

  const normalizeProject = window.ProjectAuthoring?.normalizeProject || ((item) => item);
  const project = normalizeProject(rawProject);

  renderProjectPage(project, localeContent, locale);
  startHeadingRevealObserver();
  startHeaderScrollBehavior();
  startProjectMediaDialog();
};

init();
