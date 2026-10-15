import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { HoldTimer } from '../components/HoldTimer';
import { StatusPill } from '../components/StatusPill';
import { Route, useTrip } from '../components/Route';
import { APPLICATION_REF, DRAW, DRAW_PLACE, FARE, SERVICE_CHARGE, drawParty } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'offer' | 'expired';

export interface P22v2Props {
  initialPhase?: Phase;
  /** Seconds left until the pay-by time (demo: 10:35 now → 11:00). */
  secondsToDeadline?: number;
  timerPaused?: boolean;
  focusHeading?: boolean;
  /** Go on to the official total (P10·v2). */
  onNext?: () => void;
}

/**
 * P22·v2 Picked · pay by 11:00 (and P22c·v2 Offer expired).
 * The deadline is an absolute clock time that never restarts — not "10 minutes from when you open it".
 */
export function P22v2Offer({ initialPhase = 'offer', secondsToDeadline = 25 * 60, timerPaused = false, focusHeading, onNext }: P22v2Props) {
  const { t, num, taka } = useT();
  const tr = useTrip();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const n = drawParty.length;
  const fare = n * FARE;
  const charge = n * SERVICE_CHARGE;
  const total = fare + charge;
  const place = `#${num(DRAW_PLACE)}`;

  return (
    <ScreenShell
      screenId={phase === 'expired' ? 'P22c·v2' : 'P22·v2'}
      title={phase === 'expired' ? t('Offer expired', 'অফারের সময় শেষ') : t(`Picked · pay by ${DRAW.payBy}`, `নির্বাচিত · ${num(DRAW.payBy)}-এর মধ্যে পরিশোধ করুন`)}
      lede={t(`Application ${APPLICATION_REF} · ${n} travellers`, `আবেদন ${APPLICATION_REF} · ${num(n)} জন যাত্রী`)}
      focusHeading={focusHeading}
      footer={
        phase === 'offer' ? (
          <Button block iconAfter="arrow-right" onClick={onNext}>
            {t(`Pay ${taka(total)}`, `${taka(total)} পরিশোধ করুন`)}
          </Button>
        ) : undefined
      }
    >
      <section className="card" aria-labelledby="p22-result">
        <div className="card__head">
          <h2 id="p22-result" className="section-title">
            {t('Draw result', 'লটারির ফল')}
          </h2>
          {phase === 'offer' ? (
            <StatusPill tone="success" srPrefix={t('Result:', 'ফল:')}>
              {t('Picked', 'নির্বাচিত')}
            </StatusPill>
          ) : (
            <StatusPill tone="danger" srPrefix={t('Offer:', 'অফার:')}>
              {t('Expired', 'মেয়াদ শেষ')}
            </StatusPill>
          )}
        </div>
        <dl className="kv">
          <div>
            <dt>{t('Draw place', 'লটারির স্থান')}</dt>
            <dd className="mono">{place}</dd>
          </div>
          <div>
            <dt>{t('Train', 'ট্রেন')}</dt>
            <dd>
              <Route /> · {tr.train} · {tr.date} · {tr.departs}
            </dd>
          </div>
          <div>
            <dt>{t('Seats', 'আসন')}</dt>
            <dd>{t(`${n} seats together, ${tr.className}`, `${num(n)}টি আসন একসাথে, ${tr.className}`)}</dd>
          </div>
        </dl>
      </section>

      {phase === 'offer' ? (
        <>
          <section className="card deadline" aria-labelledby="p22-deadline">
            <h2 id="p22-deadline" className="section-title">
              {t(`Pay by ${DRAW.payBy} today`, `আজ ${num(DRAW.payBy)}-এর মধ্যে পরিশোধ করুন`)}
            </h2>
            <p>
              {t(
                'The time does not restart when you open this offer, change phone or retry a payment.',
                'এই অফার খুললে, ফোন বদলালে বা আবার পরিশোধের চেষ্টা করলে সময় নতুন করে শুরু হয় না।',
              )}
            </p>
            <HoldTimer initialSeconds={secondsToDeadline} paused={timerPaused} subject={t(`${n} seats`, `${num(n)}টি আসন`)} onExpire={() => setPhase('expired')} />
          </section>

          <section className="card" aria-labelledby="p22-total">
            <h2 id="p22-total" className="section-title">
              {t('Official total', 'অফিশিয়াল মোট')}
            </h2>
            <table className="cost">
              <caption className="visually-hidden">{t('Official total for this offer', 'এই অফারের অফিশিয়াল মোট')}</caption>
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
              {t('If a registered agent helps you, their fee is itemised on the next screen. Nobody may ask for more.', 'নিবন্ধিত এজেন্ট সাহায্য করলে তাঁর ফি পরের স্ক্রিনে আলাদা করে দেখানো হয়। এর বেশি কেউ চাইতে পারেন না।')}
            </p>
          </section>
        </>
      ) : (
        <Notice tone="danger" title={t(`The offer ended at ${DRAW.payBy}`, `অফার ${num(DRAW.payBy)}-এ শেষ হয়েছে`)}>
          {t(
            'The seats passed to the next application in draw order. You have not been charged. A payment that arrives late is refunded automatically.',
            'আসনগুলো লটারির ক্রম অনুযায়ী পরের আবেদনে চলে গেছে। আপনার কাছ থেকে কোনো টাকা কাটা হয়নি। দেরিতে আসা পরিশোধ স্বয়ংক্রিয়ভাবে ফেরত দেওয়া হয়।',
          )}
        </Notice>
      )}
    </ScreenShell>
  );
}
