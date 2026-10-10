// Helpers shared by the department data pages. No build step; works on GitHub Pages.
async function ddLoad(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error("Could not load " + path + " (" + r.status + ")");
  return r.json();
}
function ddEsc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
// cols: [["Heading", "field"], ...]  rows: array of objects
function ddTable(el, cols, rows) {
  var html = "<table class='dd'><thead><tr>" + cols.map(function (c) { return "<th>" + ddEsc(c[0]) + "</th>"; }).join("") + "</tr></thead><tbody>";
  rows.forEach(function (r) { html += "<tr>" + cols.map(function (c) { return "<td>" + ddEsc(r[c[1]]) + "</td>"; }).join("") + "</tr>"; });
  el.innerHTML = html + "</tbody></table>";
}
// connects a search box to the table rows
function ddSearch(input, tableEl) {
  input.addEventListener("input", function () {
    var q = input.value.toLowerCase();
    tableEl.querySelectorAll("tbody tr").forEach(function (tr) { tr.style.display = tr.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none"; });
  });
}
function ddCards(el, items) {
  el.innerHTML = items.map(function (i) { return "<div class='dd-card'><b>" + ddEsc(i[0]) + "</b>" + ddEsc(i[1]) + "</div>"; }).join("");
}
function ddCount(rows, field) { var o = {}; rows.forEach(function (r) { o[r[field]] = (o[r[field]] || 0) + 1; }); return o; }
