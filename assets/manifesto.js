(function () {
  const body = document.body;
  const menuButton = document.querySelector("[data-menu-toggle]");
  const backdrop = document.querySelector("[data-reader-backdrop]");
  const toc = document.querySelector("[data-reader-toc]");
  const article = document.querySelector(".reader-document article");
  const copyButton = document.querySelector("[data-copy-link]");
  const toast = document.querySelector("[data-toast]");
  const titleTarget = document.querySelector("[data-reader-title]");

  function slugify(value, index) {
    const clean = value
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "");
    return clean || `section-${index + 1}`;
  }

  function setSidebar(open) {
    body.classList.toggle("sidebar-open", open);
    if (menuButton) menuButton.setAttribute("aria-expanded", String(open));
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  if (article && toc) {
    const headings = Array.from(article.querySelectorAll("h1, h2, h3"));
    const used = new Set();

    headings.forEach((heading, index) => {
      const text = heading.textContent.replace(/\s+/g, " ").trim();
      let id = heading.id || slugify(text, index);
      while (used.has(id)) id = `${id}-${index + 1}`;
      used.add(id);
      heading.id = id;

      if (index === 0 && titleTarget) titleTarget.textContent = text;

      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = text;
      link.style.paddingInlineStart = heading.tagName === "H2" ? "1.35rem" : heading.tagName === "H3" ? "2rem" : "0.7rem";
      link.addEventListener("click", () => setSidebar(false));
      item.appendChild(link);
      toc.appendChild(item);
    });
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => setSidebar(!body.classList.contains("sidebar-open")));
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => setSidebar(false));
  }

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast(copyButton.dataset.copied || "Link copied");
      } catch (error) {
        showToast(copyButton.dataset.copyFailed || "Copy failed");
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSidebar(false);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
})();
