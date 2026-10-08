# Usability test plan · UI v0.2

## Goals

1. Can passengers book for themselves, for someone else and for a group without help?
2. Do people understand the 4-tickets-per-day limit, the linked group invite and the hold timer?
3. Do people trust the invite flow, and can they tell a real invite from a fake SMS?
4. Can ticket checkers and guards check a ticket and an ID quickly on a moving train?
5. Do screen-reader users complete the key tasks (NVDA on desktop, TalkBack on Android)?

## Participants (12–16 sessions)

| Group | Count | Notes |
|---|---|---|
| Regular online buyers (Rail Sheba users) | 4 | Mix of ages; at least 2 who book for others |
| First-time or occasional buyers | 3 | Include 1 person over 55 |
| Group organisers (families or work trips of 5+) | 2 | |
| Screen-reader users | 2 | 1 NVDA, 1 TalkBack; recruit through a disability organisation |
| Ticket checkers or guards | 2–3 | Only with railway permission |
| Counter staff | 1–2 | Optional, for D01 |

Run sessions in Bangla by default and in English on request. Pay participants for their time. Never collect real NID, phone or payment data. Use the fictional personas on cards.

## Materials

- The Figma prototype flows: book for family, regular (returning), group of 7 (linked), staff onboard round.
- The coded prototype (`prototype/`) for keyboard and screen-reader tasks.
- Printed A4 e-tickets for the staff tasks.
- A consent form for recording, in Bangla and English.

## Tasks

| # | Task | Success |
|---|---|---|
| T1 | "Book a ticket for yourself to Chattogram on Friday." (R0) | Reaches payment without the form |
| T2 | "Your colleague Rahim needs a ticket too. Add him using his NID." (F04a) | Correct fields; understands "record matched" |
| T3 | "You already bought 4 tickets today. Try to buy one more." (L1) | Explains the limit in their own words; picks a valid option |
| T4 | "Book for a group of 7." (G1 → G2 → G2a) | Understands why a second buyer is needed and who can be chosen |
| T5 | "You got this invite. What do you do?" (G2b) | Joins or declines with confidence |
| T6 | Show a fake SMS with a payment link: "Is this real?" | Says no, and says the real invite is in the app |
| T7 | "Seats are held. Pay for your package." (G5) | Notices the timer; knows what happens if they don't pay |
| T8 | Staff: "Check this passenger's ticket." (S02 with a printed ticket) | Under 20 s; checks status, then ID |
| T9 | Screen reader: T1 and T4 with NVDA or TalkBack | Completes the task; all controls are announced correctly |

## Questions after the tasks

- What does "4 tickets per day" mean to you? Is it fair?
- Who should be allowed to buy for a group?
- Would you trust an invite from a friend inside the app? By SMS?
- What would stop a ticket seller from using this?

## Measures

Task success (yes / with help / no), time on task, errors, and confidence (1–5). Also SUS after the session. Screen-reader issues are logged with the screen, element and announcement.

## Analysis and output

Within one week, tag issues by screen ID and severity (blocker, major, minor). Post the top 5 findings and proposed fixes in the Slack tracker thread, and update `docs/ui-screen-map.md`.
