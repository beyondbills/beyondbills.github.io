(function () {
    const body = document.body;
    const menuButton = document.querySelector("[data-menu-toggle]");
    const backdrop = document.querySelector("[data-reader-backdrop]");
    const toc = document.querySelector("[data-reader-toc]");
    const article = document.querySelector(".reader-document article");
    const copyButton = document.querySelector("[data-copy-link]");
    const toast = document.querySelector("[data-toast]");
    const titleTarget = document.querySelector("[data-reader-title]");
    const readerBar = document.querySelector(".reader-bar");
    const progress = document.createElement("span");
    progress.className = "reader-progress";
    progress.setAttribute("aria-hidden", "true");
    if (readerBar) readerBar.appendChild(progress);

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
        if (menuButton) menuButton.classList.toggle("menu-active", open);
        if (open && readerBar) readerBar.classList.remove("is-hidden");
        updateMenuIcon(open);
    }

    function updateMenuIcon(open) {
        const icon = menuButton && menuButton.querySelector("[data-lucide]");
        if (!icon) return;
        icon.setAttribute("data-lucide", open ? "x" : "menu");
        if (window.lucide) window.lucide.createIcons();
    }

    function setTitle(text) {
        if (!titleTarget || !text) return;
        const next = text.replace(/\s+/g, " ").trim();
        if (titleTarget.textContent === next) return;
        titleTarget.classList.add("is-changing");
        window.clearTimeout(setTitle.timer);
        setTitle.timer = window.setTimeout(() => {
            titleTarget.textContent = next;
            titleTarget.classList.remove("is-changing");
        }, 180);
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
    }

    let updateActiveSection = null;
    let lastScrollY = window.scrollY;

    function updateProgress() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const amount = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
        progress.style.transform = `scaleX(${amount})`;
    }

    function updateBarOnScroll() {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;

        if (readerBar && !body.classList.contains("sidebar-open")) {
            if (delta > 6 && currentY > 96) {
                readerBar.classList.add("is-hidden");
            } else if (delta < -4 || currentY <= 96) {
                readerBar.classList.remove("is-hidden");
            }
            readerBar.classList.toggle("is-compact", currentY > 48);
        }

        lastScrollY = currentY;
        updateProgress();
        if (updateActiveSection) updateActiveSection();
    }

    if (article && toc) {
        const headings = Array.from(article.querySelectorAll("h1, h2, h3"));
        const used = new Set();
        const links = [];

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
            links.push({ heading, link });
        });

        updateActiveSection = function updateActiveSectionImpl() {
            const offset = 110;
            let active = links[0];
            links.forEach((entry) => {
                if (entry.heading.getBoundingClientRect().top <= offset) active = entry;
            });
            links.forEach((entry) => entry.link.classList.toggle("is-active", entry === active));
            if (active) setTitle(active.heading.textContent);
        };

        updateActiveSection();
    }

    updateBarOnScroll();
    window.addEventListener("scroll", updateBarOnScroll, { passive: true });

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