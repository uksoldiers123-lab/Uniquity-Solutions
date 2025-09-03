
(() => {
  // Read some basic page info
  const pageData = {
    title: document.title || "Untitled",
    sections: Array.from(document.querySelectorAll("h2, h3"))
      .filter(el => el.id || el.textContent.trim())
      .slice(0, 6) // optional cap
      .map((el) => ({
        id: (el.id || el.textContent.trim().toLowerCase().replace(/\s+/g, "-")),
        label: el.tagName.toLowerCase() + ": " + (el.textContent.trim() || "Section")
      }))
  };

  // Simple helper
  const $ = (sel, root=document) => root.querySelector(sel);

  // Mobile nav toggle
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const body = document.body;

  function openMenu(){
    mobileMenu?.classList.add("open");
    body.classList.add("no-scroll");
    if (menuBtn) menuBtn.setAttribute("aria-expanded","true");
  }
  function closeMenu(){
    mobileMenu?.classList.remove("open");
    body.classList.remove("no-scroll");
    if (menuBtn) menuBtn.setAttribute("aria-expanded","false");
  }

  if (menuBtn && mobileMenu){
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Accessibility outline (optional)
  function renderOutline(){
    const outline = document.createElement("nav");
    outline.setAttribute("aria-label","Page outline");
    outline.style.position = "absolute"; outline.style.left = "-9999px";
    const ul = document.createElement("ul");
    pageData.sections.forEach(s => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${s.id}`;
      a.textContent = s.label;
      li.appendChild(a);
      ul.appendChild(li);
    });
    outline.appendChild(ul);
    document.body.appendChild(outline);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (pageData.title) document.title = pageData.title;
    renderOutline();
  });
})();
