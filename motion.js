(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var nav = document.querySelector("nav");
  if (nav) {
    window.addEventListener(
      "scroll",
      function () {
        nav.classList.toggle("nav-scrolled", window.scrollY > 24);
      },
      { passive: true }
    );
    nav.classList.toggle("nav-scrolled", window.scrollY > 24);
  }

  if (reduced) {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  document.querySelectorAll("section, .stats, .dl-card, .feat-card, .step, .faq-item, .info-panel").forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", (i % 6) * 0.07 + "s");
  });

  document.querySelectorAll("main .panel, main .page-list, main > .meta, main > ul").forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", i * 0.08 + "s");
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  var stats = document.querySelector(".stats");
  if (stats) {
    var counted = false;
    var statObserver = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting || counted) return;
        counted = true;
        stats.querySelectorAll(".stat-n").forEach(function (el) {
          el.classList.add("counted");
          var raw = el.textContent.trim();
          if (!/^\d+$/.test(raw)) return;
          var target = parseInt(raw, 10);
          var duration = 900;
          var startTime = null;
          function tick(now) {
            if (!startTime) startTime = now;
            var progress = Math.min((now - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    statObserver.observe(stats);
  }
})();
