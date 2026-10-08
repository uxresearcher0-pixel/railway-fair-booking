# railfair concept e-ticket (A4)

`railfair-eticket-concept-A4.pdf` redesigns the current Bangladesh Railway e-ticket PDF around the project concept. It keeps the same A4 page size and the English + Bangla layout. It is a **concept demo, not valid for travel and not issued by Bangladesh Railway**: every page carries a DEMO banner and watermark, there is no railway or vendor branding, and all data is fictional.

## What changed from the current e-ticket

| Current e-ticket | Concept e-ticket | Why (project principle) |
|---|---|---|
| One QR for the whole booking | One QR per traveller, each with its own stub to cut or show | Group reference reveals individual passenger tokens |
| The lead passenger is named in full; co-passengers appear by name only, with no ID | Every traveller has their own name, ID type and masked ID | One active entitlement per named passenger |
| Full NID number and mobile number printed | Masked ID (last 4) and masked phone | Minimise identity data shown |
| "Dear [passenger]": buyer and passenger assumed to be the same person | Separate **Booked by**, **Paid by** and **Travellers** | Buyer, payer and passenger are separate roles |
| No refund destination | "Refunds go to the payer", with the payment method shown | Refund to original payer |
| "NID or Photo ID mandatory" | ID shown per traveller, birth registration for a child, assisted check if no ID (proposed) | Inclusive identity alternatives |
| Child counted only as a number | Child stub names the travelling adult; status "Assisted check · not verified" | No silent "verified" label |
| No cancellation guidance | Over / under 24 h (proposed), traveller approval when someone else booked | Cancellation and late release |
| — | "Staff check live status, then ID"; "the train never waits"; "not scanned ≠ invalid" | Accountable verification |
| Service charge shown in total | Service charge marked non-refundable next to the amount | Audit finding F2 |

Kept from the current ticket: A4 size, bilingual labels, journey table fields (issue time, journey time, train, from/to, class, coach/seat, adult/child count, fare, VAT, service charge, total), the "soft copy or printout" rule and the 2-hour complaint window.

## Rebuild

```sh
npm i @fontsource/anek-bangla@5 @fontsource/bricolage-grotesque@5 @fontsource/geist-sans@5 @fontsource/geist-mono@5
pip install segno
python3 build_eticket.py node_modules/@fontsource eticket.html
node render.mjs eticket.html railfair-eticket-concept-A4.pdf   # needs Playwright + Chromium; fails if a page overflows A4
```

Each QR encodes only `RAILFAIR-DEMO|NOT-VALID|<booking>|P<n>|sig=demo`, with no personal data. A production ticket would carry a signed opaque token instead.
