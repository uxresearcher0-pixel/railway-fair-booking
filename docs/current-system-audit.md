# Current system audit — Rail Sheba (Android), 8 October 2026

Source: 13 screenshots of the live Rail Sheba app provided by the project owner, covering one Dhaka → Rajshahi booking attempt. This is a heuristic UX review of what is visible on screen, not a test with users and not a review of back-end controls. Screenshots are not stored in this repository because they contain a real account's personal data; no names, numbers or identifiers from them are reproduced here.

## Observed flow

| # | Step | What the app does today |
|---|---|---|
| 1 | Disclaimer | Full-screen legal text on first use: e-ticket grievances must be emailed within 2 hours; counter/on-train complaints go to the Guard; must tap **I agree**. |
| 2 | Sign in | Mobile number + password, Cloudflare bot check, register / forgot password links. |
| 3 | Search | From, To, Class, Journey date, swap control. A long Bangla fraud warning (buy only from official channels; never share password, OTP, NID) fills most of the screen below the search button. |
| 4 | Results | "Total active users on this page", "0+ users are trying to book" per train. Per-train class cards (S_CHAIR ৳450, SNIGDHA ৳863 incl. VAT, AC_S ৳1035) with "Available tickets (Counter & Online)" counts, scrolling horizontally and cut off at the screen edge. |
| 5 | Coach & seat | Coach chips named by Bangla letters (KA, GHA, JHA, NEO, THA, DA, DHA, TA); seat grid labelled DHA-1…DHA-44 in a 2 + 3 layout; "0 Selected". |
| 6 | Passenger details | Timer: continue to payment within 5 minutes. Passenger 1 is pre-filled with the account holder's name; Adult/Child selector; contact email and mobile. |
| 7 | Phone OTP | 4-digit OTP with a vendor disclaimer about SMS delays; a payment-initiation countdown and a separate OTP resend countdown on the same screen. |
| 8 | Fare & payment | "Complete payment within 15 minutes"; fare breakdown (fare ৳450, service charge ৳20, VAT, bedding, SMS alert; you pay ৳470); nine payment providers as full-width logo rows; a note at the bottom that service and SMS charges are non-refundable. |
| 9 | My tickets | Upcoming / Past tabs; banner linking refund instructions and ticket return policy; illustrated empty state. |
| 10 | Account | Name, email, mobile, full NID with a **VERIFIED** badge, full date of birth, post code, address; edit profile; update password. |
| 11 | Menu | Train information, Verify ticket, Food, Ratings & reviews, Announcement, terms, privacy, support email. |

## Findings

Severity: **High** blocks or misleads, **Medium** slows or confuses, **Low** polish.

| ID | Sev | Finding | Evidence | Proposed response (Figma C-row / v0.2) |
|---|---|---|---|---|
| F1 | High | Several overlapping countdowns with different meanings ("5 minutes to reach payment", "15 minutes to complete payment", "remaining to initiate payment", OTP resend) | Passenger details, OTP and fare screens | One server-controlled hold shown as a single persistent pill from seat choice to payment; OTP resend is secondary (C4, C5) |
| F2 | High | Non-refundable service and SMS charges are disclosed only at the bottom of the provider list, after the total | Payment screen | Label the charge "not refundable" inside the fare breakdown before choosing a provider (C5) |
| F3 | High | Account screen shows the full NID and date of birth with a "VERIFIED" label | Account screen | Mask by default with explicit Show; say "NID record matched" and explain that it does not verify who holds a ticket (C6) |
| F4 | High | Passenger 1 is the account holder by default; the "book for a relative" journey is not visible | Passenger details | Policy question for T04: is a ticket bound to the buyer's NID or to a named passenger? Our design keeps buyer, payer and passenger separate (03, E5), pending railway approval |
| F5 | Medium | Live "users on this page / trying to book" counters add pressure without helping a decision; "0+" is meaningless | Results | Remove; show per-class availability with a plain status badge (C3) |
| F6 | Medium | Class cards scroll sideways and are cut off; sold-out classes look similar to available ones | Results | Stack classes vertically; sold-out rows are muted and non-interactive (C3) |
| F7 | Medium | Seat labels wrap ("DHA-" / "10"); available, selected and booked states have no legend; coach chips show no availability | Seat selection | Full seat numbers, a legend, free-seat counts on coach chips, sold-out coaches dimmed (C4) |
| F8 | Medium | Safety messaging is a long wall of justified red text that pushes the task off-screen and is repeated on several screens | Search, Home | Three short points shown once before booking, in English and Bangla, with a link to the full terms (C2) |
| F9 | Medium | First-run disclaimer is dense legal text; the 2-hour grievance rule is easy to miss | Disclaimer | Keep the rule, but surface it as one of three key points (C2) |
| F10 | Medium | Sign-in error is shown in a separate box below the field; the disabled LOGIN button (white on pale green) has low contrast | Sign in | Inline error under the field with corrective wording; button contrast meets AA in all states (C1) |
| F11 | Low | OTP warning names a vendor and disclaims responsibility instead of telling the user what to do | OTP | Plain guidance: codes can be slow; the seat hold is the timer that matters (C5) |
| F12 | Low | Nine payment providers are full-width rows, so the pay button sits below the fold | Payment | Compact 3-column grid; the pay button names the amount and provider (C5) |

## Constraints to carry into the design

- Coaches are identified by Bangla letter names (KA, GHA, …) and seats as `COACH-number`. S_CHAIR uses a 2 + 3 layout.
- Availability counts are shared between counter and online sales.
- Fares observed for this route: S_CHAIR ৳450, SNIGDHA ৳863, AC_S ৳1,035, plus a ৳20 service charge per booking. Treat these as observed values, not tariff data.
- Accepted providers: bKash, Nagad, Rocket, Upay, tap, Visa, Mastercard, Amex, DBBL Nexus.
- The account is already NID-linked, and the app already offers a ticket verification entry point. Retain these rather than rebuild them (development plan, "Current system comparison").

## What this audit cannot tell us

Hold durations on the server, how counter and online inventory are reconciled, refund timelines, whether one NID can hold overlapping journeys, and how staff verify tickets are not visible from screenshots. These remain discovery items T04–T06.

## Figma

Page **02 • UI v0.2 — Fresh**, row *"Aligned to the current Rail Sheba flow"*: C1 Sign in, C2 Before you book, C3 Results · classes, C4 Coach & seat, C5 Confirm & pay, C6 Account. All values in the designs are fictional.
