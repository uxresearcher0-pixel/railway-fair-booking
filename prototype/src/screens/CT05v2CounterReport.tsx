import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { useActionFocus } from '../components/useActionFocus';
import { AGENT_ID, BOOKING_REF, COUNTER_DESK, FARE, REPORT_REF, SERVICE_CHARGE, abdul } from '../data/demo';
import { officialTotal } from './P10v2OfficialTotal';
import { parseTaka } from './R3v2ReportCharge';
import { useT } from '../i18n/lang';

type Phase = 'form' | 'filed';
type Method = 'cash' | 'digital';

export interface CT05v2Props {
  initialPhase?: Phase;
  initialAmount?: string;
  initialCollector?: string;
  initialMethod?: Method;
  /** Show the validation errors on load (stories). */
  showErrors?: boolean;
  /** Show the "sent to the printer" demo message on load (stories). */
  initialPrinted?: boolean;
  focusHeading?: boolean;
}

/**
 * CT05·v2 Counter-assisted report (staff). For a passenger with no phone or lost access: counter staff
 * file the extra-charge report for them and print an itemised receipt. Case OC-2207, channel Counter.
 * One case per report whichever channel is used. Staff screen: names stay in English (decision #31).
 */
export function CT05v2CounterReport({
  initialPhase = 'form',
  initialAmount = '',
  initialCollector = '',
  initialMethod,
  showErrors = false,
  initialPrinted = false,
  focusHeading,
}: CT05v2Props) {
  const { t, num, taka, masked } = useT();
  const { n, fare, charge, fee, total } = officialTotal();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [amount, setAmount] = useState(initialAmount);
  const [collector, setCollector] = useState(initialCollector);
  const [method, setMethod] = useState<Method | undefined>(initialMethod);
  const [submitted, setSubmitted] = useState(showErrors);
  const [printed, setPrinted] = useState(initialPrinted);
  const filedRef = useRef<HTMLDivElement>(null);
  const { ref: printRef, acted } = useActionFocus([printed]);
  useEffect(() => {
    if (phase === 'filed' && initialPhase !== 'filed') filedRef.current?.focus();
  }, [phase, initialPhase]);

  const paid = parseTaka(amount);
  const amountError = !submitted
    ? undefined
    : amount.trim() === ''
      ? t('Enter the total the passenger paid, in taka.', 'যাত্রী মোট কত টাকা দিয়েছেন তা লিখুন।')
      : Number.isNaN(paid)
        ? t('Use numbers only, for example 2500.', 'শুধু সংখ্যা লিখুন, যেমন ২৫০০।')
        : paid <= total
          ? t(`That is not more than the official total ${taka(total)}.`, `এটি অফিসিয়াল মোট ${taka(total)}-এর বেশি নয়।`)
          : undefined;
  const methodError = submitted && !method ? t('Choose how the passenger paid the extra.', 'যাত্রী বাড়তি টাকা কীভাবে দিয়েছেন তা বেছে নিন।') : undefined;

  const file = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (amount.trim() === '' || Number.isNaN(paid) || paid <= total) {
      document.getElementById('ct05-amount')?.focus();
      return;
    }
    if (!method) {
      document.getElementById('ct05-method-cash')?.focus();
      return;
    }
    setPhase('filed');
  };

  const filed = phase === 'filed';
  const excess = !Number.isNaN(paid) && paid > total ? paid - total : 0;

  return (
    <ScreenShell
      screenId="CT05·v2"
      title={t('Counter-assisted report', 'কাউন্টারে সহায়তায় অভিযোগ')}
      lede={t(`Booking ${BOOKING_REF} · passenger with no phone or lost access`, `বুকিং ${BOOKING_REF} · যাত্রীর ফোন নেই বা প্রবেশ হারিয়েছেন`)}
      focusHeading={focusHeading}
      footer={
        filed ? (
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
        ) : (
          <Button block type="submit" form="ct05-form" icon="send">
            {t('File report for the passenger', 'যাত্রীর পক্ষে অভিযোগ জমা দিন')}
          </Button>
        )
      }
    >
      <p className="staff-context">
        <span>
          {t('Counter', 'কাউন্টার')} <span className="mono">{COUNTER_DESK.id}</span> · {t(COUNTER_DESK.station, COUNTER_DESK.stationBn)}
        </span>
        <span>
          {t('Staff', 'কর্মী')} <span className="mono">{num(COUNTER_DESK.staff)}</span>
        </span>
      </p>

      <Notice tone="info" live="off" title={t('You file it; the passenger decides', 'আপনি জমা দেন; সিদ্ধান্ত যাত্রীর')}>
        {t(
          'Write down what the passenger tells you. Never ask for a PIN, password or OTP. The ticket stays valid, and the agent is not told who reported.',
          'যাত্রী যা বলেন তা লিখুন। কখনো পিন, পাসওয়ার্ড বা OTP চাইবেন না। টিকিট বৈধ থাকে, আর কে অভিযোগ করেছেন তা এজেন্টকে জানানো হয় না।',
        )}
      </Notice>

      {filed ? (
        <div ref={filedRef} tabIndex={-1} className="focus-target">
          <Notice tone="success" title={t(`Report filed: case ${REPORT_REF}`, `অভিযোগ জমা হয়েছে: কেস ${REPORT_REF}`)}>
            {t('Channel: counter. Give the passenger the printed receipt with the case reference.', 'চ্যানেল: কাউন্টার। কেস রেফারেন্সসহ প্রিন্ট করা রসিদ যাত্রীকে দিন।')}
          </Notice>
        </div>
      ) : null}
      <div ref={printRef} tabIndex={-1} className="focus-target">
        {printed ? (
          <Notice tone="success" title={t(`Receipt for ${REPORT_REF} sent to the printer (demo)`, `${REPORT_REF}-এর রসিদ প্রিন্টারে পাঠানো হয়েছে (ডেমো)`)} />
        ) : null}
      </div>

      <section className="card" aria-labelledby="ct05-passenger">
        <h2 id="ct05-passenger" className="section-title">
          {t('Passenger and booking', 'যাত্রী ও বুকিং')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Traveller', 'যাত্রী')}</dt>
            <dd>
              <span lang="en">{abdul.name}</span> · {t('NID', 'এনআইডি')} {masked(abdul.idLast4)}
            </dd>
          </div>
          <div>
            <dt>{t('ID check', 'পরিচয় যাচাই')}</dt>
            <dd>
              <StatusPill tone="success" icon="check">
                {t('NID record matched', 'এনআইডি রেকর্ড মিলেছে')}
              </StatusPill>{' '}
              <span className="small-note">{t('ID seen at the counter', 'কাউন্টারে পরিচয়পত্র দেখা হয়েছে')}</span>
            </dd>
          </div>
          <div>
            <dt>{t('Booking', 'বুকিং')}</dt>
            <dd>
              <span className="mono">{BOOKING_REF}</span> · {t(`${n} travellers`, `${num(n)} জন যাত্রী`)}
            </dd>
          </div>
          <div>
            <dt>{t('Phone', 'ফোন')}</dt>
            <dd>{t('None · receipt on paper', 'নেই · কাগজে রসিদ')}</dd>
          </div>
        </dl>
      </section>

      {filed ? (
        <section className="card" aria-labelledby="ct05-receipt">
          <h2 id="ct05-receipt" className="section-title">
            {t('Printed receipt', 'প্রিন্ট করা রসিদ')} · <span className="mono">{REPORT_REF}</span>
          </h2>
          <table className="cost">
            <caption className="visually-hidden">{t(`Itemised receipt for case ${REPORT_REF}`, `কেস ${REPORT_REF}-এর বিস্তারিত রসিদ`)}</caption>
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
                    {num(n)} × {taka(SERVICE_CHARGE)}
                  </span>
                </th>
                <td className="mono">{taka(charge)}</td>
              </tr>
              <tr>
                <th scope="row">
                  {t('Assistance fee', 'সহায়তা ফি')} · <span className="mono">{AGENT_ID}</span>
                  <span className="cost__note">{t('Demo amount, rate to confirm', 'ডেমো পরিমাণ, হার নিশ্চিত হবে')}</span>
                </th>
                <td className="mono">{taka(fee)}</td>
              </tr>
              <tr className="is-plan">
                <th scope="row">{t('Official total', 'অফিসিয়াল মোট')}</th>
                <td className="mono">{taka(total)}</td>
              </tr>
              <tr>
                <th scope="row">{t('Reported total paid', 'জানানো মোট পরিশোধ')}</th>
                <td className="mono">{taka(paid)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">{t('Reported excess', 'বাড়তি টাকার অভিযোগ')}</th>
                <td className="mono">{taka(excess)}</td>
              </tr>
            </tfoot>
          </table>
          <dl className="kv">
            <div>
              <dt>{t('Collected by (as reported)', 'কে নিয়েছিলেন (যাত্রীর জানানো)')}</dt>
              <dd>{collector.trim() ? collector.trim() : t('Not given', 'জানানো হয়নি')}</dd>
            </div>
            <div>
              <dt>{t('Paid', 'কীভাবে')}</dt>
              <dd>{method === 'digital' ? t('Digital', 'ডিজিটাল') : t('Cash', 'নগদ')}</dd>
            </div>
            <div>
              <dt>{t('Ticket', 'টিকিট')}</dt>
              <dd>{t('Stays valid', 'বৈধ থাকে')}</dd>
            </div>
            <div>
              <dt>{t('Follow up', 'খোঁজ নিন')}</dt>
              <dd>{t(`At any counter with this receipt and ID, or in the app with ${REPORT_REF}.`, `এই রসিদ ও পরিচয়পত্র নিয়ে যেকোনো কাউন্টারে, বা অ্যাপে ${REPORT_REF} দিয়ে।`)}</dd>
            </div>
          </dl>
          <p className="small-note">
            {t('A report is a lead, not proof. No automatic penalty, and no promise of money back before a decision.', 'অভিযোগ একটি সূত্র, প্রমাণ নয়। স্বয়ংক্রিয় শাস্তি নেই, সিদ্ধান্তের আগে টাকা ফেরতের প্রতিশ্রুতিও নেই।')}
          </p>
        </section>
      ) : (
        <form id="ct05-form" className="card form" onSubmit={file} noValidate aria-labelledby="ct05-form-title">
          <h2 id="ct05-form-title" className="section-title">
            {t('What the passenger reports', 'যাত্রী যা জানাচ্ছেন')}
          </h2>
          <dl className="kv">
            <div>
              <dt>{t('Official total', 'অফিসিয়াল মোট')}</dt>
              <dd className="mono">{taka(total)}</dd>
            </div>
          </dl>
          <Field
            id="ct05-amount"
            label={t('Total the passenger paid (৳)', 'যাত্রী মোট কত দিয়েছেন (৳)')}
            hint={t('Numbers only. The whole booking, including cash.', 'শুধু সংখ্যা। পুরো বুকিংয়ের, নগদসহ।')}
            inputMode="numeric"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={amountError}
          />
          <p className={excess > 0 ? 'small-note' : 'visually-hidden'} aria-live="polite">
            {excess > 0 ? t(`Reported excess: ${taka(excess)}.`, `বাড়তি টাকার অভিযোগ: ${taka(excess)}।`) : ''}
          </p>
          <Field
            id="ct05-collector"
            label={t('Who collected it (optional)', 'কে নিয়েছিলেন (ঐচ্ছিক)')}
            hint={t('Agent number, name or place, if the passenger knows.', 'যাত্রী জানলে এজেন্ট নম্বর, নাম বা জায়গা।')}
            autoComplete="off"
            value={collector}
            onChange={(e) => setCollector(e.target.value)}
          />
          <fieldset className="radio-cards radio-cards--flat" aria-describedby={methodError ? 'ct05-method-error' : undefined}>
            <legend className="field__label">{t('How was the extra paid?', 'বাড়তি টাকা কীভাবে দেওয়া হয়েছিল?')}</legend>
            {methodError ? (
              <p className="field__error" id="ct05-method-error">
                <span className="visually-hidden">{t('Error: ', 'ত্রুটি: ')}</span>
                {methodError}
              </p>
            ) : null}
            {(
              [
                { id: 'cash', label: t('Cash', 'নগদ') },
                { id: 'digital', label: t('Digital', 'ডিজিটাল') },
              ] as const
            ).map((m) => (
              <label key={m.id} className={`radio-card ${method === m.id ? 'is-checked' : ''}`}>
                <input id={`ct05-method-${m.id}`} type="radio" name="ct05-method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
                <span className="radio-card__main">
                  <span className="radio-card__title">{m.label}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <p className="small-note">
            {t('One case per report: if the passenger already reported by SMS or in the app, this adds to that case.', 'প্রতি অভিযোগে একটি কেস: যাত্রী আগে SMS বা অ্যাপে জানিয়ে থাকলে এটি সেই কেসেই যোগ হয়।')}
          </p>
        </form>
      )}
    </ScreenShell>
  );
}
