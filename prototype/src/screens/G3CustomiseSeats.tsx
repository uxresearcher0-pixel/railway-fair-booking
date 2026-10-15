import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { HoldTimer } from '../components/HoldTimer';
import { Notice } from '../components/Notice';
import { SeatMap, SEAT_COLS, type Seat } from '../components/SeatMap';
import { useTrip } from '../components/Route';
import { GROUP_SIZE, PACKAGE_A_SIZE, coaches } from '../data/demo';
import { useT } from '../i18n/lang';

/** Seats are numbered 1–100 along the coach, five to a row (2 + 3). */
export const seatNo = (row: number, col: string) => (row - 1) * SEAT_COLS.length + SEAT_COLS.indexOf(col as (typeof SEAT_COLS)[number]) + 1;
const idFor = (n: number) => `${Math.floor((n - 1) / SEAT_COLS.length) + 1}${SEAT_COLS[(n - 1) % SEAT_COLS.length]}`;

/** Group the chosen seat numbers into runs, e.g. [1,2,3,15,16] → "1–3, 15–16". */
export function runs(nums: number[]) {
  const sorted = [...nums].sort((a, b) => a - b);
  const out: [number, number][] = [];
  for (const n of sorted) {
    const last = out[out.length - 1];
    if (last && last[1] === n - 1) last[1] = n;
    else out.push([n, n]);
  }
  return out;
}

export interface G3Props {
  coachCode?: string;
  /** Seat numbers already chosen (story states). */
  initialSeats?: number[];
  holdSeconds?: number;
  timerPaused?: boolean;
  focusHeading?: boolean;
  onBack?: () => void;
  onNext?: (seats: number[]) => void;
}

/**
 * G3 · Customise seats on the seat map. Only free seats in the group's class can be chosen;
 * the rest are shown as taken. Choosing happens inside the same seat hold (decision 7d).
 */
export function G3CustomiseSeats({ coachCode = 'GHA', initialSeats = [], holdSeconds = 8 * 60 + 5, timerPaused = false, focusHeading, onBack, onNext }: G3Props) {
  const { bn, t, num } = useT();
  const tr = useTrip();
  const coach = coaches.find((c) => c.code === coachCode) ?? coaches[0];
  const coachName = bn ? coach.codeBn : coach.code;
  const free = new Set(coach.free);
  const rows = 20;
  const seats: Seat[] = [];
  for (let r = 1; r <= rows; r++) for (const c of SEAT_COLS) seats.push({ row: r, col: c, state: free.has(seatNo(r, c)) ? 'available' : 'taken' });
  const [selected, setSelected] = useState<string[]>(initialSeats.map(idFor));
  const chosen = selected.map((id) => seatNo(Number(id.slice(0, -1)), id.slice(-1))).sort((a, b) => a - b);
  const groups = runs(chosen);
  const text = (g: [number, number][]) => g.map(([a, b]) => (a === b ? num(a) : `${num(a)}–${num(b)}`)).join(', ');
  const done = chosen.length === GROUP_SIZE;

  return (
    <ScreenShell
      screenId="G3"
      title={t('Customise seats', 'নিজে আসন সাজান')}
      lede={t(`Coach ${coach.code} · ${tr.className} · choose ${GROUP_SIZE} free seats`, `বগি ${coachName} · ${tr.className} · ${num(GROUP_SIZE)}টি খালি আসন বেছে নিন`)}
      backLabel={t('Back to where in the coach', 'বগির কোথায় বসবেন তাতে ফিরে যান')}
      onBack={onBack}
      focusHeading={focusHeading}
      footer={
        <Button block iconAfter="arrow-right" disabled={!done} onClick={() => onNext?.(chosen)}>
          {done
            ? t(`Hold seats ${coach.code} ${text(groups)}`, `আসন ${coachName} ${text(groups)} হোল্ড করুন`)
            : t(`Choose ${GROUP_SIZE - chosen.length} more`, `আরও ${num(GROUP_SIZE - chosen.length)}টি বেছে নিন`)}
        </Button>
      }
    >
      <HoldTimer initialSeconds={holdSeconds} paused={timerPaused} subject={t(`${GROUP_SIZE} seats`, `${num(GROUP_SIZE)}টি আসন`)} />

      <section className="card" aria-labelledby="g3-map">
        <h2 id="g3-map" className="section-title">
          {t('Seat map', 'আসন ম্যাপ')}
        </h2>
        <p className="small-note">
          {t('Only free seats in this class can be chosen. Seat 1 is at the front of the coach.', 'এই শ্রেণির শুধু খালি আসন বেছে নেওয়া যায়। আসন ১ বগির সামনের দিকে।')}
        </p>
        <SeatMap coach={coachName} seats={seats} selected={selected} onChange={setSelected} maxSelectable={GROUP_SIZE} seatNumber={seatNo} />
      </section>

      {chosen.length ? (
        <section className="card" aria-labelledby="g3-who">
          <h2 id="g3-who" className="section-title">
            {t('Who sits where', 'কে কোথায় বসবেন')}
          </h2>
          <dl className="kv">
            <div>
              <dt>{t('Package A', 'প্যাকেজ A')}</dt>
              <dd>{text(runs(chosen.slice(0, PACKAGE_A_SIZE)))}</dd>
            </div>
            {chosen.length > PACKAGE_A_SIZE ? (
              <div>
                <dt>{t('Package B', 'প্যাকেজ B')}</dt>
                <dd>{text(runs(chosen.slice(PACKAGE_A_SIZE)))}</dd>
              </div>
            ) : null}
          </dl>
          {groups.length > 1 ? (
            <Notice tone="warning" live="off" title={t(`The group sits in ${groups.length} places`, `দল ${num(groups.length)} জায়গায় বসবে`)}>
              {t('A child always sits next to an accompanying adult from the same package. You can still hold these seats.', 'শিশু সবসময় একই প্যাকেজের সঙ্গী প্রাপ্তবয়স্কের পাশে বসে। এই আসনগুলোও হোল্ড করতে পারেন।')}
            </Notice>
          ) : null}
        </section>
      ) : null}
    </ScreenShell>
  );
}
