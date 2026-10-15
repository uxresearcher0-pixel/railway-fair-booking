import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { GroupSteps } from '../components/GroupSteps';
import { DRAW, DRAW_AUDIT, GROUP_SIZE, PACKAGE_A_SIZE, abdul, ayesha, coaches, longestRun, type Coach } from '../data/demo';
import { blocksFor } from './G3bWhereInCoach';
import { runs } from './G3CustomiseSeats';
import { useT } from '../i18n/lang';

type Place = 'front' | 'middle' | 'back';

export interface G3v2Props {
  initialCoach?: string;
  initialPlace?: Place;
  focusHeading?: boolean;
  /** "Hold seats" → each package pays (G5·v2). Without it, a link to #/g5v2. */
  onNext?: (seats: number[]) => void;
}

const COACH_SEATS = 100;
/** The three coaches offered first: the two with 7 together, then the best split (as in DW10). */
const offered = [...coaches]
  .filter((c) => c.free.length >= GROUP_SIZE)
  .sort((a, b) => (longestRun(b.free) >= GROUP_SIZE ? 1 : 0) - (longestRun(a.free) >= GROUP_SIZE ? 1 : 0) || b.free.length - a.free.length)
  .slice(0, 3);

/**
 * G3·v2 Choose where the group sits (DW10). After the group is picked: choose a coach in the group's one
 * class, then a block of 7 seats side by side. The coach plan is a picture with a text equivalent; seats are
 * held inside the same fixed pay-by time (11:00). "Customise seats" opens the seat map (G3).
 */
export function G3v2GroupSeats({ initialCoach = 'GHA', initialPlace = 'front', focusHeading, onNext }: G3v2Props) {
  const { bn, t, num, name } = useT();
  const [code, setCode] = useState(initialCoach);
  const [place, setPlace] = useState<Place>(initialPlace);
  const coach = coaches.find((c) => c.code === code) ?? coaches[0];
  const cName = (c: Coach) => (bn ? c.codeBn : c.code);
  const blocks = blocksFor(coach, COACH_SEATS);
  const start = blocks ? blocks[place] : undefined;
  const seats = start !== undefined ? Array.from({ length: GROUP_SIZE }, (_, i) => start + i) : [];
  const span = (a: number, b: number) => `${cName(coach)} ${num(a)}–${num(b)}`;
  const free = new Set(coach.free);
  const chosen = new Set(seats);
  const freeText = runs(coach.free.filter((n) => !chosen.has(n)))
    .map(([a, b]) => (a === b ? num(a) : `${num(a)}–${num(b)}`))
    .join(', ');

  const planLabel =
    start !== undefined
      ? t(
          `Coach ${coach.code} plan, seat 1 at the front. Chosen for the group: ${start}–${start + 6}. Other free seats: ${freeText}. All other seats are taken.`,
          `বগি ${cName(coach)}-এর নকশা, আসন ১ সামনের দিকে। দলের জন্য বেছে নেওয়া: ${num(start)}–${num(start + 6)}। অন্য খালি আসন: ${freeText}। বাকি সব আসন বুক করা।`,
        )
      : t(`Coach ${coach.code} plan. Free seats: ${freeText}. No 7 free side by side.`, `বগি ${cName(coach)}-এর নকশা। খালি আসন: ${freeText}। পাশাপাশি ৭টি খালি নেই।`);

  return (
    <ScreenShell
      screenId="G3·v2"
      wide
      eyebrow={
        <>
          {t('Picked', 'নির্বাচিত')} · <span lang="en">{DRAW_AUDIT.id}</span> · {t(`pay by ${DRAW.payBy}`, `${num(DRAW.payBy)}-এর মধ্যে পরিশোধ`)}
        </>
      }
      title={t('Choose where the group sits', 'দল কোথায় বসবে বেছে নিন')}
      lede={t(
        `Coaches with ${GROUP_SIZE} free seats side by side are listed first. Choosing seats happens inside the same fixed hold.`,
        `যেসব বগিতে পাশাপাশি ${num(GROUP_SIZE)}টি খালি আসন আছে সেগুলো আগে দেখানো হয়েছে। আসন বাছাই একই নির্দিষ্ট হোল্ডের মধ্যে হয়।`,
      )}
      focusHeading={focusHeading}
    >
      <GroupSteps current="seats" />
      <div className="split">
        <div className="split__main">
          <fieldset className="chip-radios">
            <legend className="field__label">{t('Coach', 'বগি')}</legend>
            {offered.map((c) => {
              const together = longestRun(c.free) >= GROUP_SIZE;
              return (
                <label key={c.code} className={`chip-radio ${code === c.code ? 'is-checked' : ''}`}>
                  <input type="radio" name="g3v2-coach" value={c.code} checked={code === c.code} onChange={() => {
                      setCode(c.code);
                      setPlace('front');
                    }}
                  />
                  <span>
                    {t('Coach', 'বগি')} {cName(c)} · {together ? t(`${GROUP_SIZE} together`, `${num(GROUP_SIZE)} জন একসাথে`) : t('split needed', 'আলাদা বসতে হবে')}
                  </span>
                </label>
              );
            })}
          </fieldset>

          <section className="card" aria-labelledby="g3v2-plan">
            <h2 id="g3v2-plan" className="card__eyebrow">
              {t(`Coach ${coach.code} · front →`, `বগি ${cName(coach)} · সামনে →`)}
            </h2>
            {blocks ? (
              <fieldset className="chip-radios">
                <legend className="field__label">{t(`Block of ${GROUP_SIZE} seats together`, `একসাথে ${num(GROUP_SIZE)}টি আসনের ব্লক`)}</legend>
                {(
                  [
                    { id: 'front', en: 'Front', bn: 'সামনে' },
                    { id: 'middle', en: 'Middle', bn: 'মাঝখানে' },
                    { id: 'back', en: 'Back', bn: 'পেছনে' },
                  ] as const
                )
                  // A coach with one block of 7 shows it once (front, middle and back are the same seats).
                  .filter((p, i, all) => all.findIndex((q) => blocks[q.id] === blocks[p.id]) === i)
                  .map((p) => (
                  <label key={p.id} className={`chip-radio ${place === p.id ? 'is-checked' : ''}`}>
                    <input type="radio" name="g3v2-place" value={p.id} checked={place === p.id} onChange={() => setPlace(p.id)} />
                    <span>
                      {t(p.en, p.bn)} · {span(blocks[p.id], blocks[p.id] + 6)}
                    </span>
                  </label>
                ))}
              </fieldset>
            ) : null}
            <div className="coach-plan" role="img" aria-label={planLabel}>
              {Array.from({ length: COACH_SEATS }, (_, i) => {
                const n = i + 1;
                const c = i % 5;
                const state = chosen.has(n) ? 'is-chosen' : free.has(n) ? 'is-free' : '';
                return (
                  <span key={n} className={`coach-plan__seat ${state}`} style={{ ['--line' as string]: Math.floor(i / 5), ['--pos' as string]: c < 2 ? c + 1 : c + 2 }}>
                    {num(n)}
                  </span>
                );
              })}
            </div>
            {start !== undefined ? (
              <p className="small-note">
                {t(
                  `Package A: ${coach.code} ${start}–${start + PACKAGE_A_SIZE - 1} · Package B: ${coach.code} ${start + PACKAGE_A_SIZE}–${start + 6}, next to Package A. ${ayesha.name.split(' ')[0]} sits next to ${abdul.name.split(' ')[0]}.`,
                  `প্যাকেজ A: ${span(start, start + PACKAGE_A_SIZE - 1)} · প্যাকেজ B: ${span(start + PACKAGE_A_SIZE, start + 6)}, প্যাকেজ A-এর পাশে। ${name(ayesha)} বসবে ${name(abdul)}-এর পাশে।`,
                )}
              </p>
            ) : (
              <Notice tone="warning" live="off" title={t(`No ${GROUP_SIZE} seats side by side in coach ${coach.code}`, `বগি ${cName(coach)}-এ পাশাপাশি ${num(GROUP_SIZE)}টি আসন নেই`)}>
                {t('Customise seats to choose where each person sits. A child always sits next to an accompanying adult.', 'কে কোথায় বসবেন তা বেছে নিতে নিজে আসন সাজান। শিশু সবসময় সঙ্গী প্রাপ্তবয়স্কের পাশে বসে।')}
              </Notice>
            )}
          </section>
        </div>

        <div className="split__side">
          <Notice tone="warning" live="off" title={t(`Pay by ${DRAW.payBy} today`, `আজ ${num(DRAW.payBy)}-এর মধ্যে পরিশোধ করুন`)}>
            {t(`Both packages must be paid by ${DRAW.payBy}. The time does not restart.`, `দুই প্যাকেজই ${num(DRAW.payBy)}-এর মধ্যে পরিশোধ করতে হবে। সময় নতুন করে শুরু হয় না।`)}
          </Notice>
          {start !== undefined ? (
            <section className="card" aria-labelledby="g3v2-seats">
              <h2 id="g3v2-seats" className="card__eyebrow">
                {t('Seats', 'আসন')}
              </h2>
              <dl className="rows">
                <div>
                  <dt>{t('Package A', 'প্যাকেজ A')}</dt>
                  <dd>{span(start, start + PACKAGE_A_SIZE - 1)}</dd>
                </div>
                <div>
                  <dt>{t('Package B', 'প্যাকেজ B')}</dt>
                  <dd>{span(start + PACKAGE_A_SIZE, start + 6)}</dd>
                </div>
              </dl>
              <p className="visually-hidden" aria-live="polite">
                {t(`Seats ${coach.code} ${start} to ${start + 6} selected.`, `আসন ${cName(coach)} ${num(start)} থেকে ${num(start + 6)} বেছে নেওয়া হয়েছে।`)}
              </p>
            </section>
          ) : null}
          <div className="side-actions">
            {start !== undefined ? (
              onNext ? (
                <Button block iconAfter="arrow-right" onClick={() => onNext(seats)}>
                  {t(`Hold seats ${coach.code} ${start}–${start + 6}`, `আসন ${span(start, start + 6)} হোল্ড করুন`)}
                </Button>
              ) : (
                <a className="btn btn--primary btn--block" href="#/g5v2">
                  {t(`Hold seats ${coach.code} ${start}–${start + 6}`, `আসন ${span(start, start + 6)} হোল্ড করুন`)}
                </a>
              )
            ) : null}
            <a className={`btn btn--block ${start !== undefined ? 'btn--ghost' : 'btn--primary'}`} href="#/g3">
              {t('Customise seats', 'নিজে আসন সাজান')}
            </a>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
