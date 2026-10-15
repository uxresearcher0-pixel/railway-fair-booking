import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { Code } from '../components/Code';
import { useActionFocus } from '../components/useActionFocus';
import { CORRECTION } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'review' | 'sent' | 'different';

export interface DK03v2Props {
  initialPhase?: Phase;
  focusHeading?: boolean;
}

/**
 * DK03·v2 Correction — same person only (desk, desktop-first). A date or spelling fix for the same
 * traveller needs a second approver; self-approval is blocked. A different person can't take the seat:
 * the ticket is cancelled under the normal rules and the seat goes to the waiting list.
 */
export function DK03v2Correction({ initialPhase = 'review', focusHeading }: DK03v2Props) {
  const { t, num } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const { ref, acted } = useActionFocus([phase]);
  const c = CORRECTION;
  const go = (p: Phase) => {
    acted();
    setPhase(p);
  };
  const officer = t(`Desk officer ${c.officer}`, `ডেস্ক কর্মকর্তা ${num(c.officer)}`);

  return (
    <ScreenShell
      screenId="DK03·v2"
      title={t('Correction — same person only', 'সংশোধন — শুধু একই ব্যক্তি')}
      lede={t(
        'A spelling or date fix for the same traveller. Changing who travels is not a correction.',
        'একই যাত্রীর বানান বা তারিখ ঠিক করা। কে যাবেন তা বদলানো সংশোধন নয়।',
      )}
      focusHeading={focusHeading}
      footer={
        phase === 'review' ? (
          <div className="footer-stack">
            <Button block icon="send" onClick={() => go('sent')}>
              {t('Send for second approval', 'দ্বিতীয় অনুমোদনে পাঠান')}
            </Button>
            <Button block variant="secondary" onClick={() => go('different')}>
              {t('This is a different person', 'ইনি ভিন্ন ব্যক্তি')}
            </Button>
          </div>
        ) : undefined
      }
    >
      <p className="staff-context">
        <span>
          {t(`Desk · ${c.station} · `, `ডেস্ক · ${c.stationBn} · `)}
          <span className="mono">{c.desk}</span>
        </span>
        <span>
          {t('Case', 'কেস')} <span className="mono">{c.ref}</span> · {t('Decision: system or data error', 'সিদ্ধান্ত: সিস্টেম বা তথ্যের ভুল')}
        </span>
        <StatusPill tone="warning" icon="user" srPrefix={t('Status:', 'অবস্থা:')}>
          {phase === 'sent' ? t('Waiting for second approver', 'দ্বিতীয় অনুমোদনের অপেক্ষায়') : t('Second approver needed', 'দ্বিতীয় অনুমোদনকারী দরকার')}
        </StatusPill>
      </p>

      <div ref={ref} tabIndex={-1} className="focus-target">
        {phase === 'sent' ? (
          <Notice tone="success" title={t(`Sent to Reviewer ${c.reviewer} for second approval`, `দ্বিতীয় অনুমোদনের জন্য পর্যালোচক ${c.reviewer}-এর কাছে পাঠানো হয়েছে`)}>
            {t(
              `The ticket stays at version ${c.versionFrom} until ${c.reviewer} approves. You can’t approve your own case.`,
              `${c.reviewer} অনুমোদন না করা পর্যন্ত টিকিট আগের সংস্করণেই থাকবে। নিজের কেস নিজে অনুমোদন করা যায় না।`,
            )}
          </Notice>
        ) : null}
        {phase === 'different' ? (
          <Notice
            tone="danger"
            title={t('Not a correction: cancel under the normal rules', 'সংশোধন নয়: স্বাভাবিক নিয়মে বাতিল করুন')}
            actions={
              <Button variant="secondary" onClick={() => go('review')}>
                {t('Back to the correction', 'সংশোধনে ফিরে যান')}
              </Button>
            }
          >
            {t(
              'The seat goes to the waiting list; the new person applies on their own. Paying a fine never creates a seat.',
              'আসন অপেক্ষমাণ তালিকায় যাবে; নতুন ব্যক্তি নিজে আবেদন করবেন। জরিমানা দিলে কখনো আসন তৈরি হয় না।',
            )}
          </Notice>
        ) : null}
      </div>

      <section className="card" aria-labelledby="dk03-change">
        <h2 id="dk03-change" className="section-title">
          {t('What is being changed', 'কী বদলানো হচ্ছে')}
        </h2>
        <table className="compare">
          <caption className="visually-hidden">{t('Ticket compared with the NID record', 'টিকিট ও এনআইডি রেকর্ডের তুলনা')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('Field', 'ঘর')}</th>
              <th scope="col">{t('Ticket shows', 'টিকিটে আছে')}</th>
              <th scope="col">{t('NID record', 'এনআইডি রেকর্ড')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{t('Date of birth', 'জন্মতারিখ')}</th>
              <td className="mono">
                {num(c.ticketDob)}
              </td>
              <td className="mono">
                <strong>{num(c.nidDob)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <dl className="kv">
          <div>
            <dt>{t('Same person?', 'একই ব্যক্তি?')}</dt>
            <dd>{t('Yes — NID record matched, photo ID seen', 'হ্যাঁ — এনআইডি রেকর্ড মিলেছে, ছবিসহ পরিচয়পত্র দেখা হয়েছে')}</dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="dk03-evidence">
        <h2 id="dk03-evidence" className="section-title">
          {t('Evidence', 'প্রমাণ')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Document seen', 'দেখা কাগজপত্র')}</dt>
            <dd>{t('NID card · front and back', 'এনআইডি কার্ড · সামনে ও পেছনে')}</dd>
          </div>
          <div>
            <dt>{t('Recorded by', 'রেকর্ড করেছেন')}</dt>
            <dd>
              {officer} · <span className="mono">{c.desk}</span>
            </dd>
          </div>
          <div>
            <dt>{t('Version', 'সংস্করণ')}</dt>
            <dd>
              {t('Ticket', 'টিকিট')}{' '}
              <Code>
                {c.versionFrom} → {c.versionTo}
              </Code>{' '}
              {t('after approval', 'অনুমোদনের পর')}
            </dd>
          </div>
        </dl>
      </section>

      <Notice tone="warning" live="off" title={t('A different person can’t take this seat', 'অন্য কেউ এই আসন নিতে পারবেন না')}>
        {t(
          'If the traveller is a different person, cancel this ticket under the normal rules. The seat goes to the waiting list; the new person applies on their own. Paying a fine never creates a seat.',
          'যাত্রী অন্য কেউ হলে স্বাভাবিক নিয়মে এই টিকিট বাতিল করুন। আসন অপেক্ষমাণ তালিকায় যাবে; নতুন ব্যক্তি নিজে আবেদন করবেন। জরিমানা দিলে কখনো আসন তৈরি হয় না।',
        )}
      </Notice>

      <section className="card" aria-labelledby="dk03-approval">
        <h2 id="dk03-approval" className="section-title">
          {t('Approval', 'অনুমোদন')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Prepared by', 'প্রস্তুত করেছেন')}</dt>
            <dd>{officer}</dd>
          </div>
          <div>
            <dt>{t('Approver', 'অনুমোদনকারী')}</dt>
            <dd>{t(`Reviewer ${c.reviewer} (different person)`, `পর্যালোচক ${c.reviewer} (ভিন্ন ব্যক্তি)`)}</dd>
          </div>
          <div>
            <dt>{t('Self-approval', 'নিজে অনুমোদন')}</dt>
            <dd>
              <StatusPill tone="danger" icon="lock" srPrefix={t('Self-approval:', 'নিজে অনুমোদন:')}>
                {t('Blocked', 'বন্ধ')}
              </StatusPill>
            </dd>
          </div>
        </dl>
      </section>
    </ScreenShell>
  );
}
