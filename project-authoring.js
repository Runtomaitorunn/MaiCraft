(function (root) {
  const SECTION_LAYOUTS = new Set(["text-only", "text-with-media", "evidence-stack"]);

  const toArray = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value.filter(Boolean) : [value];
  };

  const firstPresent = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

  const normalizeMedia = (media, fallback = {}) => {
    if (!media) return null;

    if (typeof media === "string") {
      return {
        src: media,
        alt: fallback.alt || fallback.title || "Project media",
      };
    }

    return {
      ...media,
      alt: media.alt || media.title || fallback.alt || fallback.title || "Project media",
    };
  };

  const normalizeMediaList = (media, fallback = {}) =>
    toArray(media)
      .map((item) => normalizeMedia(item, fallback))
      .filter(Boolean);

  const normalizeOverview = (project) => {
    const rawOverview = project.overview && typeof project.overview === "object" ? project.overview : {};
    const body =
      typeof project.overview === "string"
        ? project.overview
        : firstPresent(rawOverview.body, project.detailBody?.[0], project.detailHeading, project.summary);

    return {
      heading: firstPresent(rawOverview.heading, project.overviewHeading, project.detailHeading, project.summary),
      body,
      points: toArray(rawOverview.points),
    };
  };

  const getLegacySectionMedia = (section) =>
    firstPresent(section.media, section.mediaSlots, section.mediaList, section.mediaSlot);

  const normalizeSectionLayout = (section, media) => {
    if (SECTION_LAYOUTS.has(section.layout)) return section.layout;
    if (section.mediaLayout === "impact-gallery" || section.observation || section.note) return "evidence-stack";
    if (media.length) return "text-with-media";
    return "text-only";
  };

  const normalizeSection = (section, fallback = {}) => {
    const media = normalizeMediaList(getLegacySectionMedia(section), {
      title: section.title || fallback.title,
    });
    const layout = normalizeSectionLayout(section, media);

    return {
      ...section,
      layout,
      body: toArray(section.body),
      media,
      note: section.note || section.observation || null,
    };
  };

  const fallbackSectionsFromDetailBody = (project) =>
    toArray(project.detailBody)
      .slice(1)
      .map((paragraph) => ({
        body: [paragraph],
      }));

  const normalizeProject = (project) => {
    const coverMedia = normalizeMedia(project.coverMedia || { src: project.cover, alt: project.alt }, {
      title: project.title,
    });
    const detailMedia = normalizeMediaList(project.detailMedia?.length ? project.detailMedia : coverMedia, {
      title: project.title,
    });
    const visualBreakMedia = normalizeMediaList(project.visualBreakMedia || detailMedia[1] || detailMedia[0], {
      title: project.title,
    });
    const rawSections = project.story?.sections?.length ? project.story.sections : project.detailSections || fallbackSectionsFromDetailBody(project);

    return {
      ...project,
      coverMedia,
      cover: coverMedia?.src || project.cover,
      alt: coverMedia?.alt || project.alt,
      overview: normalizeOverview(project),
      timeline: project.story?.timeline || project.timeline || [],
      detailMedia,
      visualBreakMedia,
      detailSections: rawSections.map((section) =>
        normalizeSection(section, {
          title: project.title,
        })
      ),
    };
  };

  root.ProjectAuthoring = {
    normalizeMedia,
    normalizeMediaList,
    normalizeProject,
    normalizeSection,
  };

  if (typeof module !== "undefined") {
    module.exports = root.ProjectAuthoring;
  }
})(typeof window !== "undefined" ? window : globalThis);
