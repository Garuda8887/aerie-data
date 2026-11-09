# Asking an AMC for permission

Most AMC sites say their content may not be copied or redistributed without written consent. A short, specific request usually costs nothing and, if it gets a yes, settles the question for good. Keep the replies; they are the best credibility this project can have.

Send from a real address and sign with a real name. Send one per AMC (compliance, investor relations or the contact on their website; AMFI too).

---

**Subject:** Permission to republish factual portfolio holdings (open source, non-commercial)

Hello,

I maintain an open-source, non-commercial project called aerie-data (github.com/garuda8887/aerie-data). It republishes the monthly scheme portfolios that AMCs must publish under SEBI rules as plain JSON, so that investors can see what is inside their funds and where their funds overlap, without downloading Excel files by hand.

What we would publish for <AMC name>: scheme name, "as on" date, and for each holding its ISIN, name, industry or rating and % of NAV. Nothing else. We would not copy your files, text, logos or market values. Every file links back to your own disclosure page and the exact file it came from.

How we fetch: your direct file links only, once a month, with an identifying user agent and a delay between requests. We stop at any 403 or 429.

Could you confirm in writing that <AMC name> is comfortable with this? If you would rather we did it differently (a different source, a schedule, an attribution line), tell us and we will follow it. If you ever want the data removed, we will remove it within <N> days of your message.

Thank you,
<name>
<contact>

---

## Where we stand with each AMC (checked 2026-11-09)

| AMC | Scripts can fetch? | What its terms say | Status |
|---|---|---|---|
| SBI | Yes (bare .xlsx path) | Disclaimer has no copying or redistribution clause | Published (119 schemes). A courtesy request is still worthwhile |
| PPFAS | Yes | Personal, non-commercial use; written consent to copy or reuse; bans "aggregating, copying or duplicating" | Published (7 schemes). A permission request is recommended |
| Aditya Birla Sun Life | Yes | Bans "any robot, spider, other automated device" and "systematic retrieval … to create or compile"; no redistribution without written consent | Not published. Upload only, until permission |
| LIC | Files are listed through a year/month form | Same clauses as PPFAS | Not published. Upload only, until permission |
| HDFC | No: 403 to scripts (the site works in a normal browser) | not read | Not published. Upload only |
| Bandhan | Files are listed through a year/month/scheme form | not read | Not published. Upload only |
| Nippon India | Site is `Disallow: /` in robots.txt | not read | Excluded |
| Edelweiss, Canara Robeco | No: 403 to scripts | not read | Excluded |
| Kotak, UTI, Motilal Oswal, Mirae | Files are listed by JavaScript or a private AJAX service; no stable URL pattern | not read | Upload only |
| DSP, Mahindra Manulife | robots.txt disallows their download paths | not read | Excluded |

"Upload only" means Aerie users download the AMC's file themselves and parse it locally in the browser. Nothing is fetched or republished by this project.
