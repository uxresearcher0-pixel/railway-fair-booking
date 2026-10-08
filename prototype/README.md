# railfair prototype

Accessible React + TypeScript + Storybook prototype of the railfair booking concept: linked group booking, the daily buyer allowance, NID record checks and the staff ticket check.

> **Concept demo — not a real booking service.** Everything here is simulated. There is no backend. It is not affiliated with or branded as any railway operator. All people, ID numbers, phone numbers, codes and payments are fictional. Rules marked **(proposed)** or **(rule to confirm)** still need railway approval. See `../docs/ui-screen-map.md`.

## Run it

Requires Node 20+ (tested with Node 22).

```bash
cd prototype
npm install
npm run dev               # Vite app with a screen picker → http://localhost:5173
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

Radii are 12–16px, the layout is mobile-first at a 390px width (max 430px), and touch targets are at least 44×44px.

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
| AllowancePill | 0, 3 and 4 used | "Today: N of 4 tickets used (rule to confirm)". Pips are decorative. At the limit it adds a warning icon. |
| ScreenShell / DemoBanner | used by all screens | Skip link, `<header>` with the persistent concept-demo banner, `<main id="main">` with one `h1`, optional `<footer>` for actions. `h1` takes focus when the flow changes screen. |

### Screens (`src/screens`, stories under "Screens/…")

1. **F03 Travellers & class**: adult/child steppers, class radio cards, "Max 4 tickets per buyer per day (rule to confirm) · you've used 0 today". Pressing + at the limit shows inline guidance to a linked group booking. Shows "Traveller · যাত্রী" and "Class · শ্রেণি" (`lang="bn"`).
2. **F04a Add traveller · NID**: name and DOB as on NID, NID (10 or 17 digits) masked on blur, error summary plus inline errors, simulated record check → "NID record matched" (never "verified").
3. **G2a Invite Package B buyer**: group of 7 (A 4 + B 3). You can pick the buyer only from Package B's 3 travellers. The child is disabled with a reason. The invite is bound to that traveller's NID-linked account and has single-use code K7Q-48. It goes by in-app notification and SMS, and the SMS has no payment link. Statuses: Sent / Joined / Declined.
4. **G2b Join Package B**: "Abdul Karim invited you to buy Package B (3 tickets)". Lists the package travellers with "(you)" and an accompanying adult. Shows the allowance check (plus a not-enough-allowance state), OTP confirm and Join / Decline. No seats are held yet.
5. **G5 Pay for Package B**: HoldTimer and a ৳1,110 total (3 × ৳350 fare + 3 × ৳20 non-refundable service charge). Paid by Salma Karim. Declining asks for confirmation and releases Package B seats to the queue, not to the Package A buyer. States: during hold, low time, confirm decline, paying, paid, declined, expired.
6. **L1 Daily limit reached**: 4 of 4 used. Options: ask another traveller to buy, book tomorrow, or use a counter. Cancelled tickets don't restore the allowance (proposed).
7. **S02 Staff check a ticket**: separate "Ticket status · System" and "Person check · Staff" panels. A QR isn't proof of identity. "Couldn't check" is recorded as not checked, never as invalid.
8. **Flows / App flow**: G2a → G2b → G5 with buttons and a step nav (`aria-current="step"`). Focus moves to each new screen's `h1`.

### Content rules (enforced by `src/test/content.test.ts`)

These checks run over all source files:

- The word "verified" never appears.
- No family-relationship words are used.
- There's no national-railway branding.
- The concept banner text is present.
- The role wording "Booked by", "Paid by", "Traveller", "Accompanying adult" and "NID record matched" is used.
- Every line with Bangla script also has `lang="bn"`.

## Test and axe results

These are the results from the last run on this machine:

| Check | Result |
|---|---|
| `npm test` (Vitest) | **3 files, 93 tests passed** |
| ↳ axe-core on every story (76 stories: 42 component and 34 screen/flow states) | **0 violations**. Rules: WCAG 2.0/2.1/2.2 A + AA + best practice, run on the whole document. Also asserts exactly one `h1` and one `main` per story. |
| ↳ axe harness sanity check | A deliberately broken fragment does produce `image-alt`, `label` and `button-name` violations |
| ↳ keyboard and behaviour | SeatMap: single Tab stop, arrows, Home/End, Ctrl+End, edge clamping, Space/Enter, taken seats. Stepper: labels, bounds keep focus, live value, blocked increment. HoldTimer announces only at minute marks (fake timers). F03 limit guidance. G2a buyer list (only B travellers; child disabled with reason). F04a errors, masking and "NID record matched". |
| ↳ content rules | 6 tests passed |
| `npm run test:a11y-storybook` (Chromium 390×844, reduced motion) | **76 stories, 0 axe violations**, including `color-contrast` and `target-size`. One item needs review: on G5 · Confirm decline, the sticky footer button overlaps scrolled content, so axe can't compute its background. That's ink on a solid paper footer, 16.7:1. |
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
- [ ] With 2 adults and 2 children, press "Add one adult". The value stays the same and you hear "Warning: You can buy up to 4 tickets today…", followed by the button "Start a linked group booking".
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

- [ ] The h1 "Join Package B" is followed by "Abdul Karim invited you to buy Package B (3 tickets)."
- [ ] The traveller list is announced as a list of 3 and includes "Salma Karim (you)" and "Accompanying adult: Salma Karim".
- [ ] The allowance reads as "Today: 0 of 4 tickets used (rule to confirm)".
- [ ] "One-time code, edit, Sent by SMS to your phone ending ••62…". If you press Join with an empty code, focus returns to the field with "invalid entry, Error: Enter the 6-digit code…".
- [ ] In the not-enough-allowance story, "Join as buyer" is unavailable and the warning explains why.
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
- [ ] The static note "Cancelling doesn't give tickets back (proposed)" is read in reading order. It isn't announced as an interruption.

### S02 Staff check a ticket

- [ ] There are two level 2 headings: "Ticket status System" and "Person check Staff". Navigating by H makes it clear they are separate.
- [ ] The system panel reads "Ticket status: Active", the booking RF-7Q2K-48, "NID record matched at booking" and "A QR … does not prove who is holding it."
- [ ] The person check radios are in the group "Result of ID check by staff". If you record with nothing chosen, you hear "Error: Choose a result before recording."
- [ ] After recording, you hear "Done: Person check recorded… ticket status, which is unchanged" and the pill reads "Person check: Recorded".

### App flow

- [ ] The navigation "Prototype flow" lists 3 buttons. The current one is announced as "current step".
- [ ] G2a: choose Salma → Send invite → "Open on Salma Karim's phone (demo)". Focus lands on the h1 "Join Package B".
- [ ] G2b: enter 6 digits → Join → "Continue to payment". Focus lands on the h1 "Pay for Package B".

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
    components/      Button, Field, Stepper, StatusPill (Badge), Notice, SeatMap, HoldTimer, AllowancePill, ScreenShell, Icon (+ *.stories.tsx)
    screens/         F03, F04a, G2a, G2b, G5, L1, S02, AppFlow (+ *.stories.tsx)
    data/demo.ts     fictional data only
    styles/          tokens.css, base.css, components.css, screens.css, fonts.ts
    test/            setup.ts, axe.ts, stories.a11y.test.tsx, keyboard.test.tsx, content.test.ts
    App.tsx, main.tsx   Vite app (screen picker)
```

## Known limits

- There is no routing, backend or persistence. State is per screen, and the flow passes no data between screens except through fixed demo data.
- The Bangla strings are short labels only. They need review by a native writer.
- Automated axe checks and jsdom keyboard tests don't replace manual testing with NVDA, TalkBack and VoiceOver.
