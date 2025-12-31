(() => {
  // Sidebar link highlighting (keeps behaviour minimal and focused)
  try {
    const currentPath = window.location.pathname.split("/").pop().toLowerCase();
    const navLinks = document.querySelectorAll(".sidebar a");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const linkPath = href.split("/").pop().toLowerCase();
      if (
        linkPath === currentPath ||
        (currentPath === "" && linkPath === "index.html")
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  } catch (e) {
    console.warn("nav init failed", e);
  }
})();
