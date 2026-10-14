import { useRef, useState, type FormEvent } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { useTrip } from '../components/Route';
import { toBnDigits, useT, type Lang } from '../i18n/lang';

type Phase = 'edit' | 'checking' | 'matched';

interface Values {
  name: string;
  dob: string;
  nid: string;
}
type Errors = Partial<Record<keyof Values, string>>;

export function validate(v: Values, lang: Lang = 'en'): Errors {
  const bn = lang === 'bn';
  const e: Errors = {};
  if (!v.name.trim()) e.name = bn ? 'এনআইডিতে যেভাবে লেখা আছে ঠিক সেভাবে পুরো নাম লিখুন।' : 'Enter the full name exactly as it appears on the NID.';
  if (!v.dob) e.dob = bn ? 'এনআইডিতে যেভাবে আছে সেভাবে জন্মতারিখ দিন।' : 'Enter the date of birth as it appears on the NID.';
  const digits = v.nid.replace(/\s/g, '');
  if (!digits) e.nid = bn ? 'এনআইডি নম্বর লিখুন।' : 'Enter the NID number.';
  else if (!/^\d+$/.test(digits)) e.nid = bn ? 'এনআইডি নম্বরে শুধু ০–৯ অঙ্ক থাকতে পারে।' : 'NID number can only contain digits 0–9.';
  else if (digits.length !== 10 && digits.length !== 17)
    e.nid = bn
      ? `এনআইডি নম্বর ১০ বা ১৭ অঙ্কের হতে হবে। আপনি ${toBnDigits(String(digits.length))}টি অঙ্ক দিয়েছেন।`
      : `NID number must be 10 or 17 digits. You entered ${digits.length}.`;
  return e;
}

const maskNid = (nid: string) => `${'•'.repeat(Math.max(0, nid.length - 4))}${nid.slice(-4)}`;

export interface F04aProps {
  initial?: Partial<Values>;
  initialPhase?: Phase;
  /** Show validation errors immediately (story state). */
  showErrors?: boolean;
  /** Start with the NID already masked. */
  nidMasked?: boolean;
}

export function F04aAddTraveller({ initial, initialPhase = 'edit', showErrors = false, nidMasked = false }: F04aProps) {
  const { lang, bn, t, num } = useT();
  const tr = useTrip();
  const [values, setValues] = useState<Values>({ name: '', dob: '', nid: '', ...initial });
  const [errors, setErrors] = useState<Errors>(() => (showErrors ? validate({ name: '', dob: '', nid: '', ...initial }, lang) : {}));
  const [masked, setMasked] = useState(nidMasked);
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er = validate(values, lang);
    setErrors(er);
    if (Object.keys(er).length) {
      setMasked(false);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setMasked(true);
    setPhase('checking');
    setTimeout(() => setPhase('matched'), 900);
  };

  const errorList = (Object.entries(errors) as [keyof Values, string | undefined][]).filter(([, m]) => m);
  const fieldIds: Record<keyof Values, string> = { name: 'f04-name', dob: 'f04-dob', nid: 'f04-nid' };

  return (
    <ScreenShell
      screenId="F04a"
      title={t('Add traveller', 'যাত্রী যোগ করুন')}
      titleBn="যাত্রী যোগ করুন"
      lede={t('Adult with a National ID (NID). Enter details exactly as printed on the NID.', 'জাতীয় পরিচয়পত্র (এনআইডি) আছে এমন প্রাপ্তবয়স্ক। এনআইডিতে যেভাবে ছাপা আছে ঠিক সেভাবে তথ্য দিন।')}
      backLabel={t('Back to travellers', 'যাত্রীদের তালিকায় ফিরে যান')}
    >
      {errorList.length ? (
        <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef} aria-labelledby="f04-errs">
          <h2 id="f04-errs" className="error-summary__title">
            <Icon name="danger" /> {bn ? `${num(errorList.length)}টি সমস্যা ঠিক করুন` : `Fix ${errorList.length} ${errorList.length === 1 ? 'problem' : 'problems'}`}
          </h2>
          <ul>
            {errorList.map(([k, m]) => (
              <li key={k}>
                <a href={`#${fieldIds[k]}`}>{m}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form className="card form" onSubmit={submit} noValidate aria-labelledby="f04-form-title">
        <h2 id="f04-form-title" className="section-title">
          {t('Traveller details', 'যাত্রীর তথ্য')}
        </h2>
        <Field
          id={fieldIds.name}
          label={t('Full name as on NID', 'এনআইডি অনুযায়ী পুরো নাম')}
          hint={t('English letters, as printed on the card', 'কার্ডে যেমন ছাপা আছে, ইংরেজি অক্ষরে (টিকিটে এই নাম থাকবে)')}
          autoComplete="off"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
          readOnly={phase !== 'edit'}
        />
        <Field
          id={fieldIds.dob}
          label={t('Date of birth as on NID', 'এনআইডি অনুযায়ী জন্মতারিখ')}
          type="date"
          value={values.dob}
          onChange={set('dob')}
          error={errors.dob}
          readOnly={phase !== 'edit'}
        />
        {masked ? (
          <div className="field">
            <p className="field__label" id="f04-nid-label">
              {t('NID number', 'এনআইডি নম্বর')}
            </p>
            <div className="masked-value">
              <span className="mono">
                <span aria-hidden="true">{num(maskNid(values.nid.replace(/\s/g, '')))}</span>
                <span className="visually-hidden">{t(`ending in ${values.nid.slice(-4)} (hidden)`, `শেষ অঙ্ক ${num(values.nid.slice(-4))} (লুকানো)`)}</span>
              </span>
              {phase === 'edit' ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMasked(false);
                    requestAnimationFrame(() => document.getElementById(fieldIds.nid)?.focus());
                  }}
                >
                  {t('Change NID', 'এনআইডি বদলান')}
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <Field
            id={fieldIds.nid}
            label={t('NID number', 'এনআইডি নম্বর')}
            hint={t('10 or 17 digits. Hidden after you leave the field.', '১০ বা ১৭ অঙ্ক। ঘর ছেড়ে গেলে লুকিয়ে যাবে।')}
            inputMode="numeric"
            autoComplete="off"
            value={values.nid}
            onChange={set('nid')}
            onBlur={() => {
              const er = validate(values, lang).nid;
              if (!er) setMasked(true);
            }}
            error={errors.nid}
          />
        )}

        {phase === 'edit' ? (
          <Button type="submit" block>
            {t('Check NID record', 'এনআইডি রেকর্ড মিলিয়ে দেখুন')}
          </Button>
        ) : null}
        {phase === 'checking' ? (
          <Button block loading loadingLabel={t('Checking NID record…', 'এনআইডি রেকর্ড মেলানো হচ্ছে…')}>
            {t('Check NID record', 'এনআইডি রেকর্ড মিলিয়ে দেখুন')}
          </Button>
        ) : null}
      </form>

      {phase === 'matched' ? (
        <section className="card" aria-labelledby="f04-result">
          <h2 id="f04-result" className="section-title">
            {t('Record check', 'রেকর্ড মেলানো')}
          </h2>
          <Notice tone="success" title={t('NID record matched', 'এনআইডি রেকর্ড মিলেছে')}>
            {t('The name and date of birth match the NID record (simulated). This is a record match, not a check of the person — staff may still check ID on board.', 'নাম ও জন্মতারিখ এনআইডি রেকর্ডের সাথে মিলেছে (সিমুলেটেড)। এটি রেকর্ডের মিল, ব্যক্তির যাচাই নয় — ট্রেনে কর্মীরা এখনও পরিচয়পত্র দেখতে পারেন।')}
          </Notice>
          <ul className="checklist">
            <li>
              <StatusPill tone="success">{t('Name matches', 'নাম মিলেছে')}</StatusPill>
            </li>
            <li>
              <StatusPill tone="success">{t('Date of birth matches', 'জন্মতারিখ মিলেছে')}</StatusPill>
            </li>
            <li>
              <StatusPill tone="success">{t(`No other active ticket on ${tr.train}`, `${tr.train}-এ অন্য কোনো সক্রিয় টিকিট নেই`)}</StatusPill>
            </li>
          </ul>
          <Button block iconAfter="arrow-right">
            {t('Save traveller', 'যাত্রী সংরক্ষণ করুন')}
          </Button>
        </section>
      ) : null}
    </ScreenShell>
  );
}
