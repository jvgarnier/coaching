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

      if (!name || !email || !message) {
        feedback.textContent = "Merci de remplir votre nom, votre email et votre message.";
        feedback.classList.add("err");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        feedback.textContent = "L'adresse email ne semble pas valide.";
        feedback.classList.add("err");
        return;
      }

      // Construit le corps attendu par Netlify Forms (form-name + tous les champs).
      var data = new URLSearchParams(new FormData(form)).toString();

      feedback.textContent = "Envoi en cours…";
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          feedback.textContent = "Merci ! Votre demande a bien été envoyée. Je reviens vers vous rapidement.";
          feedback.classList.add("ok");
          form.reset();
        })
        .catch(function () {
          // Repli : en local (ou si Netlify Forms indisponible), on ouvre la messagerie.
          var company = form.company.value.trim();
          var subject = encodeURIComponent("Demande d'échange — " + name);
          var body = encodeURIComponent(
            "Nom : " + name + "\n" +
            "Entreprise : " + (company || "—") + "\n" +
            "Email : " + email + "\n\n" +
            message
          );
          window.location.href = "mailto:jvgarnier@gmail.com?subject=" + subject + "&body=" + body;
          feedback.textContent = "Votre messagerie va s'ouvrir pour finaliser l'envoi. Merci !";
          feedback.classList.add("ok");
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
      return card ? card.getBoundingClientRect().width + 24 : track.clientWidth;
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
