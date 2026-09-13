/* ==========================================================================
   Septi Dewi Yuliana — Portfolio interactions
   Vanilla JS · no dependencies
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------------------------
     1. Loader
  ------------------------------------------------------------------ */
  var loader = $("#loader");

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-done");
    window.setTimeout(function () { loader.style.display = "none"; }, 700);
  }

  if (document.readyState === "complete") {
    window.setTimeout(hideLoader, 350);
  } else {
    window.addEventListener("load", function () { window.setTimeout(hideLoader, 350); });
  }
  // Safety net: never trap the user behind the loader.
  window.setTimeout(hideLoader, 4000);

  /* ------------------------------------------------------------------
     2. Theme toggle (persisted)
  ------------------------------------------------------------------ */
  var root = document.documentElement;
  var themeToggle = $("#themeToggle");
  var STORAGE_KEY = "sdy-theme";

  try {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* storage blocked — ignore */ }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);

      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#08080f" : "#f6f7fb");

      try { window.localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ------------------------------------------------------------------
     3. Mobile navigation
  ------------------------------------------------------------------ */
  var navToggle = $("#navToggle");
  var navMenu = $("#navMenu");

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Buka menu");
    document.body.classList.remove("is-locked");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      document.body.classList.toggle("is-locked", open);
    });

    $$(".nav__link", navMenu).forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) closeMenu();
    });
  }

  /* ------------------------------------------------------------------
     4. Header state + scroll progress + back-to-top
  ------------------------------------------------------------------ */
  var nav = $("#nav");
  var scrollBar = $("#scrollBar");
  var toTop = $("#toTop");
  var ticking = false;

  function onScrollFrame() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (nav) nav.classList.toggle("is-stuck", y > 24);
    if (toTop) toTop.classList.toggle("is-show", y > 600);

    if (scrollBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
      scrollBar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });

  onScrollFrame();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     5. Reveal on scroll
  ------------------------------------------------------------------ */
  var revealItems = $$(".reveal");

  revealItems.forEach(function (el) {
    var delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--reveal-delay", delay + "ms");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     6. Typing effect (hero roles)
  ------------------------------------------------------------------ */
  var typedEl = $("#typed");
  var ROLES = [
    "Instructional Designer",
    "Learning Experience Developer",
    "Educational Technology Graduate",
    "Multimedia Learning Enthusiast"
  ];

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = ROLES[0];
    } else {
      var roleIndex = 0, charIndex = 0, deleting = false;

      (function type() {
        var current = ROLES[roleIndex];
        charIndex += deleting ? -1 : 1;
        typedEl.textContent = current.slice(0, charIndex);

        var wait = deleting ? 45 : 85;

        if (!deleting && charIndex === current.length) {
          wait = 1800;
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % ROLES.length;
          wait = 420;
        }

        window.setTimeout(type, wait);
      })();
    }
  }

  /* ------------------------------------------------------------------
     7. Counters + skill bars
  ------------------------------------------------------------------ */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var isRaw = el.getAttribute("data-raw") === "true";
    var duration = 1600;
    var start = null;

    if (reduceMotion) {
      el.textContent = (isRaw ? String(target) : target.toLocaleString("id-ID")) + suffix;
      return;
    }

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = (isRaw ? String(value) : value.toLocaleString("id-ID")) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  function fillBars(scope) {
    $$(".bar", scope).forEach(function (bar, i) {
      var level = bar.getAttribute("data-level") || 0;
      var fill = $(".bar__track i", bar);
      if (!fill) return;
      window.setTimeout(function () {
        fill.style.width = level + "%";
      }, reduceMotion ? 0 : 120 + i * 130);
    });
  }

  if (!("IntersectionObserver" in window)) {
    $$("[data-count]").forEach(animateCount);
    fillBars(document);
  } else {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        $$("[data-count]", entry.target).forEach(animateCount);
        statsObserver.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    var stats = $(".stats");
    if (stats) statsObserver.observe(stats);

    var barsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        fillBars(entry.target);
        barsObserver.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    var barHost = $(".skills__bars");
    if (barHost) barsObserver.observe(barHost);
  }

  /* ------------------------------------------------------------------
     8. Active nav link
  ------------------------------------------------------------------ */
  var sections = $$("main section[id]");
  var navLinks = $$(".nav__link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var linkMap = {};
    navLinks.forEach(function (link) {
      var id = (link.getAttribute("href") || "").replace("#", "");
      if (id) linkMap[id] = link;
    });

    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = linkMap[entry.target.id];
        if (!link) return;
        navLinks.forEach(function (l) { l.classList.remove("is-active"); });
        link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (section) { activeObserver.observe(section); });
  }

  /* ------------------------------------------------------------------
     9. Cursor glow (desktop only)
  ------------------------------------------------------------------ */
  var glow = $("#cursorGlow");

  if (glow && finePointer && !reduceMotion) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    var cx = gx, cy = gy;

    window.addEventListener("mousemove", function (e) {
      gx = e.clientX;
      gy = e.clientY;
      glow.style.opacity = "1";
    }, { passive: true });

    window.addEventListener("mouseleave", function () { glow.style.opacity = "0"; });

    (function follow() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      window.requestAnimationFrame(follow);
    })();
  }

  /* ------------------------------------------------------------------
     10. Copy to clipboard
  ------------------------------------------------------------------ */
  $$(".copy-btn[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var text = btn.getAttribute("data-copy");
      var original = btn.textContent;

      function done() {
        btn.textContent = "Tersalin!";
        btn.classList.add("is-copied");
        window.setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("is-copied");
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); cb(); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ------------------------------------------------------------------
     11. Footer year
  ------------------------------------------------------------------ */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------
     12. Subtle parallax on the hero card (pointer devices only)
  ------------------------------------------------------------------ */
  var orbit = $(".orbit-card");

  if (orbit && finePointer && !reduceMotion) {
    var hero = $(".hero");

    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      orbit.style.transform = "perspective(900px) rotateY(" + (px * 9).toFixed(2) + "deg) rotateX(" + (-py * 9).toFixed(2) + "deg)";
    });

    hero.addEventListener("mouseleave", function () { orbit.style.transform = ""; });
  }
})();
