# railfair prototype

Accessible React + TypeScript + Storybook prototype of the railfair booking concept: linked group booking, the purchase limits (max 4 seats per booking, up to 2 bookings a day per NID), NID record checks and the staff ticket check, plus the proposed **fair access v2** screens (application window and random draw, fixed pay-by time, official total, extra-charge report, helper access, group and helper roles, hold pause, waiting list, receipt, recovery, agent receipt, public draw audit, desk correction and three operations screens). See `../docs/fair-access-v2.md`.

> **Concept demo — not a real booking service.** Everything here is simulated. There is no backend. It is not affiliated with or branded as any railway operator. All people, ID numbers, phone numbers, codes and payments are fictional. Rules marked **(proposed)** or **(rule to confirm)** still need railway approval. See `../docs/ui-screen-map.md`.

## Run it

Requires Node 20+ (tested with Node 22).

```bash
cd prototype
npm install
npm run dev               # Vite app: Home (journeys by role) + screen picker → http://localhost:5173
npm run storybook         # Storybook with the a11y panel → http://localhost:6006
npm test                  # Vitest: axe on every story, keyboard and behaviour tests
npm run typecheck         # tsc --noEmit
npm run build             # type check + Vite production build → dist/
npm run build-storybook   # static Storybook → storybook-static/
npm run test:a11y-storybook   # axe in real Chromium against storybook-static/ (needs Playwright, see below)
```

`test:a11y-storybook` uses Playwright from the project if it is installed, or the global install (`npm root -g`/playwright). Browsers come from `PLAYWRIGHT_BROWSERS_PATH`. Options: `VERBOSE=1` lists the items axe marks "needs review"; `SCREENSHOTS=<dir>` saves full-page PNGs of every screen story.

## Stack

Vite 5, React 18, TypeScript 5, Storybook 8 (`@storybook/react-vite`, `addon-essentials`, `addon-a11y`), Vitest 2 + jsdom, Testing Library, axe-core (with `jest-axe`'s `toHaveNoViolations` matcher). Plain CSS with custom properties. Fonts are self-hosted with `@fontsource`: Bricolage Grotesque (display), Geist (UI), Geist Mono (data) and Anek Bangla (Bangla), with system fallbacks.

## What's covered

### Design tokens (`src/styles/tokens.css`)

| Token | Value | Use / contrast |
|---|---|---|
| `--paper` | `#f5f3ee` | canvas |
| `--surface` | `#ffffff` | cards |
| `--ink` | `#111412` | text, primary button: 18.5:1 on white |
| `--ink-2` | `#5e625f` | secondary text: 6.2:1 on white, 5.6:1 on paper |
| `--lime` | `#d4f26a` | accent, only behind `--ink` text: 14.8:1 |
| `--border` | `#c9c6bd` | decorative dividers only |
| `--border-strong` | `#8a8d89` | input and control borders: 3.36:1 on white (needs 3:1) |
| `--focus` | `#1f5eff` | 3px outline, 2px offset: 5.1:1 on white, 4.6:1 on paper |
| `--danger` / `--success` / `--warning` | `#b42318` / `#1a7f37` / `#9a6700` | 6.6 / 5.1 / 4.9:1 on white. Tinted fills carry `--ink` text. |

Radii are 12–16px, the layout is mobile-first at a 390px width (max 430px), and touch targets are at least 44×44px. From 1024px wide there is a desktop layout (see [Responsive layout](#responsive-layout)).

### Components (`src/components`, each with stories)

| Component | States in stories | Accessibility notes |
|---|---|---|
| Button | primary, secondary, danger, ghost, icon, disabled, loading, block | Loading uses `aria-busy` + `aria-disabled` and keeps focus. Spinner is static under reduced motion. |
| Field | default, hint, error, filled, read-only, Bangla label | `<label for>`. Hint and error linked with `aria-describedby`. `aria-invalid`. The error has an icon and a hidden "Error:" prefix, so it doesn't rely on colour. |
| Stepper | default, at min, at max, children | `role="group"` labelled by the visible label. The −/+ buttons say "Remove one adult" / "Add one adult". At the bounds they use `aria-disabled`, not `disabled`, so focus isn't lost. A polite live region announces "3 adults". |
| StatusPill / Badge | sent, joined, declined, warning, neutral, accent, all | Every pill has an icon and text, plus an optional hidden prefix ("Invite status: Sent"). |
| Notice | info, success, warning, danger, static | Danger uses `role="alert"`. Others use `role="status"`. `live="off"` is for guidance that's already on screen at load. Each has a hidden tone label ("Warning:"). |
| SeatMap | empty, partly chosen, fully chosen, mostly taken | ARIA grid with row and column headers and a roving tabindex (one Tab stop). Arrows, Home/End and Ctrl+Home/End move focus. Space/Enter toggles `aria-pressed`. Taken or held seats stay focusable with `aria-disabled`. Labels read like "Seat 4C, aisle, chosen". Polite announcements. Legend uses shape, icon and text. |
| HoldTimer | running, paused, low time, nearly expired, expired | The visible `role="timer"` isn't live. A separate polite region speaks only at whole minutes ("2 minutes left on the hold.") and on expiry, never every second. The progress-bar transition is off under reduced motion. |
| AllowancePill | 0, 1 and 2 used | "Today: N of 2 bookings · max 4 seats each" (published terms). Pips are decorative. At the limit it adds a warning icon. |
| ScreenShell / DemoBanner | used by all screens | Skip link, `<header>` with the persistent concept-demo banner, `<main id="main">` with one `h1`, optional `<footer>` for actions. `h1` takes focus when the flow changes screen. |

### Language: English and Bangla (`src/i18n/lang.tsx`)

Every screen has an **EN / বাংলা** switch in the top bar: a labelled group of two toggle buttons (`aria-pressed`, 44px targets). The screen root gets `lang="bn"`, so screen readers switch to a Bangla voice, and the running app also sets `<html lang>`. In Storybook use the **Language** toolbar, or open the "বাংলা · …" story of any screen state.

Bangla mode follows the decisions in `docs/bangla-copy-review.md` and `docs/railway-decisions.md`:

- Bangla digits for every value (times, prices, counts, seat numbers): ৳১,১১০, ০৭:৩০, আসন ঘ ১–৭.
- Bangla station, train, class and coach names: ঢাকা → চট্টগ্রাম, ডেমো আন্তঃনগর ৭০১, এসি চেয়ার, বগি ঘ. Station codes are left out in Bangla until the railway's official abbreviations arrive (decision #32).
- People's names in Bangla on passenger screens (আব্দুল করিম). Staff checks keep the English name, as on the ticket (decision #31): S02 shows "Salma Karim" with `lang="en"`.
- Codes stay in Latin script: RF-7Q2K-48, K7Q-48.

Text is written inline as `t('English', 'বাংলা')`, with `num()`, `taka()`, `masked()` and `name()` helpers for values.

### Screens (`src/screens`, stories under "Screens/…")

Every screen state has an English story and a Bangla ("বাংলা · …") story.

1. **F03 Travellers & class**: adult/child steppers, class radio cards, "Max 4 seats per booking. Up to 2 bookings (8 seats) a day, the second for a different train or route (published terms · Eid rules can differ)". Pressing + past 4 seats shows inline guidance to a linked group booking (seats per booking, not per day). Shows "Traveller · যাত্রী" and "Class · শ্রেণি" (`lang="bn"`).
2. **F04a Add traveller · NID**: name and DOB as on NID, NID (10 or 17 digits) masked on blur, error summary plus inline errors, simulated record check → "NID record matched" (never "verified").
3. **G2a Invite Package B buyer**: group of 7 (A 4 + B 3). The lede explains why: a second booking on the same train isn't allowed, so an adult travelling in Package B buys it from their own account, or joins at any station counter with their NID and code K7Q-48. You can pick the buyer only from Package B's 3 travellers. The child is disabled with a reason. The invite is bound to that traveller's NID-linked account and has single-use code K7Q-48. It goes by in-app notification and SMS, and the SMS has no payment link. Statuses: Sent / Joined / Declined.
4. **G2b Join Package B**: "Abdul Karim invited you to buy Package B (3 seats)". Lists the package travellers with "(you)" and an accompanying adult. Shows the allowance check (plus a no-bookings-left state), OTP confirm and Join / Decline. No seats are held yet.
5. **G5 Pay for Package B**: HoldTimer and a ৳1,110 total (3 × ৳350 fare + 3 × ৳20 non-refundable service charge). Paid by Salma Karim. Declining asks for confirmation and releases Package B seats to the queue, not to the Package A buyer. A static note explains the hold ending unpaid: seats go back to the fair queue (never to another buyer), the Package A buyer chooses to keep or cancel Package A, and a late payment is refunded automatically. States: during hold, low time, confirm decline, paying, paid, declined, expired.
6. **L1 Daily limit reached**: 2 of 2 bookings used (8 seats). Options: ask another traveller to buy, book tomorrow, or use a counter. Cancelled bookings don't restore the allowance (proposed).
7. **S02 Staff check a ticket**: separate "Ticket status · System" and "Person check · Staff" panels. A QR isn't proof of identity. "Couldn't check" is recorded as not checked, never as invalid.
8. **F01b Station picker · to**: search in English or Bangla, results as a radio group, the number of matches announced politely ("3 stations match" / "৩টি স্টেশন মিলেছে"), and a "no match" state.
9. **G3a Choose a coach · 7 together**: coaches (bogi) in the group's one class (decision 7c), coaches with 7 seats side by side first, "7 together" or "Split needed" shown with icon and text, full coaches disabled with the reason, "Show all 6 coaches" toggle (`aria-expanded`). Runs inside the same seat hold, so the timer keeps going (decision 7d).
10. **G3b Where in the coach · 7 together**: with seats 1–9, 15–19, 48–54 and 92–100 free in coach GHA, it offers the front (1–7), middle (48–54) and back (94–100) blocks, or "Customise seats". It shows which seats Package A (4) and Package B (3) get and announces the change politely. A coach with no block of 7 offers only "Customise".
11. **G3 Customise seats · 7 together**: the coach GHA seat map with seats numbered 1–100 (SeatMap with `seatNumber`), only free seats choosable, "Choose N more" until 7 are chosen, Package A/B split and a warning when the group sits in more than one place. Reached from G3b "Customise seats".
12. **Flows / App flow**: G2a → G2b → G3a → G3b (→ G3) → G5 with buttons and a step nav (`aria-current="step"`). Focus moves to each new screen's `h1`.
13. **Home · journeys by role**: the first screen of the Vite app (`#/home`). One `h1`, an `h2` per role (Passenger, Staff, Operations, Public), and each journey as a link with a one-line description (the whole card is the link, so its name includes the description). v2 journeys carry a "(v2)" tag.

### Fair access v2 screens (`src/screens/*v2*`, stories under "Screens v2/…")

All rules are **proposed** (decisions #35–#44) and need railway approval. Every state has an English and a "বাংলা · …" story. The v1 screens above are unchanged.

14. **P21·v2 Apply for the draw** (→ P21b·v2 Application received): window 08:00–10:00, result 10:30, pay by 11:00. "Applying at 08:00 or at 09:59 gives exactly the same chance." One application per traveller across app, website, counter and agent; the group gets one draw place. Duplicate check: "Rahim Karim is already in application AP-0031 made at Kamalapur counter", with "Remove Rahim Karim from this application". Apply → receipt AP-0214-7K, party **Locked** (pill with icon and text), free. Focus moves to the warning or the receipt.
15. **P22·v2 Picked · pay by 11:00** (→ P22c·v2 Offer expired): draw place #0214, "Pay by 11:00 today. The time does not restart when you open this offer, change phone or retry a payment." HoldTimer counting down to that clock time. Official total ৳1,480 (4 × ৳350 + 4 × ৳20). Expired: seats passed to the next application in draw order, not charged.
16. **P10·v2 Official total**: fare ৳1,400, service charge ৳80, assistance fee ৳40 (registered agent RA-118; demo, rate to confirm), total ৳1,520. "Pay ৳1,520" plus "Report an extra charge". Paid state: receipt by SMS to each adult traveller.
17. **R3·v2 Report an extra charge** (→ R3b·v2): official total ৳1,520, amount paid (numeric, accepts Western or Bangla digits, shows how much more than the official total), paid to (optional), how (cash / mobile wallet radio). "Your ticket stays valid. Reporting never cancels it." "Who sees this: only the independent review team." Errors focus the first problem field. Send → reference OC-2207 and what happens next.
18. **A1·v2 Who can act on my booking** (→ A1b·v2): booking RF-7Q2K-48. Abdul Karim (traveller · Booked by, full access) and Karim Uddin (helper: view and pay). "Remove Karim Uddin" → confirmation (`role="alert"`, focus moves to it; "Keep helper" returns focus to the remove button) → success with record AC-5521. Notes that SMS goes to the traveller's own phone, never to the helper, and that recovery works at any counter with the traveller's own NID.
19. **Flows / v2 busy train**: P21·v2 → P22·v2 → P10·v2 (→ R3·v2), with a step nav and focus on each `h1`. Screen codes in the nav stay Latin (`lang="en"`).
20. **G2·v2 One group, one chance** (`#/g2v2`): group of 7, one application, "Party · locked at 10:00". Package A 4 travellers paid by Abdul Karim, Package B 3 paid by Salma Karim, one draw place for all 7. "If Package B isn't paid: All 7 travel, or none", chosen before the draw (pill). Static note on adding someone after the draw. "Confirm group" → success message (focus moves to it); "Change who travels (before 10:00)" links to F03.
21. **F05·v2 Who does what** (`#/f05v2`): roles for Ayesha Karim (child, 8): accompanying adult Abdul Karim, booked by (helper) Karim Uddin, paid by Karim Uddin · bKash ••9024 (বিকাশ ••৯০২৪). A table of what the helper can do: book and pay Yes, see the ticket Yes, cancel or change No — traveller or accompanying adult only; refund goes to the account that paid. Pills have icon, text and a hidden "Helper:" prefix.
22. **H1·v2 Hold paused** (`#/h1v2`): "Proposed rule" pill. 3 holds ended unpaid today, new holds pause for 30 minutes (rule to confirm), holds possible again at 10:40, the waiting list is not affected. Links to the waiting list (P24·v2) and the station picker.
23. **P24·v2 Waiting list · place kept** (`#/p24v2`): place #3, needs 4 seats. Releases as an ordered list: 09:40 2 seats → #1 fits; 10:05 1 seat → #2 fits; 10:20 3 seats → #4, you need 4, place kept. "Leave the waiting list" → confirmation (`role="alert"`, focus moves to it; "Keep place #3" returns focus to the button) → left.
24. **P14·v2 Your receipt** (`#/p14v2`): RF-7Q2K-48, fare 4 × ৳350 = ৳1,400, service charge ৳80, assistance fee RA-118 ৳40, official total ৳1,520, paid by Karim Uddin. The demo SMS that each adult traveller gets (a `figure` with a `blockquote`). Links to R3·v2.
25. **P25·v2 Recover a ticket** (`#/p25v2`): at any counter, no phone needed. The traveller (or the accompanying adult for a child) brings NID, passport or birth registration; the helper's phone is not needed. Or "Send code to my phone" → code sent to the traveller's own phone ••41 (focus moves to the message).
26. **CT04·v2 Agent receipt** (`#/ct04v2`): printed receipt from registered agent RA-118 · Mirpur. Application AP-0388-2C, 701 · Fri 17 Oct · S_CHAIR (Bangla: শোভন চেয়ার), 2 travellers with NID records matched, same draw as the app. Application free, assistance fee ৳20 (demo, rate to confirm), fare only if picked. "Print receipt" → demo message.
27. **PA1·v2 Draw audit (public)** (`#/pa1v2`): DRAW-17OCT-EVE. 1,862 applications frozen at 10:00, 212 S_CHAIR seats, snapshot fingerprint 9f3a…c71e, random number from the public beacon at 10:05; 53 applications picked for 212 seats, 1,809 in draw order; independent replay matches at 10:31. No names, NID or phone numbers. "Check my application number": empty → inline error with focus on the field; AP-0388-2C → picked, place #12; AP-1502-9D → waiting list; anything else → "isn't in this draw". Accepts lower case and Bangla digits.
28. **DK03·v2 Correction — same person only** (`#/dk03v2`, desk, desktop-first): case CV-206, date of birth on the ticket 05/07/1993 vs NID record 05/07/1992, same person (NID record matched, photo ID seen). Evidence, approval (prepared by desk officer 118, approver RV-07, self-approval **Blocked**), and the static warning "A different person can't take this seat". "Send for second approval" → message with focus; "This is a different person" → alert: cancel under the normal rules, the seat goes to the waiting list, a fine never creates a seat.
29. **OP08·v2 Draw run and replay** (`#/op08v2`, operations, desktop-first): inputs frozen at 10:00 (policy v4, 1,862 applications with 41 duplicates merged, 212-seat snapshot with fingerprint, committed to an independent log at 10:00:04), run (public beacon pulse 10:05, algorithm v1.2, 53 picked · 1,809 waiting, replay matches 10:31), "Reruns are not allowed", no changes after 10:00. "Publish audit page" (links to PA1·v2) and "Download replay pack". There is no rerun button.
30. **OP09·v2 Every seat accounted for** (`#/op09v2`): train 701 · Fri 17 Oct · S_CHAIR. Seats by state as a table that adds up to the coach plan (240 = 198 sold + 8 held + 6 waiting-list offers + 27 blocked (approved) + 1 unexplained). The unexplained seat GHA-31 (Bangla ঘ-৩১) was blocked at 09:58 with no approval record by account OPS-11. Checked by the integrity team, independent of station management. "Open case for GHA-31" and "Export reconciliation".
31. **OP10·v2 Agents and extra-charge reports** (`#/op10v2`): agents in the last 30 days as a table (RA-118 Mirpur 412 / 0 Normal, RA-204 Tejgaon 390 / 6 Under review, RA-311 Gazipur 88 / 1 Normal). Report OC-2207: official total ৳1,520, passenger paid ৳2,500, named RA-204, ticket stays valid. "No automatic penalty". "Open RA-204 review" and "Ask passenger for more detail" (one SMS, replying is optional).

The desk and operations screens (DK03, OP08–OP10) are desktop-first: at 1440 they use the two-column card layout; on a phone the cards stack and the tables are sized to fit 390px without scrolling. They keep the passenger `ScreenShell` (one `h1`, one `main`) with a staff context line (desk, case, signed-in account) instead of the Figma back-office sidebar. Staff screens show codes and English text for names (decision #31); passenger screens show Bangla names in Bangla.

### Home screen and routing (`src/App.tsx`)

The Vite app opens on **Home** (`#/home`). Hash routes (`#/<id>`) for every screen: `flow`, `apply-v2`, `p21v2`, `p22v2`, `p10v2`, `r3v2`, `a1v2`, `g2v2`, `f05v2`, `h1v2`, `p24v2`, `p14v2`, `p25v2`, `ct04v2`, `pa1v2`, `dk03v2`, `op08v2`, `op09v2`, `op10v2`, `f01b`, `f03`, `f04a`, `g2a`, `g2b`, `g3a`, `g3b`, `g3`, `g5`, `l1`, `s02`. The App-level nav (`.proto-index`, "Prototype screens") keeps the screen picker for direct access and shows a **Home** link on every other screen. It is outside the screens, so stories are unaffected. After a route change, focus moves to the new screen's `h1`.

### Responsive layout

Below 1024px nothing changes: mobile-first, max 430px, sticky footer bar. From **1024px** (`@media (min-width: 1024px)` in `screens.css`):

- The screen, top bar and nav are a centred column up to 960px.
- Cards sit in a two-column grid **in source order** (no `dense` packing, so reading and focus order match what you see). Headings, notices, the hold timer, forms, the seat map, Home's role groups and screens with a single card stay full width.
- Footer actions are no longer a full-width sticky bar: they follow the content and are aligned right, with buttons at their natural width (min 16rem).
- Touch targets stay at least 44px and the `scroll-padding` rule on `<html>` is unchanged.

Storybook has a `desktop1440` viewport (1440 × 900). Desktop stories (G3b, P21·v2, P10·v2, Home, G2·v2, F05·v2, P24·v2, P14·v2, PA1·v2, DK03·v2, OP08–OP10·v2, some in Bangla; 33 in all) set `parameters.viewport.defaultViewport = 'desktop1440'` and the tag `desktop`; `test:a11y-storybook` runs those at 1440 × 900.

### Content rules (enforced by `src/test/content.test.ts`)

These checks run over all source files:

- The word "verified" never appears.
- No family-relationship words are used.
- There's no national-railway branding.
- The concept banner text is present.
- The role wording "Booked by", "Paid by", "Traveller", "Accompanying adult" and "NID record matched" is used.
- Bangla text is checked on the rendered page instead (`stories.a11y.test.tsx`): every Bangla text node must sit inside an element with `lang="bn"`, and Bangla stories may not show Western digits except inside codes.

## Test and axe results

These are the results from the last run on this machine:

| Check | Result |
|---|---|
| `npm test` (Vitest) | **5 files, 315 tests passed** |
| ↳ axe-core on every story (236 stories: 42 component and 194 screen/flow states, English and Bangla, including 92 v2 screen states, Home, the v2 flow and 33 desktop stories) | **0 violations**. Rules: WCAG 2.0/2.1/2.2 A + AA + best practice, run on the whole document. Also asserts exactly one `h1` and one `main` per story, that all Bangla text is inside `lang="bn"`, and that Bangla stories use Bangla digits. |
| ↳ language (`language.test.tsx`, 16 tests) | Language switch (aria-pressed, `lang` on the screen, back to English). Staff check keeps the English name. G3a ordering, show-all and the disabled full coach. G3b front/middle/back blocks for the 1–9, 15–19, 48–54, 92–100 example, button and split update, Bangla coach letter and digits, no-block coach. F01b search in English and Bangla with the announced count. Flow G2b → G3a → G3b → G5 with focus on each h1. G3 numbered seats, taken seats, announcements in English and Bangla, run-based hold label, G3b → G3 link. |
| ↳ axe harness sanity check | A deliberately broken fragment does produce `image-alt`, `label` and `button-name` violations |
| ↳ keyboard and behaviour | SeatMap: single Tab stop, arrows, Home/End, Ctrl+End, edge clamping, Space/Enter, taken seats. Stepper: labels, bounds keep focus, live value, blocked increment. HoldTimer announces only at minute marks (fake timers). F03 limit guidance and allowance wording. G2a lede (4 + 3, counter option). L1 lede. G5 unpaid-hold note. G2a buyer list (only B travellers; child disabled with reason). F04a errors, masking and "NID record matched". |
| ↳ v2 behaviour (`v2.test.tsx`, 44 tests) | P21·v2 timing text, apply → receipt AP-0214-7K with party locked, duplicate warning (AP-0031, Kamalapur counter) with focus and remove. P22·v2 deadline text, ৳1,480 breakdown, expired state, Bangla digits (#০২১৪, ৳১,৪৮০, ১১:০০). P10·v2 ৳1,400 + ৳80 + ৳40 = ৳1,520 and the report link. R3·v2 errors and focus, extra-amount note, send → OC-2207, Bangla digit parsing. A1·v2 rights, confirm/keep/remove with focus, record AC-5521, Bangla name and digits. v2 flow P21 → P22 → P10 → R3 with focus on each h1. G2·v2 packages, all-or-none, confirm with focus, Bangla. F05·v2 roles and helper-rights table, Bangla name and বিকাশ ••৯০২৪. H1·v2 proposed rule, 10:40, waiting list unaffected. P24·v2 release list and fit rule, leave/keep/left with focus, Bangla digits. P14·v2 ৳1,400 + ৳80 + ৳40 = ৳1,520 and the SMS, Bangla. P25·v2 recovery facts, code to ••41 with focus. CT04·v2 free application, ৳20 fee, fare only if picked, print message, Bangla class name. PA1·v2 audit values, no personal data, number check (error and focus, found, not found), Bangla-digit input. DK03·v2 comparison row, self-approval blocked, send for second approval, different-person alert, Bangla dates. OP08·v2 frozen inputs, no rerun button, publish with link to PA1. OP09·v2 states add up to 240, GHA-31 / ঘ-৩১, open case. OP10·v2 agent rows, OC-2207 values, no automatic penalty, ask for detail. Routes: Operations links and desk route with focus on the h1. Home: one h1, h2 per role (Passenger, Staff, Operations, Public), 14 passenger links, links navigate by hash and back via the Home link, every link matches a route, Bangla switch. |
| ↳ content rules | 5 tests passed |
| `npm run test:a11y-storybook` (Chromium 390×844, desktop stories at 1440×900, reduced motion) | **236 stories (33 at 1440 × 900), 0 axe violations**, including `color-contrast` and `target-size`. Three Bangla items need review: on F03 · Over limit guidance, G5 · Low time and P21·v2 · Duplicate found, the longer Bangla text puts an element under the sticky footer in the full-page capture, so axe can't compute its background. All three are ink on solid fills. `scroll-padding` on `<html>` keeps focused items clear of the sticky bars (WCAG 2.2 · 2.4.11). On the Bangla G3 seat map axe marks `label-content-name-mismatch` as needs review: each seat's name ("আসন ১৭, …") does contain the visible number, but check it with a screen reader. |
| `npm run build` | passes (tsc + Vite) |
| `npm run build-storybook` | passes (warns about large chunks from Storybook's own docs and axe bundles, which is expected) |

jsdom can't compute colour contrast, so the Vitest run turns `color-contrast` off. The Chromium run covers it.

Automated checks find only part of the problems. The manual screen reader script below still needs to be run, and the Bangla copy still needs a review by a native Bangla writer (T11).

## Manual screen reader test script (NVDA + Firefox/Chrome, TalkBack + Chrome)

Setup:

- **NVDA:** Windows, NVDA 2024+, Firefox or Chrome. Open Storybook, open the story in a new tab ("Open canvas in new tab"), and set the browser zoom to 100%.
- **TalkBack:** Android 13+, Chrome, TalkBack on. Use the Vite app (`npm run dev -- --host`) or the static Storybook on the LAN.
- For each screen, record pass/fail and the exact words announced. NVDA: `Insert+F7` lists landmarks and headings, `D` jumps by landmark, `H` by heading, `F` by form field, `Tab` moves through controls. TalkBack: swipe right/left to move, use the reading controls (swipe up/down) set to Headings or Landmarks, double-tap to activate.

### All screens (check once per screen)

- [ ] The first Tab reaches "Skip to main content, link". Activating it moves to main.
- [ ] Landmarks: banner (header), main, and contentinfo where a footer has actions. In App flow, also a navigation landmark called "Prototype flow".
- [ ] "Concept demo — not a real booking service" is read near the start of the page.
- [ ] Exactly one heading level 1 is announced and it names the screen. Section headings are level 2.
- [ ] The Bangla words (যাত্রী, শ্রেণি, যাত্রী যোগ করুন) are read with a Bangla voice. NVDA needs automatic language switching on and a Bangla voice installed.
- [ ] The focus ring is visible on every control. No control is smaller than about one fingertip (44px).
- [ ] With "Remove animations" (Android) or "prefers reduced motion" on, spinners and the progress bar don't animate.

### F03 Travellers & class

- [ ] Tab to the adult stepper. You should hear "Adults, grouping, Age 12 and over (age band to confirm)", then "Remove one adult, button, unavailable" (NVDA) or "dimmed" (TalkBack).
- [ ] "Add one adult, button". Press it and hear "2 adults" politely.
- [ ] With 2 adults and 2 children, press "Add one adult". The value stays the same and you hear "Warning: One booking can have up to 4 seats…", followed by the button "Start a linked group booking".
- [ ] The class radios read as "Class · শ্রেণি, grouping, AC chair 42 seats left ৳350, radio button, checked, 1 of 3". Arrow keys change the selection.
- [ ] The footer button reads "Continue with 4 travellers", followed by the estimate description.

### F04a Add traveller · NID

- [ ] Fields are announced with their labels and hints, e.g. "NID number, edit, 10 or 17 digits. Hidden after you leave the field."
- [ ] Submit an empty form. Focus moves to the alert "Fix 3 problems" and the list of links is read. Each link moves focus to its field.
- [ ] On the NID field you hear "invalid entry" plus "Error: NID number must be 10 or 17 digits. You entered 5."
- [ ] Enter a valid 10-digit NID and Tab away. The field becomes "NID number" followed by "ending in 4821 (hidden)". The digits are not read out in full. The "Change NID" button returns focus to the input.
- [ ] After "Check NID record", the busy button reads "Checking NID record…". Then you hear "Done: NID record matched" politely. The word "verified" is never announced.

### G2a Invite Package B buyer

- [ ] The group "Who buys Package B?" is described by "Only a Package B traveller can buy Package B…".
- [ ] There are only 3 radios: Salma Karim, Rahim Karim and Ayesha Karim. Ayesha reads as "unavailable / dimmed" with the description "Child traveller · Birth registration ••0526 · can't buy: buyers must be adults". Abdul Karim is not offered.
- [ ] Choosing Salma reveals the Invite section. "Bound to … NID-linked account (NID ••1177)", "Single-use code K7Q-48" and the SMS note "no payment link" are read in order.
- [ ] After "Send invite", you hear "Information: Waiting for Salma Karim to join" and the pill reads "Invite status: Sent".
- [ ] Check the Joined and Declined stories. They read "Invite status: Joined" and "Invite status: Declined". Status is never conveyed by colour alone.

### G2b Join Package B

- [ ] The h1 "Join Package B" is followed by "Abdul Karim invited you to buy Package B (3 seats)."
- [ ] The traveller list is announced as a list of 3 and includes "Salma Karim (you)" and "Accompanying adult: Salma Karim".
- [ ] The allowance reads as "Today: 0 of 2 bookings · max 4 seats each".
- [ ] "One-time code, edit, Sent by SMS to your phone ending ••62…". If you press Join with an empty code, focus returns to the field with "invalid entry, Error: Enter the 6-digit code…".
- [ ] In the not-enough-allowance story (2 of 2 bookings used), "Join as buyer" is unavailable and the warning explains why.
- [ ] After Join, you hear "Done: You've joined as Package B buyer… No seats are held yet".

### G5 Pay for Package B

- [ ] The region "Seat hold" reads "Package B seats held for", then the timer ("09:11 left"). The timer is not read every second.
- [ ] Leave the page idle across a minute boundary. You hear "9 minutes left on the hold." exactly once per minute. In the Nearly expired component story you hear "Hold expired. Package B seats have been released."
- [ ] The cost table reads row headers with values: "Fare · 3 × ৳350, ৳1,050", "Service charge · 3 × ৳20 Non-refundable, ৳60", "Total, ৳1,110".
- [ ] "Paid by: Salma Karim" is read.
- [ ] Pressing "Decline Package B" announces the alert immediately: "Problem: Decline Package B? Package B's 3 seats go back to the queue … not passed to the Package A buyer."
- [ ] Pay: the button reads "Paying…, busy". Then you hear "Done: Paid ৳1,110 · Package B booked".

### L1 Daily limit reached

- [ ] The h1 "Daily limit reached" is followed by the lede "You've bought 4 of 4…".
- [ ] The options are announced as an ordered list of 3, each with a level 3 heading: Ask another traveller to buy, Book tomorrow, and Buy at a station counter.
- [ ] The static note "Cancelling doesn't give bookings back (proposed)" is read in reading order. It isn't announced as an interruption.

### S02 Staff check a ticket

- [ ] There are two level 2 headings: "Ticket status System" and "Person check Staff". Navigating by H makes it clear they are separate.
- [ ] The system panel reads "Ticket status: Active", the booking RF-7Q2K-48, "NID record matched at booking" and "A QR … does not prove who is holding it."
- [ ] The person check radios are in the group "Result of ID check by staff". If you record with nothing chosen, you hear "Error: Choose a result before recording."
- [ ] After recording, you hear "Done: Person check recorded… ticket status, which is unchanged" and the pill reads "Person check: Recorded".

### App flow

- [ ] The navigation "Prototype flow" lists 5 buttons. The current one is announced as "current step".
- [ ] G2a: choose Salma → Send invite → "Open on Salma Karim's phone (demo)". Focus lands on the h1 "Join Package B".
- [ ] G2b: enter 6 digits → Join → "Continue to choose seats". Focus lands on the h1 "Choose a coach".
- [ ] G3a: the coach radios read e.g. "Coach GHA · 30 free, Up to 9 seats side by side, Seating: 7 together". "Show all 6 coaches" is announced as collapsed/expanded. Continue → focus on "Where in the coach?".
- [ ] G3b: changing the block announces "Seats 48 to 54 selected." Hold → focus on "Pay for Package B".
- [ ] G3b → Customise seats → "Open the seat map". In the grid, a seat reads e.g. "Seat 9, middle, available, toggle button"; taken seats read "taken" and can't be chosen. In Bangla: "আসন ৯, মাঝখানে, খালি".

### Language switch (repeat the App flow in Bangla)

- [ ] The switch is read as "Language, grouping" with "EN, toggle button, pressed" and "বাংলা, toggle button, not pressed".
- [ ] After pressing বাংলা, NVDA (automatic language switching on, Bangla voice installed) and TalkBack read the screen in Bangla, including the digits (০৭:৩০ as Bangla numbers).
- [ ] On S02 in Bangla, the traveller's name "Salma Karim" is read with the English voice.

### SeatMap (component story)

- [ ] Tab into the grid. You hear "Coach C2 seats, 2 plus 3 layout. Use arrow keys…, grid", then e.g. "Row 1, A, Seat 1A, window, taken, unavailable" (wording varies by screen reader).
- [ ] Arrow keys move one seat at a time. Tab leaves the grid in one step.
- [ ] Space on an available seat announces "Seat 4E chosen. 3 of 3 chosen." and "pressed". Space on a taken seat announces "Seat 1A is not available."
- [ ] TalkBack: swiping moves through seats in reading order, and double-tap toggles. Check that the column and row headers are read.

## Files

```
prototype/
  .storybook/        main.ts, preview.tsx (global CSS, a11y config, component frame), preview-head.html
  scripts/a11y-storybook.mjs   Playwright + axe-core runner for storybook-static
  src/
    components/      Button, Field, Stepper, StatusPill (Badge), Notice, SeatMap, HoldTimer, AllowancePill, ScreenShell (+ LangSwitch), Route, Icon (+ *.stories.tsx),
                     Code (Latin code with lang="en"), OpsContext (operations context line), useActionFocus (focus the message after an action)
    i18n/lang.tsx    LangProvider, useT(): t(), num(), taka(), masked(), name()
    screens/         Home, F01b, F03, F04a, G2a, G2b, G3a, G3b, G3, G5, L1, S02, AppFlow,
                     v2: P21v2ApplyDraw, P22v2Offer, P10v2OfficialTotal, R3v2ReportCharge, A1v2BookingAccess, ApplyFlowV2,
                         G2v2Group, F05v2Roles, H1v2HoldPaused, P24v2Waitlist, P14v2Receipt, P25v2Recover, CT04v2AgentReceipt,
                         PA1v2DrawAudit, DK03v2Correction, OP08v2DrawRun, OP09v2SeatReconciliation, OP10v2AgentReports (+ *.stories.tsx)
    data/demo.ts     fictional data only
    styles/          tokens.css, base.css, components.css, screens.css, fonts.ts
    test/            setup.ts, axe.ts, stories.a11y.test.tsx, keyboard.test.tsx, language.test.tsx, v2.test.tsx, content.test.ts
    App.tsx, main.tsx   Vite app (Home, hash routes, screen picker)
```

## Known limits

- Routing is hash-only and there is no backend or persistence. State is per screen, and the flows pass no data between screens except through fixed demo data.
- All 21 v2 screens from `docs/fair-access-v2.md` are coded. The English copy follows Figma page 02c and the Bangla copy follows the drafts on page 02d (needs native review). States that Figma doesn't draw (confirmations, sent/printed/published messages, the application-number result) use new copy written for the prototype.
- Out-of-scope actions show a short "(demo)" message instead of a screen: P14·v2 "Show my tickets", P25·v2 "Find a counter", CT04·v2 "Print receipt", OP08·v2 "Download replay pack", OP09·v2 "Export reconciliation".
- All coded v2 screens use the 02d Bangla wording "অফিসিয়াল মোট" and "বাড়তি টাকার অভিযোগ করুন" (aligned 15 Oct).
- The second-pass v2 screens are standalone (reached from Home and the screen picker); only P21 → P22 → P10 → R3 is a connected flow.
- The P22·v2 offer total (৳1,480) has no assistance fee; P10·v2 (৳1,520) shows a booking helped by registered agent RA-118, so it adds the ৳40 fee. These are the two example totals from the brief.
- All Bangla copy is a draft and needs review by a native writer (T11).
- The other back-office screens (OP01–OP07, CT03, RV05) are in the Figma prototype only.
- Automated axe checks and jsdom keyboard tests don't replace manual testing with NVDA, TalkBack and VoiceOver.
