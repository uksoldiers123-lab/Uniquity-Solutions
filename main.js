
(() => {
  // Simple data model for demonstration
  const pageData = {
    title: document.title || "Untitled",
    sections: [
      { id: "services", label: "Services" },
      { id: "partners", label: "Partners" },
      { id: "contact", label: "Contact" }
    ],
  };

  // Utility: safe query
  const $ = (sel, root = document) => root.querySelector(sel);

  // Mobile menu toggle (overlay)
  const menuBtn = $("#menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const body = document.body;

  function closeMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove("open");
      body.classList.remove("no-scroll");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }
  }

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add("open");
      body.classList.add("no-scroll");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    }
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Simple page outline (for screen readers / debug)
  function renderOutline() {
    const outlineContainer = document.createElement("nav");
    outlineContainer.setAttribute("aria-label", "Page outline");
    outlineContainer.style.position = "absolute";
    outlineContainer.style.left = "-9999px";
    outlineContainer.style.top = "auto";
    outlineContainer.style.width = "1px";
    outlineContainer.style.height = "1px";
    outlineContainer.style.overflow = "hidden";

    const ul = document.createElement("ul");
    pageData.sections.forEach((s) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${s.id}`;
      a.textContent = s.label;
      li.appendChild(a);
      ul.appendChild(li);
    });
    outlineContainer.appendChild(ul);
    document.body.appendChild(outlineContainer);
  }

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    // Optional: set document title from data
    if (pageData.title) document.title = pageData.title;

    // Build outline for accessibility
    renderOutline();

    // You can extend here: read meta tags, sections, etc.
  });
})();
