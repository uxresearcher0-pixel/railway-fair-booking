import { useRef, useState, type FormEvent } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { trip } from '../data/demo';

type Phase = 'edit' | 'checking' | 'matched';

interface Values {
  name: string;
  dob: string;
  nid: string;
}
type Errors = Partial<Record<keyof Values, string>>;

export function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Enter the full name exactly as it appears on the NID.';
  if (!v.dob) e.dob = 'Enter the date of birth as it appears on the NID.';
  const digits = v.nid.replace(/\s/g, '');
  if (!digits) e.nid = 'Enter the NID number.';
  else if (!/^\d+$/.test(digits)) e.nid = 'NID number can only contain digits 0–9.';
  else if (digits.length !== 10 && digits.length !== 17)
    e.nid = `NID number must be 10 or 17 digits. You entered ${digits.length}.`;
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
  const [values, setValues] = useState<Values>({ name: '', dob: '', nid: '', ...initial });
  const [errors, setErrors] = useState<Errors>(() => (showErrors ? validate({ name: '', dob: '', nid: '', ...initial }) : {}));
  const [masked, setMasked] = useState(nidMasked);
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er = validate(values);
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
      title="Add traveller"
      titleBn="যাত্রী যোগ করুন"
      lede="Adult with a National ID (NID). Enter details exactly as printed on the NID."
      backLabel="Back to travellers"
    >
      {errorList.length ? (
        <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef} aria-labelledby="f04-errs">
          <h2 id="f04-errs" className="error-summary__title">
            <Icon name="danger" /> Fix {errorList.length} {errorList.length === 1 ? 'problem' : 'problems'}
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
          Traveller details
        </h2>
        <Field
          id={fieldIds.name}
          label="Full name as on NID"
          hint="English letters, as printed on the card"
          autoComplete="off"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
          readOnly={phase !== 'edit'}
        />
        <Field
          id={fieldIds.dob}
          label="Date of birth as on NID"
          type="date"
          value={values.dob}
          onChange={set('dob')}
          error={errors.dob}
          readOnly={phase !== 'edit'}
        />
        {masked ? (
          <div className="field">
            <p className="field__label" id="f04-nid-label">
              NID number
            </p>
            <div className="masked-value">
              <span className="mono">
                <span aria-hidden="true">{maskNid(values.nid.replace(/\s/g, ''))}</span>
                <span className="visually-hidden">ending in {values.nid.slice(-4)} (hidden)</span>
              </span>
              {phase === 'edit' ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMasked(false);
                    requestAnimationFrame(() => document.getElementById(fieldIds.nid)?.focus());
                  }}
                >
                  Change NID
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <Field
            id={fieldIds.nid}
            label="NID number"
            hint="10 or 17 digits. Hidden after you leave the field."
            inputMode="numeric"
            autoComplete="off"
            value={values.nid}
            onChange={set('nid')}
            onBlur={() => {
              const er = validate(values).nid;
              if (!er) setMasked(true);
            }}
            error={errors.nid}
          />
        )}

        {phase === 'edit' ? (
          <Button type="submit" block>
            Check NID record
          </Button>
        ) : null}
        {phase === 'checking' ? (
          <Button block loading loadingLabel="Checking NID record…">
            Check NID record
          </Button>
        ) : null}
      </form>

      {phase === 'matched' ? (
        <section className="card" aria-labelledby="f04-result">
          <h2 id="f04-result" className="section-title">
            Record check
          </h2>
          <Notice tone="success" title="NID record matched">
            The name and date of birth match the NID record (simulated). This is a record match, not a check of the
            person — staff may still check ID on board.
          </Notice>
          <ul className="checklist">
            <li>
              <StatusPill tone="success">Name matches</StatusPill>
            </li>
            <li>
              <StatusPill tone="success">Date of birth matches</StatusPill>
            </li>
            <li>
              <StatusPill tone="success">No other active ticket on {trip.train}</StatusPill>
            </li>
          </ul>
          <Button block iconAfter="arrow-right">
            Save traveller
          </Button>
        </section>
      ) : null}
    </ScreenShell>
  );
}
