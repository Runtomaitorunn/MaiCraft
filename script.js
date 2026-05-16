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

const renderSkills = (skills) => {
  const container = document.querySelector("#skill-cards");
  if (!container) return;

  container.replaceChildren();

  skills.forEach((skill) => {
    const card = document.createElement("article");
    card.className = "skill-card";
    card.innerHTML = `
      <div class="skill-icon" aria-hidden="true">${skill.icon}</div>
      <h3>${skill.title}</h3>
      <p>${skill.description}</p>
      <p class="skill-tools">${skill.tools}</p>
    `;
    container.append(card);
  });
};

const createProjectCard = (project, separator) => {
  const card = document.createElement(project.link ? "a" : "article");
  card.className = `project-card${project.featured ? " featured-card" : ""}`;

  if (project.link) {
    card.href = project.link;
    card.target = "_blank";
    card.rel = "noreferrer";
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
