# UI v0.2 screen and state map

Figma: page **02 • UI v0.2 — Fresh** in the [project file](https://www.figma.com/design/3Jb4jMo27Pi6N4gncIPPJK). Prototype flows start at **P01** (passenger), **S01** (staff) and **R01** (reviewer). Page 01 keeps v0.1 for comparison.

All names, numbers, fares, QR codes, payments and identity results are fictional or simulated. Items marked **proposed** need railway approval (T04–T06).

## Passenger: booking (mobile 390 × 844)

| ID | Screen | Purpose / key states | Plan link |
|---|---|---|---|
| P01 | Sign in | Mobile + password, bot check, inline field error | Audit F10 |
| P02 | Before you book | Three safety rules (EN + BN), 2-hour e-ticket grievance rule | Audit F8, F9 |
| P03 | Search | Who it's for (me / someone else / family), route, date, travellers, keep-together | Backlog 2, 3 |
| P04 | Results | Classes stacked per train; availability badges; fair-queue class | Backlog 2; Audit F5, F6 |
| P21 | Fair queue · apply | One application per group; applying holds nothing (**proposed trial**) | Fair allocation trial |
| P22 | Fair queue · result | Published draw number and audit ref; offer opens a fixed hold | Fair allocation trial |
| P05 | Travellers | Buyer / payer / travellers separate; identity status per person, never "verified" | Backlog 3 |
| P06 | Child or no NID | Birth registration, other document, or assisted counter check | T09; acceptance "child/no NID" |
| P07 | Travelling adult | Links child to an adult; parent vs guardian vs accompanying adult | Doc S42–S43 |
| P08 | Seats | Coach chips with free counts; 2 + 3 seat map; single hold pill; split preference | Backlog 4, 5; Audit F1, F7 |
| P09 | Split seats consent | Partial availability options; nothing booked until chosen | T10 |
| P10 | Pay | Buyer OTP once; fare + non-refundable service charge before provider choice | Backlog 6; Audit F2, F12 |
| P14 | Tickets | Ticket stub per passenger; demo QR; ID reminder | Backlog 7 |
| P15 | Paper ticket · A4 (three frames) | Two self-contained tickets per page with 60 mm QR; odd count = last ticket on the upper half, lower half empty; full booking summary page. Mirrors `design/eticket` PDFs | Backlog 7 (print layout) |

## Passenger: booking forms and regular passengers

| ID | Screen | Purpose / key states | Plan link |
|---|---|---|---|
| F01 | Station picker | Search in English or Bangla; recent and matching stations with codes (demo codes) | Backlog 2 |
| F02 | Date picker | Calendar with today, selected date and sale window; dates outside the window are not selectable (window per railway rule) | Backlog 2 |
| F03 | Travellers & class | Adult/child steppers (age bands to confirm), class choice; group limit marked proposed | Backlog 2, 4 |
| F04a | Add traveller · NID (adult) | Name and DOB as on NID, NID number (10 or 17 digits, masked), record-check result: name, DOB, no other active ticket on this train | Backlog 3; acceptance "one entitlement per passenger" |
| F04b | Add traveller · birth registration (child) | Child type, DOB, birth registration with inline error (17 digits), accompanying adult, permission consent | T09 child/no NID |
| F05 | Contact & delivery | Booked-by (signed in), SMS link and/or email PDF; contact details never printed or in the QR | Backlog 7 |
| F06 | Review booking | Trip, travellers with seats and edit links, fare with non-refundable service charge, terms consent | Backlog 6; audit F2 |
| R0 | Search · returning passenger | "Book again" recent trips, Just me / Someone else / Me + others | Regular passenger fast path |
| R1 | Saved travellers picker | Saved people with ID status; stale record re-checked without retyping (period proposed); "+ New traveller" opens F04a | Regular passenger fast path |
| R2 | Travellers · Just me | Profile-filled traveller card with masked NID and record-match date; no form | Regular passenger fast path |

Prototype: a fourth flow starts at **R0** (returning passenger). Form flow: F05 → F06 → P10 Pay; F04a Save → R1.

## Passenger: groups over 4 (linked booking, proposed rule)

| ID | Screen | Purpose / key states | Plan link |
|---|---|---|---|
| G1 | Group size · over 4 | 7 travellers = 2 linked bookings: packages A (4) + B (3), one fair-queue place, one hold; each package bought by a different adult (max 4 tickets per buyer per day, **rule to confirm**) | Plan acceptance "approved larger groups use one linked request" |
| G2 | Group travellers · packages | Every traveller named with their own ID; each package header names its buyer; notice that the package B buyer pays from their own account; each child with an adult in the same package | One entitlement per named passenger |
| G3 | Linked seat offer | One hold for all 7 seats; packages A and B on one coach map with legend; never offered alone, no split without consent | Backlog 4, 5 |
| G5 | Co-booker invite (package B buyer's phone) | Invite to buy package B inside the shared hold (time left shown); "Accept & pay ৳1,110"; declining releases package B only; their daily allowance shown | 4-per-buyer rule; one hold |
| G4 | Linked checkout & tickets | Group reference GRP-31 with two booking refs; one payment per package (A: bKash ৳1,480, B: Nagad ৳1,110; group total ৳2,590), "Both paid" status; 7 named tickets; refunds go to each package's payer | Backlog 6, 7, 8 |
| L1 | Daily limit reached | "4 of 4 tickets used today"; options: ask another traveller to buy, book tomorrow, or use a counter; cancelled tickets don't restore the allowance (**proposed**) | 4-per-buyer rule |

Prototype flow: **Passenger · group of 7 (linked)** runs G1 → G2 → G3 → G5 → G4.

**Daily buyer limit (rule to confirm):** one buyer can buy at most 4 tickets per day. F03 shows "you've used 0 today" and R0 shows a "Today: 0 of 4 tickets used" pill, so people see the limit before they hit it. A group over 4 therefore needs a second adult to buy the second package; the linked hold keeps both packages together while they pay.

## Passenger: when things change

| ID | Screen | Purpose / key states | Plan link |
|---|---|---|---|
| P11 | Payment pending | Hold continues; "don't pay again"; check status | Backlog 6; T10 |
| P12 | Payment failed | Reason, no money taken, safe retry, seats still held | Backlog 6; T10 |
| P13 | Hold expired | Seats released, not charged, new search = new hold | Backlog 5; T10 |
| P16 | Cancel or release | Per-passenger selection; refund to original payer; over-24 h rule (**proposed**) | Backlog 8 |
| P17 | Late release | Under 24 h: release without standard refund; conditional recovery only if approved | Backlog 8; T10 |
| P18 | Passenger approval | Booker cancelling for another traveller needs that traveller's approval | Doc §3 "Cancellation and help" |
| P19 | Refund tracking | Requested → revoked/released → sent → received; agent cash repayment tracked separately | Backlog 8; T10 |
| P20 | Respond to a charge | Passenger response / appeal to an independent reviewer | Backlog 11 |
| P23 | Account | Masked NID and DOB; "NID record matched" wording | Audit F3 |

## Staff: TT / guard (mobile)

| ID | Screen | Purpose / key states | Plan link |
|---|---|---|---|
| S01 | Coach list | Onboard manifest, checked / to-check / flags; cached time shown | Doc §6 onboard round |
| S02 | Check a ticket | Ticket status (system) and person check (staff) as separate panels | Backlog 9 |
| S03 | Group ticket | One booking reveals each passenger; one person check each | Doc §3 group tokens |
| S04 | Scan · cancelled | Can't mark active; record incident | Backlog 10 |
| S05 | Scan · offline | Provisional result on cached data; syncs later | Backlog 10 |
| S06 | Scan · seen before | Possible copy or normal re-check; not proof | Backlog 10 |
| S07 | Scan · invalid QR | Signature failed; look up by reference; not proof of fraud | Backlog 10; T09 |
| S08 | Scan · wrong journey | Valid ticket for another train/date; record exception | Backlog 10 |
| S09 | Couldn't check | Reason recorded as "not checked", never invalid | Backlog 9; T09 |
| S10 | Incident | Locked ticket status; official receipt; amount from approved tariff | Backlog 10 |

## Reviewer and counter

| ID | Screen | Purpose / key states | Plan link |
|---|---|---|---|
| R01 | Review inbox (mobile) | Cases by type; own cases locked | Backlog 11 |
| R02 | Case detail (mobile) | Append-only history, passenger response, decision + reason | Backlog 11 |
| D01 | Counter booking (desktop 1440) | Assisted booking for someone else, ID checked at counter, same hold, cash receipt, prints tickets | T12 |
| D02 | Reviewer workspace (desktop 1440) | Queue, case history, decision panel, separation of duties | T12 |

## Bangla and accessibility

- **BN · P03, P05, P14:** Bangla drafts with the language switch set to বাংলা. Copy needs review by a native Bangla writer before testing (T11).
- **Accessibility spec:** computed contrast for 15 token pairs (all pass AA: lowest 3.33:1 for the input border, which needs 3:1); focus ring examples; focus order, live-region, error, seat-map keyboard and target-size rules. Contrast is computed from the tokens; everything else must be verified with axe and NVDA/TalkBack once coded.

## Open decisions for T08 review

1. Can a ticket be bound to a named passenger other than the account holder? The current Rail Sheba app defaults to the account holder (audit F4).
2. Hold length and whether one hold covers seats through payment (audit F1).
3. Service charge per booking or per ticket, and refundability (P10 assumes ৳20 per ticket, not refundable).
4. The 24-hour cancellation boundary and any conditional recovery after official resale (P16, P17).
5. The fair-queue trial: eligibility, window, group fairness, counter participation (P04, P21, P22).
6. Child seating with an adult, and when proof of relationship is required (P07, P09).
7. Charge tariff and wrong-train rules (S08, S10).
8. Larger groups: maximum size, package split (4 + n), and whether linked packages share one fair-queue place (G1–G5).
9. The daily buyer limit (4 tickets per day): is it counted per account or per NID, do counter purchases count, do cancelled or refunded tickets restore the allowance, and how long can a linked hold wait for the second buyer (F03, R0, G5, L1).
