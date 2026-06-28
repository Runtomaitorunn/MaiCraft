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

const isVideoAsset = (path = "") => /\.(mp4|webm|mov)$/i.test(path);

const renderMedia = (item, className = "") => {
  const src = normalizeAssetPath(item.src);
  const label = item.alt || item.title || "Project media";

  if (isVideoAsset(src)) {
    return `<video class="${className}" src="${src}" aria-label="${label}" autoplay muted loop playsinline controls></video>`;
  }

  return `<img class="${className}" src="${src}" alt="${label}" loading="lazy" />`;
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

const renderSectionMedia = (section) => {
  const media = section.media || section.mediaSlot;
  if (!media) return "";

  const caption = media.caption ? `<figcaption>${media.caption}</figcaption>` : "";

  if (media.src) {
    return `
      <figure class="project-section-media">
        ${renderMedia({ ...media, title: media.title || section.title }, "project-section-media-asset")}
        ${caption}
      </figure>
    `;
  }

  return `
    <figure class="project-section-media is-placeholder" aria-label="${media.label || "Project image slot"}">
      <span>${media.label || "Image slot"}</span>
      ${caption}
    </figure>
  `;
};

const renderSectionBlock = (section, index, labels = {}) => `
  <section class="project-story-block">
    <p class="project-story-kicker">${section.kicker || `${labels.sectionFallbackLabel || "Part"} ${index + 1}`}</p>
    <div class="project-story-content">
      <h2>${section.title || labels.sectionTitleSlot || "Section title slot"}</h2>
      ${(section.body || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
      ${renderSectionMedia(section)}
    </div>
  </section>
`;

const renderProjectPage = (project, localeContent, locale) => {
  const root = document.querySelector("#project-detail");
  if (!root) return;

  document.documentElement.lang = locale;
  document.title = `${project.title} | ${localeContent.brand.name}`;

  const detailLabels = localeContent.projectDetail || {};
  const detailBody = project.detailBody || [];
  const overview = project.overview || detailBody[0] || project.detailHeading || project.summary;
  const sectionBlocks = project.detailSections?.length
    ? project.detailSections
    : detailBody.slice(1).map((paragraph, index) => ({
        kicker: `${detailLabels.sectionFallbackLabel || "Part"} ${index + 1}`,
        title: detailLabels.sectionTitleSlot || "Section title slot",
        body: [paragraph],
      }));
  const media = project.detailMedia?.length ? project.detailMedia : [{ src: project.cover, alt: project.alt }];
  const visualBreakMedia = project.visualBreakMedia || media[1] || media[0] || { src: project.cover, alt: project.alt };
  const gallery = media
    .map((item) => `<figure>${renderMedia({ ...item, title: project.title })}</figure>`)
    .join("");
  const gallerySection = media.length > 1 ? `<section class="project-detail-gallery">${gallery}</section>` : "";

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
        ${renderMedia({ src: project.cover, alt: project.alt, title: project.title }, "project-detail-cover")}
      </section>

      <section class="project-overview">
        <p class="project-overview-label">${detailLabels.overviewLabel || "Overview"}</p>
        <div class="project-overview-copy">
          <h2>${project.overviewHeading || project.detailHeading || project.summary}</h2>
          <p>${overview}</p>
        </div>
      </section>

      <section class="project-visual-break" aria-label="${detailLabels.visualBreakLabel || "Project visual"}">
        ${renderMedia({ ...visualBreakMedia, title: project.title }, "project-visual-break-media")}
      </section>

      <section class="project-story">
        ${renderTimelineGhost(project.timeline, detailLabels.timelineLabel || "Project timeline")}
        <div class="project-story-list">
          ${sectionBlocks.map((section, index) => renderSectionBlock(section, index, detailLabels)).join("")}
        </div>
      </section>

      ${gallerySection}
    </article>
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

const init = async () => {
  const response = await fetch(CONTENT_URL);
  const content = await response.json();
  const locale = getRequestedLocale(content);
  const localeContent = content.locales[locale];
  const slug = document.body.dataset.projectSlug;
  const project = localeContent.projects.find((item) => item.slug === slug);

  if (!project) {
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

  renderProjectPage(project, localeContent, locale);
  startHeadingRevealObserver();
  startHeaderScrollBehavior();
};

init();
