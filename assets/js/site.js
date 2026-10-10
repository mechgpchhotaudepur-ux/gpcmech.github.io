/* Renders the lists from content.js and wires up the menu. No need to edit. */
(function () {
  var esc = function (s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  var CAT_COLORS = {
    Exam: "bg-crimson-heritage", Academic: "bg-success-precision", Workshop: "bg-tech-blue",
    Admission: "bg-secondary", General: "bg-on-surface-variant",
  };

  function noticeHTML(n) {
    var d = n.date ? new Date(n.date + "T00:00:00") : null;
    var dateBox = d && !isNaN(d)
      ? '<span class="block font-display text-title-md">' + String(d.getDate()).padStart(2, "0") +
        '</span><span class="block font-tech text-caption uppercase text-on-surface-variant">' +
        MONTHS[d.getMonth()] + " " + String(d.getFullYear()).slice(2) + "</span>"
      : '<span class="material-symbols-outlined text-secondary">campaign</span>';
    var tag = n.link ? "a" : "div";
    var href = n.link ? ' href="' + esc(n.link) + '" target="_blank" rel="noopener"' : "";
    return "<" + tag + href + ' class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-space-md">' +
      '<div class="bg-surface-container text-on-surface p-space-xs rounded-lg text-center shrink-0 w-14 min-h-[3.25rem] flex flex-col items-center justify-center">' + dateBox + "</div>" +
      '<div class="flex-1 min-w-0 space-y-1"><span class="inline-block px-space-xs py-0.5 rounded text-caption font-tech text-on-primary uppercase ' +
      (CAT_COLORS[n.category] || "bg-secondary") + '">' + esc(n.category) + "</span>" +
      '<h4 class="font-body text-title-md text-on-surface">' + esc(n.title) + "</h4>" +
      (n.text ? '<p class="text-body-sm text-on-surface-variant">' + esc(n.text) + "</p>" : "") +
      "</div>" + (n.link ? '<span class="material-symbols-outlined text-on-surface-variant self-center">open_in_new</span>' : "") +
      "</" + tag + ">";
  }

  function activityHTML(a) {
    return '<article class="activity-card bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col" data-category="' + esc(a.category) + '">' +
      '<button type="button" class="yt relative block w-full aspect-video bg-primary-container group" data-id="' + esc(a.youtube) + '" aria-label="Play video: ' + esc(a.title) + '">' +
      '<img loading="lazy" src="https://i.ytimg.com/vi/' + esc(a.youtube) + '/hqdefault.jpg" alt="" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity">' +
      '<span class="absolute inset-0 flex items-center justify-center"><span class="w-14 h-14 rounded-full bg-tech-blue/90 group-hover:bg-tech-blue text-on-primary flex items-center justify-center shadow-lg transition-colors"><span class="material-symbols-outlined text-[32px]">play_arrow</span></span></span>' +
      "</button>" +
      '<div class="p-space-md space-y-space-xs flex-1">' +
      '<div class="flex items-center gap-space-sm font-tech text-label-technical uppercase text-secondary"><span>' + esc(a.category) + "</span>" +
      (a.year ? '<span class="text-on-surface-variant">• ' + esc(a.year) + "</span>" : "") + "</div>" +
      '<h3 class="font-body text-title-md text-on-surface">' + esc(a.title) + "</h3>" +
      (a.text ? '<p class="text-body-sm text-on-surface-variant">' + esc(a.text) + "</p>" : "") +
      (a.link ? '<a class="inline-flex items-center gap-1 text-body-sm text-tech-blue hover:underline" href="' + esc(a.link) + '" target="_blank" rel="noopener">Visit website<span class="material-symbols-outlined text-[16px]">open_in_new</span></a>' : "") +
      "</div></article>";
  }

  function downloadHTML(d, compact) {
    return '<a href="' + esc(d.link) + '" target="_blank" rel="noopener" class="flex items-center justify-between gap-space-sm ' +
      (compact ? "p-space-sm bg-surface-slate hover:bg-surface-container" : "p-space-md bg-surface-container-lowest shadow-sm hover:shadow-md") +
      ' rounded-lg transition-all">' +
      '<div class="flex items-center gap-space-sm min-w-0"><span class="' + (compact ? "" : "w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center shrink-0 ") +
      'material-symbols-outlined text-secondary">' + esc(d.icon || "folder") + "</span>" +
      '<div class="min-w-0"><span class="block font-semibold text-body-md text-on-surface">' + esc(d.title) + "</span>" +
      '<span class="block text-caption text-on-surface-variant">' + esc(d.text) + "</span></div></div>" +
      '<span class="material-symbols-outlined text-on-surface-variant shrink-0">folder_open</span></a>';
  }

  document.querySelectorAll("[data-render]").forEach(function (el) {
    var type = el.getAttribute("data-render");
    var limit = parseInt(el.getAttribute("data-limit") || "0", 10);
    var cut = function (arr) { return limit ? arr.slice(0, limit) : arr; };
    if (type === "notices") {
      var list = window.NOTICES || [];
      el.innerHTML = list.length ? cut(list).map(noticeHTML).join("")
        : '<p class="p-space-md bg-surface-container-lowest rounded-xl text-on-surface-variant">No notices right now. Please check back later.</p>';
    } else if (type === "activities") {
      el.innerHTML = cut(window.ACTIVITIES || []).map(activityHTML).join("");
    } else if (type === "downloads") {
      var compact = el.getAttribute("data-variant") === "compact";
      el.innerHTML = cut(window.DOWNLOADS || []).map(function (d) { return downloadHTML(d, compact); }).join("");
    }
  });

  // Activity category filter
  var filters = document.getElementById("activity-filters");
  if (filters) {
    var cats = [];
    (window.ACTIVITIES || []).forEach(function (a) { if (cats.indexOf(a.category) < 0) cats.push(a.category); });
    filters.innerHTML = ["All"].concat(cats).map(function (c, i) {
      return '<button type="button" data-filter="' + esc(c) + '" class="filter-chip px-space-md py-space-xs rounded-full text-body-sm border border-border-slate transition-colors ' +
        (i === 0 ? "bg-primary-container text-on-primary" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container") + '">' + esc(c) + "</button>";
    }).join("");
    filters.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]"); if (!b) return;
      var f = b.getAttribute("data-filter");
      filters.querySelectorAll(".filter-chip").forEach(function (c) {
        var on = c === b;
        c.classList.toggle("bg-primary-container", on); c.classList.toggle("text-on-primary", on);
        c.classList.toggle("bg-surface-container-lowest", !on); c.classList.toggle("text-on-surface", !on);
      });
      document.querySelectorAll(".activity-card").forEach(function (card) {
        card.style.display = f === "All" || card.getAttribute("data-category") === f ? "" : "none";
      });
    });
  }

  // Load YouTube only when clicked (keeps pages fast)
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".yt"); if (!btn) return;
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + btn.getAttribute("data-id") + "?autoplay=1&rel=0";
    f.className = "w-full aspect-video block";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    f.allowFullscreen = true; f.title = btn.getAttribute("aria-label");
    btn.replaceWith(f);
  });

  // Mobile menu
  var toggle = document.getElementById("menu-toggle"), menu = document.getElementById("mobile-menu");
  if (toggle && menu) toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", open);
    toggle.querySelector(".material-symbols-outlined").textContent = open ? "close" : "menu";
  });
})();
