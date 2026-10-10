/* Helpers for the department data pages (Staff, Laboratories, Faculty training,
   Student projects, Student performance). The data lives in data/*.json. No need to edit. */
(function (w) {
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  w.dd = {
    esc: esc,
    load: function (path) {
      return fetch(path).then(function (r) {
        if (!r.ok) throw new Error("Could not load " + path + " (" + r.status + ")");
        return r.json();
      });
    },
    // Shown in place of the data when it cannot load (most often: page opened by double-click)
    fail: function (el, e) {
      el.innerHTML = '<div class="p-space-lg rounded-xl bg-surface-container-low text-on-surface-variant">' +
        "<strong class=\"text-on-surface\">The data could not be loaded.</strong> " +
        (location.protocol === "file:" ? "Browsers block data files when a page is opened by double-click. It works on the published website, or preview with <code>python3 -m http.server</code>."
          : esc(e && e.message)) + "</div>";
    },
    count: function (rows, field) {
      var o = {}; rows.forEach(function (r) { o[r[field]] = (o[r[field]] || 0) + 1; }); return o;
    },
    // items: [[value, label], ...]
    stats: function (el, items) {
      el.innerHTML = items.map(function (i) {
        return '<div class="bg-surface-container-lowest/10 backdrop-blur-md rounded-xl p-space-md">' +
          '<span class="block font-display text-stat-number-mobile md:text-stat-number text-on-primary">' + esc(i[0]) + "</span>" +
          '<span class="block text-caption uppercase text-on-primary-container">' + esc(i[1]) + "</span></div>";
      }).join("");
    },
    // cols: [["Heading", "field" | function(row)], ...]
    table: function (el, cols, rows) {
      var cell = function (c, r) { return typeof c[1] === "function" ? c[1](r) : esc(r[c[1]]); };
      el.innerHTML = '<table class="dd-table"><thead><tr>' +
        cols.map(function (c) { return '<th scope="col">' + esc(c[0]) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        rows.map(function (r) { return "<tr>" + cols.map(function (c) { return "<td>" + cell(c, r) + "</td>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table>";
    },
    // Search box + optional filter chips over any set of items (table rows or cards)
    filter: function (opts) {
      var q = "", f = "All", chips = opts.chips, items = function () { return opts.root.querySelectorAll(opts.itemSelector); };
      var apply = function () {
        var shown = 0;
        items().forEach(function (it) {
          var ok = (!q || it.textContent.toLowerCase().indexOf(q) > -1) && (f === "All" || it.getAttribute("data-group") === f);
          it.style.display = ok ? "" : "none"; if (ok) shown++;
        });
        if (opts.counter) opts.counter.textContent = shown + " shown";
      };
      if (opts.input) opts.input.addEventListener("input", function () { q = opts.input.value.trim().toLowerCase(); apply(); });
      if (chips && opts.groups) {
        chips.innerHTML = ["All"].concat(opts.groups).map(function (g, i) {
          return '<button type="button" data-chip="' + esc(g) + '" class="dd-chip' + (i === 0 ? " is-on" : "") + '">' + esc(g) + "</button>";
        }).join("");
        chips.addEventListener("click", function (e) {
          var b = e.target.closest("[data-chip]"); if (!b) return;
          f = b.getAttribute("data-chip");
          chips.querySelectorAll(".dd-chip").forEach(function (c) { c.classList.toggle("is-on", c === b); });
          apply();
        });
      }
      apply();
    },
    colors: { blue: "#4C7CA9", navy: "#172C3F", indigo: "#38628A", gold: "#F5A524", green: "#10B981", grid: "#DBE3EB", text: "#49525A" },
  };
})(window);
