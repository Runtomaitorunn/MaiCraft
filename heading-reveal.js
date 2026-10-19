export const startHeadingReveal = (selector) => {
  const headings = document.querySelectorAll(selector);
  if (!headings.length) return;

  headings.forEach((heading) => {
    if (heading.classList.contains("heading-reveal")) return;

    const inner = document.createElement("span");
    inner.className = "heading-reveal-inner";

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

  headings.forEach((heading) => {
    headingObserver.observe(heading);
  });
};
