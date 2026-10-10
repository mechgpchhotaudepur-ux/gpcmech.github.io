// Checks every lab and experiment link in data/virtual-labs.js and writes LINK-REPORT.md.
// Run locally with:  node scripts/check-links.mjs     (Node 18 or newer)
// The GitHub Action in .github/workflows/link-check.yml runs it every Monday.
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL("../data/virtual-labs.js", import.meta.url), "utf8"), ctx);
const D = ctx.window.VLAB;

const targets = [];
for (const lab of D.labs) {
  targets.push({ lab: lab.id, what: "Lab home", url: lab.site });
  lab.exps.forEach(([title, path], i) =>
    targets.push({ lab: lab.id, what: `E${String(i + 1).padStart(2, "0")} ${title}`, url: /^https?:/.test(path) ? path : lab.site + path }));
}

async function check(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(20000),
        headers: { "user-agent": "Mozilla/5.0 (VirtualLabConsole link check)" } });
      return res.status;
    } catch (e) { if (attempt) return "error"; }
  }
}

const results = [];
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (next < targets.length) { const i = next++; results[i] = { ...targets[i], status: await check(targets[i].url) }; }
}));

const bad = results.filter(r => r.status !== 200);
const today = new Date().toISOString().slice(0, 10);
let md = `# Link report\n\nChecked ${today}: ${results.length} links, ${results.length - bad.length} open, ${bad.length} need attention.\n\n`;
md += bad.length ? `## Need attention\n\n| Lab | Item | Status | Link |\n|---|---|---|---|\n${bad.map(r => `| ${r.lab} | ${r.what} | ${r.status} | ${r.url} |`).join("\n")}\n\n` : "All links opened.\n\n";
md += "A page that opens does not prove the simulation runs. Faculty still run one experiment of each lab before class use.\n";
writeFileSync(new URL("../LINK-REPORT.md", import.meta.url), md);
console.log(md);
