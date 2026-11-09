// Sanity check over everything in data/: npm test
import fs from "node:fs";
import path from "node:path";
import { isIsin } from "../src/parser/isin";

const files: string[] = [];
const walk = (d: string) =>
  fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".json") && e.name !== "index.json") files.push(p);
  });
walk("data");

let bad = 0;
const fail = (f: string, msg: string) => (console.error(`${f}: ${msg}`), bad++);
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  const long = j.holdings.filter((h: any) => h.kind !== "derivative").reduce((a: number, h: any) => a + h.pct, 0);
  if (Math.abs(long - 100) > 3) fail(f, `holdings add to ${long.toFixed(2)}%`);
  if (!j.source?.file?.startsWith("https://")) fail(f, "missing source link");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(j.asOf)) fail(f, `bad asOf ${j.asOf}`);
  for (const h of j.holdings) if (h.isin && !isIsin(h.isin)) fail(f, `bad ISIN ${h.isin}`);
}
console.log(`${files.length} files checked, ${bad} problems`);
process.exit(bad ? 1 : 0);
