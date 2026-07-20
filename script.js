(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const revealItems = document.querySelectorAll(".reveal");

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  function closeMenu() {
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -40px" });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}());
