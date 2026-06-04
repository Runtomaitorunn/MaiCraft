const CONTENT_URL = "data/content.json";
const FALLBACK_LOCALE = "en";

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

    const description = document.createElement("p");
    description.textContent = skill.description;

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

    card.append(icon, title, description, tools);
    container.append(card);
  });
};

const createProjectCard = (project, separator) => {
  const card = document.createElement(project.link ? "a" : "article");
  card.className = [
    "project-card",
    project.featured ? "featured-card" : "",
    project.tier ? `project-card--${project.tier}` : ""
  ].filter(Boolean).join(" ");

  if (project.link) {
    card.href = project.link;

    if (/^https?:\/\//.test(project.link)) {
      card.target = "_blank";
      card.rel = "noreferrer";
    }
  }

  const media = project.cover
    ? `<img src="${project.cover}" alt="${project.alt || project.title}" loading="lazy" />`
    : `<span class="thumb-placeholder">${project.mediaLabel}</span>`;

  card.innerHTML = `
    <div class="project-thumb">${media}</div>
    <div class="project-body">
      <span class="project-meta">${[project.year, project.role].filter(Boolean).join(separator)}</span>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
    </div>
  `;

  return card;
};

const renderProjects = (projects, separator) => {
  const featuredContainer = document.querySelector("#featured-projects");
  const gridContainer = document.querySelector("#project-grid");

  if (!featuredContainer || !gridContainer) return;

  featuredContainer.replaceChildren();
  gridContainer.replaceChildren();

  projects.forEach((project) => {
    const card = createProjectCard(project, separator);

    if (project.featured) {
      featuredContainer.append(card);
    } else {
      gridContainer.append(card);
    }
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

const startRotatingText = (phrases) => {
  const rotatingText = document.querySelector("#rotating-text");
  if (!rotatingText || !phrases.length) return;

  let phraseIndex = 0;
  rotatingText.textContent = phrases[phraseIndex];

  window.setInterval(() => {
    rotatingText.classList.add("is-changing");

    window.setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      rotatingText.textContent = phrases[phraseIndex];
      rotatingText.classList.remove("is-changing");
    }, 280);
  }, 3500);
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
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
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
  renderProjects(localeContent.projects, localeContent.projectsSection.metaSeparator);
  renderContactLinks(localeContent.contact.links);
  startRotatingText(localeContent.hero.rotatingPhrases);
  startRevealObserver();
  setYear();
};

const init = async () => {
  const response = await fetch(CONTENT_URL);
  const content = await response.json();
  const locale = getRequestedLocale(content);

  renderSite(content.locales[locale], locale);
};

init();
