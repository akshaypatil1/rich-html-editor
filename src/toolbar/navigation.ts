export function setupNavigation(toolbar: HTMLElement) {
  toolbar.addEventListener("keydown", (e: KeyboardEvent) => {
    const focusable = Array.from(
      toolbar.querySelectorAll<HTMLElement>("button, select, input, [tabindex]")
    ).filter((el) => !el.hasAttribute("disabled"));
    if (!focusable.length) return;
    const idx = focusable.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next =
        focusable[Math.min(focusable.length - 1, Math.max(0, idx + 1))];
      next?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = focusable[Math.max(0, idx - 1)] || focusable[0];
      prev?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      focusable[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      focusable[focusable.length - 1].focus();
    }
  });
}
