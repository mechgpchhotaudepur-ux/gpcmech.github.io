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
      : '<span translate="no" class="material-symbols-outlined text-secondary">campaign</span>';
    n = Object.assign({}, n);
    if (!/^https?:\/\//i.test(n.link || "")) n.link = "";
    var tag = n.link ? "a" : "div";
    var href = n.link ? ' href="' + esc(n.link) + '" target="_blank" rel="noopener"' : "";
    return "<" + tag + href + ' class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-space-md">' +
      '<div class="bg-surface-container text-on-surface p-space-xs rounded-lg text-center shrink-0 w-14 min-h-[3.25rem] flex flex-col items-center justify-center">' + dateBox + "</div>" +
      '<div class="flex-1 min-w-0 space-y-1"><span class="inline-block px-space-xs py-0.5 rounded text-caption font-tech text-on-primary uppercase ' +
      (CAT_COLORS[n.category] || "bg-secondary") + '">' + esc(n.category || "General") + "</span>" +
      (isNew ? ' <span class="inline-block px-space-xs py-0.5 rounded text-caption font-tech uppercase bg-tertiary-fixed text-on-surface">New</span>' : "") +
      '<h4 class="font-body text-title-md text-on-surface">' + esc(n.title) + "</h4>" +
      (n.text ? '<p class="text-body-sm text-on-surface-variant">' + esc(n.text) + "</p>" : "") +
      "</div>" + (n.link ? '<span translate="no" class="material-symbols-outlined text-on-surface-variant self-center">open_in_new</span>' : "") +
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
    var c = { date: col(["date"]), category: col(["category", "type"]), title: col(["name", "document name", "title", "notice", "subject"]),
      text: col(["details", "description", "text"]), link: col(["link", "document link", "file link", "url", "file"]), show: col(["show", "show on website", "visible"]) };
    if (c.title < 0 || c.link < 0) throw new Error("Notice sheet needs Name and Link columns");
    var get = function (r, k) { return c[k] > -1 ? (r[c[k]] || "").trim() : ""; };
    return rows.map(function (r) {
      return { date: get(r, "date"), category: get(r, "category"), title: get(r, "title"), text: get(r, "text"), link: /^https?:\/\//i.test(get(r, "link")) ? get(r, "link") : "", show: get(r, "show") };
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
      '<span class="absolute inset-0 flex items-center justify-center"><span class="w-14 h-14 rounded-full bg-tech-blue/90 group-hover:bg-tech-blue text-on-primary flex items-center justify-center shadow-lg transition-colors"><span translate="no" class="material-symbols-outlined text-[32px]">play_arrow</span></span></span>' +
      "</button>" +
      '<div class="p-space-md space-y-space-xs flex-1">' +
      '<div class="flex items-center gap-space-sm font-tech text-label-technical uppercase text-secondary"><span>' + esc(a.category) + "</span>" +
      (a.year ? '<span class="text-on-surface-variant">• ' + esc(a.year) + "</span>" : "") + "</div>" +
      '<h3 class="font-body text-title-md text-on-surface">' + esc(a.title) + "</h3>" +
      (a.text ? '<p class="text-body-sm text-on-surface-variant">' + esc(a.text) + "</p>" : "") +
      (a.link ? '<a class="inline-flex items-center gap-1 text-body-sm text-secondary hover:underline" href="' + esc(a.link) + '" target="_blank" rel="noopener">Visit website<span translate="no" class="material-symbols-outlined text-[16px]">open_in_new</span></a>' : "") +
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
      '<span translate="no" class="material-symbols-outlined text-on-surface-variant shrink-0">folder_open</span></a>';
  }

  document.querySelectorAll("[data-render]").forEach(function (el) {
    var type = el.getAttribute("data-render");
    var limit = parseInt(el.getAttribute("data-limit") || "0", 10);
    var cut = function (arr) { return limit ? arr.slice(0, limit) : arr; };
    if (type === "notices") {
      el.innerHTML = '<p class="p-space-md bg-surface-container-lowest rounded-xl text-on-surface-variant">Loading notices…</p>';
      var paintNotices = function () {
        loadNotices().then(function (list) {
          var markup = list.length ? cut(list).map(noticeHTML).join("")
            : '<p class="p-space-md bg-surface-container-lowest rounded-xl text-on-surface-variant">No notices right now. Please check back later.</p>';
          if (el.innerHTML !== markup) el.innerHTML = markup;
        });
      };
      paintNotices();
      if (window.NOTICES_SHEET_CSV) setInterval(function () {
        if (!document.hidden) { noticesPromise = null; paintNotices(); }
      }, 60000);
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

/* Message from the Head of Department (HOD in content.js). Hidden until a message is filled in. */
(function () {
  var box = document.getElementById("hod-message"), h = window.HOD || {};
  if (!box || !(h.message || "").trim()) return;
  var esc = function (s) { return String(s || "").replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var initials = (h.name || "HOD").replace(/^(Shri|Smt\.?|Dr\.?|Prof\.?)\s+/i, "").split(/[\s.]+/).filter(Boolean).map(function (p) { return p[0]; }).join("").slice(0, 3);
  box.querySelector("[data-hod=photo]").innerHTML = h.photo
    ? '<img src="' + esc(h.photo) + '" alt="' + esc(h.name) + '" class="w-full h-full object-cover">'
    : '<span class="font-display text-headline-lg">' + esc(initials) + "</span>";
  box.querySelector("[data-hod=name]").textContent = h.name || "";
  box.querySelector("[data-hod=designation]").textContent = h.designation || "";
  box.querySelector("[data-hod=text]").innerHTML = h.message.trim().split(/\n\s*\n/).map(function (p) { return '<p>' + esc(p) + "</p>"; }).join("");
  box.classList.remove("hidden");
})();

/* Text size buttons (A- / A / A+) in the top bar. The choice is remembered on this device. */
(function () {
  var sizes = [0.9, 1, 1.1, 1.2], i = 1, KEY = "gpcmech-text-size";
  try { var saved = parseFloat(localStorage.getItem(KEY)); if (sizes.indexOf(saved) > -1) i = sizes.indexOf(saved); } catch (e) {}
  var targets = function () { return document.querySelectorAll("main, footer"); };
  var apply = function () {
    targets().forEach(function (el) { el.style.zoom = sizes[i] === 1 ? "" : sizes[i]; });
    var lbl = document.getElementById("ts-value"); if (lbl) lbl.textContent = Math.round(sizes[i] * 100) + "%";
    document.querySelectorAll("[data-ts]").forEach(function (b) {
      var d = b.getAttribute("data-ts");
      b.disabled = (d === "-" && i === 0) || (d === "+" && i === sizes.length - 1);
    });
    try { localStorage.setItem(KEY, sizes[i]); } catch (e) {}
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ts]"); if (!b) return;
    var d = b.getAttribute("data-ts");
    i = d === "+" ? Math.min(i + 1, sizes.length - 1) : d === "-" ? Math.max(i - 1, 0) : 1;
    apply();
  });
  apply();
})();

/* Gujarati / English button. Uses Google Translate (free), so no second copy of the content is needed.
   The choice is remembered (googtrans cookie) and carries over to every page. */
(function () {
  var isGu = /(^|;\s*)googtrans=\/en\/gu/.test(document.cookie);
  document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
    var short = b.hasAttribute("data-lang-short");
    b.textContent = isGu ? (short ? "EN" : "English") : (short ? "ગુ" : "ગુજરાતી");
    b.setAttribute("lang", isGu ? "en" : "gu");
    b.setAttribute("translate", "no"); b.classList.add("notranslate");
  });
  var setCookie = function (v) {
    var exp = v ? "" : "; expires=Thu, 01 Jan 1970 00:00:00 GMT", host = location.hostname;
    document.cookie = "googtrans=" + v + "; path=/" + exp;
    if (host.indexOf(".") > -1) document.cookie = "googtrans=" + v + "; path=/; domain=" + host + exp;
  };
  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-lang-toggle]")) return;
    setCookie(isGu ? "" : "/en/gu");
    location.reload();
  });
  if (!isGu) return;
  document.documentElement.lang = "gu";
  window.gtInit = function () {
    new google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: "en,gu", autoDisplay: false }, "google_translate_element");
  };
  var s = document.createElement("script");
  s.src = "https://translate.google.com/translate_a/element.js?cb=gtInit"; s.async = true;
  document.body.appendChild(s);
})();

/* Microsoft Clarity: heatmaps and session recordings (project ID set in content.js).
   The Virtual Lab console is masked, so names and enrolment numbers typed there are never recorded. */
(function () {
  var id = (window.CLARITY_PROJECT_ID || "").trim();
  if (!id || location.protocol === "file:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
  var note = document.getElementById("analytics-note"); if (note) note.classList.remove("hidden");
})();

/* Faculty Corner: cards from FACULTY_LINKS in content.js */
(function () {
  var root = document.getElementById("faculty-groups"); if (!root) return;
  var esc = function (s) { return String(s || "").replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var GROUPS = [["NBA / SAR Evidence", "verified"], ["Meetings & Circulars", "forum"], ["Student Records & Results", "school"], ["Timetables & Lab Records", "schedule"]];
  var list = window.FACULTY_LINKS || [];
  GROUPS = GROUPS.concat(list.map(function (l) { return l.group; }).filter(function (g, i, a) { return a.indexOf(g) === i && !GROUPS.some(function (x) { return x[0] === g; }); }).map(function (g) { return [g, "folder"]; }));
  root.innerHTML = GROUPS.map(function (g) {
    var items = list.filter(function (l) { return l.group === g[0]; }); if (!items.length) return "";
    var linked = items.filter(function (l) { return (l.link || "").trim(); }).length;
    return '<section class="space-y-space-md"><div class="flex items-end justify-between gap-space-md flex-wrap"><h2 class="font-display text-headline-md font-semibold flex items-center gap-space-sm">' +
      '<span class="w-10 h-10 rounded-lg bg-tech-blue text-on-primary flex items-center justify-center shrink-0"><span translate="no" class="material-symbols-outlined" aria-hidden="true">' + g[1] + "</span></span>" + esc(g[0]) + "</h2>" +
      '<span class="font-tech text-label-technical uppercase text-on-surface-variant">' + linked + " of " + items.length + " linked</span></div>" +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">' + items.map(function (l) {
        var on = (l.link || "").trim();
        var inner = '<span class="w-11 h-11 rounded-lg ' + (on ? "bg-surface-container text-secondary" : "bg-surface-container-low text-on-surface-variant") + ' flex items-center justify-center shrink-0"><span translate="no" class="material-symbols-outlined" aria-hidden="true">' + esc(l.icon || "folder") + "</span></span>" +
          '<span class="min-w-0 flex-1"><span class="block font-semibold text-on-surface">' + esc(l.title) + "</span>" + (l.text ? '<span class="block text-body-sm text-on-surface-variant">' + esc(l.text) + "</span>" : "") +
          (on ? "" : '<span class="block pt-1 font-tech text-label-technical uppercase text-on-surface-variant">Not linked yet</span>') + "</span>" +
          (on ? '<span translate="no" class="material-symbols-outlined text-on-surface-variant" aria-hidden="true">lock_open</span>' : "");
        return on ? '<a href="' + esc(l.link) + '" target="_blank" rel="noopener" class="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow p-space-md flex items-center gap-space-md border border-border-slate">' + inner + "</a>"
          : '<div class="bg-surface-container-low rounded-xl p-space-md flex items-center gap-space-md border border-dashed border-border-slate opacity-80">' + inner + "</div>";
      }).join("") + "</div></section>";
  }).join("");
})();
