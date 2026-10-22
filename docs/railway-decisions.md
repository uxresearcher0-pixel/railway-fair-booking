# Railway decisions brief

The UI v0.2 design and the coded prototype rely on rules that only the railway can confirm. Every screen that depends on one labels it **proposed** or **rule to confirm**. This brief is for the T08 review. For each decision it gives the project's recommendation, the screens affected, and what changes if the answer differs.

All examples use fictional data. This is an independent concept, not a Bangladesh Railway document.

## Purchase limits and anti-resale

| # | Decision | Recommendation | Screens | If the answer differs |
|---|---|---|---|---|
| 1 | Buyer limit | Align with the published terms (max 4 seats per transaction, up to 2 transactions / 8 seats per day, subject to train and station conditions; separate Eid rules). The UI now follows this baseline (13 Oct) — confirm it applies per NID and to counters | F03, R0, G1, G2b, G5, L1 | Change the number in the allowance pill and L1 copy |
| 2 | Is the limit per account or per NID? | **Per NID**; one NID = one account | L1, G2a | Per account lets one person with several accounts multiply the limit |
| 3 | Do counter purchases count? | Yes, against the same NID | L1, D01 | Counters become the bypass route |
| 4 | Does cancelling restore the allowance? | No | L1 | Cancel-and-rebuy becomes a way to hand seats to a customer |
| 5 | Who may buy Package B of a linked group? | Only an adult travelling in Package B | G2, G2a, G2c | Paid strangers can buy for groups; the 4-per-day limit stops working for groups |
| 6 | Maximum group size | 8 (two packages of 4) | G1 | Larger groups win a bigger share per fair-queue draw |
| 7 | How long does a group invite stay open? | 24 hours or until the sale closes | G2a | Shorter means more declined groups; longer delays the queue |
| 7a | Package B not paid when the linked hold ends | B seats go to the fair queue; Package A's buyer keeps or cancels A within 30 min (default keep); late B payment refunded automatically | G5, G6 | Whole-group cancellation would punish A; holding B seats would allow parking |
| 7b | Travellers without a smartphone in a group | Join Package B at any counter with their NID and the group code; same limits | G2a, CT02 | Without it, larger groups require a second account |
| 7c | Class (seat type) in a linked group | **One class for the whole group** (chosen 14 Oct). Both packages travel in the class Package A's buyer picks; Package B's buyer can't change it. A traveller who wants another class leaves the group and books separately within their own limit | G1, G2b, CT02 | Mixed classes would split the group across coaches and complicate the shared hold |
| 7d | Coach and seat choice for a group | The buyer picks the coach (G3a) and where in it (G3b: front, middle or back block of seats together), or customises on the seat map (G3). Only free seats in the chosen class are shown; choosing is inside the same fixed hold | G3a, G3b, G3 | Auto-allocation only would remove the passenger's choice; unlimited browsing without a hold would let people block seats |
| 8 | Unpaid Package B in a hold | Seats return to the fair queue, never to the other buyer | G5 | Seats could be "parked" for a chosen person |
| 9 | One wallet paying for many accounts | Flag for review, don't block | Back office only | Blocking hurts families who share a wallet |
| 10 | "Book for someone else" outside groups | Keep it, counted against the buyer's 4 | P03, R0 | Removing it excludes older people and people not online |
| 11 | Name or ID change after issue | Never; cancel and release instead | P16, P17 | Transfers make resale easy again |

## Booking, payment and cancellation

| # | Decision | Recommendation | Screens |
|---|---|---|---|
| 12 | Can a ticket be bound to a named passenger other than the account holder? | Yes, with that passenger's ID | P05, F04a, R1 |
| 13 | Hold length, and does one hold cover seats through payment? | One fixed hold through payment (10 min proposed) | P08, G5, P11–P13 |
| 14 | Service charge per booking or per ticket; refundable? | ৳20 per ticket, not refundable (as shown today) | P10, F06, G4 |
| 15 | Cancellation deductions and boundaries | Follow the published graduated deductions (48+ h, 48–24 h, 24–12 h, 12–6 h; no refund under 6 h; service charge non-refundable), confirmed with the railway. The earlier "no refund under 24 h" proposal is withdrawn | P16, P17 |
| 16 | Fair-queue trial: eligibility, window, group fairness, counter participation | One application per group, published draw, audit reference | P04, P21, P22 |

## Verification operations (proposed defaults, 13 Oct)

| # | Decision | Recommendation | Screens |
|---|---|---|---|
| 21 | Exit check | **Normal step of every journey** (Entry → TT → Exit). Only a supervisor-approved operational exception (e.g. crowd safety) can pause it, and it is recorded on each journey | EX01–EX04 |
| 22 | Consent before allocation | Every traveller consents (SMS, app or counter) and has a matched record before seats are offered | F04a, F04b, P05 |
| 23 | Monitor timeout | No answer in 60 s: nothing saved, screen locks, rescan; no time pressure to guess | EG03 |
| 24 | Save not confirmed | Recover the original event; never record twice; traveller may pass as provisional after 2 min | EG05, OB11 |
| 25 | Priority pass | One use; bound to traveller, ticket version, journey, station and case; expiry set by desk; revocable; expired pass loses priority only | DK02, EG07, EG08 |
| 26 | Desk queue | Departing within 30 min first, then oldest; no case waits over 15 min (supervisor alerted) | DK01 |
| 27 | Destination handoff | Desk acknowledges within 10 min, else duty supervisor; no detention by the system; train never waits | OB13, DK06 |
| 28 | Child checks | Birth registration has no photo: check name, age and the accompanying adult on the same booking | EG03, EG11, OB02, TV01 |
| 29 | Outage message | Public screens say active tickets are accepted and checks are temporary until reconciled — never "your ticket is valid" | TV02, EG09 |
| 30 | Integrity ownership | An operations integrity team, independent of station management, owns reconciliation, sampling and investigations | Page 03 accountability loop |

## Identity and travel

| # | Decision | Recommendation | Screens |
|---|---|---|---|
| 17 | Child seating with an adult; when proof of relationship is needed | Child always in the same package as an accompanying adult; proof only at assisted counter checks | P07, F04b, G2 |
| 18 | Age bands (adult 12+, child 3–11, under 3 on a lap) | Confirm against the current tariff | F03 |
| 19 | Accepted IDs: NID, birth registration, passport, assisted check | All four, with assisted check at counters | F04a, F04b, P06 |
| 20 | Charge tariff and wrong-train rules | Amount from the approved tariff only; official receipt | S08, S10 |

## Language and naming (decided by the project team, 14 Oct)

| # | Decision | Decision taken | Screens | Still needed from the railway |
|---|---|---|---|---|
| 31 | Which name the ticket and staff checks use | **The English name.** Tickets and every staff check (guard, TT, exit, desk, counter, reviewer) show the English name, also on Bangla screens. Passenger booking screens in Bangla may show the Bangla name | P14, P15, P25, EG, OB, EX, DK, CT, RV | Confirm the English name is the one on the NID, birth registration and passport records the checks match against |
| 32 | Station abbreviations | **Use the railway's official station abbreviations** on the station-picker badges and anywhere a short form is needed | F01, F01b | The official list of station abbreviations (Bangla and English). The demo codes (DHK, CTG) and Bangla short forms (চট্ট, বিমান) are placeholders until then |
| 33 | Cash wording in Bangla | Cash is written **নগদ টাকা**, so it is never confused with the payment brand নগদ | CT01–CT03, P19 | None |
| 34 | Language of planning pages | The master journey (page 03) and information architecture (page 04) stay **English only** | Pages 03, 04 | None |

## Fair access v2 (proposed 15 Oct, needs railway approval)

From [fair-access-v2.md](fair-access-v2.md). Screens are on Figma page 02c.

| # | Decision | Proposal | Screens | If the answer differs |
|---|---|---|---|---|
| 35 | Which trains use an application window and draw | Only oversubscribed trains, announced before sale; others keep direct booking | P21·v2, P22·v2 | Without a window, speed (and bots) decide who gets seats |
| 36 | Window and deadlines | Example for testing: apply 08:00–10:00, result 10:30, pay by 11:00; deadlines never restart | P21·v2, P22·v2, P22c·v2 | Restarting deadlines let seats be parked |
| 37 | One application per traveller | Across app, website, counter and agents; a group gets one place; party locked before the draw | P21·v2, G2·v2 | Duplicate entries give brokers ~111 of 200 seats in the simulation instead of ~40 |
| 38 | Hold pause | After 3 unpaid holds on one train, a 30-minute pause (values to confirm) | H1·v2 | Repeated holds can keep seats from the public |
| 39 | Registered agents and assistance fee | Agents registered, same draw, free application, published fee on an itemised receipt; no paid priority | CT04·v2, P10·v2, P14·v2 | Hidden fees stay invisible; unregistered brokers keep the advantage |
| 40 | Extra-charge reports | Private report from receipt/SMS/counter; seen only by an independent review team; never cancels the ticket | R3·v2, R3b·v2, OP10·v2 | Passengers won't report if it risks their ticket |
| 41 | Helper rights | Helper can book, pay and view; only the traveller (or accompanying adult) can cancel or change; traveller can remove the helper | F05·v2, A1·v2 | Helpers can hold tickets over passengers |
| 42 | Recovery without the helper | Any counter with the traveller's own ID; codes to the traveller's own phone | P25·v2 | Losing the helper means losing the ticket |
| 43 | Corrections vs changing the person | Corrections only for the same person, with a second approver; a different person must cancel and apply | DK03·v2 | Corrections become a way to resell seats |
| 44 | Draw audit and seat reconciliation | Inputs frozen and committed before the random number; public audit page; independent replay; every seat reconciled | PA1·v2, OP08·v2, OP09·v2 | Insiders could alter quotas or rerun draws unseen |

## How to use this brief

1. Walk through the table with the railway in the T08 review and record each answer here, with the date and who confirmed it.
2. For each changed answer, update the screens listed and remove the "proposed" or "rule to confirm" label once it is confirmed.
3. Post the outcome in the project Slack tracker thread.
