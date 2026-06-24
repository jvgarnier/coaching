/* Jean-Victor Garnier — interactions */
/* Appelée par render.js une fois le contenu injecté dans le DOM. */
window.initSiteInteractions = function () {
  "use strict";

  /* ----- Année dans le footer ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----- Menu mobile ----- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Refermer après clic sur un lien
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ----- Apparition au scroll ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- Formulaire de contact (Netlify Forms, repli mailto en local) ----- */
  var form = document.getElementById("contact-form");
  var feedback = document.getElementById("form-feedback");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      feedback.className = "form-feedback";

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      var msgs = window.formMessages || {};
      var msgRequired = msgs.errorRequired || "Merci de remplir votre nom, votre email et votre message.";
      var msgEmail    = msgs.errorEmail    || "L'adresse email ne semble pas valide.";
      var msgSending  = msgs.sending       || "Envoi en cours…";
      var msgSuccess  = msgs.success       || "Merci ! Votre demande a bien été envoyée. Je reviens vers vous rapidement.";
      var msgFallback = msgs.fallback      || "Votre messagerie va s'ouvrir pour finaliser l'envoi. Merci !";

      if (!name || !email || !message) {
        feedback.textContent = msgRequired;
        feedback.classList.add("err");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        feedback.textContent = msgEmail;
        feedback.classList.add("err");
        return;
      }

      feedback.textContent = msgSending;
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form),
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (!json.success) throw new Error(json.message);
          feedback.textContent = msgSuccess;
          feedback.classList.add("ok");
          form.reset();
        })
        .catch(function () {
          feedback.textContent = msgFallback;
          feedback.classList.add("err");
        });
    });
  }

  /* ----- Carrousel témoignages (flèches latérales) ----- */
  var track = document.getElementById("temoignages-items");
  var prevBtn = document.getElementById("temoignages-prev");
  var nextBtn = document.getElementById("temoignages-next");
  if (track && prevBtn && nextBtn) {
    var stepSize = function () {
      var card = track.querySelector(".testimonial");
      if (!card) return track.clientWidth;
      var cardW = card.getBoundingClientRect().width + 24;
      // défile d'un bloc = nombre de cartes visibles (3 sur desktop, 2 tablette, 1 mobile)
      var visible = Math.max(1, Math.round(track.clientWidth / cardW));
      return visible * cardW;
    };
    var updateArrows = function () {
      var scrollable = track.scrollWidth - track.clientWidth > 4;
      prevBtn.hidden = !scrollable;
      nextBtn.hidden = !scrollable;
      if (scrollable) {
        prevBtn.disabled = track.scrollLeft <= 2;
        nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      }
    };
    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -stepSize(), behavior: "smooth" });
    });
    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: stepSize(), behavior: "smooth" });
    });
    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();
  }
};
