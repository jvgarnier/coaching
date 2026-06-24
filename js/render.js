/* Jean-Victor Garnier — rendu du contenu depuis content/site.json
   Le contenu éditable (via l'admin Decap) est la source unique de vérité.
   Ce script peuple le DOM puis lance les interactions (main.js). */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };

  function setText(id, value) {
    var el = $(id);
    if (el && value != null) el.textContent = value;
  }

  function setLink(id, link) {
    var el = $(id);
    if (!el || !link) return;
    if (link.label != null) el.textContent = link.label;
    if (link.href != null) el.setAttribute("href", link.href);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  function renderStats(containerId, stats) {
    var box = $(containerId);
    if (!box || !Array.isArray(stats)) return;
    clear(box);
    stats.forEach(function (s) {
      var wrap = el("li");
      // hero-stats utilise <li>, stat-band utilise <div class="stat">.
      if (box.classList.contains("stat-band")) {
        wrap = el("div", "stat");
      }
      wrap.appendChild(el("strong", null, s.value));
      wrap.appendChild(el("span", null, s.label));
      box.appendChild(wrap);
    });
  }

  function render(data) {
    // --- Marque / footer ---
    if (data.brand) {
      setText("brand-mark", data.brand.mark);
      setText("brand-name", data.brand.name);
      setText("footer-mark", data.brand.mark);
    }
    if (data.footer) setText("footer-tagline", data.footer.tagline);
    if (data.nav) setText("nav-cta", data.nav.cta);

    // --- Hero ---
    var hero = data.hero || {};
    setText("hero-eyebrow", hero.eyebrow);
    setText("hero-title", hero.title);
    setText("hero-lead", hero.lead);
    setLink("hero-cta-primary", hero.ctaPrimary);
    setLink("hero-cta-ghost", hero.ctaGhost);
    renderStats("hero-stats", hero.stats);

    // --- Mentor ---
    var mentor = data.mentor || {};
    setText("mentor-eyebrow", mentor.eyebrow);
    setText("mentor-title", mentor.title);
    setLink("mentor-cta", mentor.cta);
    var img = $("mentor-img");
    if (img && mentor.image) {
      img.setAttribute("src", mentor.image);
      if (mentor.imageAlt) img.setAttribute("alt", mentor.imageAlt);
    }
    var paras = $("mentor-paragraphs");
    if (paras && Array.isArray(mentor.paragraphs)) {
      clear(paras);
      mentor.paragraphs.forEach(function (p) {
        paras.appendChild(el("p", "reveal", p));
      });
    }

    // --- Parcours ---
    var parcours = data.parcours || {};
    setText("parcours-eyebrow", parcours.eyebrow);
    setText("parcours-title", parcours.title);
    renderStats("parcours-stats", parcours.stats);
    var facets = $("parcours-facets");
    if (facets && Array.isArray(parcours.facets)) {
      clear(facets);
      parcours.facets.forEach(function (f) {
        var art = el("article", "facet reveal");
        art.appendChild(el("span", "facet-num", f.num));
        art.appendChild(el("h3", null, f.title));
        art.appendChild(el("p", null, f.text));
        facets.appendChild(art);
      });
    }

    // --- Pour qui ---
    var pq = data.pourQui || {};
    setText("pourqui-eyebrow", pq.eyebrow);
    setText("pourqui-title", pq.title);
    var pqCards = $("pourqui-cards");
    if (pqCards && Array.isArray(pq.cards)) {
      clear(pqCards);
      pq.cards.forEach(function (c) {
        var art = el("article", "audience-card reveal");
        art.appendChild(el("h3", null, c.title));
        art.appendChild(el("p", null, c.text));
        pqCards.appendChild(art);
      });
    }

    // --- Domaines ---
    var dom = data.domaines || {};
    setText("domaines-eyebrow", dom.eyebrow);
    setText("domaines-title", dom.title);
    setText("domaines-intro", dom.intro);
    var domCards = $("domaines-cards");
    if (domCards && Array.isArray(dom.cards)) {
      clear(domCards);
      dom.cards.forEach(function (c) {
        var art = el("article", "domain-card reveal");
        art.appendChild(el("h3", null, c.title));
        var ul = el("ul");
        (c.items || []).forEach(function (it) { ul.appendChild(el("li", null, it)); });
        art.appendChild(ul);
        domCards.appendChild(art);
      });
    }

    // --- Écosystème ---
    var eco = data.ecosysteme || {};
    setText("eco-eyebrow", eco.eyebrow);
    setText("eco-title", eco.title);
    setText("eco-intro", eco.intro);
    setText("eco-note", eco.note);
    var tags = $("eco-tags");
    if (tags && Array.isArray(eco.tags)) {
      clear(tags);
      eco.tags.forEach(function (t) { tags.appendChild(el("div", "eco-tag reveal", t)); });
    }

    // --- Témoignages ---
    var temo = data.temoignages || {};
    setText("temoignages-eyebrow", temo.eyebrow);
    setText("temoignages-title", temo.title);
    setText("temoignages-intro", temo.intro);
    var temoItems = $("temoignages-items");
    if (temoItems && Array.isArray(temo.items)) {
      clear(temoItems);
      temo.items.forEach(function (t) {
        var fig = el("figure", "testimonial reveal");
        var mark = el("span", "quote-mark", "“");
        mark.setAttribute("aria-hidden", "true");
        fig.appendChild(mark);
        fig.appendChild(el("blockquote", null, t.quote));
        var cap = el("figcaption");
        cap.appendChild(el("span", "t-name", t.name));
        cap.appendChild(el("span", "t-role", t.role));
        fig.appendChild(cap);
        temoItems.appendChild(fig);
      });
    }

    // --- Contact ---
    var contact = data.contact || {};
    setText("contact-eyebrow", contact.eyebrow);
    setText("contact-title", contact.title);
    setText("contact-text", contact.text);
    if (contact.booking) {
      setText("booking-title", contact.booking.title);
      setText("booking-desc", contact.booking.desc);
      var embed = $("booking-embed");
      if (embed && contact.booking.calendarUrl) {
        clear(embed);
        var iframe = document.createElement("iframe");
        iframe.src = contact.booking.calendarUrl;
        iframe.title = "Prise de rendez-vous";
        iframe.loading = "lazy";
        iframe.setAttribute("frameborder", "0");
        embed.appendChild(iframe);
      }
    }
  }

  function start() {
    fetch("content/site.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) { render(data); })
      .catch(function (err) {
        // En cas d'échec, on n'empêche pas les interactions de base.
        console.error("Chargement du contenu impossible :", err);
      })
      .then(function () {
        if (typeof window.initSiteInteractions === "function") {
          window.initSiteInteractions();
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
