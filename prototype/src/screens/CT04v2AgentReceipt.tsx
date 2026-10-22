import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { useActionFocus } from '../components/useActionFocus';
import { AGENT_RECEIPT, DRAW_AUDIT, FARE, SERVICE_CHARGE, evening } from '../data/demo';
import { useT } from '../i18n/lang';

export interface CT04v2Props {
  initialPrinted?: boolean;
  focusHeading?: boolean;
}

/**
 * CT04·v2 Agent receipt (printed by a registered agent). The application is free and goes into the
 * same draw as the app. The assistance fee is itemised; the fare is charged only if picked.
 */
export function CT04v2AgentReceipt({ initialPrinted = false, focusHeading }: CT04v2Props) {
  const { t, num, taka } = useT();
  const [printed, setPrinted] = useState(initialPrinted);
  const { ref, acted } = useActionFocus([printed]);
  const { agent, place, placeBn, application, travellers, fee } = AGENT_RECEIPT;
  const n = num(travellers);

  return (
    <ScreenShell
      screenId="CT04·v2"
      title={t('Agent receipt', 'এজেন্টের রসিদ')}
      lede={t(`Printed receipt · registered agent ${agent} · ${place}`, `প্রিন্ট করা রসিদ · নিবন্ধিত এজেন্ট ${agent} · ${placeBn}`)}
      focusHeading={focusHeading}
      footer={
        <Button
          block
          icon="ticket"
          onClick={() => {
            acted();
            setPrinted(true);
          }}
        >
          {t('Print receipt', 'রসিদ প্রিন্ট করুন')}
        </Button>
      }
    >
      <div ref={ref} tabIndex={-1} className="focus-target">
        {printed ? (
          <Notice tone="success" title={t(`Receipt for ${application} sent to the printer (demo)`, `${application}-এর রসিদ প্রিন্টারে পাঠানো হয়েছে (ডেমো)`)}>
            {t('Give the printed receipt to the passenger. They keep it to check the result and to report an extra charge.', 'প্রিন্ট করা রসিদ যাত্রীকে দিন। ফল দেখতে ও বাড়তি টাকার অভিযোগ করতে তিনি এটি রাখবেন।')}
          </Notice>
        ) : null}
      </div>

      <section className="card" aria-labelledby="ct04-app">
        <h2 id="ct04-app" className="section-title">
          {t('Application', 'আবেদন')} <span className="mono">{application}</span>
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Train', 'ট্রেন')}</dt>
            <dd>{t(`${evening.number} · ${evening.date} · ${evening.classCode}`, `${num(evening.number)} · ${evening.dateBn} · ${evening.classBn}`)}</dd>
          </div>
          <div>
            <dt>{t('Travellers', 'যাত্রীরা')}</dt>
            <dd>{t(`${travellers} · NID records matched`, `${n} · এনআইডি রেকর্ড মিলেছে`)}</dd>
          </div>
          <div>
            <dt>{t('Draw', 'ড্র')}</dt>
            <dd>{t(`Same draw as the app · ${DRAW_AUDIT.frozenAt}`, `অ্যাপের মতো একই ড্র · ${num(DRAW_AUDIT.frozenAt)}`)}</dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="ct04-paid">
        <h2 id="ct04-paid" className="section-title">
          {t('What you paid today', 'আজ আপনি যা দিয়েছেন')}
        </h2>
        <table className="cost">
          <caption className="visually-hidden">{t('Charges on this receipt', 'এই রসিদের খরচ')}</caption>
          <tbody>
            <tr>
              <th scope="row">{t('Application', 'আবেদন')}</th>
              <td>{t('Free', 'বিনামূল্যে')}</td>
            </tr>
            <tr>
              <th scope="row">
                {t('Assistance fee', 'সহায়তা ফি')}
                <span className="cost__note">{t('Demo, rate to confirm', 'ডেমো, হার নিশ্চিত হবে')}</span>
              </th>
              <td className="mono">{taka(fee)}</td>
            </tr>
            <tr>
              <th scope="row">
                {t('Fare if picked', 'নির্বাচিত হলে ভাড়া')}
                <span className="cost__note">
                  {t(
                    `${travellers} × ${taka(FARE)} + ${travellers} × ${taka(SERVICE_CHARGE)}, paid only if picked`,
                    `${n} × ${taka(FARE)} + ${n} × ${taka(SERVICE_CHARGE)}, শুধু নির্বাচিত হলে দিতে হবে`,
                  )}
                </span>
              </th>
              <td className="mono">{taka(travellers * (FARE + SERVICE_CHARGE))}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{t('Paid today', 'আজ দিয়েছেন')}</th>
              <td className="mono">{taka(fee)}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      <Notice tone="info" live="off" title={t('An agent can’t give a better chance, a better seat or a guaranteed ticket.', 'এজেন্ট ভালো সুযোগ, ভালো আসন বা নিশ্চিত টিকিট দিতে পারেন না।')} />

      <section className="card" aria-labelledby="ct04-more">
        <h2 id="ct04-more" className="section-title">
          {t('Charged more than this?', 'এর বেশি টাকা নেওয়া হয়েছে?')}
        </h2>
        <p>
          {t(
            `Report at railfair.example/report or at any station counter. Reference ${application}. Demo receipt.`,
            `railfair.example/report-এ বা যেকোনো স্টেশন কাউন্টারে জানান। রেফারেন্স ${application}। ডেমো রসিদ।`,
          )}
        </p>
      </section>
    </ScreenShell>
  );
}
