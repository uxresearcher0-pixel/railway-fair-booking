import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { CounterRail } from '../components/CounterRail';
import { useActionFocus } from '../components/useActionFocus';
import { APPLICATION_REF, DRAW, FARE, SERVICE_CHARGE, SHIFT, drawParty } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'pay' | 'issued';
type Method = 'cash' | 'wallet';

export interface CTD03Props {
  initialPhase?: Phase;
  initialMethod?: Method;
  focusHeading?: boolean;
}

/** Counter total for the 4 travellers of AP-0214-7K: fare ৳1,400 + service charge ৳80, no counter fee = ৳1,480. */
export const counterTotal = () => {
  const n = drawParty.length;
  const fare = n * FARE;
  const charge = n * SERVICE_CHARGE;
  return { n, fare, charge, total: fare + charge };
};

/**
 * CTD03 · Take payment (station counter terminal, desktop-first). The passenger sees the official
 * total ৳1,480 on the customer display ("counter fee: none") before any money is taken; cash or a
 * bKash/Nagad QR; then "Received ৳1,480 · issue tickets". Shift summary on the side.
 */
export function CTD03TakePayment({ initialPhase = 'pay', initialMethod = 'cash', focusHeading }: CTD03Props) {
  const { t, num, taka } = useT();
  const { n, fare, charge, total } = counterTotal();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [method, setMethod] = useState<Method>(initialMethod);
  const { ref, acted } = useActionFocus([phase]);
  const issued = phase === 'issued';
  const cash = SHIFT.cash + (issued && method === 'cash' ? total : 0);
  const digital = SHIFT.digital + (issued && method === 'wallet' ? total : 0);
  const receipts = SHIFT.receipts + (issued ? 1 : 0);

  const methods: { id: Method; title: string; meta: string }[] = [
    { id: 'cash', title: t('Cash', 'নগদ'), meta: t('Count with the passenger. Change is given from the shift float.', 'যাত্রীর সামনে গুনে নিন। ভাংতি শিফটের ফ্লোট থেকে দেওয়া হয়।') },
    {
      id: 'wallet',
      title: t('bKash or Nagad (QR on customer display)', 'বিকাশ বা নগদ (গ্রাহকের ডিসপ্লেতে QR)'),
      meta: t('Paid from the passenger’s own wallet.', 'যাত্রীর নিজের ওয়ালেট থেকে পরিশোধ।'),
    },
  ];

  return (
    <ScreenShell
      screenId="CTD03"
      eyebrow={
        <>
          <span lang="en">{APPLICATION_REF}</span> · {t(`Picked · pay by ${DRAW.payBy}`, `নির্বাচিত · ${num(DRAW.payBy)}-এর মধ্যে পরিশোধ`)}
        </>
      }
      title={t('Take payment', 'টাকা নিন')}
      lede={t('Show the passenger the official total on the customer display before taking money.', 'টাকা নেওয়ার আগে গ্রাহকের ডিসপ্লেতে যাত্রীকে অফিসিয়াল মোট দেখান।')}
      rail={<CounterRail current="ctd03" />}
      focusHeading={focusHeading}
    >
      <div className="split">
        <div className="split__main">
          <section className="card" aria-labelledby="ctd03-total">
            <h2 id="ctd03-total" className="card__eyebrow">
              {t('Official total', 'অফিসিয়াল মোট')}
            </h2>
            <table className="cost">
              <caption className="visually-hidden">{t(`Official total for ${APPLICATION_REF}`, `${APPLICATION_REF}-এর অফিসিয়াল মোট`)}</caption>
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
                  </th>
                  <td className="mono">{taka(charge)}</td>
                </tr>
                <tr>
                  <th scope="row">{t('Counter fee', 'কাউন্টার ফি')}</th>
                  <td>{t('None', 'নেই')}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">{t('Official total', 'অফিসিয়াল মোট')}</th>
                  <td className="mono">{taka(total)}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          <fieldset className="card radio-cards" disabled={issued}>
            <legend className="card__eyebrow">{t('Payment', 'পরিশোধ')}</legend>
            {methods.map((m) => (
              <label key={m.id} className={`radio-card ${method === m.id ? 'is-checked' : ''}`}>
                <input type="radio" name="ctd03-method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} aria-labelledby={`ctd03-${m.id}-title`} aria-describedby={`ctd03-${m.id}-meta`} />
                <span className="radio-card__main">
                  <span className="radio-card__title" id={`ctd03-${m.id}-title`}>
                    {m.title}
                  </span>
                  <span className="radio-card__meta" id={`ctd03-${m.id}-meta`}>
                    {m.meta}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="split__side">
          <Notice tone="info" live="off" title={t('Receipt prints with the total', 'রসিদে মোট প্রিন্ট হয়')}>
            {t(`The receipt and SMS show ${taka(total)} and how to report an extra charge.`, `রসিদ ও SMS-এ ${taka(total)} এবং বাড়তি টাকার অভিযোগ কীভাবে করবেন তা থাকে।`)}
          </Notice>
          {!issued ? (
            <Button
              block
              icon="check"
              onClick={() => {
                acted();
                setPhase('issued');
              }}
            >
              {t(`Received ${taka(total)} · issue tickets`, `${taka(total)} পেয়েছি · টিকিট ইস্যু করুন`)}
            </Button>
          ) : null}
          <div ref={ref} tabIndex={-1} className="focus-target">
            {issued ? (
              <Notice tone="success" title={t(`${n} tickets issued · ${taka(total)} received`, `${num(n)}টি টিকিট ইস্যু হয়েছে · ${taka(total)} পাওয়া গেছে`)}>
                {t(
                  `${method === 'cash' ? 'Cash' : 'bKash or Nagad'}. Receipt printed (demo); each adult traveller gets the SMS receipt on their own phone.`,
                  `${method === 'cash' ? 'নগদ' : 'বিকাশ বা নগদ'}। রসিদ প্রিন্ট হয়েছে (ডেমো); প্রত্যেক প্রাপ্তবয়স্ক যাত্রী নিজের ফোনে SMS রসিদ পান।`,
                )}
              </Notice>
            ) : null}
          </div>
          <section className="card" aria-labelledby="ctd03-shift">
            <h2 id="ctd03-shift" className="card__eyebrow">
              {t('Shift', 'শিফট')}
            </h2>
            <dl className="rows">
              <div>
                <dt>{t('Cash taken today', 'আজ নেওয়া নগদ')}</dt>
                <dd className="mono">{taka(cash)}</dd>
              </div>
              <div>
                <dt>{t('bKash or Nagad today', 'আজ বিকাশ বা নগদ')}</dt>
                <dd className="mono">{taka(digital)}</dd>
              </div>
              <div>
                <dt>{t('Receipts', 'রসিদ')}</dt>
                <dd className="mono">{num(receipts)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </ScreenShell>
  );
}
