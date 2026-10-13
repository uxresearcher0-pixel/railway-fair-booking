# UI gaps after removing older concepts (13 Oct)

On 13 October, 55 older concept screens (v0.4–v0.7) were removed from the Figma file because they did not match the current visual style or duplicated newer screens. Their content was recorded before removal. This file lists:

- what the current screens already cover;
- the scenarios that **no current screen covers**, which are the gaps to design next.

All screens use fictional data. Figma version history can restore any removed frame.

## Current screen set (kept)

| Area | Screens |
|---|---|
| Passenger booking | P01–P04, R0, F01–F03, P21–P22, P05–P07, F04a, F04b, R1, R2, F05, G1–G5, G2a–G2c, L1, P08–P13, F06 |
| Tickets and changes | P14, P15 (×3), P16–P20, P23 |
| Station entry | G01 start shift, G02 scan ready, W01 verification monitor |
| Public TV | Ticket check open, Service notice |
| Onboard | S01–S10, T02 ticket and person check |
| Desk | D03 case intake |
| Review and counter | R01, R02, D02 reviewer workspace, D01 counter booking |
| Bangla drafts | 10 screens |

## Covered by current screens (no action)

| Removed | Covered by |
|---|---|
| Family seat offer | G3, P09 |
| Payment recovery | P11 |
| Confirmed ticket | P14 |
| Refund tracking, including repayment of cash given to a helper | P19 |
| Cancellation review | P16. Its copy still uses the old 24-hour rule. Update it to the published graduated deductions (decision 15). |
| TT: cannot check / offline | S05, S09 |
| TT: incident review | S10 |
| TT: review and complaint | P20, R01, R02 |
| Reviewer inbox and reasoned decision | R01, R02, D02 |
| Guard: unreadable ticket | G02, which has reference lookup |

## Gaps: scenarios with no screen now

Priority: **P1** blocks a flow end to end, **P2** is an important state, **P3** is a confirmation or edge state.

### Station entry (guard)

| # | Scenario | What it must show | Priority |
|---|---|---|---|
| 1 | Entry recorded | Match saved with event ID, "proceed to platform"; onboard and exit checks still pending; screen clears | P3 |
| 2 | Needs review → desk referral | Entry not approved, referral case number, reason chosen at the desk, no guilt label | P1 |
| 3 | Can't check outcome | Reason recorded (photo missing, no ID, poor light); no Match saved; sent to the desk | P2 |
| 4 | Group ticket at the gate | Each traveller checked separately; progress such as "2 matched · 1 review · 1 not checked" | P1 |
| 5 | Ticket exception at the gate | Cancelled, wrong journey or possible duplicate; explain the reason; an expected onboard or exit scan is not a duplicate | P2 |
| 6 | Offline, status unknown | Provisional check only; cached journey and last sync time | P1 |
| 7 | Event pending sync / save unknown / synced | Queued event stays provisional; recover the original event, never create a second one; synced means "received", not "verified" | P2 |
| 8 | Priority re-check after the desk | One-use pass checked, then a fresh comparison; expired, used or revoked pass loses priority but not a valid ticket | P1 |
| 9 | Monitor locked | Details hidden on lock, shift end or inactivity | P3 |
| 10 | Access denied | No assignment, session expired or device revoked; no passenger data shown | P3 |
| 11 | Staff-side service outage | Lookup failed or verification capacity exceeded; retry, alternative lookup or offline path; no automatic rejection | P2 |

### Onboard (TT)

| # | Scenario | What it must show | Priority |
|---|---|---|---|
| 12 | Check recorded | Event linked to the ticket and staff assignment; exit check still pending | P3 |
| 13 | Official settlement and receipt | Fare and excess charge shown separately from the approved rule; numbered receipt; payment never closes an identity question | P1 |
| 14 | Payment unresolved | Pending, failed or unknown payment; check before collecting again | P2 |
| 15 | Destination handoff | Destination desk notified and acknowledges; case, explanation and receipt included; no detention, no train delay | P1 |
| 16 | Handoff escalation | Desk unavailable → duty supervisor; receiving officer recorded | P2 |
| 17 | No ticket on board | Separate the seat, standing entitlement and fare; a fine does not create a seat | P2 |

### Exit (optional, by station): whole area missing

| # | Scenario | What it must show | Priority |
|---|---|---|---|
| 18 | Exit compare | Photo, journey history (entry, onboard), linked case and payment | P1 if exit checks are piloted |
| 19 | Exit completed | Exit recorded; journey complete; screen clears | P2 |
| 20 | Case outstanding at exit | Person, case and payment checked separately; desk referral; no double charge | P1 |
| 21 | Exit check unavailable / operational exception | Safe exit recorded; earlier missing checks stay visible; not a Match | P2 |

### Verification desk (only D03 intake exists)

| # | Scenario | What it must show | Priority |
|---|---|---|---|
| 22 | Priority pass receipt | Pass bound to traveller, ticket version, journey, station and case; expiry; onboard and exit still apply | P1 |
| 23 | Correction approved (data error) | Correction with reason and evidence; second approval; no fine | P1 |
| 24 | Official fare and rebooking | Only if seats and rules allow; no guaranteed seat; payment cannot take another traveller's seat | P1 |
| 25 | Settlement at the desk | Check existing receipt first; charge only what is outstanding; official receipt | P2 |
| 26 | Destination resolution | Cases arriving from TT or exit resolved at the destination, not sent back to entry | P1 |
| 27 | Refer to independent review | Evidence disputed; case reference given to the traveller; no automatic guilt | P2 |
| 28 | Authorised legal referral | Evidence file for authorised officers only; restricted access | P3 |
| 29 | Reviewed history for future journeys | Open, settled, cleared, confirmed, appealed or expired; linked to the proven actor, not the ticket's NID owner by default | P3 |

### Independent review

| # | Scenario | What it must show | Priority |
|---|---|---|---|
| 30 | Second approval | A different approver for sensitive changes; requester can't approve their own | P1 |
| 31 | Case cleared | Correction pushed to all systems; traveller notified; original audit kept | P2 |
| 32 | Independent sample | Random sample of checks reviewed for quality and collusion | P3 |

### Passenger

| # | Scenario | What it must show | Priority |
|---|---|---|---|
| 33 | Official waiting list | No seat held; a released seat goes to the next eligible person; the offer has a fixed expiry | P1 |
| 34 | Ticket recovery | Lost phone or printout: verify access, then reprint the **same** ticket; a replaced version invalidates the old one | P1 |
| 35 | Alternative journey | Missed or disrupted train: official rebooking or refund options; no seat promise | P2 |
| 36 | Support and appeal without a password | Track a case by reference; report identity misuse; request recovery | P2 |
| 37 | Assisted booking by a non-travelling helper | The Ministry notice of 13 May 2026 requires the registered ID holder to travel. Label it "proposed, policy approval pending". | P2 (policy-blocked) |
| 38 | Identity help: approved alternative evidence | Child plus guardian evidence, or another approved document; no shared-phone rejection | P3 (P06 partly covers this) |

## Other things found during the cleanup

- **Bangla drafts** don't yet include the new staff and TV screens (G01, G02, W01, T02, D03). The TV screens are already bilingual.
- **Unlinked current screens:** F01–F03, F04b, L1, P09, P11–P13, P17, P20, P23, S03, S05–S08, D01, D02 still have no prototype links in or out.
- **Policy copy to update:**
  - P16 and P17 still use the withdrawn "no refund under 24 h" rule.
  - L1, F03, R0 and G-screens say "4 per day", but the published terms say 4 per transaction and 8 per day (decision 1).
- **Not updated:** the two FigJam boards (journeys and IA) were not changed. The Figma design file pages 03 and 04 are now the current flow and IA.

## Suggested order

1. **P1 gaps:** guard referral, group and offline at the gate (2, 4, 6, 8); TT settlement and handoff (13, 15); desk outcomes (22–24, 26); second approval (30); waiting list and ticket recovery (33, 34).
2. **Exit set (18–21)**, but only if exit checks are confirmed for the pilot stations.
3. **P2 and P3 states**, then link all screens into prototype flows.
