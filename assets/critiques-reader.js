(() => {
  const lang = new URLSearchParams(location.search).get("lang") || document.documentElement.lang || "en";
  const isRtl = document.documentElement.dir === "rtl";
  const labels = { en: ["Contents", "Critiques & Answers", "Copy link", "Link copied", "Back to site", "Close contents", "Copy failed"], fr: ["Sommaire", "Critiques et réponses", "Copier le lien", "Lien copié", "Retour au site", "Fermer le sommaire", "Échec de la copie"], es: ["Contenido", "Críticas y respuestas", "Copiar enlace", "Enlace copiado", "Volver al sitio", "Cerrar contenido", "Error al copiar"], de: ["Inhalt", "Kritik und Antworten", "Link kopieren", "Link kopiert", "Zur Website", "Inhalt schließen", "Kopieren fehlgeschlagen"], it: ["Indice", "Critiche e risposte", "Copia link", "Link copiato", "Torna al sito", "Chiudi indice", "Copia non riuscita"], ru: ["Содержание", "Критика и ответы", "Копировать ссылку", "Ссылка скопирована", "На сайт", "Закрыть содержание", "Не удалось скопировать"], zh: ["目录", "质疑与回应", "复制链接", "链接已复制", "返回网站", "关闭目录", "复制失败"], ar: ["المحتويات", "الانتقادات والإجابات", "نسخ الرابط", "تم نسخ الرابط", "العودة إلى الموقع", "إغلاق المحتويات", "تعذر نسخ الرابط"] }[lang] || ["Contents", "Critiques & Answers", "Copy link", "Link copied", "Back to site", "Close contents", "Copy failed"];
  const icon = (name) => name === "menu" ? '<svg class="reader-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' : name === "back" ? '<svg class="reader-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6M9 12h12"/></svg>' : '<svg class="reader-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>';
  const closeIcon = '<svg class="reader-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  const bar = document.createElement("header"); bar.className = "reader-bar"; bar.dir = isRtl ? "rtl" : "ltr";
  const menuButton = `<button id="readerMenuToggle" type="button" aria-label="${labels[0]}" aria-expanded="false">${icon("menu")}</button>`;
  const title = `<span class="reader-title">${labels[1]}</span>`;
  const actions = `<div class="reader-actions"><a href="../index.html?lang=${encodeURIComponent(lang)}" aria-label="${labels[4]}">${icon("back")}</a><button id="readerCopyLink" type="button" aria-label="${labels[2]}">${icon("copy")}</button></div>`;
  bar.innerHTML = `${menuButton}${title}${actions}`;
  const aside = document.createElement("aside"); aside.className = "reader-sidebar"; aside.id = "readerSidebar"; aside.setAttribute("aria-label", labels[0]); aside.innerHTML = `<div class="reader-sidebar-heading"><h2>${labels[0]}</h2><button id="readerMenuClose" type="button" aria-label="${labels[5]}">${closeIcon}</button></div><ul id="readerContents"></ul>`;
  const scrim = document.createElement("div"); scrim.className = "reader-scrim";
  const body = document.body; body.prepend(bar, aside, scrim); body.setAttribute("dir", document.documentElement.dir || "ltr");
  const main = document.createElement("main"); main.className = "reader-main"; main.id = "readerMain";
  while (body.children.length > 3) main.append(body.children[3]); body.append(main);
  const copyStatus = document.createElement("div"); copyStatus.className = "reader-copy-toast"; copyStatus.setAttribute("role", "status"); copyStatus.setAttribute("aria-live", "polite"); body.append(copyStatus);
  const toc = aside.querySelector("ul"); let count = 0;
  main.querySelectorAll("h1,h2,h3").forEach((heading) => { if (!heading.id) heading.id = `section-${++count}`; const item = document.createElement("li"); if (heading.tagName === "H2") item.style.marginLeft = ".65rem"; const link = document.createElement("a"); link.href = `#${heading.id}`; link.textContent = heading.textContent.trim(); item.append(link); toc.append(item); });
  const toggle = (open) => { aside.classList.toggle("is-open", open); scrim.classList.toggle("is-open", open); document.getElementById("readerMenuToggle").setAttribute("aria-expanded", String(open)); };
  document.getElementById("readerMenuToggle").addEventListener("click", () => toggle(!aside.classList.contains("is-open"))); document.getElementById("readerMenuClose").addEventListener("click", () => toggle(false)); scrim.addEventListener("click", () => toggle(false)); toc.addEventListener("click", (event) => { if (event.target.closest("a")) toggle(false); });
  document.getElementById("readerCopyLink").addEventListener("click", async (event) => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(location.href);
        copied = true;
      }
    } catch { /* Use the local copy fallback when clipboard permission is unavailable. */ }
    if (!copied) {
      const input = document.createElement("textarea");
      input.value = location.href;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      try { copied = document.execCommand("copy"); } catch { copied = false; }
      input.remove();
    }
    const button = event.currentTarget;
    copyStatus.textContent = copied ? labels[3] : labels[6];
    copyStatus.classList.add("show");
    clearTimeout(copyStatus.hideTimer);
    copyStatus.hideTimer = setTimeout(() => {
      copyStatus.classList.remove("show");
      button.setAttribute("aria-label", labels[2]);
    }, 2200);
    if (copied) {
      button.setAttribute("aria-label", labels[3]);
    }
  });
})();
