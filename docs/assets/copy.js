(() => {
  function initCodeCopyButtons() {
    const codes = document.querySelectorAll("pre > code");
    if (!codes || codes.length === 0) return;

    if (!document.getElementById("copy-live")) {
      const live = document.createElement("div");
      live.id = "copy-live";
      live.className = "visually-hidden";
      live.setAttribute("aria-live", "polite");
      live.setAttribute("aria-atomic", "true");
      document.body.appendChild(live);
    }

    let toast = document.querySelector(".copy-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "copy-toast";
      toast.setAttribute("role", "status");
      toast.textContent = "Code copied to clipboard";
      document.body.appendChild(toast);
    }

    codes.forEach((code) => {
      const pre = code.parentElement;
      if (!pre || pre.dataset.copyEnhanced) return;
      pre.dataset.copyEnhanced = "1";

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", "Copy code");
      btn.textContent = "Copy";
      pre.appendChild(btn);

      async function showToast() {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1600);
      }

      btn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        const text = code.innerText;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
          }

          btn.classList.add("copied");
          btn.textContent = "Copied";
          const live = document.getElementById("copy-live");
          if (live) live.textContent = "Code copied to clipboard";
          showToast();
          setTimeout(() => {
            btn.classList.remove("copied");
            btn.textContent = "Copy";
          }, 1600);
        } catch (err) {
          console.warn("copy failed", err);
          const live = document.getElementById("copy-live");
          if (live) live.textContent = "Copy failed";
          alert("Copy failed");
        }
      });
    });
  }

  window.addEventListener("load", initCodeCopyButtons);
})();
