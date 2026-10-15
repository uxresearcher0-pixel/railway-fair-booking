import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { useActionFocus } from '../components/useActionFocus';
import { SMS_DEMO } from '../data/demo';
import { buildState, caseTimeline, type CaseStage } from '../sms/engine';
import { useT } from '../i18n/lang';

/** The case the SMS demo creates (SM07): the app shows the same case, never a second one. */
export const smsCase = () => buildState('SM07').cases[0];

export interface R3cV2Props {
  /** Where the review is (proposed stages). */
  stage?: CaseStage;
  /** Show the "Add evidence" demo message on load (stories). */
  initialEvidence?: boolean;
  focusHeading?: boolean;
}

/**
 * R3c·v2 Your report in the app: case OC-2207, source SMS. The same case as the SMS conversation
 * (SMS and app never create duplicate cases), with the status timeline, optional evidence and
 * "Ticket stays valid". Reports are leads, not proof.
 */
export function R3cV2CaseInApp({ stage = 'review', initialEvidence = false, focusHeading }: R3cV2Props) {
  const { t, num, taka } = useT();
  const c = smsCase();
  const [evidence, setEvidence] = useState(initialEvidence);
  const { ref, acted } = useActionFocus([evidence]);
  const steps = caseTimeline(stage);

  return (
    <ScreenShell
      screenId="R3c·v2"
      title={t(`Report ${c.ref}`, `অভিযোগ ${c.ref}`)}
      lede={t(`Booking ${c.booking} · reported by SMS`, `বুকিং ${c.booking} · SMS-এ জানানো`)}
      focusHeading={focusHeading}
      footer={
        <div className="footer-stack">
          <Button
            block
            icon="plus"
            onClick={() => {
              acted();
              setEvidence(true);
            }}
          >
            {t('Add evidence (optional)', 'প্রমাণ যোগ করুন (ঐচ্ছিক)')}
          </Button>
          <a className="btn btn--ghost btn--block" href="#/sms">
            {t('View the SMS conversation', 'SMS কথোপকথন দেখুন')}
          </a>
        </div>
      }
    >
      <Notice tone="success" live="off" title={t('Ticket stays valid', 'টিকিট বৈধ থাকে')}>
        {t('Reporting never cancels a valid ticket. Other ticket rules still apply.', 'অভিযোগ করলে বৈধ টিকিট কখনো বাতিল হয় না। টিকিটের অন্য নিয়ম প্রযোজ্য।')}
      </Notice>

      <div ref={ref} tabIndex={-1} className="focus-target">
        {evidence ? (
          <Notice tone="info" title={t('Secure upload isn’t part of this prototype (demo)', 'নিরাপদ আপলোড এই প্রোটোটাইপে নেই (ডেমো)')}>
            {t('Nothing was uploaded. Evidence is optional: you can also show it at any counter.', 'কিছু আপলোড হয়নি। প্রমাণ ঐচ্ছিক: যেকোনো কাউন্টারেও দেখাতে পারেন।')}
          </Notice>
        ) : null}
      </div>

      <section className="card" aria-labelledby="r3c-case">
        <h2 id="r3c-case" className="section-title">
          {t('Your report', 'আপনার অভিযোগ')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Source', 'উৎস')}</dt>
            <dd>
              <StatusPill tone="info" icon="send">
                SMS
              </StatusPill>
            </dd>
          </div>
          <div>
            <dt>{t('Reported total', 'আপনার জানানো মোট')}</dt>
            <dd className="mono">{taka(c.amount)}</dd>
          </div>
          <div>
            <dt>{t('Official total', 'অফিসিয়াল মোট')}</dt>
            <dd className="mono">{taka(c.total)}</dd>
          </div>
          <div>
            <dt>{t('Reported excess', 'বাড়তি টাকার অভিযোগ')}</dt>
            <dd className="mono">{taka(c.amount - c.total)}</dd>
          </div>
          <div>
            <dt>{t('Collected by (as reported)', 'কে নিয়েছিলেন (আপনার জানানো)')}</dt>
            <dd>{c.collector ? <span className="mono">{c.collector}</span> : t('Not given', 'জানানো হয়নি')}</dd>
          </div>
          <div>
            <dt>{t('Paid', 'কীভাবে')}</dt>
            <dd>{c.method === 'cash' ? t('Cash', 'নগদ') : t('Digital', 'ডিজিটাল')}</dd>
          </div>
        </dl>
        <p className="small-note">
          {t('One case, whichever way you report: SMS, app or counter. Reporting again doesn’t create a new case.', 'যেভাবেই জানান — SMS, অ্যাপ বা কাউন্টার — কেস একটিই। আবার জানালে নতুন কেস হয় না।')}
        </p>
      </section>

      <section className="card" aria-labelledby="r3c-status">
        <h2 id="r3c-status" className="section-title">
          {t('Status', 'অবস্থা')}
        </h2>
        <ol className="timeline">
          {steps.map((s) => (
            <li key={s.stage} aria-current={s.state === 'current' ? 'step' : undefined}>
              <span>
                {s.state === 'done' ? (
                  <StatusPill tone="success" icon="check">
                    {t('Done', 'হয়েছে')}
                  </StatusPill>
                ) : s.state === 'current' ? (
                  <StatusPill tone="accent" icon="clock">
                    {t('Now', 'এখন')}
                  </StatusPill>
                ) : (
                  <StatusPill tone="neutral" icon="minus">
                    {t('Not yet', 'এখনো নয়')}
                  </StatusPill>
                )}
              </span>
              <span className="timeline__when">
                {t(s.text.en, s.text.bn)}
                {s.stage === 'received' ? <span className="mono"> · {num(c.receivedAt)}</span> : null}
              </span>
              {s.stage === 'info' ? (
                <span className="small-note">{t('Only if the review needs more. Replying is optional.', 'পর্যালোচনায় আরও তথ্য লাগলেই শুধু। উত্তর দেওয়া ঐচ্ছিক।')}</span>
              ) : null}
              {s.stage === 'resolved' ? (
                <span className="small-note">
                  {stage === 'resolved'
                    ? t('Outcome (demo): the review is finished and the reasons are in the app. You can appeal at any counter or in the app.', 'ফলাফল (ডেমো): পর্যালোচনা শেষ, কারণসহ অ্যাপে দেখুন। যেকোনো কাউন্টারে বা অ্যাপে আপিল করতে পারেন।')
                    : t('You get the outcome and how to appeal.', 'আপনি ফলাফল ও আপিলের উপায় জানতে পারবেন।')}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="small-note">
          {t(
            `Timing is proposed: first update within ${SMS_DEMO.firstUpdateDays} working days, not guaranteed.`,
            `সময় প্রস্তাবিত: ${num(SMS_DEMO.firstUpdateDays)} কর্মদিবসের মধ্যে প্রথম হালনাগাদ, নিশ্চিত নয়।`,
          )}
        </p>
      </section>

      <section className="card" aria-labelledby="r3c-evidence">
        <h2 id="r3c-evidence" className="section-title">
          {t('Evidence (optional)', 'প্রমাণ (ঐচ্ছিক)')}
        </h2>
        <p>
          {t(
            'A photo of a receipt or a payment message can help, but you don’t need it. SMS can’t take photos: upload securely here, or show it at any counter.',
            'রসিদ বা পরিশোধের বার্তার ছবি সাহায্য করতে পারে, তবে লাগবেই এমন নয়। SMS-এ ছবি পাঠানো যায় না: এখানে নিরাপদে আপলোড করুন, বা যেকোনো কাউন্টারে দেখান।',
          )}
        </p>
      </section>

      <Notice tone="info" live="off" title={t('A report is a lead, not proof', 'অভিযোগ একটি সূত্র, প্রমাণ নয়')}>
        {t(
          'An independent team reviews it. Nobody is penalised automatically, and there is no promise of money back before a decision. Who sees it: you, the reviewer, and a counter only if it helped you report.',
          'একটি স্বাধীন দল এটি পর্যালোচনা করে। কাউকে স্বয়ংক্রিয়ভাবে শাস্তি দেওয়া হয় না, সিদ্ধান্তের আগে টাকা ফেরতের প্রতিশ্রুতিও নেই। কে দেখেন: আপনি, পর্যালোচক, আর কাউন্টার শুধু যদি সেখান থেকে অভিযোগ করা হয়।',
        )}
      </Notice>
    </ScreenShell>
  );
}
