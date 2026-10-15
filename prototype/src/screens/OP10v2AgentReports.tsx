import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { OpsContext } from '../components/OpsContext';
import { useActionFocus } from '../components/useActionFocus';
import { AGENTS, REPORT_CASE } from '../data/demo';
import { officialTotal } from './P10v2OfficialTotal';
import { useT } from '../i18n/lang';

type Done = 'none' | 'review' | 'asked';

export interface OP10v2Props {
  initialDone?: Done;
  focusHeading?: boolean;
}

/**
 * OP10·v2 Agents and extra-charge reports (operations, desktop-first). Reports are leads, not proof:
 * each case is checked against receipts and other reports. No automatic penalty; suspension only after
 * an independent review with evidence and an appeal route.
 */
export function OP10v2AgentReports({ initialDone = 'none', focusHeading }: OP10v2Props) {
  const { t, num, taka } = useT();
  const [done, setDone] = useState<Done>(initialDone);
  const { ref, acted } = useActionFocus([done]);
  const { total } = officialTotal();
  const r = REPORT_CASE;
  const act = (d: Done) => {
    acted();
    setDone(d);
  };

  return (
    <ScreenShell
      screenId="OP10·v2"
      title={t('Agents and extra-charge reports', 'এজেন্ট ও বাড়তি টাকার অভিযোগ')}
      lede={t(
        'Reports are leads, not proof. Each case is checked against receipts and other reports before any action.',
        'অভিযোগ সূত্র মাত্র, প্রমাণ নয়। কোনো ব্যবস্থার আগে প্রতিটি কেস রসিদ ও অন্য অভিযোগের সাথে মিলিয়ে দেখা হয়।',
      )}
      focusHeading={focusHeading}
      footer={
        <div className="footer-stack">
          <Button block icon="shield" onClick={() => act('review')}>
            {t(`Open ${r.named} review`, `${r.named} পর্যালোচনা খুলুন`)}
          </Button>
          <Button block variant="secondary" onClick={() => act('asked')} disabled={done === 'asked'}>
            {t('Ask passenger for more detail', 'যাত্রীর কাছে আরও তথ্য চান')}
          </Button>
        </div>
      }
    >
      <OpsContext code="OP10" />
      <p>
        <StatusPill tone="accent" icon="shield" srPrefix={t('Handled by:', 'দেখছেন:')}>
          {t('Independent review', 'স্বাধীন পর্যালোচনা')}
        </StatusPill>
      </p>

      <div ref={ref} tabIndex={-1} className="focus-target">
        {done === 'review' ? (
          <Notice tone="info" title={t(`Review of ${r.named} opened`, `${r.named}-এর পর্যালোচনা খোলা হয়েছে`)}>
            {t(
              `${r.named} keeps working during the review. It is told the evidence and can appeal before any decision.`,
              `পর্যালোচনার সময় ${r.named} কাজ চালিয়ে যায়। কোনো সিদ্ধান্তের আগে তাদের প্রমাণ জানানো হয় এবং আপিলের সুযোগ থাকে।`,
            )}
          </Notice>
        ) : null}
        {done === 'asked' ? (
          <Notice tone="success" title={t('One SMS sent to the passenger', 'যাত্রীকে একটি SMS পাঠানো হয়েছে')}>
            {t(`Replying is optional. The agent is not told who reported ${r.ref}.`, `উত্তর দেওয়া ঐচ্ছিক। ${r.ref} কে করেছেন তা এজেন্টকে জানানো হয় না।`)}
          </Notice>
        ) : null}
      </div>

      <section className="card" aria-labelledby="op10-agents">
        <h2 id="op10-agents" className="section-title">
          {t('Agents · last 30 days', `এজেন্ট · গত ${num(30)} দিন`)}
        </h2>
        <table className="data-table">
          <caption className="visually-hidden">{t('Registered agents, applications and reports in the last 30 days', `গত ${num(30)} দিনে নিবন্ধিত এজেন্ট, আবেদন ও অভিযোগ`)}</caption>
          <thead>
            <tr>
              <th scope="col">{t('Agent', 'এজেন্ট')}</th>
              <th scope="col" className="num">
                {t('Applications', 'আবেদন')}
              </th>
              <th scope="col" className="num">
                {t('Reports', 'অভিযোগ')}
              </th>
              <th scope="col">{t('Status', 'অবস্থা')}</th>
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((ag) => (
              <tr key={ag.id}>
                <th scope="row">
                  <span className="mono">{ag.id}</span>
                  <span className="cost__note">{t(ag.place, ag.placeBn)}</span>
                </th>
                <td className="num mono">{num(ag.applications)}</td>
                <td className="num mono">{num(ag.reports)}</td>
                <td>
                  {ag.status === 'review' ? (
                    <StatusPill tone="warning" icon="warning">
                      {t('Under review', 'পর্যালোচনাধীন')}
                    </StatusPill>
                  ) : (
                    <StatusPill tone="neutral" icon="check">
                      {t('Normal', 'স্বাভাবিক')}
                    </StatusPill>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" aria-labelledby="op10-report">
        <h2 id="op10-report" className="section-title">
          {t('Report', 'অভিযোগ')} <span className="mono">{r.ref}</span>
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Official total', 'অফিসিয়াল মোট')}</dt>
            <dd className="mono">{taka(total)}</dd>
          </div>
          <div>
            <dt>{t('Passenger paid', 'যাত্রী দিয়েছেন')}</dt>
            <dd className="mono">
              {taka(r.paid)} <span className="small-note">{t(`(${taka(r.paid - total)} more)`, `(${taka(r.paid - total)} বেশি)`)}</span>
            </dd>
          </div>
          <div>
            <dt>{t('Named', 'নাম উল্লেখ')}</dt>
            <dd className="mono">{r.named}</dd>
          </div>
          <div>
            <dt>{t('Ticket', 'টিকিট')}</dt>
            <dd>{t('Stays valid', 'বৈধ থাকে')}</dd>
          </div>
          <div>
            <dt>{t('Channel', 'চ্যানেল')}</dt>
            <dd>
              <StatusPill tone="info" icon={r.channel === 'counter' ? 'ticket' : 'send'} srPrefix={t('Reported by:', 'যেভাবে জানানো:')}>
                {r.channel === 'sms' ? 'SMS' : r.channel === 'app' ? t('App', 'অ্যাপ') : t('Counter', 'কাউন্টার')}
              </StatusPill>{' '}
              <span className="small-note">{t('Channels: SMS, app or counter. One case per report.', 'চ্যানেল: SMS, অ্যাপ বা কাউন্টার। প্রতি অভিযোগে একটি কেস।')}</span>
            </dd>
          </div>
        </dl>
      </section>

      <Notice tone="info" live="off" title={t('No automatic penalty', 'স্বয়ংক্রিয় শাস্তি নেই')}>
        {t(
          'An agent is only suspended after an independent review with evidence and an appeal route. Busy agents are not punished for volume.',
          'প্রমাণসহ স্বাধীন পর্যালোচনা ও আপিলের সুযোগের পরেই শুধু এজেন্টকে স্থগিত করা হয়। বেশি কাজের জন্য ব্যস্ত এজেন্টকে শাস্তি দেওয়া হয় না।',
        )}
      </Notice>
    </ScreenShell>
  );
}
