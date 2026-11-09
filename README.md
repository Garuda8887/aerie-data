# aerie-data

Monthly mutual fund portfolio holdings as plain JSON, for [Aerie](../aerie). No manual Excel downloads.

```
data/index.json                          newest file for every scheme
data/<amc>/<yyyy-mm>/<scheme-id>.json    one scheme, one month
```

Each file holds the scheme name, the "as on" date, a link to the AMC's own disclosure, and its holdings: ISIN, name, industry, kind and % of NAV. That's all.

## What this is and isn't

- **Facts only.** Names, ISINs and percentages that AMCs must publish under SEBI rules. We don't republish the AMC's files, logos, text or market values.
- **Always sourced.** Every file links to the AMC page and the exact file it came from. The AMC's own disclosure is the authority; this is a convenience copy.
- **Non-commercial.** Free, open source, no ads, no accounts.
- **Not advice.** Data can be late or wrong. Check against the AMC before you rely on it.

## Fetching

`npm run build -- --month 2026-09 [--amc ppfas]` downloads that month's files and writes the JSON. `npm test` sanity-checks every file (holdings add to about 100%, valid ISINs, source link present).

The fetcher is deliberately polite: it names itself in the user agent, waits 2 seconds between requests, uses the AMC's own direct file links (no page scraping), and **stops on any 403 or 429** without retrying or working around it.

## Removal

If you work at an AMC (or are AMFI) and want your data removed, or would like it published differently, open an issue or email the maintainer (address to be added before this repo goes public). We'll remove it promptly: delete the AMC's entry in `src/amcs.ts` and its `data/<amc>/` folder.

## AMCs

| AMC | Status |
|---|---|
| PPFAS Mutual Fund | 7 schemes, fetched from amc.ppfas.com |

Others are added only after reading their terms.

## Code

`src/parser/` is the Aerie workbook parser, copied from Aerie at commit `fea77c6`. Re-copy it when Aerie's parser changes. Code is MIT. The data is the AMCs' public disclosure; see above.
