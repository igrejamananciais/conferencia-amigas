(function () {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const revealItems = document.querySelectorAll(".reveal");

  function loadGoogleAnalytics(measurementId) {
    if (!measurementId || window.gtag) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.addEventListener("load", sendLandingVisitEvent, { once: true });
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", measurementId);
  }

  function sendLandingVisitEvent() {
    const searchParams = new URLSearchParams(window.location.search);

    window.gtag("event", "landing_visit", {
      utm_source: searchParams.get("utm_source") || "",
      utm_medium: searchParams.get("utm_medium") || "",
      utm_campaign: searchParams.get("utm_campaign") || "",
      utm_content: searchParams.get("utm_content") || "",
      page_location: window.location.href,
      debug_mode: true
    });
  }

  function initGoogleAnalytics() {
    fetch("/api/ga-id")
      .then((response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (data && data.measurementId) loadGoogleAnalytics(data.measurementId);
      })
      .catch(() => {});
  }

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  function initPhotoMarquee() {
    const track = document.querySelector("[data-photo-track]");
    if (!track || track.dataset.marqueeReady) return;

    Array.from(track.children).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    track.dataset.marqueeReady = "true";
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
  initPhotoMarquee();
  initGoogleAnalytics();
  updateHeader();
}());
