const header = document.querySelector("[data-header]");
const feedbackWindow = document.querySelector("[data-feedback-window]");
const feedbackForm = document.querySelector("[data-feedback-form]");
const formNote = document.querySelector("[data-form-note]");
const serviceSelect = document.querySelector("[data-service-select]");
const openFeedbackButtons = document.querySelectorAll("[data-open-feedback]");
const serviceButtons = document.querySelectorAll("[data-service]");
const minimizeButton = document.querySelector("[data-minimize]");

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

document.querySelectorAll(".reveal").forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
  revealObserver.observe(item);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = Number(entry.target.dataset.count);
      const duration = 900;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 32);
};

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

const openFeedback = (serviceName) => {
  if (serviceName && serviceSelect) {
    serviceSelect.value = serviceName;
  }

  feedbackWindow.classList.remove("is-minimized");
  feedbackWindow.classList.add("is-floating");
  formNote.textContent = "Это фейковое окно обратной связи для демонстрации.";
};

openFeedbackButtons.forEach((button) => {
  button.addEventListener("click", () => openFeedback());
});

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => openFeedback(button.dataset.service));
});

minimizeButton.addEventListener("click", () => {
  feedbackWindow.classList.add("is-minimized");
});

feedbackForm.addEventListener("submit", (event) => event.preventDefault());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && feedbackWindow.classList.contains("is-floating")) {
    feedbackWindow.classList.add("is-minimized");
  }
});
