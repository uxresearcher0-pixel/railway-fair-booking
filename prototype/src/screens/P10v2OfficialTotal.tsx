import { useEffect, useRef, useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { AGENT_ID, ASSISTANCE_FEE, BOOKING_REF, FARE, SERVICE_CHARGE, abdul, drawParty } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'total' | 'paying' | 'paid';

/** Official total for the v2 example: fare ৳1,400 + service charge ৳80 + assistance fee ৳40 = ৳1,520. */
export const officialTotal = () => {
  const n = drawParty.length;
  const fare = n * FARE;
  const charge = n * SERVICE_CHARGE;
  return { n, fare, charge, fee: ASSISTANCE_FEE, total: fare + charge + ASSISTANCE_FEE };
};

export interface P10v2Props {
  initialPhase?: Phase;
  focusHeading?: boolean;
  /** "Report an extra charge" → R3·v2. */
  onReport?: () => void;
}

/** P10·v2 Official total: itemised fare, service charge and assistance fee, and a way to report an extra charge. */
export function P10v2OfficialTotal({ initialPhase = 'total', focusHeading, onReport }: P10v2Props) {
  const { t, num, taka, name } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const { n, fare, charge, fee, total } = officialTotal();
  const doneRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (phase === 'paid' && initialPhase !== 'paid') doneRef.current?.focus();
  }, [phase, initialPhase]);

  const pay = () => {
    setPhase('paying');
    timer.current = setTimeout(() => setPhase('paid'), 900);
  };

  return (
    <ScreenShell
      screenId="P10·v2"
      title={t('Official total', 'অফিশিয়াল মোট')}
      lede={t(`Booking ${BOOKING_REF} · ${n} travellers · helped by registered agent ${AGENT_ID}`, `বুকিং ${BOOKING_REF} · ${num(n)} জন যাত্রী · সাহায্য করেছেন নিবন্ধিত এজেন্ট ${AGENT_ID}`)}
      focusHeading={focusHeading}
      footer={
        phase !== 'paid' ? (
          <div className="footer-stack">
            <Button block onClick={pay} loading={phase === 'paying'} loadingLabel={t('Paying…', 'পরিশোধ হচ্ছে…')}>
              {t(`Pay ${taka(total)}`, `${taka(total)} পরিশোধ করুন`)}
            </Button>
            <Button block variant="ghost" onClick={onReport} disabled={phase === 'paying'}>
              {t('Report an extra charge', 'বাড়তি টাকা চাওয়ার কথা জানান')}
            </Button>
          </div>
        ) : undefined
      }
    >
      <section className="card" aria-labelledby="p10-items">
        <h2 id="p10-items" className="section-title">
          {t('What you pay', 'আপনি যা পরিশোধ করবেন')}
        </h2>
        <table className="cost">
          <caption className="visually-hidden">{t('Itemised official total', 'অফিশিয়াল মোটের বিস্তারিত হিসাব')}</caption>
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
            <tr>
              <th scope="row">
                {t('Assistance fee', 'সহায়তা ফি')} · {AGENT_ID}
                <span className="cost__note">{t('Demo amount, rate to confirm', 'ডেমো পরিমাণ, হার নিশ্চিত করতে হবে')}</span>
              </th>
              <td className="mono">{taka(fee)}</td>
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
          {t(`Booked by: ${abdul.name}. Each adult traveller gets this total by SMS on their own phone.`, `বুক করেছেন: ${name(abdul)}। প্রত্যেক প্রাপ্তবয়স্ক যাত্রী নিজের ফোনে SMS-এ এই মোট পান।`)}
        </p>
      </section>

      <section className="card" aria-labelledby="p10-more">
        <h2 id="p10-more" className="section-title">
          {t('Asked to pay more?', 'বেশি টাকা চাওয়া হয়েছে?')}
        </h2>
        <p>
          {t(
            `${taka(total)} is the full price. Nobody, including an agent or helper, may ask for more. You can report it privately, and your ticket stays valid.`,
            `${taka(total)}-ই পুরো দাম। এজেন্ট বা সাহায্যকারীসহ কেউ এর বেশি চাইতে পারেন না। আপনি গোপনে জানাতে পারেন, আর আপনার টিকিট বৈধ থাকে।`,
          )}
        </p>
      </section>

      {phase === 'paid' ? (
        <div ref={doneRef} tabIndex={-1} className="focus-target">
          <Notice tone="success" title={t(`Paid ${taka(total)} · ${n} tickets booked`, `${taka(total)} পরিশোধিত · ${num(n)}টি টিকিট বুক হয়েছে`)}>
            {t('A receipt with this itemised total was sent by SMS to each adult traveller.', 'এই বিস্তারিত মোটসহ রসিদ প্রত্যেক প্রাপ্তবয়স্ক যাত্রীকে SMS-এ পাঠানো হয়েছে।')}
          </Notice>
          <p className="paid-report">
            <Button variant="ghost" onClick={onReport}>
              {t('Report an extra charge', 'বাড়তি টাকা চাওয়ার কথা জানান')}
            </Button>
          </p>
        </div>
      ) : null}
    </ScreenShell>
  );
}
