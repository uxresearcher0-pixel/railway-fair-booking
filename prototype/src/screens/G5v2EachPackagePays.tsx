import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { GroupSteps } from '../components/GroupSteps';
import { useActionFocus } from '../components/useActionFocus';
import { DRAW, FARE, GROUP_SIZE, GROUP_V2, SERVICE_CHARGE, salma } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'waiting' | 'resent' | 'paid';

export interface G5v2Props {
  initialPhase?: Phase;
  focusHeading?: boolean;
  /** "See group tickets" → G4·v2. Without it, a link to #/g4v2. */
  onNext?: () => void;
}

/** Each package's official total: fare + service charge per traveller (no assistance fee). */
export const packageTotal = (n: number) => ({ n, fare: n * FARE, charge: n * SERVICE_CHARGE, total: n * (FARE + SERVICE_CHARGE) });

/**
 * G5·v2 Each package pays its own share (DW11). Package A (4) is paid: ৳1,480. Package B (3, ৳1,110) is
 * waiting for Salma Karim, who was sent a one-time code; the code can be resent. The tickets follow
 * when both are paid, by 11:00. Proposed rules.
 */
export function G5v2EachPackagePays({ initialPhase = 'waiting', focusHeading, onNext }: G5v2Props) {
  const { t, num, taka, name, masked } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const { ref, acted } = useActionFocus([phase]);
  const a = packageTotal(GROUP_V2.packageA.length);
  const b = packageTotal(GROUP_V2.packageB.length);
  const paid = phase === 'paid';
  const salmaName = name(salma);

  const totalTable = (p: ReturnType<typeof packageTotal>, caption: string) => (
    <table className="cost">
      <caption className="visually-hidden">{caption}</caption>
      <tbody>
        <tr>
          <th scope="row">
            {t('Fare', 'ভাড়া')} · {num(p.n)} × {taka(FARE)}
          </th>
          <td className="mono">{taka(p.fare)}</td>
        </tr>
        <tr>
          <th scope="row">
            {t('Service charge', 'সার্ভিস চার্জ')} · {num(p.n)} × {taka(SERVICE_CHARGE)}
          </th>
          <td className="mono">{taka(p.charge)}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">{t('Official total', 'অফিসিয়াল মোট')}</th>
          <td className="mono">{taka(p.total)}</td>
        </tr>
      </tfoot>
    </table>
  );

  const seats = `${t(GROUP_V2.coach, GROUP_V2.coachBn)} ${num(1)}–${num(GROUP_SIZE)}`;

  return (
    <ScreenShell
      screenId="G5·v2"
      wide
      eyebrow={t(`Pay by ${DRAW.payBy} today`, `আজ ${num(DRAW.payBy)}-এর মধ্যে পরিশোধ`)}
      title={t('Each package pays its own share', 'প্রতিটি প্যাকেজ নিজের অংশ পরিশোধ করে')}
      lede={t(
        `${salma.name} was sent a one-time code to join as the buyer of Package B. Each payer pays only their own package total.`,
        `প্যাকেজ B-এর ক্রেতা হিসেবে যোগ দিতে ${salmaName}-কে একটি এককালীন কোড পাঠানো হয়েছে। প্রত্যেক পরিশোধকারী শুধু নিজের প্যাকেজের মোট পরিশোধ করেন।`,
      )}
      focusHeading={focusHeading}
    >
      <GroupSteps current="pay" />
      <div className="split">
        <div className="split__main">
          <section className="card" aria-labelledby="g5v2-a">
            <div className="card__head">
              <h2 id="g5v2-a" className="card__eyebrow">
                {t('Package A · you pay', 'প্যাকেজ A · আপনি পরিশোধ করছেন')}
              </h2>
              <StatusPill tone="success" icon="check" srPrefix={t('Package A:', 'প্যাকেজ A:')}>
                {t('Paid', 'পরিশোধিত')}
              </StatusPill>
            </div>
            {totalTable(a, t('Package A official total', 'প্যাকেজ A-এর অফিসিয়াল মোট'))}
            <dl className="rows">
              <div>
                <dt>{t('Status', 'অবস্থা')}</dt>
                <dd>
                  {t(
                    `Paid ${GROUP_V2.paidA.time} · ${GROUP_V2.paidA.method} `,
                    `পরিশোধিত ${num(GROUP_V2.paidA.time)} · ${GROUP_V2.paidA.methodBn} `,
                  )}
                  {masked(GROUP_V2.paidA.last4)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="card" aria-labelledby="g5v2-b">
            <div className="card__head">
              <h2 id="g5v2-b" className="card__eyebrow">
                {t(`Package B · ${salma.name} pays`, `প্যাকেজ B · পরিশোধ করবেন ${salmaName}`)}
              </h2>
              {paid ? (
                <StatusPill tone="success" icon="check" srPrefix={t('Package B:', 'প্যাকেজ B:')}>
                  {t('Paid', 'পরিশোধিত')}
                </StatusPill>
              ) : (
                <StatusPill tone="warning" icon="clock" srPrefix={t('Package B:', 'প্যাকেজ B:')}>
                  {t('Waiting', 'অপেক্ষমাণ')}
                </StatusPill>
              )}
            </div>
            {totalTable(b, t('Package B official total', 'প্যাকেজ B-এর অফিসিয়াল মোট'))}
            <dl className="rows">
              <div>
                <dt>{t('Status', 'অবস্থা')}</dt>
                <dd>
                  {paid
                    ? t(`Paid ${GROUP_V2.paidB}`, `পরিশোধিত ${num(GROUP_V2.paidB)}`)
                    : phase === 'resent'
                      ? t(`Waiting · code sent again ${GROUP_V2.codeResent}`, `অপেক্ষমাণ · কোড আবার পাঠানো হয়েছে ${num(GROUP_V2.codeResent)}`)
                      : t(`Waiting · code sent ${GROUP_V2.codeSent}`, `অপেক্ষমাণ · কোড পাঠানো হয়েছে ${num(GROUP_V2.codeSent)}`)}
                </dd>
              </div>
            </dl>
            {!paid ? (
              <div className="side-actions">
                <Button
                  variant="secondary"
                  icon="send"
                  onClick={() => {
                    acted();
                    setPhase('resent');
                  }}
                >
                  {t(`Resend code to ${salma.name}`, `${salmaName}-কে আবার কোড পাঠান`)}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    acted();
                    setPhase('paid');
                  }}
                >
                  {t(`Demo: ${salma.name} pays ${taka(b.total)}`, `ডেমো: ${salmaName} ${taka(b.total)} পরিশোধ করলেন`)}
                </Button>
              </div>
            ) : null}
          </section>
        </div>

        <div className="split__side">
          <Notice tone="warning" live="off" title={t(`All ${GROUP_SIZE} travel, or none`, `${num(GROUP_SIZE)} জনই যাবেন, নয়তো কেউ নয়`)}>
            {t(
              `If Package B isn’t paid by ${DRAW.payBy}, Package A is refunded to the account that paid and all ${GROUP_SIZE} seats go to the next application.`,
              `প্যাকেজ B ${num(DRAW.payBy)}-এর মধ্যে পরিশোধ না হলে প্যাকেজ A-এর টাকা যে অ্যাকাউন্ট থেকে পরিশোধ হয়েছে সেখানে ফেরত যায়, আর ${num(GROUP_SIZE)}টি আসনই পরের আবেদনে যায়।`,
            )}
          </Notice>
          <section className="card" aria-labelledby="g5v2-group">
            <h2 id="g5v2-group" className="card__eyebrow">
              {t('Group', 'দল')}
            </h2>
            <dl className="rows">
              <div>
                <dt>{t('Seats', 'আসন')}</dt>
                <dd>{seats}</dd>
              </div>
              <div>
                <dt>{t('Paid', 'পরিশোধিত')}</dt>
                <dd>{paid ? t('2 of 2 packages', '২টির মধ্যে ২টি প্যাকেজ') : t('1 of 2 packages', '২টির মধ্যে ১টি প্যাকেজ')}</dd>
              </div>
              <div>
                <dt>{t('Pay by', 'পরিশোধের শেষ সময়')}</dt>
                <dd>{num(DRAW.payBy)}</dd>
              </div>
            </dl>
          </section>
          <div ref={ref} tabIndex={-1} className="focus-target">
            {phase === 'resent' ? (
              <Notice tone="success" title={t(`Code sent again to ${salma.name}`, `${salmaName}-কে আবার কোড পাঠানো হয়েছে`)}>
                {t(
                  `Sent at ${GROUP_V2.codeResent} to her own phone. The pay-by time stays ${DRAW.payBy}.`,
                  `${num(GROUP_V2.codeResent)}-এ তাঁর নিজের ফোনে পাঠানো হয়েছে। পরিশোধের শেষ সময় ${num(DRAW.payBy)}-ই থাকে।`,
                )}
              </Notice>
            ) : null}
            {paid ? (
              <Notice tone="success" title={t('Both packages paid', 'দুই প্যাকেজই পরিশোধিত')}>
                {t(`Package A ${taka(a.total)} · Package B ${taka(b.total)}. The ${GROUP_SIZE} named tickets are ready.`, `প্যাকেজ A ${taka(a.total)} · প্যাকেজ B ${taka(b.total)}। নামসহ ${num(GROUP_SIZE)}টি টিকিট তৈরি।`)}
              </Notice>
            ) : null}
          </div>
          {paid ? (
            onNext ? (
              <Button block icon="ticket" onClick={onNext}>
                {t('See group tickets', 'দলের টিকিট দেখুন')}
              </Button>
            ) : (
              <a className="btn btn--primary btn--block" href="#/g4v2">
                {t('See group tickets', 'দলের টিকিট দেখুন')}
              </a>
            )
          ) : (
            <Button block icon="ticket" disabled>
              {t('See tickets when both are paid', 'দুই প্যাকেজ পরিশোধ হলে টিকিট দেখুন')}
            </Button>
          )}
        </div>
      </div>
    </ScreenShell>
  );
}
