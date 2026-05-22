(function () {
  "use strict";

  const yearEl = document.getElementById("year");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const backToTop = document.querySelector(".back-to-top");
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");
  const statValues = document.querySelectorAll(".stat-value[data-count]");
  const revealSections = document.querySelectorAll(
    ".hero, .section, .project-card, .skill-card"
  );

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function setNavOpen(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = "";

    document.querySelectorAll("section[id]").forEach((section) => {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach((el) => statsObserver.observe(el));

  revealSections.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealSections.forEach((el) => revealObserver.observe(el));

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function showError(id, message) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(`${id}-error`);
    input.classList.add("invalid");
    errorEl.textContent = message;
  }

  function clearErrors() {
    ["name", "email", "message"].forEach((id) => {
      document.getElementById(id).classList.remove("invalid");
      document.getElementById(`${id}-error`).textContent = "";
    });
    formSuccess.hidden = true;
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    let valid = true;

    if (!name) {
      showError("name", "Please enter your name.");
      valid = false;
    }

    if (!email) {
      showError("email", "Please enter your email.");
      valid = false;
    } else if (!validateEmail(email)) {
      showError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (!message) {
      showError("message", "Please enter a message.");
      valid = false;
    }

    if (!valid) return;

    const payload = { name, email, message, sentAt: new Date().toISOString() };
    const stored = JSON.parse(localStorage.getItem("portfolioMessages") || "[]");
    stored.push(payload);
    localStorage.setItem("portfolioMessages", JSON.stringify(stored));

    contactForm.reset();
    formSuccess.hidden = false;
  });
})();
