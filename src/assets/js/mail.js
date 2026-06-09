document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".modal form");
  if (forms.length) {
    forms.forEach((form) => {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const closestThank = form.closest("[data-thank]");
        if (!closestThank) {
          return;
        }
        const feedback = document.getElementById(closestThank.dataset.thank);

        if (!feedback) {
          return;
        }

        form.reset();

        const haveText = document.querySelectorAll(".havetext");
        if (haveText.length) {
          haveText.forEach((el) => {
            el.classList.remove("havetext");
          });
        }

        const modal = form.closest(".modal");
        if (modal && "closeModal" in modal) {
          modal.closeModal();
        }

        if (feedback && "openModal" in feedback) {
          feedback.openModal();
        }
      });
    });
  }
});
