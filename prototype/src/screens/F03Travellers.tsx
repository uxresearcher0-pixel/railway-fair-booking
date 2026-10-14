import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Stepper } from '../components/Stepper';
import { Notice } from '../components/Notice';
import { Button } from '../components/Button';
import { AllowancePill } from '../components/AllowancePill';
import { Route, useTrip } from '../components/Route';
import { BOOKINGS_PER_DAY, FARE, SEATS_PER_BOOKING, SEATS_PER_DAY, SERVICE_CHARGE } from '../data/demo';
import { useT } from '../i18n/lang';

const classes = [
  { id: 'ac-chair', label: 'AC chair', labelBn: 'এসি চেয়ার', fare: FARE, left: 42 },
  { id: 'non-ac-chair', label: 'Non-AC chair', labelBn: 'নন-এসি চেয়ার', fare: 210, left: 8 },
  { id: 'ac-berth', label: 'AC berth', labelBn: 'এসি বার্থ', fare: 640, left: 0 },
];

export interface F03Props {
  initialAdults?: number;
  initialChildren?: number;
  /** Bookings already made today on this NID. */
  usedToday?: number;
  /** Start with the over-limit guidance visible (for the story state). */
  showLimitGuidance?: boolean;
}

export function F03Travellers({ initialAdults = 1, initialChildren = 0, usedToday = 0, showLimitGuidance = false }: F03Props) {
  const { bn, t, num, taka } = useT();
  const tr = useTrip();
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [cls, setCls] = useState('ac-chair');
  const [blocked, setBlocked] = useState(showLimitGuidance);
  const total = adults + children;
  // The cap is seats per booking, not per day.
  const canAdd = () => total < SEATS_PER_BOOKING;
  const fare = classes.find((c) => c.id === cls)!.fare;
  const max = num(SEATS_PER_BOOKING);

  return (
    <ScreenShell
      screenId="F03"
      title={t('Travellers & class', 'যাত্রী ও শ্রেণি')}
      lede={
        <>
          <Route /> · {tr.date}
        </>
      }
      backLabel={t('Back to search', 'খোঁজে ফিরে যান')}
      footer={
        <Button block iconAfter="arrow-right" aria-describedby="f03-total">
          {bn ? `${num(total)} জন যাত্রী নিয়ে এগিয়ে যান` : `Continue with ${total} ${total === 1 ? 'traveller' : 'travellers'}`}
        </Button>
      }
    >
      <section className="card" aria-labelledby="f03-who">
        <h2 id="f03-who" className="section-title">
          {t("Who's travelling", 'কে যাচ্ছেন')} {bn ? null : <span lang="bn">· যাত্রী</span>}
        </h2>
        <Stepper
          label={t('Adults', 'প্রাপ্তবয়স্ক')}
          hint={t('Age 12 and over (age band to confirm)', '১২ বছর বা তার বেশি (বয়সসীমা নিশ্চিত করতে হবে)')}
          unit={t(['adult', 'adults'], ['প্রাপ্তবয়স্ক', 'প্রাপ্তবয়স্ক'])}
          value={adults}
          min={1}
          onChange={(n) => {
            setAdults(n);
            setBlocked(false);
          }}
          canIncrement={canAdd}
          onBlockedIncrement={() => setBlocked(true)}
        />
        <Stepper
          label={t('Children', 'শিশু')}
          hint={t('Age 3 to 11 (age band to confirm)', '৩ থেকে ১১ বছর (বয়সসীমা নিশ্চিত করতে হবে)')}
          unit={t(['child', 'children'], ['শিশু', 'শিশু'])}
          value={children}
          onChange={(n) => {
            setChildren(n);
            setBlocked(false);
          }}
          canIncrement={canAdd}
          onBlockedIncrement={() => setBlocked(true)}
        />
        {bn ? (
          <p className="small-note">
            {`প্রতি বুকিংয়ে সর্বোচ্চ ${max}টি আসন। দিনে ${num(BOOKINGS_PER_DAY)}টি পর্যন্ত বুকিং (${num(SEATS_PER_DAY)}টি আসন), দ্বিতীয়টি অন্য ট্রেন বা রুটের জন্য `}
            <span className="rule-tag">{t('(published terms · Eid rules can differ)', '(প্রকাশিত শর্ত · ঈদের নিয়ম আলাদা হতে পারে)')}</span>।
          </p>
        ) : (
          <p className="small-note">
            Max {SEATS_PER_BOOKING} seats per booking. Up to {BOOKINGS_PER_DAY} bookings ({SEATS_PER_DAY} seats) a day, the
            second for a different train or route <span className="rule-tag">(published terms · Eid rules can differ)</span>.
          </p>
        )}
        {blocked ? (
          <Notice
            tone="warning"
            title={t(`One booking can have up to ${SEATS_PER_BOOKING} seats`, `একটি বুকিংয়ে সর্বোচ্চ ${max}টি আসন থাকতে পারে`)}
            actions={
              <Button variant="secondary" iconAfter="arrow-right">
                {t('Start a linked group booking', 'যুক্ত দলীয় বুকিং শুরু করুন')}
              </Button>
            }
          >
            {bn
              ? `${max} জনের বেশি যাত্রীর জন্য যুক্ত দলীয় বুকিং ব্যবহার করুন: আপনি একটি প্যাকেজ কিনবেন, আর অন্য প্যাকেজে যাতায়াতকারী একজন প্রাপ্তবয়স্ক সেটি অ্যাপে বা যেকোনো কাউন্টারে তাঁর এনআইডি ও দলের কোড দিয়ে কিনবেন। দুই প্যাকেজের একটিই আসন হোল্ড `
              : `For more than ${SEATS_PER_BOOKING} travellers, use a linked group booking: you buy one package and an adult travelling in the other package buys it in the app or at any counter with their NID and the group code. Both packages share one seat hold `}
            <span className="rule-tag">{t('(rule to confirm)', '(নিয়ম নিশ্চিত করতে হবে)')}</span>
            {t('.', '।')}
          </Notice>
        ) : null}
        <AllowancePill used={usedToday} />
      </section>

      <fieldset className="card radio-cards">
        <legend className="section-title">
          {t('Class', 'শ্রেণি')} {bn ? null : <span lang="bn">· শ্রেণি</span>}
        </legend>
        {classes.map((c) => (
          <label key={c.id} className={`radio-card ${cls === c.id ? 'is-checked' : ''}`}>
            <input type="radio" name="class" value={c.id} checked={cls === c.id} onChange={() => setCls(c.id)} />
            <span className="radio-card__main">
              <span className="radio-card__title">{t(c.label, c.labelBn)}</span>
              <span className="radio-card__meta">
                {c.left ? t(`${c.left} seats left`, `${num(c.left)}টি আসন বাকি`) : t('Fair queue only', 'শুধু ন্যায্য সারিতে')}
              </span>
            </span>
            <span className="radio-card__price mono">{taka(c.fare)}</span>
          </label>
        ))}
      </fieldset>

      <p className="total-line" id="f03-total">
        {bn ? (
          <>
            আনুমানিক: <span className="mono">{num(total)} × {taka(fare)}</span> ভাড়া + টিকিটপ্রতি <span className="mono">{taka(SERVICE_CHARGE)}</span> ফেরতযোগ্য নয় এমন সার্ভিস চার্জ
          </>
        ) : (
          <>
            Estimated: <span className="mono">{total} × {taka(fare)}</span> fare + <span className="mono">{taka(SERVICE_CHARGE)}</span>{' '}
            non-refundable service charge per ticket
          </>
        )}
      </p>
    </ScreenShell>
  );
}
