const assert = require("node:assert/strict");
const { test } = require("node:test");
const { getYouTubeMedia, normalizeMedia, normalizeProject } = require("../project-authoring.js");

const videoId = "M7lc1UVf-VE";

for (const source of [
  `https://www.youtube.com/watch?v=${videoId}&si=tracking`,
  `https://youtu.be/${videoId}`,
  `https://m.youtube.com/watch?v=${videoId}`,
  `https://www.youtube.com/embed/${videoId}`,
  `https://www.youtube-nocookie.com/embed/${videoId}`,
  `https://youtube.com/shorts/${videoId}`,
  `https://youtube.com/live/${videoId}`,
]) {
  test(`recognizes ${source}`, () => {
    const media = getYouTubeMedia(source);
    assert.equal(media.videoId, videoId);
    assert.equal(media.embedSrc, `https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1`);
  });
}

test("preserves share and embed start times without importing autoplay or tracking", () => {
  for (const time of ["90", "90s", "1m30s"]) {
    const media = getYouTubeMedia(`https://youtu.be/${videoId}?t=${time}&autoplay=1&si=tracking`);
    const url = new URL(media.embedSrc);
    assert.equal(url.searchParams.get("start"), "90");
    assert.equal(url.searchParams.has("autoplay"), false);
    assert.equal(url.searchParams.has("si"), false);
  }
  assert.equal(new URL(getYouTubeMedia(`https://youtube.com/embed/${videoId}?start=12`).embedSrc).searchParams.get("start"), "12");
});

test("does not turn local media, unrelated domains, or invalid video IDs into embeds", () => {
  for (const source of [
    "assets/projects/demo/walkthrough.mp4",
    "assets/projects/demo/cover.webp",
    `https://youtube.com.evil.example/watch?v=${videoId}`,
    `https://evil.example/youtube.com/watch?v=${videoId}`,
    `javascript:alert('${videoId}')`,
    "https://youtube.com/watch?v=bad-id",
    `https://youtube.com/channel/${videoId}`,
    "https://youtube.com/playlist?list=PL123",
    null,
    {},
  ]) assert.equal(getYouTubeMedia(source), null);
});

test("normalizes video objects and short string entries without mutating the input", () => {
  const source = { src: `https://youtu.be/${videoId}`, alt: "Interaction walkthrough", caption: "Demo caption" };
  const media = normalizeMedia(source);
  assert.equal(source.youtube, undefined);
  assert.equal(media.alt, source.alt);
  assert.equal(media.caption, source.caption);
  assert.equal(media.youtube.videoId, videoId);
  assert.equal(normalizeMedia(source.src, { title: "Demo" }).alt, "Demo");
});

test("keeps local image and video source paths unchanged", () => {
  for (const src of ["assets/projects/demo/cover.webp", "assets/projects/demo/demo.mp4"]) {
    const media = normalizeMedia({ src, alt: "Demo" });
    assert.equal(media.src, src);
    assert.equal(media.youtube, null);
  }
});

test("uses a thumbnail for a YouTube cover and supports every detail media slot", () => {
  const media = { src: `https://youtu.be/${videoId}`, alt: "Walkthrough" };
  const project = normalizeProject({
    title: "Demo", coverMedia: media, visualBreakMedia: [media], detailMedia: [media],
    story: { sections: [{ title: false, media: [media] }] },
  });
  assert.equal(project.cover, `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
  assert.equal(project.coverMedia.youtube.videoId, videoId);
  assert.equal(project.visualBreakMedia[0].youtube.videoId, videoId);
  assert.equal(project.detailMedia[0].youtube.videoId, videoId);
  assert.equal(project.detailSections[0].media[0].youtube.videoId, videoId);
  assert.equal(project.detailSections[0].title, false);
});
