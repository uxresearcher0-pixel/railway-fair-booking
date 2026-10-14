# UI review status (13 Oct, updated 14 Oct)

This file tracks the 24 review issues raised on 13 October and how each was resolved in Figma (file `3Jb4jMo27Pi6N4gncIPPJK`) and the repo. All data is fictional. Rules marked **proposed** still need railway approval; see [railway-decisions.md](railway-decisions.md).

## Resolved

| # | Priority | Issue | Resolution | Where |
|---|---|---|---|---|
| 1 | P0 | Exit was optional | Exit is a normal step; only a supervisor-approved exception pauses it, and it is recorded | EX01–EX04, master journey, IA, decision 21 |
| 2 | P0 | Refunds used the withdrawn 24-hour rule | Published graduated deductions on P16, P17, the A4 summary page and the e-ticket PDFs | P16, P17, P15, `design/eticket` |
| 3 | P0 | Purchase limit didn't match the baseline | 4 seats per booking, 2 bookings (8 seats) a day, second for a different train or route; Eid rules may differ | F03, R0, L1, G1, G2a, G2b, G2c, G5, BN copies, master journey, prototype |
| 4 | P0 | Large groups needed a second account | Package B traveller can join at any counter with NID and group code | G2a, CT02 |
| 5 | P0 | Consent not established before allocation | Traveller consent (SMS, app or counter) replaces the purchaser checkbox; P05 blocks seats until all travellers are ready | F04a, F04b, P05, decision 22 |
| 6 | P0 | Desk decision had one destination | Four outcomes, each linked: pass, correction with second approval, official fare and rebooking, referral | DK01 → DK02, DK03 (→ RV04), DK04, DK05 |
| 7 | P0 | Priority pass not validated | Pass check screen: binding, expiry, revocation, one-use consumption; invalid-pass state | DK02 → EG07 → EG03; EG08 |
| 8 | P0 | "Can't check" had no outcome | Linked outcomes | EG03 → EG06; OB02 → OB09 |
| 9 | P0 | Match confirmation and failed save bypassed | Saved and unknown-save states; outbox recovery | EG04, EG05, OB11 |
| 10 | P0 | TV outage claimed every ticket is valid | "Active tickets accepted; checks temporary until reconciled" | TV02, decision 29 |
| 11 | P1 | Payment branch merged three states | Pending/unknown → reconcile; failed → retry in hold; expired → new allocation | Master journey, P10 prototype chips |
| 12 | P1 | Linked-package completion unclear | Package B unpaid → B seats to queue; A's buyer keeps or cancels A; late B payment refunded | G1, G5, G6, decision 7a |
| 13 | P1 | Exception paths not traceable | Exception branches table with 18 branches, triggers, outcomes and screens | Page 03 |
| 14 | P1 | Onboard handoff merged with fare/rebooking | Handoff → destination desk (DK06) is separate from official fare (DK04) | Master journey, OB13, DK06 |
| 15 | P1 | 20-second timeout pressured staff | 60 s idle → nothing saved, lock, rescan; "never guess" | EG03, decision 23 |
| 16 | P1 | Children's evidence called photo ID | Child check: name, age and accompanying adult | TV01, EG03, EG11, OB02, decision 28 |
| 17 | P1 | Desk queue could delay others forever | Departing within 30 min first, then oldest; 15-min cap with supervisor alert | DK01, decision 26 |
| 18 | P1 | Stale and duplicate IDs | New prefixes (EG, OB, EX, DK, CT, RV, TV, OP); each ID used once; master and IA updated | Pages 02–04, screen map |
| 19 | P1 | Critical states disconnected | Linked: split consent, payment pending/failed/expired, limit, waitlist, recovery, all guard/TT/desk/exit states | Prototype flows |
| 20 | P1 | No operations/admin role | Operations & admin role in the IA (quotas, policy versions, staff/device revocation, signing keys, reconciliation, service health, integrity) | Page 04 |
| 21 | P1 | Information model incomplete | 13 objects incl. consent, hold, waitlist offer, payment & refund, sync event, priority pass, handoff, decision & approval | Page 04 |
| 22 | P1 | Corruption controls not a flow | Staff accountability loop with owners: record → reconcile → independent sample → triage → investigation → outcome | Page 03, decision 30 |
| 23 | P2 | Current and earlier concepts competed | All 55 older concept screens removed; one style, one ID per screen | Page 02 |

## Resolved on 14 Oct

| # | Issue | Done | Still open |
|---|---|---|---|
| 24 | Bangla coverage | Bangla drafts for every screen (14 Oct): passenger, public TV, front-line staff, reviewer RV01–RV05 and operations OP01–OP07, plus every new screen: EG04–EG11, OB11–OB13, EX01–EX04, DK02–DK06, CT02, G6, P24, P25, plus the G2a counter line (page 02b, own Bangla page) | All Bangla is a draft and needs review by a native Bangla writer (T11). All Bangla screens use Bangla digits for values (times, prices, percentages, counts, dates, seat numbers) Bangla coach letters (ক, খ, গ, ঘ … e.g. ঘ-১৩) Bangla train names (৭০১ সুবর্ণ এক্সপ্রেস) Bangla class names (শোভন চেয়ার, স্নিগ্ধা, এসি সিট) Bangla people's names (আব্দুল করিম) and Bangla station names instead of codes (ঢাকা → চট্টগ্রাম). Leftover English labels found and translated on 14 Oct: DK02–DK06 headings and section labels, CT01–CT02, G6, P24, P25, EG01, DK01; codes such as RF-21, CASE-0192 and v3 stay in Latin script |

## Cannot be resolved in design

| # | Issue | Why | What we did |
|---|---|---|---|
| 25 | Effectiveness and throughput unvalidated | Needs measurement in a real station | [Pilot validation plan](research/pilot-validation-plan.md): throughput targets, queue tests, false-refusal and fraud measures |

## Designed on 14 Oct

- Operations & admin OP01–OP07 (new section 13 on page 02; Bangla moved to its own page, 02b), counter refunds CT03, reviewer samples RV05. All are green chips on the IA, linked in the master journey and the accountability loop, with prototype links between them.
- Group class rule (decision 7c, proposed): one class for the whole group; Package B can't change it (G1, G2b, CT02).
- P25 copy: "Verified access" changed to "Access confirmed".

- Prototype links for the new booking screens (14 Oct): P03 To → F01b → P03; station rows in F01/F01b return to P03; G2b Join → G3a → G3b → G5, with "Customise seats" → G3 and "Split needed" bogis → G3 (groups) or P09 (P08). Bangla copies link to each other: BN P03 → BN F01b, BN G2b → BN G3a → BN G3b → BN G5; new flow start "বাংলা · Passenger search". BN RV and OP screens link to each other (flows "বাংলা · Reviewer" and "বাংলা · Ops back office"); no Bangla link points to an English screen.
- Screen states (14 Oct): G3b "Middle selected" and "Back selected" (options switch between Front/Middle/Back; button holds 1–7, 48–54 or 94–100); P08 "all coaches" (Show all 8 coaches ↔ Show fewer). Same states in Bangla. Page 02 sections restacked so nothing overlaps.
- Pages split by language (14 Oct): English stays on page 02 (sections 00–13); Bangla moved to new page 02b with the same sections and layout, its own flow starts, and no links between the pages. Section 12 now runs counter (CT01–CT03) then reviewer (RV01–RV05) on both pages; layers on both pages read top to bottom in journey order.
- Copy fixes found during the Bangla pass (14 Oct): P02 no longer names the real railway e-ticket domain (uses "the official railway website" and support@railfair.example); P07 "Relationship / Parent" became "Role on this booking"; "verified" removed from R2, F04b, P06, P23 ("Check a ticket") and P15 ("Check or cancel"); flow "Passenger · book for family" renamed "book for others".

## Still open

- Native review of all Bangla copy.
- Screens that are static by design: library, Bangla drafts.
- The FigJam board is kept for history; it now points to Design pages 03 and 04.
