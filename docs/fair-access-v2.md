# Fair access · v2 (proposed, 15 Oct 2026)

v2 answers the 12 open issues raised in the *Fair access without broker dependence* proposal (15 Oct). It adds screens and rules; it does not delete anything from v1.

- **v1 is kept:** Figma pages 02 (English) and 02b (Bangla) are unchanged, and the repository state is saved as branch `release/v1.0`.
- **v2 screens:** Figma page **02c • UI v2 — Fair access (English, proposed)**. Section v2-0 is a one-page overview.
- **Status:** every rule below is **proposed** and needs railway approval (decisions #35–#44 in [railway-decisions.md](railway-decisions.md)). No reduction in black marketing is claimed until a measured pilot ([pilot-validation-plan.md](research/pilot-validation-plan.md)).

## The core idea

An ID check shows *who* travels. It can't show *how* the ticket was obtained or whether someone paid a broker extra. So v2 removes the broker's advantage instead of adding more checks:

1. **Speed gives no advantage.** Busy trains use an application window and a published random draw.
2. **One chance per traveller.** One application per traveller across app, website, counter and agents. A group gets one place.
3. **Seats can't be parked.** Every offer and hold has a fixed end time that never restarts.
4. **Help is official and priced.** Registered agents give itemised receipts; anyone can report an extra charge privately.
5. **The traveller stays in control.** Helpers have limited rights; the traveller can remove them and recover the ticket at any counter.
6. **Insiders are checked.** Draw inputs are frozen and replayed; every seat is reconciled; agents and reports go to independent review.

## Issue by issue

| # | Issue | v2 answer | Screens (page 02c) | Still open after v2 | Who |
|---|---|---|---|---|---|
| 1 | Hidden extra price for booking help | Itemised official total; SMS receipt to each adult traveller; private extra-charge report; registered agents with printed receipts; agent review | P10·v2, P14·v2, R3·v2, R3b·v2, CT04·v2, OP10·v2 | A private payment both sides hide can't be seen. Needs cheap official help and independent sampling | Railway (fees, agents), ops |
| 2 | Many real people, each within their own limit | One application per traveller across all channels; party locked before the draw | P21·v2, G2·v2 | Coordinated genuine people; pattern review only | Engineering, review team |
| 3 | Bots and faster clicking | Application window and published random draw; duplicate check; public audit | P21·v2, P21b·v2, PA1·v2, OP08·v2 | Server enforcement and identity linking | Railway (scope), engineering |
| 4 | Repeated seat holds | Fixed hold end time; 30-minute pause after 3 unpaid holds on the same train | H1·v2 | Exact limits | Railway |
| 5 | Delaying an offer to park seats | Absolute pay-by time that never restarts; unopened offers expire; waiting-list place kept | P22·v2, P22c·v2, P24·v2 | — | — |
| 6 | Dishonest guard or TT | No change in v2 (v1 records staff, "couldn't check" and random samples) | — | A log can't prove what staff saw | Operations |
| 7 | Dishonest desk approvals | Correction only for the same person; changing the person means cancel and re-apply; second approver; self-approval blocked | DK03·v2 | Two colluding approvers | Railway, independent review |
| 8 | Insider seat diversion | Frozen seat snapshot; draw replay by an auditor; every seat reconciled | OP08·v2, OP09·v2 | Needs an independent integrity team | Railway, operations |
| 9 | Whoever holds the phone controls the ticket | Traveller, helper and payer roles; traveller removes helper; recovery at any counter without the helper; codes to the traveller's own phone | F05·v2, A1·v2, A1b·v2, P25·v2 | — | — |
| 10 | Different ID documents for one person | Not solvable in design | — | Official identity linking | Identity service, railway |
| 11 | Copied tickets during an outage | No change in v2 (v1 marks offline checks provisional; reissue cancels the old QR) | — | Found only after sync | — |
| 12 | Boarding where there is no gate | No change in v2 | — | Staffing and coverage | Railway operations |

**Correction to an earlier note:** the waiting-list screen P24 already had a fixed offer end time. The screen that started the hold "when you open the offer" was **P22**; P22·v2 fixes it.

## Screens added in v2 (page 02c)

| Section | Screen | What it shows |
|---|---|---|
| v2-1 Apply, draw and offer | P21·v2 Apply for the draw | Window 08:00–10:00, result 10:30, pay by 11:00; "applying early gives no extra chance"; one application per traveller; duplicate-check example |
| | P21b·v2 Application received | Application receipt AP-0214-7K, party locked, free to apply |
| | P22·v2 Picked · pay by 11:00 | Draw place, absolute deadline that never restarts, official total |
| | P22c·v2 Offer expired | Seats passed to the next application in draw order; not charged |
| | P24·v2 Waiting list · place kept | Place kept when a release doesn't fit the group; every skip recorded |
| | H1·v2 Hold paused | Pause after repeated unpaid holds (rule to confirm) |
| v2-2 Groups and helpers | G2·v2 Your group | One draw place for all 7; party locked; all-or-none chosen before the draw |
| | F05·v2 Who does what | Traveller, accompanying adult, helper and payer, and what the helper can do |
| | A1·v2 / A1b·v2 | Who can act on my booking; remove a helper; record of the change |
| v2-3 Receipt, report and recovery | P10·v2 Official total | Fare, service charge, assistance fee, total; "asked to pay more?" |
| | P14·v2 Receipt · SMS | Receipt and the SMS each adult traveller gets |
| | R3·v2 / R3b·v2 | Private extra-charge report; reference and what happens next |
| | P25·v2 Recover without the helper | Counter recovery with own ID; codes to the traveller's own phone |
| v2-4 Counter, desk, public audit, operations | CT04·v2 Agent receipt | Registered agent RA-118; free application; itemised fee; same draw |
| | PA1·v2 Public draw audit | Frozen inputs, fingerprint, random source, result, independent replay — no personal data |
| | DK03·v2 Correction — same person only | Desktop. Second approver; "a different person can't take this seat" |
| | OP08·v2 Draw run and replay | Desktop. Inputs frozen and committed; no reruns |
| | OP09·v2 Every seat accounted for | Desktop. Seats by state; unexplained seat flagged |
| | OP10·v2 Agents and extra-charge reports | Desktop. Reports are leads; no automatic penalty; review and appeal |

## Check of the proposal's simulation

`research/allocation_sim.py` (standard library only) repeats the proposal's simplified model: 1,000 single-seat applicants, 200 of them broker-assisted, 200 seats.

| Case | Broker side wins (average of 20,000 draws) | Middle 95% of draws |
|---|---|---|
| One entry per applicant | 39.97 of 200 seats (expected 40) | 30–50 |
| 5 entries per broker client (no duplicate check) | 111.04 of 200 entries | 98–124 |

This matches the proposal (39.996 and 111.151). What it shows: with a fair draw, speed gives no advantage, but **duplicate checks are essential**. It does not show any real-world reduction, and a broker can still charge the ~40 winning clients, which is why official help and reporting are part of v2.

## Acceptance tests to run before any pilot

From section 10 of the proposal, to be run against a real backend in a test environment (not prototype screenshots):

1. One passenger across app, counter and agents resolves to one application.
2. Duplicate identity documents: verified aliases converge; uncertain matches go to an appealable review.
3. Bots and network speed don't change rank inside the window.
4. Unopened offer and repeated refresh: hard expiry; next offer follows the recorded order.
5. Concurrent payments and late callbacks: at most one seat allocation; late money is refunded.
6. Family split and rejoin: no extra chances; no additions after the result.
7. Cancel and targeted recapture: the seat goes to the next eligible request, never to a chosen buyer.
8. Quota tampering and draw rerun: blocked or visible; replay matches.
9. Helper loses contact or phone changes: traveller recovers at another counter.
10. Paid genuine passenger: checks pass; official price visible; excess payment reportable without invalidating the ticket.
11. Dishonest desk or TT: a fine never creates a seat; substitution blocked.
12. Outage or missed notification: the published rule applies; no secret deadline extensions.

## Not in v2 yet

Done on 15 Oct (second pass):

- **Bangla:** page **02d • UI v2 — বাংলা (draft, proposed)** has Bangla copies of all 21 v2 screens and the overview, in the same positions as 02c. Same rules as 02b: Bangla digits, coach letters (বগি ড, ঘ-৩১), class (শোভন চেয়ার, স্নিগ্ধা), payment brands (বিকাশ), নগদ টাকা; codes (AP-0214-7K, RF-7Q2K-48, RA-118) stay Latin. Needs native review.
- **Coded prototype:** P21·v2 (with the duplicate state), P22·v2 (with the expired state), P10·v2, R3·v2 and A1·v2 are coded, with a flow P21 → P22 → P10 → R3 (`#apply-v2`). There is a role-based Home screen and a desktop layout from 1024px. See [prototype/README.md](../prototype/README.md).
- **Desktop passenger journey:** page **02e • UI — Desktop passenger journey (1440, website)** has 8 screens (DW01–DW08): search, results, apply, picked and seats, pay, tickets, manage booking and report an extra charge. It is a prototype flow, "Desktop · book a busy train".
- **Start here:** page **00 • Start here** lists every page and has 12 role cards with links to the first screen of each flow (English, Bangla, v2, desktop).

Still not done:

- The other v2 screens (G2·v2, F05·v2, H1·v2, P24·v2, P14·v2, P25·v2, CT04·v2, PA1·v2, DK03·v2, OP08–OP10·v2) are in Figma only, not in the coded prototype.
- Desktop versions of the staff, counter and group journeys. Staff back-office screens are already desktop.
- Native-speaker review of all Bangla, v1 and v2.
