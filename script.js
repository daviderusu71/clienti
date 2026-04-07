const themeToggle = document.getElementById("theme-toggle");
const backToTopButton = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const revealElements = document.querySelectorAll(".reveal");
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

const THEME_STORAGE_KEY = "david-developer-theme";

// Pastreaza preferinta de tema intre vizite.
const applyTheme = (theme) => {
  document.body.classList.toggle("light-theme", theme === "light");
};

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
if (savedTheme) {
  applyTheme(savedTheme);
}

themeToggle.addEventListener("click", () => {
  const isLightTheme = document.body.classList.toggle("light-theme");
  localStorage.setItem(THEME_STORAGE_KEY, isLightTheme ? "light" : "dark");
});

const closeMenu = () => {
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("is-active");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  siteNav.classList.toggle("is-open", isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 640) {
    closeMenu();
  }
});

// Afiseaza elegant elementele cand intra in viewport.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

// Face butonul de intoarcere sus vizibil dupa scroll.
const toggleBackToTop = () => {
  backToTopButton.classList.toggle("is-visible", window.scrollY > 500);
};

window.addEventListener("scroll", toggleBackToTop);
toggleBackToTop();

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const setFieldError = (field, message) => {
  const errorElement = field.parentElement.querySelector(".error-message");
  errorElement.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
};

const clearErrors = () => {
  const fields = contactForm.querySelectorAll("input, textarea");
  fields.forEach((field) => setFieldError(field, ""));
  formStatus.textContent = "";
};

// Verificare simpla pe campuri esentiale.
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");

  let isValid = true;

  if (nameField.value.trim().length < 2) {
    setFieldError(nameField, "Introdu un nume valid.");
    isValid = false;
  }

  if (!validateEmail(emailField.value)) {
    setFieldError(emailField, "Introdu o adresa de email valida.");
    isValid = false;
  }

  if (messageField.value.trim().length < 10) {
    setFieldError(messageField, "Mesajul trebuie sa contina cel putin 10 caractere.");
    isValid = false;
  }

  if (!isValid) {
    formStatus.textContent = "Te rog sa corectezi campurile marcate.";
    return;
  }

  formStatus.textContent = "Mesajul a fost validat cu succes. Iti voi raspunde curand.";
  contactForm.reset();
});
