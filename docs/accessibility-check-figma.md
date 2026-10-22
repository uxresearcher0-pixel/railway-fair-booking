# Accessibility check of the Figma screens (14 Oct)

Automated check of every screen on page 02 (English, 104 screens, 3,885 text layers) and page 02b (Bangla, 104 screens, 3,831 text layers) in the [Figma file](https://www.figma.com/design/3Jb4jMo27Pi6N4gncIPPJK). It is a design-file check: it reads fill colours, font sizes and the size of every element with a prototype link. It does not replace testing the coded prototype with NVDA, TalkBack and VoiceOver (see `prototype/README.md`).

## What was checked

| Check | Rule |
|---|---|
| Text contrast | WCAG 2.2 · 1.4.3: 4.5:1, or 3:1 for text 24px+ (18.66px+ bold) |
| Tap targets | WCAG 2.2 · 2.5.8: at least 24 × 24px; project target 44 × 44px |
| Text size | Project rule: at least 12px on screens (Bangla script is hard to read below that) |

## Found and fixed

| Issue | Where | Fix | Result |
|---|---|---|---|
| Secondary text on dark panels at 4.47:1 (105 layers) | Staff screens: sidebars ("Status feed", "Device"), TV tables, EG03 monitor, DK01 queue, OP/RV sidebars | Token `text/inverse-secondary` changed from #8a8e89 to #9a9e99 (fixes both pages) | 5.47:1 on #24282a |
| "PROTOTYPE:" label at 1.11:1 | P10 demo strip (both pages) | Bound to `text/secondary` | Passes |
| "Recover ticket" link 18px tall (fails 2.5.8) | P14 (both pages) | Padded to 44px | Passes |
| "Show all coaches" 29–36px | P08 and P08 all coaches (both pages) | 44px | Passes |
| Result arrow buttons 40 × 40px | P04 (both pages) | 44 × 44px | Passes |
| 247 Bangla labels at 11px or less | Bangla page, mostly section labels on staff and ops screens | Raised to 12px; layouts checked (no clipped or truncated text) | Passes |

After the fixes: **0 contrast failures and 0 tap targets under 24px on either page.**

## Done on 15 Oct

| Item | Change | Result |
|---|---|---|
| English labels at 11px | 247 labels raised to 12px on page 02 (all screens except the A4 ticket) | No truncated text; OP01 and G3b checked by screenshot |
| A4 paper ticket (P15) text at 6.8–7.8pt | 72 text layers per language raised to 8pt (both pages, all three P15 pages) | Everything still inside the A4 page |
| Bangla gloss on the English ticket | "আবদুল" corrected to "আব্দুল" | Matches the Bangla page |

## Still open

- **Demo chips at 28–40px.** The prototype-state chips on P10 and some filter chips (RV02, RV03, EX01) are under 44px but over 24px, so they pass WCAG 2.2.
- **Print test.** Print P15 on a real A4 printer and check the 8pt text, the QR code scan and the fold line.
- **Screen reader testing.** Needs a person with NVDA and TalkBack on the coded prototype; see [handoff-requests.md](handoff-requests.md).
