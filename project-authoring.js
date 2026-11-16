(function (root) {
  const SECTION_LAYOUTS = new Set(["text-only", "text-with-media", "evidence-stack"]);

  const toArray = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value.filter(Boolean) : [value];
  };

  const firstPresent = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

  const getYouTubeMedia = (source) => {
    if (typeof source !== "string" || !/^https?:\/\//i.test(source.trim())) return null;

    let url;
    try {
      url = new URL(source);
    } catch {
      return null;
    }

    const host = url.hostname.replace(/^www\./, "");
    const segments = url.pathname.split("/").filter(Boolean);
    let videoId;

    if (host === "youtu.be") {
      videoId = segments[0];
    } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      videoId = segments[0] === "watch"
        ? url.searchParams.get("v")
        : ["embed", "shorts", "live"].includes(segments[0]) ? segments[1] : null;
    }

    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId || "")) return null;

    const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
    embedUrl.searchParams.set("playsinline", "1");

    const time = url.searchParams.get("start") || url.searchParams.get("t") || "";
    const parts = time.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
    const seconds = /^\d+$/.test(time)
      ? Number(time)
      : parts ? Number(parts[1] || 0) * 3600 + Number(parts[2] || 0) * 60 + Number(parts[3] || 0) : 0;
    if (Number.isSafeInteger(seconds) && seconds > 0) embedUrl.searchParams.set("start", String(seconds));

    return {
      videoId,
      embedSrc: embedUrl.href,
      thumbnailSrc: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };
  };

  const normalizeMedia = (media, fallback = {}) => {
    if (!media) return null;

    if (typeof media === "string") {
      return {
        src: media,
        alt: fallback.alt || fallback.title || "Project media",
        youtube: getYouTubeMedia(media),
      };
    }

    return {
      ...media,
      alt: media.alt || media.title || fallback.alt || fallback.title || "Project media",
      youtube: getYouTubeMedia(media.src),
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
    if (media.length || section.gallery?.media?.length || section.gallery?.rows?.some((row) => row.media?.length)) return "text-with-media";
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
      sidebarMedia: normalizeMedia(section.sidebarMedia),
      gallery: section.gallery ? {
        ...section.gallery,
        media: normalizeMediaList(section.gallery.media),
        rows: toArray(section.gallery.rows).map((row) => ({ ...row, media: normalizeMediaList(row.media) })),
      } : null,
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
    const visualBreakMedia =
      project.visualBreakMedia === false
        ? false
        : normalizeMediaList(project.visualBreakMedia || detailMedia[1] || detailMedia[0], {
            title: project.title,
          });
    const rawSections = project.story?.sections?.length ? project.story.sections : project.detailSections || fallbackSectionsFromDetailBody(project);

    return {
      ...project,
      coverMedia,
      cover: coverMedia?.youtube?.thumbnailSrc || coverMedia?.src || project.cover,
      alt: coverMedia?.alt || project.alt,
      overview: normalizeOverview(project),
      timeline: project.story?.timeline || project.timeline || [],
      detailMedia,
      visualBreakMedia,
      walkthroughMedia: normalizeMediaList(project.walkthroughMedia, { title: project.title }),
      detailSections: rawSections.map((section) =>
        normalizeSection(section, {
          title: project.title,
        })
      ),
    };
  };

  root.ProjectAuthoring = {
    getYouTubeMedia,
    normalizeMedia,
    normalizeMediaList,
    normalizeProject,
    normalizeSection,
  };

  if (typeof module !== "undefined") {
    module.exports = root.ProjectAuthoring;
  }
})(typeof window !== "undefined" ? window : globalThis);
