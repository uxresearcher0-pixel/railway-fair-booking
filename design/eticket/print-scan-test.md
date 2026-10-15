# Print and scan test (A4 e-ticket)

The QR codes in the concept e-ticket decode reliably from the rendered PDF pages (OpenCV, 100–150 dpi). This test checks the same thing on real paper and phones, which can't be done in software.

## Materials

- `railfair-eticket-concept-A4.pdf` (4 travellers, 3 pages) and `railfair-eticket-concept-A4-single.pdf` (1 traveller, 2 pages).
- Printers: one office laser, one home inkjet, one shop photocopier (black and white).
- Phones: at least one low-cost Android (2–3 years old), one mid-range Android, one iPhone. Use the stock camera, or any QR scanner app.
- A room with normal light, and a dim area (train-carriage level, about 50–100 lux).

## Print settings

Print at **100 % / actual size**, not "fit to page". Test each printer in colour and in black and white. Also make one photocopy of a printout.

## Test cases

For every printed ticket, record decode time and success:

| # | Condition | Pass if |
|---|---|---|
| 1 | Normal light, phone 20–30 cm away, held flat | Decodes in under 2 s |
| 2 | Dim light | Decodes in under 3 s |
| 3 | Page folded along the guide | Decodes |
| 4 | Page creased or crumpled, then flattened | Decodes |
| 5 | Phone tilted about 30° | Decodes |
| 6 | Photocopy of the printout | Decodes |
| 7 | Ticket shown on a phone screen at 50 % brightness | Decodes |
| 8 | Both tickets on one page: scan the top, then the bottom | Each decodes to its own traveller (P1, P2…) and never the other |

Also check:
- Every printed QR measures **60 mm ± 1 mm** with a ruler, with a clear white quiet zone on all sides.
- Text at 7.2 pt is still readable on the inkjet and photocopy prints.
- The DEMO watermark and banner are visible and do not cover the QR.

## Recording results

Copy this table per printer:

| Phone | Case 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Notes |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

If any case fails, note the printer, phone and light level. Possible fixes are a larger QR (up to 70 mm still fits two tickets per page), error correction level H instead of Q, or a thicker quiet zone. The codes contain only `RAILFAIR-DEMO|NOT-VALID|…`, with no personal data.
