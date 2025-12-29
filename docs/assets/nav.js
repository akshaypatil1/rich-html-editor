(() => {
  // Normalize path (works for GitHub Pages + file://)
  const currentPath = window.location.pathname.split("/").pop().toLowerCase();

  // Select all sidebar links
  const navLinks = document.querySelectorAll(".sidebar a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const linkPath = href.split("/").pop().toLowerCase();

    // Match current page
    if (
      linkPath === currentPath ||
      (currentPath === "" && linkPath === "index.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
})();
