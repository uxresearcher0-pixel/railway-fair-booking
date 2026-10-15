import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { useActionFocus } from '../components/useActionFocus';
import { AGENT_ID, BOOKING_REF, FARE, PAYMENT, SERVICE_CHARGE, drawParty, helper } from '../data/demo';
import { officialTotal } from './P10v2OfficialTotal';
import { useT } from '../i18n/lang';

export interface P14v2Props {
  focusHeading?: boolean;
  /** "Show my tickets" (no ticket screen in this prototype; shows a demo note when omitted). */
  onShowTickets?: () => void;
}

/**
 * P14·v2 Your receipt. Itemised official total (fare, service charge, assistance fee) and the SMS
 * that each adult traveller gets on their own phone, with a way to report an extra charge.
 */
export function P14v2Receipt({ focusHeading, onShowTickets }: P14v2Props) {
  const { t, num, taka, masked, name } = useT();
  const { n, fare, charge, fee, total } = officialTotal();
  const adults = drawParty.filter((p) => p.kind === 'adult').length;
  const [note, setNote] = useState(false);
  const { ref, acted } = useActionFocus([note]);
  const plain = (v: number) => num(v.toLocaleString('en-US'));

  return (
    <ScreenShell
      screenId="P14·v2"
      title={t('Your receipt', 'আপনার রসিদ')}
      lede={t(`Tickets issued · ${n} travellers`, `টিকিট ইস্যু হয়েছে · ${num(n)} জন যাত্রী`)}
      focusHeading={focusHeading}
      footer={
        <div className="footer-stack">
          <Button
            block
            icon="ticket"
            onClick={() => {
              if (onShowTickets) return onShowTickets();
              acted();
              setNote(true);
            }}
          >
            {t('Show my tickets', 'আমার টিকিট দেখান')}
          </Button>
          <a className="btn btn--ghost btn--block" href="#/r3v2">
            {t('Report an extra charge', 'বাড়তি টাকার অভিযোগ করুন')}
          </a>
        </div>
      }
    >
      <div ref={ref} tabIndex={-1} className="focus-target">
        {note ? (
          <Notice tone="info" title={t('Tickets aren’t part of this prototype (demo)', 'টিকিটের স্ক্রিন এই প্রোটোটাইপে নেই (ডেমো)')}>
            {t(`Each of the ${n} tickets shows the traveller’s English name, as on their ID.`, `${num(n)}টি টিকিটের প্রতিটিতে যাত্রীর ইংরেজি নাম থাকে, পরিচয়পত্রের মতো।`)}
          </Notice>
        ) : null}
      </div>

      <section className="card" aria-labelledby="p14-receipt">
        <h2 id="p14-receipt" className="section-title">
          {t('Receipt', 'রসিদ')} · <span className="mono">{BOOKING_REF}</span>
        </h2>
        <table className="cost">
          <caption className="visually-hidden">{t(`Official total for booking ${BOOKING_REF}`, `বুকিং ${BOOKING_REF}-এর অফিসিয়াল মোট`)}</caption>
          <tbody>
            <tr>
              <th scope="row">
                {t('Fare', 'ভাড়া')}
                <span className="cost__note">
                  {num(n)} × {taka(FARE)}
                </span>
              </th>
              <td className="mono">{taka(fare)}</td>
            </tr>
            <tr>
              <th scope="row">
                {t('Service charge', 'সার্ভিস চার্জ')}
                <span className="cost__note">
                  {num(n)} × {taka(SERVICE_CHARGE)} · {t('non-refundable', 'ফেরতযোগ্য নয়')}
                </span>
              </th>
              <td className="mono">{taka(charge)}</td>
            </tr>
            <tr>
              <th scope="row">
                {t('Assistance fee', 'সহায়তা ফি')} · {AGENT_ID}
                <span className="cost__note">{t('Demo amount, rate to confirm', 'ডেমো পরিমাণ, হার নিশ্চিত হবে')}</span>
              </th>
              <td className="mono">{taka(fee)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{t('Official total', 'অফিসিয়াল মোট')}</th>
              <td className="mono">{taka(total)}</td>
            </tr>
          </tfoot>
        </table>
        <dl className="kv">
          <div>
            <dt>{t('Paid by', 'পরিশোধ করেছেন')}</dt>
            <dd>
              {name(helper)} · {t(PAYMENT.method, PAYMENT.methodBn)} {masked(PAYMENT.last4)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="p14-sms">
        <h2 id="p14-sms" className="section-title">
          {t('SMS to each adult traveller', 'প্রত্যেক প্রাপ্তবয়স্ক যাত্রীকে SMS')}
        </h2>
        <p className="small-note">
          {t(`Sent to the ${adults} adult travellers’ own phones, not only to the phone that booked.`, `${num(adults)} জন প্রাপ্তবয়স্ক যাত্রীর নিজের ফোনে পাঠানো হয়েছে, শুধু বুকিংয়ের ফোনে নয়।`)}
        </p>
        <figure className="sms">
          <figcaption className="visually-hidden">{t('Demo SMS message', 'ডেমো SMS বার্তা')}</figcaption>
          <blockquote className="sms__bubble">
            <p>
              {t(
                `railfair: ${BOOKING_REF} confirmed. Official total ${taka(total)} (fare ${plain(fare)} · service ${plain(charge)} · assistance ${plain(fee)}). Paid more? Report at railfair.example/report or any counter. Demo message.`,
                `railfair: ${BOOKING_REF} নিশ্চিত। অফিসিয়াল মোট ${taka(total)} (ভাড়া ${plain(fare)} · সার্ভিস ${plain(charge)} · সহায়তা ${plain(fee)})। বেশি দিয়েছেন? railfair.example/report-এ বা যেকোনো কাউন্টারে জানান। ডেমো বার্তা।`,
              )}
            </p>
          </blockquote>
        </figure>
      </section>
    </ScreenShell>
  );
}
