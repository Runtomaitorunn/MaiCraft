const rotatingPhrases = [
  "Immersive experiences.",
  "Art + sound installations.",
  "Virtual worlds.",
  "AR experiments.",
];

const fallbackProjects = [
  {
    title: "Featured Project One",
    year: "2026",
    role: "Creative Technologist",
    summary: "A short description for a major project. Replace this with your real work later.",
    cover: "",
    mediaLabel: "Featured media",
    link: "",
    featured: true,
  },
  {
    title: "Featured Project Two",
    year: "2025",
    role: "Designer / Researcher",
    summary: "Use this slot for a polished case study, installation, performance, or research project.",
    cover: "",
    mediaLabel: "Case study media",
    link: "",
    featured: true,
  },
  {
    title: "Prototype Study",
    year: "2025",
    role: "Interaction Design",
    summary: "A compact project card for smaller experiments, sketches, and prototypes.",
    cover: "",
    mediaLabel: "Prototype",
    link: "",
    featured: false,
  },
  {
    title: "Visual System",
    year: "2024",
    role: "Visual Design",
    summary: "A placeholder for visual work, identity studies, computational graphics, or motion tests.",
    cover: "",
    mediaLabel: "Visuals",
    link: "",
    featured: false,
  },
  {
    title: "Research Project",
    year: "2024",
    role: "Research",
    summary: "A card for academic, cultural heritage, XR, HCI, or design research work.",
    cover: "",
    mediaLabel: "Research",
    link: "",
    featured: false,
  },
];

const rotatingText = document.querySelector("#rotating-text");
let phraseIndex = 0;

if (rotatingText) {
  window.setInterval(() => {
    rotatingText.classList.add("is-changing");

    window.setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
      rotatingText.textContent = rotatingPhrases[phraseIndex];
      rotatingText.classList.remove("is-changing");
    }, 280);
  }, 3500);
}

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

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const createProjectCard = (project) => {
  const card = document.createElement(project.link ? "a" : "article");
  card.className = `project-card${project.featured ? " featured-card" : ""}`;

  if (project.link) {
    card.href = project.link;
    card.target = "_blank";
    card.rel = "noreferrer";
  }

  const media = project.cover
    ? `<img src="${project.cover}" alt="${project.alt || project.title}" loading="lazy" />`
    : `<span class="thumb-placeholder">${project.mediaLabel || "Project media"}</span>`;

  card.innerHTML = `
    <div class="project-thumb">${media}</div>
    <div class="project-body">
      <span class="project-meta">${[project.year, project.role].filter(Boolean).join(" / ")}</span>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
    </div>
  `;

  return card;
};

const appendProjects = (projects, featuredContainer, gridContainer) => {
  featuredContainer.replaceChildren();
  gridContainer.replaceChildren();

  projects.forEach((project) => {
    const card = createProjectCard(project);

    if (project.featured) {
      featuredContainer.append(card);
    } else {
      gridContainer.append(card);
    }
  });
};

const renderProjects = async () => {
  const featuredContainer = document.querySelector("#featured-projects");
  const gridContainer = document.querySelector("#project-grid");

  if (!featuredContainer || !gridContainer) return;

  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error("Project data unavailable");
    const projects = await response.json();
    appendProjects(projects, featuredContainer, gridContainer);
  } catch (error) {
    appendProjects(fallbackProjects, featuredContainer, gridContainer);
  }
};

renderProjects();
