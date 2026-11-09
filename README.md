# aerie-data

Monthly mutual fund portfolio holdings as plain JSON, for the Aerie portfolio X-ray. No manual Excel downloads.

Indian AMCs must publish every scheme's portfolio each month, but each one does it in a different Excel layout. This repository fetches the files from the AMCs' own sites, parses them, and keeps only the facts: scheme name, "as on" date, and each holding's ISIN, name, industry, kind and % of NAV. Every file links back to the AMC page and the exact file it came from.

```
data/index.json                          newest file for every scheme
data/<amc>/<yyyy-mm>/<scheme-id>.json    one scheme, one month
```

## Data format

```json
{
  "id": "ppfas-ppaf",
  "name": "Parag Parikh Arbitrage Fund",
  "amc": "PPFAS Mutual Fund",
  "asOf": "2026-09-30",
  "source": {
    "page": "https://amc.ppfas.com/downloads/portfolio-disclosure/",
    "file": "https://amc.ppfas.com/downloads/portfolio-disclosure/2026/PPAF_PPFAS_Monthly_Portfolio_Report_September_30_2026.xlsx"
  },
  "holdings": [
    { "key": "INE040A01034", "isin": "INE040A01034", "name": "HDFC Bank Limited", "industry": "Banks", "kind": "equity", "pct": 6.38 }
  ]
}
```

`kind` is one of `equity`, `debt`, `cash`, `derivative`, `units` or `other`. `pct` is the share of the scheme's NAV and is negative for short derivative positions. `data/index.json` lists `{ id, name, amc, asOf, path }` for the newest month of every scheme and is what Aerie's **Find a fund** searches.

## AMCs

| AMC | Schemes | As on | Source |
| --- | --- | --- | --- |
| PPFAS Mutual Fund | 7 | Sep 2026 | one file per scheme, amc.ppfas.com |
| SBI Mutual Fund | 119 | Oct 2026 | the all-schemes workbook, sbimf.com |

### Why not more

There is no common API or file format, and many AMCs do not permit automated retrieval. An AMC is added only after its terms are read and its files can be fetched politely from stable, public URLs. Where that isn't possible, because the terms forbid copying or bots, the site answers scripts with 403, `robots.txt` disallows the download path, or the files are listed only through JavaScript or forms, the AMC is left out. Users of those AMCs upload the AMC's Excel file in Aerie instead, where it is parsed locally in their browser.

[docs/permission-request.md](docs/permission-request.md) records the status of each AMC checked and a template for asking an AMC for written permission.

## Running it

Requires Node.js 20 or newer.

```bash
npm install
npm run build -- --month 2026-10            # all AMCs in src/amcs.ts
npm run build -- --month 2026-10 --amc sbi  # one AMC
npm test                                    # sanity-check every data file
```

`npm run build` defaults to the previous calendar month. `npm test` checks that every file's holdings add up to about 100% of NAV, that ISINs are valid, that the source link is https, and that `asOf` is an ISO date.

### Fetching policy

The fetcher is deliberately polite. It names itself in the user agent, waits 2 seconds between requests, uses the AMC's own direct file links (no page scraping), treats a 404 as "not published yet", and **stops on any 403 or 429** without retrying or working around it.

### Adding an AMC

1. Read the AMC's terms and `robots.txt`. If either forbids automated retrieval or copying, stop.
2. Find stable public file URLs for a month.
3. Add an entry to `src/amcs.ts`: `files(year, month)` returns the AMC's file URLs. Give a file a `name` if it holds one scheme; omit it for a workbook with one sheet per scheme.
4. Run `npm run build -- --month <yyyy-mm> --amc <id>` and `npm test`, and look at a few schemes by eye.

`src/parser/` is the Aerie workbook parser, copied from the Aerie repository. Re-copy it when Aerie's parser changes.

## Principles

- **Facts only.** Names, ISINs and percentages that AMCs must publish under SEBI rules. No AMC files, logos, text or market values are republished.
- **Always sourced.** The AMC's own disclosure is the authority; this is a convenience copy.
- **Non-commercial.** Free, open source, no ads, no accounts.
- **Not advice.** Data can be late or wrong. Check it against the AMC before you rely on it.

## Takedown and corrections

If you work at an AMC or AMFI and want your data removed, or would like it published differently, open an issue on this repository. Removal is quick: delete the AMC's entry in `src/amcs.ts` and its `data/<amc>/` folder, then rebuild the index. Wrong or stale data can be reported the same way.

## License

The code is MIT, see [LICENSE](LICENSE). The files under `data/` are factual extracts from AMCs' public disclosures and remain subject to the AMCs' own terms.
