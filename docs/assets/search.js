(() => {
  const input = document.getElementById("doc-search");
  const resultsBox = document.getElementById("search-results");

  if (!input || !resultsBox) return;

  function highlight(text, query) {
    if (!query) return text;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "ig");

    return text.replace(regex, "<mark>$1</mark>");
  }

  // Lightweight search index
  const pages = [
    {
      title: "Overview",
      url: "./index.html",
      keywords: "introduction overview what is rich html editor",
    },
    {
      title: "Getting Started",
      url: "./getting-started.html",
      keywords: "install setup iframe init initialize",
    },
    {
      title: "Core Concepts",
      url: "./concepts.html",
      keywords: "template iframe isolation editable regions",
    },
    {
      title: "Browser Usage",
      url: "./browser-usage.html",
      keywords: "cdn browser srcdoc iframe unpkg",
    },
    {
      title: "API Reference",
      url: "./api.html",
      keywords: "api reference methods options events editor",
    },
    {
      title: "Framework Guides",
      url: "./framework-guides.html",
      keywords: "react angular vue vanilla framework",
    },
    {
      title: "Security & Safety",
      url: "./security.html",
      keywords: "security iframe xss sanitize safety",
    },
    {
      title: "FAQ",
      url: "./faq.html",
      keywords: "questions answers common problems",
    },
    {
      title: "Roadmap",
      url: "./roadmap.html",
      keywords: "roadmap future plans features",
    },
  ];

  input.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    resultsBox.innerHTML = "";

    if (!query || query.length < 2) {
      resultsBox.classList.add("hidden");
      return;
    }

    const matches = pages.filter((page) => {
      return (
        page.title.toLowerCase().includes(query) ||
        page.keywords.includes(query)
      );
    });

    if (!matches.length) {
      resultsBox.innerHTML = "<div class='search-empty'>No results found</div>";
    } else {
      // resultsBox.innerHTML = matches
      //   .map((m) => `<a class="search-result" href="${m.url}">${m.title}</a>`)
      //   .join("");
      resultsBox.innerHTML = matches
        .map(
          (m) =>
            `<a class="search-result" href="${m.url}">
        ${highlight(m.title, query)}
      </a>`
        )
        .join("");
    }

    resultsBox.classList.remove("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!resultsBox.contains(e.target) && e.target !== input) {
      resultsBox.classList.add("hidden");
    }
  });

  // Keyboard shortcut: "/" focuses search
  document.addEventListener("keydown", (e) => {
    // Ignore if user is typing in an input or textarea
    const target = e.target;
    const isTyping =
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable;

    if (isTyping) return;

    if (e.key === "/") {
      e.preventDefault();
      input.focus();
    }

    // Escape closes results
    if (e.key === "Escape") {
      resultsBox.classList.add("hidden");
      input.blur();
    }
  });
})();
