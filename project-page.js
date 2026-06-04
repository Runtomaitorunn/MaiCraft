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

const renderProjectPage = (project, localeContent, locale) => {
  const root = document.querySelector("#project-detail");
  if (!root) return;

  document.documentElement.lang = locale;
  document.title = `${project.title} | ${localeContent.brand.name}`;

  const body = (project.detailBody || []).map((paragraph) => `<p>${paragraph}</p>`).join("");
  const media = project.detailMedia?.length ? project.detailMedia : [{ src: project.cover, alt: project.alt }];
  const gallery = media
    .map((item) => `<figure><img src="${normalizeAssetPath(item.src)}" alt="${item.alt || project.title}" loading="lazy" /></figure>`)
    .join("");

  root.innerHTML = `
    <header class="project-detail-header">
      <a class="back-link" href="../index.html#projects">Back to projects</a>
      <span class="project-meta">${[project.year, project.role].filter(Boolean).join(localeContent.projectsSection.metaSeparator)}</span>
      <h1>${project.title}</h1>
      <p>${project.detailHeading || project.summary}</p>
    </header>
    <section class="project-detail-hero">
      <img src="${normalizeAssetPath(project.cover)}" alt="${project.alt || project.title}" />
    </section>
    <section class="project-detail-body">
      <div>${body}</div>
      <aside>
        <span class="eyebrow">Project focus</span>
        <p>${project.summary}</p>
      </aside>
    </section>
    <section class="project-detail-gallery">
      ${gallery}
    </section>
  `;
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
      <header class="project-detail-header">
        <a class="back-link" href="../index.html#projects">Back to projects</a>
        <h1>Project not found</h1>
      </header>
    `;
    return;
  }

  renderProjectPage(project, localeContent, locale);
};

init();
