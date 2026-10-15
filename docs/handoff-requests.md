# Handoff requests (15 Oct)

Three things that need people. Each has a short message you can forward as it is, and a checklist for the person doing it.

---

## 1. Screen reader test (NVDA + TalkBack)

**Who:** an accessibility tester, ideally someone who uses a screen reader every day. Two sessions of about 45 minutes: one with NVDA on Windows, one with TalkBack on Android.

**Message to send:**

> Hi, could you test our railway booking prototype with NVDA (Windows, Firefox or Chrome) and TalkBack (Android, Chrome)? It's a concept demo with fictional data. We need to know where it is confusing or broken with a screen reader, in English and in Bangla. The step-by-step script is in `prototype/README.md` ("Manual screen reader test script"). Run it with `npm run dev` or `npm run storybook` in `prototype/`. Please note what you heard, what you expected and how serious it is (blocker / major / minor). About 45 minutes per screen reader.

**Checklist:**

- [ ] NVDA: automatic language switching on, Bangla voice installed (e.g. eSpeak Bangla or a Bangla SAPI voice)
- [ ] TalkBack: Bangla text-to-speech installed
- [ ] Run the whole script in English, then switch to বাংলা and repeat the App flow
- [ ] Bangla: names, digits (০৭:৩০) and coach letters (ঘ) are read clearly; the staff check reads "Salma Karim" with the English voice
- [ ] Seat map (G3): each seat's spoken name includes the number you see (axe flagged this "needs review" in Bangla)
- [ ] Timers: the hold timer speaks only at whole minutes, never every second
- [ ] Record each finding with screen, step, what was heard, what was expected, severity

---

## 2. Official station abbreviations (railway)

**Who:** the railway contact for the T08 review.

**Message to send:**

> Hello, for the fair-booking concept we would like to use your official station abbreviations on the station picker, in Bangla and English. Could you share the current list (station name in Bangla and English, and the abbreviation(s) you use on tickets and screens)? A spreadsheet is fine. Until we have it, the designs show placeholders that are clearly marked. This is decision #32 in our decisions brief.

**Checklist when the list arrives:**

- [ ] Add it to `prototype/src/data/demo.ts` (`destinations`, `trip.from` / `trip.to`) and remove "demo codes" notes
- [ ] Replace the placeholder badges on F01 and F01b (English and Bangla pages in Figma)
- [ ] Bangla mode: decide whether to show the abbreviation next to the station name
- [ ] Mark decision #32 as confirmed in `docs/railway-decisions.md`, with date and who confirmed

---

## 3. Native Bangla review (T11)

**Who:** a native Bangla writer, ideally with UX-writing or public-service content experience. About half a day.

**Message to send:**

> Hi, could you review the Bangla text of our railway booking concept? It covers passenger, staff and back-office screens. We want it clear, natural and consistent, at an everyday reading level. The rules we already follow are in `docs/bangla-copy-review.md` (for example Bangla digits, Bangla train and station names, English names on tickets). The screens are on page "02b • UI — বাংলা screens by journey (draft)" in Figma, and the coded prototype has a বাংলা switch. Please suggest changes as comments in Figma or in a list with the screen ID (e.g. G3b).

**Checklist:**

- [ ] Read every screen on Figma page 02b, in journey order (sections 01–13)
- [ ] Check terms are consistent: বগি, আসন, হোল্ড, প্যাকেজ, এনআইডি, নগদ টাকা
- [ ] Decide on the open wording points in `docs/bangla-copy-review.md` (for example নন-এসি, short station forms, ট্রায়াল vs পরীক্ষামূলক)
- [ ] Check the coded prototype in বাংলা mode (F01b, F03, F04a, G2a, G2b, G3a, G3b, G3, G5, L1, S02)
- [ ] Return comments; we update Figma and the prototype together
