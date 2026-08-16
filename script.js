const CONTENT_URL = "data/content.json";
const FALLBACK_LOCALE = "en";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const getPathValue = (source, path) => {
  return path.split(".").reduce((value, key) => {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) {
      return value[key];
    }

    return "";
  }, source);
};

const getRequestedLocale = (content) => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("lang") || window.localStorage.getItem("portfolioLocale");
  const defaultLocale = content.defaultLocale || FALLBACK_LOCALE;

  if (requested && content.locales[requested]) {
    return requested;
  }

  return defaultLocale;
};

const applyTextBindings = (localeContent) => {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = getPathValue(localeContent, element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((binding) => {
      const [attribute, path] = binding.split(":");
      const value = getPathValue(localeContent, path);

      if (attribute && value) {
        element.setAttribute(attribute, value);
      }
    });
  });
};

const renderNav = (links) => {
  const nav = document.querySelector("#nav-links");
  if (!nav) return;

  nav.replaceChildren();

  links.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;
    nav.append(link);
  });
};

const openArtistDisclosureForTarget = (targetId, shouldScroll = false) => {
  if (!targetId) return;

  const target = document.getElementById(targetId);
  const disclosure = document.querySelector("#artist-disclosure");
  if (!target || !disclosure || !disclosure.contains(target)) return;

  disclosure.open = true;

  if (shouldScroll) {
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
    }, prefersReducedMotion.matches ? 0 : 760);
  }
};

const startArtistDisclosureBehavior = () => {
  const disclosure = document.querySelector("#artist-disclosure");
  const summary = disclosure?.querySelector(".artist-disclosure-summary");
  if (!disclosure || !summary) return;

  const syncExpandedState = () => {
    summary.setAttribute("aria-expanded", String(disclosure.open));
  };

  summary.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    disclosure.open = !disclosure.open;
  });

  disclosure.addEventListener("toggle", syncExpandedState);
  syncExpandedState();
  openArtistDisclosureForTarget(window.location.hash.slice(1), true);

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target || !disclosure.contains(target) || disclosure.open) return;

    event.preventDefault();
    window.history.pushState(null, "", `#${targetId}`);
    openArtistDisclosureForTarget(targetId, true);
  });

  window.addEventListener("hashchange", () => {
    openArtistDisclosureForTarget(window.location.hash.slice(1), true);
  });
};

const renderParagraphs = (paragraphs) => {
  const body = document.querySelector("#artist-body");
  if (!body) return;

  body.replaceChildren();

  paragraphs.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    body.append(paragraph);
  });
};

const iconPaths = {
  vr: [
    '<path d="M7 10.5h10a3 3 0 0 1 3 3v2.1a2.4 2.4 0 0 1-2.4 2.4h-2.2a2 2 0 0 1-1.6-.8l-.7-.9a1.5 1.5 0 0 0-2.2 0l-.7.9a2 2 0 0 1-1.6.8H6.4A2.4 2.4 0 0 1 4 15.6v-2.1a3 3 0 0 1 3-3Z"/>',
    '<path d="M9 14h.01M15 14h.01M8 10.5l1-3h6l1 3"/>'
  ],
  web: [
    '<path d="m9 9-4 3 4 3"/>',
    '<path d="m15 9 4 3-4 3"/>',
    '<path d="m13 7-2 10"/>'
  ],
  creative: [
    '<path d="M5 19l1.4-4.6L15.8 5a2.1 2.1 0 0 1 3 3L9.4 17.4 5 19Z"/>',
    '<path d="M14 6l3 3"/>',
    '<path d="M18 14.5l.7 1.4 1.3.6-1.3.7-.7 1.3-.7-1.3-1.3-.7 1.3-.6.7-1.4Z"/>'
  ]
};

const createSkillIcon = (type, fallback) => {
  const icon = document.createElement("div");
  icon.className = `skill-icon skill-icon--${type}`;
  icon.setAttribute("aria-hidden", "true");

  if (!iconPaths[type]) {
    icon.textContent = fallback;
    return icon;
  }

  icon.innerHTML = `
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      ${iconPaths[type].join("")}
    </svg>
  `;

  return icon;
};

const isVideoAsset = (path = "") => /\.(mp4|webm|mov)$/i.test(path);

const renderSkills = (skills) => {
  const container = document.querySelector("#skill-cards");
  if (!container) return;

  container.replaceChildren();

  skills.forEach((skill) => {
    const card = document.createElement("article");
    card.className = "skill-card";

    const icon = createSkillIcon(skill.icon, skill.icon);

    const title = document.createElement("h3");
    title.textContent = skill.title;

    const tools = document.createElement("div");
    tools.className = "skill-tools";

    const groups = skill.toolGroups || [{ label: "", tools: skill.tools || [] }];
    groups.forEach((group) => {
      const groupElement = document.createElement("div");
      groupElement.className = "skill-tool-group";

      if (group.label) {
        const groupLabel = document.createElement("span");
        groupLabel.className = "skill-tool-label";
        groupLabel.textContent = group.label;
        groupElement.append(groupLabel);
      }

      const capsuleList = document.createElement("div");
      capsuleList.className = "skill-capsule-list";

      const toolItems = Array.isArray(group.tools) ? group.tools : String(group.tools).split(",").map((item) => item.trim());
      toolItems.forEach((tool) => {
        const capsule = document.createElement("span");
        capsule.className = "skill-capsule";
        capsule.textContent = tool;
        capsuleList.append(capsule);
      });

      groupElement.append(capsuleList);
      tools.append(groupElement);
    });

    card.append(icon, title, tools);
    container.append(card);
  });
};

const renderResumeEntries = (containerId, entries = []) => {
  const container = document.querySelector(`#${containerId}`);
  if (!container) return;

  container.replaceChildren();

  entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "resume-entry";

    const mark = document.createElement("div");
    mark.className = "resume-entry-mark";
    mark.setAttribute("aria-hidden", "true");

    if (entry.logo) {
      const logo = document.createElement("img");
      logo.src = entry.logo;
      logo.alt = "";
      logo.loading = "lazy";
      mark.append(logo);
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "resume-entry-mark-placeholder";
      placeholder.textContent = entry.mark || "—";
      mark.append(placeholder);
    }

    const copy = document.createElement("div");
    copy.className = "resume-entry-copy";

    const institution = document.createElement("h3");
    institution.className = "resume-entry-institution";

    if (entry.url) {
      const link = document.createElement("a");
      link.href = entry.url;
      link.textContent = entry.institution;

      if (/^https?:\/\//.test(entry.url)) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }

      institution.append(link);
    } else {
      institution.textContent = entry.institution;
    }

    const meta = document.createElement("p");
    meta.className = "resume-entry-meta";

    const detail = document.createElement("span");
    detail.textContent = entry.detail;
    meta.append(detail);

    if (entry.period) {
      const period = document.createElement("span");
      period.className = "resume-entry-period";
      period.textContent = entry.period;
      meta.append(period);
    }

    copy.append(institution, meta);
    item.append(mark, copy);
    container.append(item);
  });
};

const createProjectCard = (project, separator, actionLabels = {}) => {
  const isExternal = Boolean(project.link && /^https?:\/\//.test(project.link));
  const cardKind = isExternal ? "external" : project.link ? "case-study" : "note";
  const actionKey = cardKind === "case-study" ? "caseStudy" : cardKind;
  const defaultActionLabels = {
    caseStudy: "Read case study",
    external: "Visit project site",
    note: "Project note"
  };
  const actionLabel = project.actionLabel || actionLabels[actionKey] || defaultActionLabels[actionKey];
  const actionMark = cardKind === "external" ? "↗" : cardKind === "case-study" ? "→" : "";
  const card = document.createElement(project.link ? "a" : "article");
  card.className = [
    "project-card",
    `project-card--${cardKind}`,
    project.tier ? `project-card--${project.tier}` : ""
  ].filter(Boolean).join(" ");

  if (project.link) {
    card.href = project.link;

    if (isExternal) {
      card.target = "_blank";
      card.rel = "noreferrer";
    }
  }

  const mediaSource = project.cover || project.poster;
  const mediaAlt = project.alt || project.posterAlt || project.title;
  const media = mediaSource
    ? isVideoAsset(mediaSource)
      ? `<video src="${mediaSource}" aria-label="${mediaAlt}" autoplay muted loop playsinline></video>`
      : `<img src="${mediaSource}" alt="${mediaAlt}" loading="lazy" />`
    : `<span class="thumb-placeholder">${project.mediaLabel || project.title}</span>`;

  const meta = [project.year, project.role].filter(Boolean).join(separator);

  card.innerHTML = `
    <div class="project-thumb">
      ${media}
    </div>
    <div class="project-body">
      ${meta ? `<span class="project-meta">${meta}</span>` : ""}
      <h4>${project.title}</h4>
      ${project.summary ? `<p>${project.summary}</p>` : ""}
      <span class="project-card-action">
        <span>${actionLabel}</span>
        ${actionMark ? `<span class="project-card-action-mark" aria-hidden="true">${actionMark}</span>` : ""}
      </span>
    </div>
  `;

  return card;
};

const renderProjects = (projects, separator, categories, actionLabels) => {
  const container = document.querySelector("#project-groups");
  if (!container) return;

  const normalizeProject = window.ProjectAuthoring?.normalizeProject || ((item) => item);
  const normalizedProjects = projects.map(normalizeProject);

  container.replaceChildren();

  categories.forEach((category) => {
    const categoryProjects = normalizedProjects.filter((project) => project.category === category.id);
    if (!categoryProjects.length) return;

    const group = document.createElement("section");
    const heading = document.createElement("h3");
    const grid = document.createElement("div");
    const categoryLabel = category.label || category.id;

    group.className = `project-group project-group--${category.id}`;
    heading.className = "project-group-title";
    heading.id = `project-group-${category.id}`;
    heading.textContent = categoryLabel;
    grid.className = "project-grid compact";
    group.setAttribute("aria-labelledby", heading.id);

    categoryProjects.forEach((project) => {
      grid.append(createProjectCard(project, separator, actionLabels));
    });

    if (category.ghost) {
      const ghost = document.createElement("p");
      ghost.className = "section-ghost project-group-ghost";
      ghost.setAttribute("aria-hidden", "true");
      ghost.textContent = category.ghost;
      group.append(ghost);
    }

    group.append(heading, grid);
    container.append(group);
  });
};

const renderContactLinks = (links) => {
  const container = document.querySelector("#contact-links");
  if (!container) return;

  container.replaceChildren();

  links.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;

    if (!item.href.startsWith("mailto:")) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }

    container.append(link);
  });
};

const startHeroMedia = () => {
  const hero = document.querySelector(".hero");
  const media = hero?.querySelector("[data-hero-media]");
  const video = hero?.querySelector("[data-hero-video]");
  const status = hero?.querySelector("[data-hero-media-status]");
  if (!hero || !media || !video || !status) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isInViewport = true;
  let hasError = false;
  let resumeAt = null;

  const pause = () => {
    if (Number.isFinite(video.currentTime)) {
      resumeAt = video.currentTime;
    }

    video.pause();
  };

  const mayAutoplay = () => {
    return !hasError && isInViewport && !document.hidden && !reducedMotion.matches;
  };

  const play = async () => {
    if (!mayAutoplay()) return;

    try {
      if (resumeAt !== null && Math.abs(video.currentTime - resumeAt) > 0.05) {
        video.currentTime = resumeAt;
      }

      await video.play();
      resumeAt = null;
    } catch {}
  };

  video.addEventListener("playing", () => {
    media.classList.add("is-video-ready");
  });

  video.addEventListener("error", () => {
    hasError = true;
    media.classList.remove("is-video-ready");
    media.classList.add("is-error");
    status.hidden = false;
    pause();
  });

  const handleMotionPreference = () => {
    if (reducedMotion.matches) {
      pause();
      return;
    }

    play();
  };

  reducedMotion.addEventListener?.("change", handleMotionPreference);

  const viewportObserver = new IntersectionObserver(
    ([entry]) => {
      isInViewport = entry.isIntersecting;

      if (isInViewport) {
        play();
      } else {
        pause();
      }
    },
    { threshold: 0.18 }
  );

  viewportObserver.observe(hero);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pause();
    } else {
      play();
    }
  });

  play();
};

const startRevealObserver = () => {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.04 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
};

const getHeadingRevealVariant = (heading) => {
  if (heading.classList.contains("project-group-title")) return "project-group";
  if (heading.classList.contains("eyebrow")) return "eyebrow";
  if (heading.classList.contains("contact-note")) return "contact-note";
  if (heading.closest(".artist-section")) return "artist";
  if (heading.closest(".skill-card")) return "skill-card";
  if (heading.closest(".project-detail")) return "project-detail";
  return "section-heading";
};

const startHeadingRevealObserver = () => {
  const headings = document.querySelectorAll("main h1:not(#hero-title), main h2, main h3, .artist-heading, .contact-note");
  if (!headings.length) return;

  headings.forEach((heading) => {
    if (heading.classList.contains("heading-reveal")) return;

    const inner = document.createElement("span");
    inner.className = `heading-reveal-inner heading-reveal-inner--${getHeadingRevealVariant(heading)}`;

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

const setYear = () => {
  const year = document.querySelector("#year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
};

const renderSite = (localeContent, locale) => {
  document.documentElement.lang = locale;
  document.title = localeContent.meta.title;

  applyTextBindings(localeContent);
  renderNav(localeContent.nav);
  renderParagraphs(localeContent.artist.body);
  renderSkills(localeContent.skills.items);
  renderResumeEntries("education-list", localeContent.education.items);
  renderResumeEntries("industry-list", localeContent.industry.items);
  renderProjects(
    localeContent.projects,
    localeContent.projectsSection.metaSeparator,
    localeContent.projectsSection.categories,
    localeContent.projectsSection.cardActions
  );
  renderContactLinks(localeContent.contact.links);
  startArtistDisclosureBehavior();
  startHeroMedia();
  window.PortfolioMedia?.startViewportVideoPlayback();
  startRevealObserver();
  startHeadingRevealObserver();
  startHeaderScrollBehavior();
  setYear();
};

const init = async () => {
  const response = await fetch(CONTENT_URL);
  const content = await response.json();
  const locale = getRequestedLocale(content);

  renderSite(content.locales[locale], locale);
};

init();
