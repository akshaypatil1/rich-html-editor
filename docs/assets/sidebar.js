(() => {
  const HEADER_SELECTOR = ".site-header-inner";
  const SIDEBAR_SELECTOR = ".sidebar";

  function initMobileSidebar() {
    const header = document.querySelector(HEADER_SELECTOR);
    const sidebar = document.querySelector(SIDEBAR_SELECTOR);
    const main = document.querySelector("main");
    if (!header || !sidebar) return;

    if (!sidebar.id) sidebar.id = "site-sidebar";
    sidebar.setAttribute("role", "navigation");
    sidebar.setAttribute("aria-label", "Documentation navigation");
    sidebar.setAttribute("tabindex", "-1");

    if (!document.querySelector(".sidebar-toggle")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sidebar-toggle";
      btn.setAttribute("aria-label", "Open navigation");
      btn.setAttribute("aria-controls", sidebar.id);
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML =
        '<span class="hamburger" aria-hidden="true"><span></span><span></span><span></span></span><span class="visually-hidden">Menu</span>';
      document.body.appendChild(btn);

      const overlay = document.createElement("div");
      overlay.className = "sidebar-overlay";
      overlay.setAttribute("aria-hidden", "true");
      document.body.appendChild(overlay);

      // focus trap helpers
      let previouslyFocused = null;
      let onKeydown = null;

      function getFocusable(el) {
        if (!el) return [];
        const selector =
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        return Array.from(el.querySelectorAll(selector)).filter(
          (node) => node.offsetParent !== null
        );
      }

      function trapFocus(e) {
        if (e.key !== "Tab") return;
        const focusable = getFocusable(sidebar);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (
            document.activeElement === first ||
            document.activeElement === sidebar
          ) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      function openSidebar() {
        previouslyFocused = document.activeElement;
        sidebar.classList.add("open");
        overlay.classList.add("visible");
        overlay.setAttribute("aria-hidden", "false");
        btn.setAttribute("aria-expanded", "true");
        btn.classList.add("open");
        btn.setAttribute("aria-label", "Close navigation");
        if (main) main.setAttribute("aria-hidden", "true");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        const focusable = getFocusable(sidebar);
        (focusable[0] || sidebar).focus();
        onKeydown = (ev) => {
          if (ev.key === "Escape") {
            ev.preventDefault();
            closeSidebar();
          } else if (ev.key === "Tab") {
            trapFocus(ev);
          }
        };
        document.addEventListener("keydown", onKeydown);
      }

      function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("visible");
        overlay.setAttribute("aria-hidden", "true");
        btn.setAttribute("aria-expanded", "false");
        btn.classList.remove("open");
        btn.setAttribute("aria-label", "Open navigation");
        if (main) main.removeAttribute("aria-hidden");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        if (onKeydown) document.removeEventListener("keydown", onKeydown);
        onKeydown = null;
        try {
          (previouslyFocused || btn).focus();
        } catch (e) {}
      }

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains("open")) closeSidebar();
        else openSidebar();
      });
      overlay.addEventListener("click", closeSidebar);
      sidebar.addEventListener("click", (ev) => {
        const a = ev.target.closest && ev.target.closest("a");
        if (a && window.innerWidth <= 900) closeSidebar();
      });
      btn.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          btn.click();
        }
      });
    }
  }

  // Initialize on load and on resize (debounced)
  let resizeTimer = null;
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => initMobileSidebar(), 120);
  }
  window.addEventListener("load", initMobileSidebar);
  window.addEventListener("resize", onResize);
})();
