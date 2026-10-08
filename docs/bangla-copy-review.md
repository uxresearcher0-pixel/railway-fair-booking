# Bangla copy review (T11)

The Bangla screens in Figma are machine-assisted drafts. A native Bangla writer must review them before any testing with passengers.

**Screens to review** (Figma page "02 • UI v0.2 — Fresh"):
- Row "BN · P03, P05, P14": search, travellers, tickets.
- Row "Bangla drafts · new screens": F03, F04a, R0, G2a, G2b, G5, L1.
- The e-ticket PDFs in `design/eticket/` (bilingual labels).

## What to check

| Check | Why it matters |
|---|---|
| Plain, everyday Bangla, not literal translation | Passengers include people with low literacy and older people |
| Professional, neutral roles: ক্রেতা (buyer), যাত্রী (traveller), পরিশোধকারী (payer), সঙ্গী প্রাপ্তবয়স্ক (accompanying adult) | No family-relationship words, per project rule |
| "রেকর্ড মিলেছে" (record matched), never "যাচাইকৃত" (verified) | A record match is not proof of who holds the ticket |
| Rules marked প্রস্তাবিত (proposed) or নিশ্চিত করতে হবে (to confirm) | Unconfirmed rules must not read as official |
| Numbers: Bangla digits in prose and amounts (৳১,১১০); Latin digits for codes, seats, times and IDs (GHA-23, 07:00, ••3390) | Codes must match what staff and SMS show |
| Names and train names stay as entered (Latin script) | They must match the ID record |
| Fits the layout: no clipped lines at 390 px width; line height ≥ 1.35 | Bangla conjuncts are taller than Latin text |
| Scam warning reads clearly: real invites only appear inside the app | Fake ticket SMS with payment links are common |

## Terms to agree

| English | Draft Bangla | Notes |
|---|---|---|
| Fair queue | ন্যায্য সারি | Confirm if "লটারি" is clearer for passengers |
| Hold | আসন রাখা | |
| Package A / B | প্যাকেজ A / B | Keep the letter in Latin script so it matches the ticket |
| Daily limit / allowance | আজকের সীমা | |
| Invite | আমন্ত্রণ | |
| One-time code | ওটিপি | |
| Service charge (not refundable) | সার্ভিস চার্জ (ফেরতযোগ্য নয়) | |

## How to record the review

Comment directly on the Figma frames, or list changes here as "screen · current text → new text". After the review, update the Figma frames and the prototype's Bangla labels, then remove "NEEDS NATIVE REVIEW" from the row label.
