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
    var d = parseDate(n.date);
    var isNew = d && (Date.now() - d.getTime()) < 7 * 864e5 && d.getTime() <= Date.now() + 864e5;
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
      (CAT_COLORS[n.category] || "bg-secondary") + '">' + esc(n.category || "General") + "</span>" +
      (isNew ? ' <span class="inline-block px-space-xs py-0.5 rounded text-caption font-tech uppercase bg-tertiary-fixed text-on-surface">New</span>' : "") +
      '<h4 class="font-body text-title-md text-on-surface">' + esc(n.title) + "</h4>" +
      (n.text ? '<p class="text-body-sm text-on-surface-variant">' + esc(n.text) + "</p>" : "") +
      "</div>" + (n.link ? '<span class="material-symbols-outlined text-on-surface-variant self-center">open_in_new</span>' : "") +
      "</" + tag + ">";
  }

  /* ---- Notices: from the Google Sheet (NOTICES_SHEET_CSV in content.js), else the NOTICES list ---- */
  // Accepts 2026-10-10, 10/10/2026, 10-10-2026, 10.10.2026 (day first), "10 Oct 2026", "Oct 10, 2026"
  function parseDate(v) {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v) ? null : v;
    v = String(v).trim(); var m;
    if ((m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return new Date(+m[1], m[2] - 1, +m[3]);
    if ((m = v.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/))) return new Date(m[3].length === 2 ? 2000 + +m[3] : +m[3], m[2] - 1, +m[1]);
    var t = Date.parse(v); return isNaN(t) ? null : new Date(t);
  }
  function parseCSV(text) {
    var rows = [], row = [], f = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += c;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    return rows;
  }
  function fromSheet(text) {
    var rows = parseCSV(text).filter(function (r) { return r.some(function (c) { return c.trim(); }); });
    if (!rows.length) return [];
    var head = rows.shift().map(function (h) { return h.trim().toLowerCase(); });
    var col = function (names) { for (var i = 0; i < names.length; i++) { var k = head.indexOf(names[i]); if (k > -1) return k; } return -1; };
    var c = { date: col(["date"]), category: col(["category", "type"]), title: col(["title", "notice", "subject"]),
      text: col(["details", "description", "text"]), link: col(["link", "file link", "url", "file"]), show: col(["show", "show on website", "visible"]) };
    var get = function (r, k) { return c[k] > -1 ? (r[c[k]] || "").trim() : ""; };
    return rows.map(function (r) {
      return { date: get(r, "date"), category: get(r, "category"), title: get(r, "title"), text: get(r, "text"), link: get(r, "link"), show: get(r, "show") };
    }).filter(function (n) { return n.title && !/^(no|n|hide|false)$/i.test(n.show); });
  }
  function newestFirst(list) {
    return list.map(function (n, i) { return [n, i]; }).sort(function (a, b) {
      var da = parseDate(a[0].date), db = parseDate(b[0].date);
      if (da && db && da - db) return db - da;
      if (da && !db) return -1; if (db && !da) return 1;
      return a[1] - b[1];
    }).map(function (x) { return x[0]; });
  }
  var noticesPromise;
  function loadNotices() {
    if (noticesPromise) return noticesPromise;
    var fallback = function () { return newestFirst(window.NOTICES || []); };
    var url = window.NOTICES_SHEET_CSV;
    if (!url) return (noticesPromise = Promise.resolve(fallback()));
    return (noticesPromise = fetch(url + (url.indexOf("?") > -1 ? "&" : "?") + "_=" + Math.floor(Date.now() / 60000))
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) { if (/^\s*</.test(t)) throw new Error("not CSV"); return newestFirst(fromSheet(t)); })
      .catch(function () { return fallback(); }));
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
      (a.link ? '<a class="inline-flex items-center gap-1 text-body-sm text-secondary hover:underline" href="' + esc(a.link) + '" target="_blank" rel="noopener">Visit website<span class="material-symbols-outlined text-[16px]">open_in_new</span></a>' : "") +
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
      el.innerHTML = '<p class="p-space-md bg-surface-container-lowest rounded-xl text-on-surface-variant">Loading notices…</p>';
      loadNotices().then(function (list) {
        el.innerHTML = list.length ? cut(list).map(noticeHTML).join("")
          : '<p class="p-space-md bg-surface-container-lowest rounded-xl text-on-surface-variant">No notices right now. Please check back later.</p>';
      });
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

/* Desktop dropdown menus: also open on click/tap (hover and keyboard focus work via CSS) */
document.querySelectorAll(".dd-menu").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    var panel = btn.nextElementSibling, open = panel.classList.toggle("!block");
    btn.setAttribute("aria-expanded", open);
    document.querySelectorAll(".dd-panel.\\!block").forEach(function (p) { if (p !== panel) { p.classList.remove("!block"); p.previousElementSibling.setAttribute("aria-expanded", "false"); } });
  });
});
document.addEventListener("click", function () {
  document.querySelectorAll(".dd-panel.\\!block").forEach(function (p) { p.classList.remove("!block"); p.previousElementSibling.setAttribute("aria-expanded", "false"); });
});

/* Visitor counter: records the visit and shows the total (GoatCounter; code set in content.js) */
(function () {
  var code = (window.VISIT_COUNTER_CODE || "").trim();
  if (!code || location.protocol === "file:") return;
  var base = "https://" + code + ".goatcounter.com";
  var s = document.createElement("script");
  s.async = true; s.src = "https://gc.zgo.at/count.js"; s.setAttribute("data-goatcounter", base + "/count");
  document.head.appendChild(s);
  fetch(base + "/counter/TOTAL.json").then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
    if (!d || d.count == null) return;
    var box = document.getElementById("visit-counter"), n = document.getElementById("visit-count");
    if (!box || !n) return;
    n.textContent = String(d.count).trim();
    box.classList.remove("hidden"); box.classList.add("inline-flex");
  }).catch(function () {});
})();
