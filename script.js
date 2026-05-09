const revealItems = document.querySelectorAll(".reveal");
const menuToggle = document.querySelector(".mobile-menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll('.main-nav a[href^="#"], .mobile-nav a[href^="#"]');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if ("IntersectionObserver" in window && sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: "-42% 0px -48% 0px", threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

if (menuToggle && mobileNav) {
  const closeMobileMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    header?.classList.remove("menu-open");
  };

  const openMobileMenu = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    mobileNav.classList.add("is-open");
    header?.classList.add("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    const target = event.target;

    if (!isOpen || !(target instanceof Node)) return;

    if (!mobileNav.contains(target) && !menuToggle.contains(target)) {
      closeMobileMenu();
    }
  });
}
