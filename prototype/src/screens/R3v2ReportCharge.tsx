import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Notice } from '../components/Notice';
import { BOOKING_REF, REPORT_REF } from '../data/demo';
import { officialTotal } from './P10v2OfficialTotal';
import { useT } from '../i18n/lang';

type Phase = 'form' | 'sending' | 'sent';
type How = 'cash' | 'wallet';

const BN = '০১২৩৪৫৬৭৮৯';
/** Accept Western or Bangla digits, commas and a leading ৳. */
export const parseTaka = (s: string) => {
  const western = s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d))).replace(/[৳,\s]/g, '');
  return /^\d+$/.test(western) ? Number(western) : NaN;
};

export interface R3v2Props {
  initialPhase?: Phase;
  initialAmount?: string;
  initialPaidTo?: string;
  initialHow?: How;
  /** Show the validation errors on load (stories). */
  showErrors?: boolean;
  focusHeading?: boolean;
  onBack?: () => void;
}

/**
 * R3·v2 Report an extra charge (and R3b·v2 reference and what happens next).
 * Private: only the independent review team sees it. Reporting never cancels the ticket.
 */
export function R3v2ReportCharge({ initialPhase = 'form', initialAmount = '', initialPaidTo = '', initialHow, showErrors = false, focusHeading, onBack }: R3v2Props) {
  const { t, taka } = useT();
  const { total } = officialTotal();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [amount, setAmount] = useState(initialAmount);
  const [paidTo, setPaidTo] = useState(initialPaidTo);
  const [how, setHow] = useState<How | undefined>(initialHow);
  const [submitted, setSubmitted] = useState(showErrors);
  const doneRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (phase === 'sent' && initialPhase !== 'sent') doneRef.current?.focus();
  }, [phase, initialPhase]);

  const paid = parseTaka(amount);
  const amountError = !submitted
    ? undefined
    : amount.trim() === ''
      ? t('Enter the amount you paid, in taka.', 'আপনি কত টাকা দিয়েছেন তা লিখুন।')
      : Number.isNaN(paid)
        ? t('Use numbers only, for example 1800.', 'শুধু সংখ্যা লিখুন, যেমন ১৮০০।')
        : undefined;
  const howError = submitted && !how ? t('Choose how you paid.', 'কীভাবে দিয়েছেন তা বেছে নিন।') : undefined;
  const extra = !Number.isNaN(paid) && paid > total ? paid - total : 0;

  const send = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (amount.trim() === '' || Number.isNaN(paid)) {
      document.getElementById('r3-amount')?.focus();
      return;
    }
    if (!how) {
      document.getElementById('r3-how-cash')?.focus();
      return;
    }
    setPhase('sending');
    timer.current = setTimeout(() => setPhase('sent'), 700);
  };

  const sent = phase === 'sent';

  return (
    <ScreenShell
      screenId={sent ? 'R3b·v2' : 'R3·v2'}
      title={sent ? t('Report sent', 'রিপোর্ট পাঠানো হয়েছে') : t('Report an extra charge', 'বাড়তি টাকার অভিযোগ করুন')}
      lede={t(`Booking ${BOOKING_REF}`, `বুকিং ${BOOKING_REF}`)}
      backLabel={t('Back to the official total', 'অফিসিয়াল মোটে ফিরে যান')}
      onBack={onBack}
      focusHeading={focusHeading}
      footer={
        sent ? undefined : (
          <Button block type="submit" form="r3-form" icon="send" loading={phase === 'sending'} loadingLabel={t('Sending…', 'পাঠানো হচ্ছে…')}>
            {t('Send report', 'রিপোর্ট পাঠান')}
          </Button>
        )
      }
    >
      <Notice tone="info" live="off" title={t('Your ticket stays valid. Reporting never cancels it.', 'আপনার টিকিট বৈধ থাকে। রিপোর্ট করলে টিকিট কখনো বাতিল হয় না।')}>
        {t('Who sees this: only the independent review team. The agent or helper is not told who reported.', 'কে দেখবেন: শুধু স্বাধীন পর্যালোচনা দল। কে রিপোর্ট করেছেন তা এজেন্ট বা সাহায্যকারীকে জানানো হয় না।')}
      </Notice>

      {sent ? (
        <div ref={doneRef} tabIndex={-1} className="focus-target">
          <Notice tone="success" title={t(`Reference ${REPORT_REF}`, `রেফারেন্স ${REPORT_REF}`)}>
            {t('Thank you. Keep this reference to follow up at any counter or in the app.', 'ধন্যবাদ। যেকোনো কাউন্টারে বা অ্যাপে খোঁজ নিতে এই রেফারেন্স রাখুন।')}
          </Notice>
        </div>
      ) : null}

      {sent ? (
        <section className="card" aria-labelledby="r3-next">
          <h2 id="r3-next" className="section-title">
            {t('What happens next', 'এরপর কী হবে')}
          </h2>
          <ol className="steps">
            <li>{t('The independent review team reads every report. A report is a lead, not proof: nobody is penalised automatically.', 'স্বাধীন পর্যালোচনা দল প্রতিটি রিপোর্ট পড়েন। রিপোর্ট একটি সূত্র, প্রমাণ নয়: কাউকে স্বয়ংক্রিয়ভাবে শাস্তি দেওয়া হয় না।')}</li>
            <li>{t('Reports about the same agent or helper are reviewed together.', 'একই এজেন্ট বা সাহায্যকারী নিয়ে আসা রিপোর্টগুলো একসাথে দেখা হয়।')}</li>
            <li>{t('You may get one SMS asking for more detail. You never have to reply.', 'আরও তথ্যের জন্য আপনি একটি SMS পেতে পারেন। উত্তর দেওয়া বাধ্যতামূলক নয়।')}</li>
          </ol>
          <dl className="kv">
            <div>
              <dt>{t('Official total', 'অফিসিয়াল মোট')}</dt>
              <dd className="mono">{taka(total)}</dd>
            </div>
            {!Number.isNaN(paid) ? (
              <div>
                <dt>{t('You reported paying', 'আপনি জানিয়েছেন দিয়েছেন')}</dt>
                <dd className="mono">{taka(paid)}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : (
        <form id="r3-form" className="card form" onSubmit={send} noValidate aria-labelledby="r3-form-title">
          <h2 id="r3-form-title" className="section-title">
            {t('What happened', 'কী হয়েছিল')}
          </h2>
          <dl className="kv">
            <div>
              <dt>{t('Official total', 'অফিসিয়াল মোট')}</dt>
              <dd className="mono">{taka(total)}</dd>
            </div>
          </dl>
          <Field
            id="r3-amount"
            label={t('Amount you paid in total (৳)', 'আপনি মোট কত টাকা দিয়েছেন (৳)')}
            hint={t('Numbers only. Include anything paid in cash.', 'শুধু সংখ্যা। নগদে দেওয়া টাকাও যোগ করুন।')}
            inputMode="numeric"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={amountError}
          />
          <p className={extra > 0 ? 'small-note' : 'visually-hidden'} aria-live="polite">
            {extra > 0 ? t(`That is ${taka(extra)} more than the official total.`, `এটি অফিসিয়াল মোটের চেয়ে ${taka(extra)} বেশি।`) : ''}
          </p>
          <Field
            id="r3-paid-to"
            label={t('Paid to (optional)', 'কাকে দিয়েছেন (ঐচ্ছিক)')}
            hint={t('A name, agent number or place, if you know it.', 'জানা থাকলে নাম, এজেন্ট নম্বর বা জায়গা।')}
            autoComplete="off"
            value={paidTo}
            onChange={(e) => setPaidTo(e.target.value)}
          />
          <fieldset className="radio-cards radio-cards--flat" aria-describedby={howError ? 'r3-how-error' : undefined}>
            <legend className="field__label">{t('How did you pay the extra?', 'বাড়তি টাকা কীভাবে দিয়েছেন?')}</legend>
            {howError ? (
              <p className="field__error" id="r3-how-error">
                <span className="visually-hidden">{t('Error: ', 'ত্রুটি: ')}</span>
                {howError}
              </p>
            ) : null}
            {(
              [
                { id: 'cash', label: t('Cash', 'নগদ') },
                { id: 'wallet', label: t('Mobile wallet', 'মোবাইল ওয়ালেট') },
              ] as const
            ).map((m) => (
              <label key={m.id} className={`radio-card ${how === m.id ? 'is-checked' : ''}`}>
                <input id={`r3-how-${m.id}`} type="radio" name="how" value={m.id} checked={how === m.id} onChange={() => setHow(m.id)} />
                <span className="radio-card__main">
                  <span className="radio-card__title">{m.label}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <p className="small-note">{t('Only the amounts, who was paid and how are stored with this report.', 'এই রিপোর্টের সাথে শুধু পরিমাণ, কাকে ও কীভাবে দেওয়া হয়েছে তা রাখা হয়।')}</p>
        </form>
      )}
    </ScreenShell>
  );
}
