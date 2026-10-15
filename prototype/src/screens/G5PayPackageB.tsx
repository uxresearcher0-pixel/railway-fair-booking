import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { HoldTimer } from '../components/HoldTimer';
import { StatusPill } from '../components/StatusPill';
import { Route, useTrip } from '../components/Route';
import { BOOKING_REF, FARE, SERVICE_CHARGE, abdul, packageB, salma } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'pay' | 'confirm-decline' | 'paying' | 'paid' | 'declined' | 'expired';

export interface G5Props {
  initialPhase?: Phase;
  holdSeconds?: number;
  /** Freeze the timer (static stories / tests). */
  timerPaused?: boolean;
  focusHeading?: boolean;
}

export function G5PayPackageB({ initialPhase = 'pay', holdSeconds = 9 * 60 + 12, timerPaused = false, focusHeading }: G5Props) {
  const { t, num, taka, name } = useT();
  const tr = useTrip();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [method, setMethod] = useState('wallet');
  const n = packageB.length;
  const fare = n * FARE;
  const charge = n * SERVICE_CHARGE;
  const total = fare + charge;
  const active = phase === 'pay' || phase === 'confirm-decline' || phase === 'paying';
  const abdulName = name(abdul);

  const pay = () => {
    setPhase('paying');
    setTimeout(() => setPhase('paid'), 900);
  };

  return (
    <ScreenShell
      screenId="G5"
      title={t('Pay for Package B', 'প্যাকেজ B-এর টাকা দিন')}
      lede={t(`Linked booking ${BOOKING_REF} · invited by ${abdul.name}`, `যুক্ত বুকিং ${BOOKING_REF} · আমন্ত্রণ জানিয়েছেন ${abdulName}`)}
      focusHeading={focusHeading}
      footer={
        active ? (
          <div className="footer-stack">
            <Button block onClick={pay} loading={phase === 'paying'} loadingLabel={t('Paying…', 'পরিশোধ হচ্ছে…')}>
              {t(`Pay ${taka(total)}`, `${taka(total)} পরিশোধ করুন`)}
            </Button>
            <Button block variant="ghost" onClick={() => setPhase('confirm-decline')} disabled={phase === 'paying'}>
              {t('Decline Package B', 'প্যাকেজ B প্রত্যাখ্যান করুন')}
            </Button>
          </div>
        ) : undefined
      }
    >
      {active ? (
        <HoldTimer
          initialSeconds={holdSeconds}
          paused={timerPaused || phase === 'paying'}
          subject={t('Package B seats', 'প্যাকেজ B-এর আসন')}
          onExpire={() => setPhase('expired')}
        />
      ) : null}

      {active ? (
        <Notice tone="info" title={t('If the hold ends before you pay', 'পরিশোধের আগে হোল্ড শেষ হলে')} live="off">
          {t(`Package B's seats go back to the fair queue, never to another buyer. ${abdul.name} then chooses to keep or cancel Package A. A payment that arrives late is refunded automatically.`, `প্যাকেজ B-এর আসন ন্যায্য সারিতে ফিরে যায়, কখনো অন্য ক্রেতার কাছে নয়। এরপর ${abdulName} প্যাকেজ A রাখবেন নাকি বাতিল করবেন তা ঠিক করেন। দেরিতে আসা পরিশোধ স্বয়ংক্রিয়ভাবে ফেরত দেওয়া হয়।`)}
        </Notice>
      ) : null}

      {phase === 'confirm-decline' ? (
        <Notice
          tone="danger"
          title={t('Decline Package B?', 'প্যাকেজ B প্রত্যাখ্যান করবেন?')}
          actions={
            <>
              <Button variant="danger" onClick={() => setPhase('declined')}>
                {t('Decline and release 3 seats', 'প্রত্যাখ্যান করে ৩টি আসন ছেড়ে দিন')}
              </Button>
              <Button variant="secondary" onClick={() => setPhase('pay')}>
                {t('Keep Package B', 'প্যাকেজ B রাখুন')}
              </Button>
            </>
          }
        >
          {t("Package B's 3 seats go back to the queue for other passengers. They are not passed to the Package A buyer. Package A stays booked.", 'প্যাকেজ B-এর ৩টি আসন অন্য যাত্রীদের জন্য সারিতে ফিরে যায়। এগুলো প্যাকেজ A-এর ক্রেতাকে দেওয়া হয় না। প্যাকেজ A বুক করাই থাকে।')}
        </Notice>
      ) : null}

      <section className="card" aria-labelledby="g5-trip">
        <div className="card__head">
          <h2 id="g5-trip" className="section-title">
            {t(`Package B · ${n} tickets`, `প্যাকেজ B · ${num(n)}টি টিকিট`)}
          </h2>
          <StatusPill tone="success" srPrefix={t('Package A:', 'প্যাকেজ A:')}>
            {t('Package A paid', 'প্যাকেজ A পরিশোধিত')}
          </StatusPill>
        </div>
        <p>
          <Route />
          <br />
          {tr.train} · {tr.date} · {tr.departs}–{tr.arrives} · {t(`Coach ${tr.coach}, ${tr.className}`, `বগি ${tr.coach}, ${tr.className}`)}
        </p>
        <ul className="people">
          {packageB.map((p) => (
            <li key={p.id}>
              <span className="people__name">{name(p)}</span>
              <span className="people__meta">
                {p.kind === 'child' ? t('Child', 'শিশু') : t('Adult', 'প্রাপ্তবয়স্ক')} · {t('Seat', 'আসন')}{' '}
                <span className="mono">{`${tr.coach}-${num(p.seat ?? '')}`}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="g5-cost">
        <h2 id="g5-cost" className="section-title">
          {t('Amount', 'পরিমাণ')}
        </h2>
        <table className="cost">
          <caption className="visually-hidden">{t('Package B cost breakdown', 'প্যাকেজ B-এর খরচের হিসাব')}</caption>
          <tbody>
            <tr>
              <th scope="row">
                {t('Fare', 'ভাড়া')} · {num(n)} × {taka(FARE)}
              </th>
              <td className="mono">{taka(fare)}</td>
            </tr>
            <tr>
              <th scope="row">
                {t('Service charge', 'সার্ভিস চার্জ')} · {num(n)} × {taka(SERVICE_CHARGE)}
                <span className="cost__note">{t('Non-refundable', 'ফেরতযোগ্য নয়')}</span>
              </th>
              <td className="mono">{taka(charge)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{t('Total', 'মোট')}</th>
              <td className="mono">{taka(total)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="small-note">
          {t(`Paid by: ${salma.name}. Refunds go back to the account that paid.`, `পরিশোধ করছেন: ${name(salma)}। অর্থ ফেরত যায় যে অ্যাকাউন্ট থেকে পরিশোধ করা হয়েছে সেখানে।`)}
        </p>
      </section>

      {active ? (
        <fieldset className="card radio-cards">
          <legend className="section-title">{t('Pay with', 'যেভাবে পরিশোধ করবেন')}</legend>
          {[
            { id: 'wallet', label: t('Mobile wallet (demo)', 'মোবাইল ওয়ালেট (ডেমো)') },
            { id: 'card', label: t('Card (demo)', 'কার্ড (ডেমো)') },
          ].map((m) => (
            <label key={m.id} className={`radio-card ${method === m.id ? 'is-checked' : ''}`}>
              <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
              <span className="radio-card__main">
                <span className="radio-card__title">{m.label}</span>
              </span>
            </label>
          ))}
        </fieldset>
      ) : null}

      {phase === 'paid' ? (
        <Notice tone="success" title={t(`Paid ${taka(total)} · Package B booked`, `${taka(total)} পরিশোধিত · প্যাকেজ B বুক হয়েছে`)}>
          {t(`3 named tickets are ready. Both packages of ${BOOKING_REF} are paid.`, `নামসহ ৩টি টিকিট তৈরি। ${BOOKING_REF}-এর দুই প্যাকেজই পরিশোধিত।`)}
        </Notice>
      ) : null}
      {phase === 'declined' ? (
        <Notice tone="info" title={t('Package B declined', 'প্যাকেজ B প্রত্যাখ্যাত')}>
          {t('3 seats were released back to the queue, not to the Package A buyer. You have not been charged.', '৩টি আসন সারিতে ফিরিয়ে দেওয়া হয়েছে, প্যাকেজ A-এর ক্রেতার কাছে নয়। আপনার কাছ থেকে কোনো টাকা কাটা হয়নি।')}
        </Notice>
      ) : null}
      {phase === 'expired' ? (
        <Notice tone="danger" title={t('Hold expired', 'হোল্ড শেষ')}>
          {t(`Package B seats went back to the fair queue, not to another buyer. You have not been charged, and a late payment is refunded automatically. ${abdul.name} will choose whether to keep or cancel Package A.`, `প্যাকেজ B-এর আসন ন্যায্য সারিতে ফিরে গেছে, অন্য ক্রেতার কাছে নয়। আপনার কাছ থেকে কোনো টাকা কাটা হয়নি, আর দেরিতে আসা পরিশোধ স্বয়ংক্রিয়ভাবে ফেরত দেওয়া হয়। প্যাকেজ A রাখবেন নাকি বাতিল করবেন তা ${abdulName} ঠিক করবেন।`)}
        </Notice>
      ) : null}
    </ScreenShell>
  );
}
