# UI v0.2 screen and state map

Figma: page **02 • UI — screens by journey** (English) in the [project file](https://www.figma.com/design/3Jb4jMo27Pi6N4gncIPPJK), sections 00–13 in journey order. Page **02b • UI — বাংলা screens by journey (draft)** holds the Bangla screens in the same sections 01–13, each screen in the same place as its English one. Page 03 holds the master journey, exception branches and staff accountability loop; page 04 the information architecture. Prototype flows: Passenger · book for others (P01), regular (R0), group of 7 (G1); Guard · entry check (EG01); TT · onboard round (OB01); Exit (EX01); Desk · case decisions (DK01); Reviewer (RV01); Ops · back office (OP01). Bangla flows (বাংলা · …) are on page 02b and start from the BN copies of P01, P03, G1, P25, EG01, OB01, EX01, DK01, RV01 and OP01. Page **02c • UI v2 — Fair access (English, proposed)** holds the v2 screens for the fair-access proposal; see [fair-access-v2.md](fair-access-v2.md). Page **02d** has the same v2 screens in Bangla (draft). Page **02e** has the passenger journey at desktop size (1440, DW01–DW08, flow "Desktop · book a busy train"), the group of 7 (DW09–DW12) and the station counter terminal (CTD01–CTD04). Page 02c section **v2-5** (Bangla on 02d) holds the two-way SMS simulation SMS01–SMS13 plus R3c·v2 and CT05·v2 ([sms-help-extra.md](sms-help-extra.md)). Page **02f** has the 16 desktop screens in Bangla (draft). Page **99 • Full journey — interactive prototype** holds all 79 key screens in 10 acts, fully connected (‹ Back · Next › on every screen, an index, and a Bangla step-by-step guide; see [journey-bangla.md](journey-bangla.md)). Present ▶ "Full journey · start here". Page **98 • Role journeys** has five connected journeys, each from one person's view: traveller, helper, registered agent, guard and TT ([role-journeys.md](role-journeys.md)). Page 02c section v2-6 adds the agent portal (AG01–AG05) and the helper view (HB1·v2). Page **00 • Start here** is the entry point: it lists the pages and links each role to its first screen. v1 is unchanged and saved as branch `release/v1.0`. A coded version of key screens is in [`prototype/`](../prototype/README.md).

**ID prefixes:** P passenger · F forms · R0–R2 returning passenger · G groups · L limits · EG entry guard · TV public TV · OB onboard TT · EX exit · DK desk · CT counter · RV review · OP operations (to design). Every ID is used once.

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
| P07 | Travelling adult | Links child to an adult; role on the booking: accompanying adult, legal guardian or other approved role (no family-relationship words) | Doc S42–S43 |
| P08 | Seats | Pick a coach (bogi): list of coaches with free seats, longest run together and "4 together" / "Split needed" (same pattern as G3a); 2 + 3 seat map; single hold pill; split preference | Backlog 4, 5; Audit F1, F7 |
| P09 | Split seats consent | Partial availability options; nothing booked until chosen | T10 |
| P10 | Pay | Buyer OTP once; fare + non-refundable service charge before provider choice | Backlog 6; Audit F2, F12 |
| P14 | Tickets | Ticket stub per passenger; demo QR; ID reminder | Backlog 7 |
| P15 | Paper ticket · A4 (three frames) | Two self-contained tickets per page with 60 mm QR; odd count = last ticket on the upper half, lower half empty; full booking summary page. Mirrors `design/eticket` PDFs | Backlog 7 (print layout) |

## Passenger: booking forms and regular passengers

| ID | Screen | Purpose / key states | Plan link |
|---|---|---|---|
| F01 | Station picker · from | Search in English or Bangla; recent and matching stations with codes (demo codes) | Backlog 2 |
| F01b | Station picker · to | Opened from the To field on P03; the From station isn't listed; only stations reachable from it | Backlog 2 |
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

## Passenger: groups over 4 (linked booking)

| ID | Screen | Purpose / key states |
|---|---|---|
| G1 | Group size · over 4 | 7 travellers = 2 linked bookings: A (4) + B (3); one hold; each package bought by an adult travelling in it; max 4 seats per booking and no second booking on the same train (published terms); max 8 per group (**proposed**) |
| G2 | Group travellers · packages | Every traveller named with their own ID; Package B bought by one of its travellers |
| G2a | Invite Package B buyer | Buyer chosen only from Package B's adults; invite in app, SMS without payment link, single-use code K7Q-48, **or join at any counter (CT02)** for travellers without a smartphone |
| G2b | Join Package B | Traveller joins and consents before seats are held; scam warning |
| G2c | Invite declined | Invite another Package B adult, book A only, or cancel |
| G3a | Choose a coach (bogi) · 7 together | Every coach in the chosen class with free seats and its longest run of seats together; coaches that can't seat the whole group are shown but marked "Split needed" |
| G3b | Where in the coach | Strip of free runs from front (seat 1) to back; suggested blocks of 7 (front, middle, back); "Customise seats" opens the seat map |
| G3 | Customise seats · 7 together | Seat map to pick or change any seats (example: A in GHA 1–4, B in 5–7, free 8–9 and 15–19); one hold for all seats, only after both buyers joined |
| G5 | Pay for Package B | Hold timer; if B isn't paid in time its seats go to the fair queue, never to another buyer |
| G6 | Package B not paid · choose | Package A's buyer keeps A or cancels A (published deductions); late B payment refunded automatically; default after 30 min: keep A |
| G4 | Linked checkout & tickets | Payment per package; refunds to each package's payer |
| L1 | Limit reached | 2 of 2 bookings used (8 seats); another traveller, next day, or counter (same NID count, **proposed**) |

**Purchase limit (published terms, confirm with railway):** max 4 seats per booking; up to 2 bookings (8 seats) a day per NID, the second for a different train or route; Eid rules can be stricter.

### Anti-resale rules for linked groups (proposed)

1. The Package B buyer must be one of Package B's adult travellers.
2. One NID = one account; limits count per NID, including counter purchases.
3. Invites work for one person only, single use, expire; SMS carries no payment link.
4. Group size capped at 8; every traveller named with an ID when the group applies.
5. One wallet paying for many accounts is flagged for review (back office).
6. No name or ID change after issue; released seats go to the queue, never to a chosen person.
7. Unpaid holds release to the queue (G6 handles Package A's choice).

## Passenger: payment, tickets and changes

| ID | Screen | Purpose / key states |
|---|---|---|
| P11 | Payment pending / unknown | Hold continues; reconcile first, never pay twice |
| P12 | Payment failed | Retry within the same hold and seats |
| P13 | Hold expired | Seats released; new search makes a new hold |
| P24 | Official waiting list offer | Released seat offered in fair order; fixed expiry; not paid → next person |
| P25 | Ticket recovery | Verify access; reissue the same ticket as a new version; old QR stops working |
| P16 | Cancel or release | Published deductions: 48 h+ ৳40 or 10% (greater); 48–24 h 25%; 24–12 h 50%; 12–6 h 75%; under 6 h no refund; service charge never refunded |
| P17 | Late release | Example 12–6 h: ৳87.50 back on ৳350; under 6 h release without refund |
| P18 | Passenger approval | Booker cancelling for another traveller needs that traveller's approval |
| P19 | Refund tracking | To original payer; failed refund retried or paid at counter |
| P20 | Respond to a charge | Response / identity-misuse report → independent review |
| P23 | Account | Masked NID and DOB; "NID record matched" |

**Consent before allocation:** F04a/F04b record the traveller's (or accompanying adult's) consent by SMS, app or counter. P05 blocks "Continue to seats" until every traveller is record-matched and has consented.

## Station entry: guard (EG, console 1440)

| ID | Screen | Purpose / key states |
|---|---|---|
| EG01 | Start shift | Own staff sign-in, device check, assigned trains |
| EG02 | Scan ready | Camera, reference lookup (no NID search), boarding train, shift counts |
| EG03 | Verification monitor | Private screen: approved photo, system status, Match / Needs review / Can't check; locks after 60 s idle with nothing saved; child check guidance |
| EG04 | Entry recorded | Server-confirmed event; onboard and exit still pending |
| EG05 | Save not confirmed | Recover the original event; never record twice; provisional pass after 2 min |
| EG06 | Can't check | Reason; no Match recorded; desk or assistance |
| EG07 | Priority pass check | Pass binding (traveller, ticket version, journey, station, case), expiry, not revoked, unused → fresh comparison; consumed once on save |
| EG08 | Priority pass not valid | Expired, used or revoked: loses priority, not the ticket |
| EG09 | Offline · provisional | Signature + cache checked; cancellations since cache unknown; outbox syncs later |
| EG10 | Ticket not accepted | Cancelled, wrong journey, segment, duplicate concern, invalid QR; staff can't override |
| EG11 | Group ticket at the gate | Each traveller checked separately; child with accompanying adult |

## Station: public TV (TV, 1920×1080)

| ID | Screen | Purpose |
|---|---|---|
| TV01 | Ticket check open | Bilingual boarding info; ID guidance (children: birth registration with the accompanying adult); no personal data |
| TV02 | Service notice | Active tickets accepted; checks temporary until the system reconciles; help desk |

## Onboard: TT (OB, mobile)

| ID | Screen | Purpose / key states |
|---|---|---|
| OB01 | Coach list | Manifest; rows open checks and exceptions |
| OB02 | Ticket and person check | System status, photo, journey checks, Match / Needs review / Can't check |
| OB03 | Group ticket | One check per person |
| OB04–OB08 | Scan exceptions | Cancelled, offline, seen before, invalid QR, wrong journey |
| OB09 | Couldn't check | Reason recorded, never "invalid" |
| OB10 | Incident | Locked ticket status; reason |
| OB11 | Check recorded | Server-confirmed event; outbox for pending |
| OB12 | Official settlement | Fare and excess from approved tariff; numbered receipt; payment never closes identity case |
| OB13 | Destination handoff | Desk acknowledges; supervisor after 10 min; no detention, train doesn't wait |

## Station exit (EX, console 1440) — normal procedure

| ID | Screen | Purpose / key states |
|---|---|---|
| EX01 | Exit check | Photo, journey record, linked cases; finished journey is not an invalid ticket |
| EX02 | Journey complete | Entry, onboard, exit recorded |
| EX03 | Case outstanding | Person, case and payment checked separately → destination desk |
| EX04 | Approved exception | Supervisor-approved pause (e.g. crowd safety), recorded; never a false check |

## Verification desk (DK) and counter (CT)

| ID | Screen | Purpose / key states |
|---|---|---|
| DK01 | Case intake | Queue: departing within 30 min first, then oldest; no case waits over 15 min (supervisor alerted, **proposed**); four decisions, each with its own outcome |
| DK02 | Priority pass issued | One-use pass bound to traveller, ticket version, journey, station, case; expiry; revocable |
| DK03 | Correction for approval | Data error, no fine; second approval (RV04) |
| DK04 | Official fare & rebooking | Only if seats and limits allow; seat not guaranteed; case stays open |
| DK05 | Referred to review | Case reference and appeal route for the traveller |
| DK06 | Destination resolution | Cases from TT or exit resolved at the destination; receipt checked first |
| CT01 | Counter booking (desktop) | Assisted booking, ID checked, cash receipt |
| CT02 | Counter · join Package B | For travellers without a smartphone; same rules and limits; class fixed for the whole group (decision 7c, proposed) |
| CT03 | Counter · refund and receipt | Cancel at the counter with the published deductions; cash back only for cash payments, otherwise to the original payer; names never changed; signed receipt |

## Independent review (RV)

| ID | Screen | Purpose |
|---|---|---|
| RV01 | Inbox (mobile) | Cases by type; own cases locked |
| RV02 | Case detail (mobile) | History, response, decision + reason |
| RV03 | Workspace (desktop) | Queue, history, decision panel |
| RV04 | Second approval | Different approver for sensitive changes |
| RV05 | Random samples | System-picked decisions; never your own station or decisions; findings go to OP07 |

## Operations & admin (OP, console 1440) — restricted back office

| ID | Screen | Purpose |
|---|---|---|
| OP01 | Quotas and sale windows | Online / counter / fair-queue shares per train; applies to unsold seats only; changes need a second approver |
| OP02 | Policy versions | Every ticket records the policy version it was sold under; publishing needs two approvers; retired 24 h refund rule shown |
| OP03 | Staff and devices | Revoke lost devices or suspend accounts; queued offline checks kept and flagged |
| OP04 | Ticket signing keys | Rotation with an overlap window; compromise reporting; key IDs only, never private keys |
| OP05 | Payment reconciliation | Paid-no-ticket, provider-unknown, no-booking and refund-not-received cases; refunds only to the original payer |
| OP06 | Service health | Per-station checks, offline share and sync lag; outage playbook (TV02, EG09) |
| OP07 | Integrity and audit | Owned by the integrity team; override and exception rates, triage flags, samples to RV05 |

Process views on page 03: master journey, **exception branches** (18 branches) and the **staff accountability loop** (record → reconcile → independent sampling → triage → investigation → outcome).

## Bangla and accessibility

- **Coverage (14 Oct):** every passenger screen, the public TV screens (TV01–TV02), the A4 paper tickets (P15) and front-line staff screens (guard EG01–EG11, TT OB01–OB13, exit, desk, counter CT01–CT03) have Bangla drafts on page 02b. The reviewer (RV01–RV05) and operations (OP01–OP07) back-office screens have Bangla drafts too, so every screen now has one. Screens say "coach (bogi)"; Bangla uses বগি. Bangla screens link only to each other. Bangla screens use Bangla digits for values (times, prices, counts, dates, seat numbers) and Bangla coach letters, e.g. বগি ঘ, seat ঘ-১৩ (English screens keep GHA-13). Train names are in Bangla too (৭০১ সুবর্ণ এক্সপ্রেস, মর্নিং এক্সপ্রেস). Class names are in Bangla (শোভন চেয়ার, স্নিগ্ধা, এসি সিট; English screens keep S_CHAIR, SNIGDHA, AC_S). People's names are in Bangla on passenger screens (আব্দুল করিম); tickets (P14, P15, P25) and staff screens use the English name, because the ticket and staff checks use the English name (decided 14 Oct). Stations show Bangla names (ঢাকা → চট্টগ্রাম); station-picker badges show placeholder short forms (ঢাকা, চট্ট, বিমান) until the railway's official abbreviations arrive and the search examples are typed in Bangla. Payment brands are in Bangla too (বিকাশ, নগদ, রকেট, ভিসা); cash is written নগদ টাকা. Only codes such as RF-7Q2K, MX-701, CASE-0192 and v3 and the product name stay in Latin script. Pages 03 (master journey) and 04 (information architecture) stay in English only (decided 14 Oct). All Bangla still needs native review (T11).

- **BN · P03, P05, P14:** Bangla drafts with the language switch set to বাংলা.
- **BN · EG02, EG03, OB02, DK01:** Bangla drafts of the main staff verification screens.
- **BN · EG04–EG11, OB11–OB13, EX01–EX04, DK02–DK06, CT02, G6, P24, P25 (14 Oct):** Bangla drafts of all the outcome screens added on 13 Oct; BN G2a also has the counter line. Page 02b.
- **BN · F03, F04a, R0, G2a, G2b, G5, L1:** Bangla drafts of the forms, returning-passenger and group screens (row below the group row). Names, train names and class names are in Bangla; codes stay in Latin script. All Bangla copy needs review by a native Bangla writer before testing (T11); see [Bangla copy review](bangla-copy-review.md).
- **Accessibility spec:** computed contrast for 15 token pairs (all pass AA: lowest 3.33:1 for the input border, which needs 3:1); focus ring examples; focus order, live-region, error, seat-map keyboard and target-size rules. Contrast is computed from the tokens; everything else must be verified with axe and NVDA/TalkBack once coded.

## Open decisions for T08 review

1. Can a ticket be bound to a named passenger other than the account holder? The current Rail Sheba app defaults to the account holder (audit F4).
2. Hold length and whether one hold covers seats through payment (audit F1).
3. Service charge per booking or per ticket, and refundability (P10 assumes ৳20 per ticket, not refundable).
4. Confirm the published graduated deductions and boundaries (P16, P17).
5. The fair-queue trial: eligibility, window, group fairness, counter participation (P04, P21, P22).
6. Child seating with an adult, and when proof of relationship is required (P07, P09).
7. Charge tariff and wrong-train rules (OB08, OB10, OB12).
8. Larger groups: maximum size (8 proposed), package split (4 + n), and whether linked packages share one fair-queue place (G1–G6).
9. Purchase limits: confirm the published 4 seats per booking / 2 bookings a day applies per NID, including counters; whether cancelling restores a booking; invite expiry (24 h proposed).
10. Anti-resale rules 1–7 above, in particular "the buyer must travel in the package" and the wallet-review signal (G2a–G2c, G5).
11. "Book for someone else" outside groups: keep it for real needs (older people, people not online), counted against the buyer's limits (P03, R0).

All open decisions are collected for the railway in [Railway decisions brief](railway-decisions.md).
