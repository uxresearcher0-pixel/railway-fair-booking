import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { HoldTimer } from '../components/HoldTimer';
import { Notice } from '../components/Notice';
import { useTrip } from '../components/Route';
import { GROUP_SIZE, PACKAGE_A_SIZE, coaches, type Coach } from '../data/demo';
import { useT } from '../i18n/lang';

type Place = 'front' | 'middle' | 'back' | 'custom';

/** Every run of GROUP_SIZE consecutive free seats, as start numbers. */
export function blockStarts(free: number[], size = GROUP_SIZE) {
  const set = new Set(free);
  return free.filter((n) => Array.from({ length: size }, (_, i) => n + i).every((s) => set.has(s)));
}

/** Front, middle and back blocks of 7 seats together (decision 7d). */
export function blocksFor(coach: Coach, coachSize = 100) {
  const starts = blockStarts(coach.free);
  if (!starts.length) return undefined;
  const mid = coachSize / 2;
  const middle = [...starts].sort((a, b) => Math.abs(a + 3 - mid) - Math.abs(b + 3 - mid))[0];
  return { front: starts[0], middle, back: starts[starts.length - 1] };
}

export interface G3bProps {
  coachCode?: string;
  initialPlace?: Place;
  holdSeconds?: number;
  timerPaused?: boolean;
  focusHeading?: boolean;
  onBack?: () => void;
  onNext?: (seats: number[]) => void;
  /** "Customise seats" → the seat map (G3). */
  onCustomise?: () => void;
}

/**
 * G3b · Where in the coach. With seats 1–9, 15–19, 48–54 and 92–100 free in coach GHA,
 * the front block is 1–7, the middle 48–54 and the back 94–100. "Customise" opens the seat map.
 */
export function G3bWhereInCoach({ coachCode = 'GHA', initialPlace = 'front', holdSeconds = 8 * 60 + 40, timerPaused = false, focusHeading, onBack, onNext, onCustomise }: G3bProps) {
  const { bn, t, num } = useT();
  const tr = useTrip();
  const coach = coaches.find((c) => c.code === coachCode) ?? coaches[0];
  const blocks = blocksFor(coach);
  const [place, setPlace] = useState<Place>(blocks ? initialPlace : 'custom');
  const coachName = bn ? coach.codeBn : coach.code;
  const range = (a: number, b: number) => `${num(a)}–${num(b)}`;
  const start = place !== 'custom' && blocks ? blocks[place] : undefined;
  const seats = start !== undefined ? Array.from({ length: GROUP_SIZE }, (_, i) => start + i) : [];

  const options: { id: Place; label: string; meta: string }[] = blocks
    ? [
        { id: 'front', label: t('Front of the coach', 'বগির সামনের দিকে'), meta: t(`Seats ${blocks.front}–${blocks.front + 6}`, `আসন ${range(blocks.front, blocks.front + 6)}`) },
        { id: 'middle', label: t('Middle of the coach', 'বগির মাঝখানে'), meta: t(`Seats ${blocks.middle}–${blocks.middle + 6}`, `আসন ${range(blocks.middle, blocks.middle + 6)}`) },
        { id: 'back', label: t('Back of the coach', 'বগির পেছনের দিকে'), meta: t(`Seats ${blocks.back}–${blocks.back + 6}`, `আসন ${range(blocks.back, blocks.back + 6)}`) },
      ]
    : [];
  options.push({ id: 'custom', label: t('Customise seats', 'নিজে আসন সাজান'), meta: t('Pick each seat on the seat map', 'আসন ম্যাপে প্রতিটি আসন বেছে নিন') });

  return (
    <ScreenShell
      screenId="G3b"
      title={t('Where in the coach?', 'বগির কোথায় বসবেন?')}
      lede={t(`Coach ${coach.code} · ${tr.className} · ${GROUP_SIZE} seats together`, `বগি ${coachName} · ${tr.className} · ${num(GROUP_SIZE)}টি আসন একসাথে`)}
      backLabel={t('Back to coaches', 'বগির তালিকায় ফিরে যান')}
      onBack={onBack}
      focusHeading={focusHeading}
      footer={
        <Button block iconAfter="arrow-right" onClick={() => (start !== undefined ? onNext?.(seats) : onCustomise?.())}>
          {start !== undefined
            ? t(`Hold seats ${coach.code} ${start}–${start + 6}`, `আসন ${coachName} ${range(start, start + 6)} হোল্ড করুন`)
            : t('Open the seat map', 'আসন ম্যাপ খুলুন')}
        </Button>
      }
    >
      <HoldTimer initialSeconds={holdSeconds} paused={timerPaused} subject={t(`${GROUP_SIZE} seats`, `${num(GROUP_SIZE)}টি আসন`)} />

      <fieldset className="card radio-list">
        <legend className="section-title">{t('Choose a block of 7 seats together', 'একসাথে ৭টি আসনের একটি ব্লক বেছে নিন')}</legend>
        {options.map((o) => (
          <label key={o.id} className={`radio-card ${place === o.id ? 'is-checked' : ''}`}>
            <input type="radio" name="place" value={o.id} checked={place === o.id} onChange={() => setPlace(o.id)} />
            <span className="radio-card__main">
              <span className="radio-card__title">{o.label}</span>
              <span className="radio-card__meta">{o.meta}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {start !== undefined ? (
        <section className="card" aria-labelledby="g3b-split">
          <h2 id="g3b-split" className="section-title">
            {t('Who sits where', 'কে কোথায় বসবেন')}
          </h2>
          <dl className="kv">
            <div>
              <dt>{t('Package A', 'প্যাকেজ A')}</dt>
              <dd>{t(`Seats ${coach.code} ${start}–${start + PACKAGE_A_SIZE - 1}`, `আসন ${coachName} ${range(start, start + PACKAGE_A_SIZE - 1)}`)}</dd>
            </div>
            <div>
              <dt>{t('Package B', 'প্যাকেজ B')}</dt>
              <dd>{t(`Seats ${coach.code} ${start + PACKAGE_A_SIZE}–${start + 6}, next to Package A`, `আসন ${coachName} ${range(start + PACKAGE_A_SIZE, start + 6)}, প্যাকেজ A-এর পাশে`)}</dd>
            </div>
          </dl>
          <p className="visually-hidden" aria-live="polite">
            {t(`Seats ${start} to ${start + 6} selected.`, `আসন ${num(start)} থেকে ${num(start + 6)} বেছে নেওয়া হয়েছে।`)}
          </p>
        </section>
      ) : (
        <Notice tone="info" live="off" title={t('Customise on the seat map', 'আসন ম্যাপে নিজে সাজান')}>
          {t('The seat map shows only free seats in this class. You choose each of the 7 seats; the hold keeps running.', 'আসন ম্যাপে এই শ্রেণির শুধু খালি আসন দেখায়। ৭টি আসনের প্রতিটি আপনি বেছে নেবেন; হোল্ড চলতে থাকবে।')}
        </Notice>
      )}
    </ScreenShell>
  );
}
