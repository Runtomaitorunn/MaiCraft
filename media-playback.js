(function (root) {
  const observedVideos = new WeakSet();
  const userPausedVideos = new WeakSet();
  const viewportPausedVideos = new WeakSet();
  let viewportVideoObserver = null;

  const selector = "video[autoplay][muted]";

  const pauseForViewport = (video) => {
    if (video.paused) return;

    viewportPausedVideos.add(video);
    video.pause();
  };

  const playForViewport = (video) => {
    if (userPausedVideos.has(video)) return;

    const playAttempt = video.play();
    if (playAttempt?.catch) {
      playAttempt.catch(() => {});
    }
  };

  const prepareVideo = (video) => {
    if (observedVideos.has(video)) return false;

    observedVideos.add(video);

    video.addEventListener("pause", () => {
      if (viewportPausedVideos.has(video)) {
        viewportPausedVideos.delete(video);
        return;
      }

      userPausedVideos.add(video);
    });

    video.addEventListener("play", () => {
      userPausedVideos.delete(video);
    });

    return true;
  };

  const startViewportVideoPlayback = (scope = document) => {
    if (!("IntersectionObserver" in root)) return;

    const videos = Array.from(scope.querySelectorAll(selector));
    if (!videos.length) return;

    if (!viewportVideoObserver) {
      viewportVideoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;

            if (entry.isIntersecting) {
              playForViewport(video);
            } else {
              pauseForViewport(video);
            }
          });
        },
        { threshold: 0 }
      );
    }

    videos.forEach((video) => {
      if (prepareVideo(video)) {
        viewportVideoObserver.observe(video);
      }
    });
  };

  root.PortfolioMedia = {
    ...(root.PortfolioMedia || {}),
    startViewportVideoPlayback,
  };
})(typeof window !== "undefined" ? window : globalThis);
