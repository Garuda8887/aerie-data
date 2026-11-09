// Fetch each AMC's published monthly portfolio files, parse them, write facts-only JSON.
//   npm run build -- [--month 2026-09] [--amc ppfas]
// Polite by design: identifies itself, waits between requests, and STOPS on 403/429 (no retries, no workarounds).
import fs from "node:fs";
import path from "node:path";
import { AMCS } from "../src/amcs";
import { parseAmcFile } from "../src/parser/parseAmc";

const UA = "aerie-data/0.1 (open-source, non-commercial mutual fund holdings research)";
const DELAY_MS = 2000;
const DATA = path.resolve("data");

const arg = (n: string) => {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const now = new Date();
const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
const month = arg("--month") ?? `${prev.getUTCFullYear()}-${String(prev.getUTCMonth() + 1).padStart(2, "0")}`;
const [year, mon] = month.split("-").map(Number);
const only = arg("--amc");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let wrote = 0;
for (const amc of AMCS.filter((a) => !only || a.id === only)) {
  for (const f of amc.files(year, mon)) {
    await sleep(DELAY_MS);
    const res = await fetch(f.url, { headers: { "user-agent": UA } });
    if (res.status === 403 || res.status === 429) {
      console.error(`${amc.name} answered ${res.status}. Stopping; not retrying or working around it.`);
      process.exit(1);
    }
    if (res.status === 404) {
      console.log(`${f.code}: not published yet (404)`);
      continue;
    }
    if (!res.ok) {
      console.warn(`${f.code}: HTTP ${res.status}, skipped`);
      continue;
    }
    const parsed = parseAmcFile(new Uint8Array(await res.arrayBuffer()));
    for (const [i, s] of parsed.entries()) {
      if (Math.abs(s.coverage - 100) > 3) {
        console.warn(`${f.code}: coverage ${s.coverage.toFixed(2)}%, not written`);
        continue;
      }
      const id = f.name ? `${amc.id}-${f.code.toLowerCase()}${parsed.length > 1 ? `-${i + 1}` : ""}` : `${amc.id}-${s.sheet.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const out = {
        id,
        name: f.name ?? s.name,
        amc: amc.name,
        asOf: s.asOf ?? `${month}-${new Date(Date.UTC(year, mon, 0)).getUTCDate()}`,
        source: { page: amc.page, file: f.url },
        holdings: s.holdings.map((h) => ({
          key: h.key,
          isin: h.isin,
          name: h.name,
          industry: h.industry,
          kind: h.kind,
          pct: Math.round(h.pct * 10000) / 10000,
        })),
      };
      const file = path.join(DATA, amc.id, month, `${id}.json`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(out) + "\n");
      if (f.name) console.log(`${id}: ${s.holdings.length} lines, ${s.coverage.toFixed(2)}% of NAV`);
      wrote++;
    }
    if (!f.name) console.log(`${amc.name}: ${parsed.length} schemes parsed from ${f.code}`);
  }
}

// index.json: the newest month for every scheme
const latest = new Map<string, { id: string; name: string; amc: string; asOf: string; path: string }>();
for (const amcDir of fs.existsSync(DATA) ? fs.readdirSync(DATA).filter((d) => fs.statSync(path.join(DATA, d)).isDirectory()) : []) {
  for (const m of fs.readdirSync(path.join(DATA, amcDir)).sort()) {
    for (const f of fs.readdirSync(path.join(DATA, amcDir, m))) {
      const j = JSON.parse(fs.readFileSync(path.join(DATA, amcDir, m, f), "utf8"));
      latest.set(j.id, { id: j.id, name: j.name, amc: j.amc, asOf: j.asOf, path: `${amcDir}/${m}/${f}` });
    }
  }
}
fs.writeFileSync(path.join(DATA, "index.json"), JSON.stringify({ schemes: [...latest.values()] }, null, 1) + "\n");
console.log(`done: ${wrote} written, ${latest.size} schemes in index`);
