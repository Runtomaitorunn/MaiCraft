(function () {
  const form = document.querySelector("[data-media-practice]");
  if (!form) return;

  const field = form.querySelector("textarea");
  const feedback = document.querySelector("[data-feedback]");
  const address = document.querySelector("[data-embed-address]");
  const preview = document.querySelector("[data-preview]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    preview.replaceChildren();
    address.textContent = "";
    feedback.classList.remove("error");

    try {
      const input = JSON.parse(field.value);
      const media = window.ProjectAuthoring.normalizeMedia(input);
      if (!media?.youtube) throw new Error("请把可识别的 YouTube 视频链接填入 src，例如 https://youtu.be/M7lc1UVf-VE。");
      if (!input.alt || typeof input.alt !== "string" || !input.alt.trim()) throw new Error("请补上 alt，写清楚这段视频的内容。它会成为播放器的可访问名称。");

      address.textContent = media.youtube.embedSrc;
      if (location.protocol === "file:") {
        feedback.textContent = "链接识别成功。播放器预览请从本地 HTTP 服务器打开本课，避免缺少 Referer 导致播放错误。";
        return;
      }

      const player = document.createElement("iframe");
      player.className = "lesson-video";
      player.src = media.youtube.embedSrc;
      player.title = media.alt;
      player.allow = "encrypted-media; picture-in-picture; fullscreen";
      player.allowFullscreen = true;
      player.referrerPolicy = "strict-origin-when-cross-origin";
      preview.append(player);
      feedback.textContent = "识别成功。src 已转换成播放器地址；点击下方播放器即可观看。caption 只影响图注，不会改变播放的视频。";
    } catch (error) {
      feedback.classList.add("error");
      feedback.textContent = error instanceof SyntaxError ? "JSON 格式不正确。检查引号、逗号和大括号后再试。" : error.message;
    }
  });
})();
