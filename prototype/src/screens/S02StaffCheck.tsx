import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { StatusPill } from '../components/StatusPill';
import { Notice } from '../components/Notice';
import { Button } from '../components/Button';
import { useTrip } from '../components/Route';
import { BOOKING_REF, salma, trip } from '../data/demo';
import { useT } from '../i18n/lang';

type Outcome = 'matches' | 'mismatch' | 'not-checked';

export interface S02Props {
  initialOutcome?: Outcome;
  recorded?: boolean;
}

/**
 * Staff check. The traveller's name is always the English name, as on the ticket
 * (railway-decisions.md #31), also in Bangla mode.
 */
export function S02StaffCheck({ initialOutcome, recorded = false }: S02Props) {
  const { bn, t, num, masked } = useT();
  const tr = useTrip();
  const [outcome, setOutcome] = useState<Outcome | undefined>(initialOutcome);
  const [saved, setSaved] = useState(recorded);
  const [error, setError] = useState(false);
  const outcomes: { id: Outcome; label: string; meta: string }[] = [
    { id: 'matches', label: t('ID shown matches the ticket', 'দেখানো পরিচয়পত্র টিকিটের সাথে মিলেছে'), meta: t('Name and photo ID agree with the named traveller', 'নাম ও ছবিসহ পরিচয়পত্র টিকিটের যাত্রীর সাথে মেলে') },
    { id: 'mismatch', label: t("ID doesn't match", 'পরিচয়পত্র মেলেনি'), meta: t('Record an exception. This is not proof of misconduct.', 'ব্যতিক্রম রেকর্ড করুন। এটি অসদাচরণের প্রমাণ নয়।') },
    { id: 'not-checked', label: t("Couldn't check", 'যাচাই করা যায়নি'), meta: t('Recorded as "not checked", never as invalid', '"যাচাই হয়নি" হিসেবে রেকর্ড হয়, কখনো অবৈধ হিসেবে নয়') },
  ];
  const personSr = t('Person check:', 'ব্যক্তি যাচাই:');

  return (
    <ScreenShell
      screenId="S02"
      title={t('Check a ticket', 'টিকিট দেখুন')}
      lede={t(`Staff view · ${trip.train} · Coach ${trip.coach}`, `কর্মীর ভিউ · ${tr.train} · বগি ${tr.coach}`)}
      backLabel={t('Back to coach list', 'বগির তালিকায় ফিরে যান')}
    >
      <section className="card panel panel--system" aria-labelledby="s02-system">
        <div className="card__head">
          <h2 id="s02-system" className="section-title">
            {t('Ticket status', 'টিকিটের অবস্থা')} <span className="panel__tag">{t('System', 'সিস্টেম')}</span>
          </h2>
          <StatusPill tone="success" srPrefix={t('Ticket status:', 'টিকিটের অবস্থা:')}>
            {t('Active', 'সক্রিয়')}
          </StatusPill>
        </div>
        <dl className="kv">
          <div>
            <dt>{t('Booking', 'বুকিং')}</dt>
            <dd className="mono">{BOOKING_REF}</dd>
          </div>
          <div>
            <dt>
              {t('Traveller', 'যাত্রী')} {bn ? null : <span lang="bn">· যাত্রী</span>}
            </dt>
            <dd>
              <span lang="en">{salma.name}</span> · {t('NID', 'এনআইডি')} {masked(salma.idLast4)}
            </dd>
          </div>
          <div>
            <dt>{t('Journey', 'যাত্রা')}</dt>
            <dd>
              {bn ? `${trip.from.nameBn} → ${trip.to.nameBn}` : `${trip.from.code} → ${trip.to.code}`} · {tr.date} · {t('Seat', 'আসন')}{' '}
              <span className="mono">{`${tr.coach}-${num(salma.seat ?? '')}`}</span>
            </dd>
          </div>
          <div>
            <dt>{t('QR signature', 'QR স্বাক্ষর')}</dt>
            <dd>{t('Valid · checked against ticket status 07:42 (cached)', `বৈধ · টিকিটের অবস্থার সাথে মেলানো হয়েছে ${num('07:42')} (ক্যাশ করা)`)}</dd>
          </div>
          <div>
            <dt>{t('Identity record', 'পরিচয়ের রেকর্ড')}</dt>
            <dd>{t('NID record matched at booking', 'বুকিংয়ের সময় এনআইডি রেকর্ড মিলেছে')}</dd>
          </div>
        </dl>
        <p className="small-note">{t('A QR shows the ticket is genuine. It does not prove who is holding it.', 'QR দেখায় টিকিটটি আসল। কে এটি বহন করছেন তা প্রমাণ করে না।')}</p>
      </section>

      <section className="card panel panel--staff" aria-labelledby="s02-person">
        <div className="card__head">
          <h2 id="s02-person" className="section-title">
            {t('Person check', 'ব্যক্তি যাচাই')} <span className="panel__tag">{t('Staff', 'কর্মী')}</span>
          </h2>
          {saved && outcome ? (
            <StatusPill tone={outcome === 'matches' ? 'success' : outcome === 'mismatch' ? 'warning' : 'neutral'} srPrefix={personSr}>
              {t('Recorded', 'রেকর্ড হয়েছে')}
            </StatusPill>
          ) : (
            <StatusPill tone="neutral" srPrefix={personSr}>
              {t('To check', 'যাচাই বাকি')}
            </StatusPill>
          )}
        </div>
        <fieldset className="radio-cards radio-cards--flat" disabled={saved} aria-describedby={error ? 's02-error' : undefined}>
          <legend className="sub-title">{t('Result of ID check by staff', 'কর্মীর পরিচয়পত্র দেখার ফল')}</legend>
          {error ? (
            <p className="field__error" id="s02-error">
              <span className="visually-hidden">{t('Error: ', 'ত্রুটি: ')}</span>
              {t('Choose a result before recording.', 'রেকর্ড করার আগে একটি ফল বেছে নিন।')}
            </p>
          ) : null}
          {outcomes.map((o) => (
            <label key={o.id} className={`radio-card ${outcome === o.id ? 'is-checked' : ''}`}>
              <input
                type="radio"
                name="outcome"
                value={o.id}
                checked={outcome === o.id}
                onChange={() => {
                  setOutcome(o.id);
                  setError(false);
                }}
              />
              <span className="radio-card__main">
                <span className="radio-card__title">{o.label}</span>
                <span className="radio-card__meta">{o.meta}</span>
              </span>
            </label>
          ))}
        </fieldset>
        {saved ? (
          <Notice tone="success" title={t('Person check recorded', 'ব্যক্তি যাচাই রেকর্ড হয়েছে')}>
            {t('Saved separately from the ticket status, which is unchanged. Syncs when the device is online.', 'টিকিটের অবস্থা থেকে আলাদাভাবে সংরক্ষিত, টিকিটের অবস্থা বদলায়নি। ডিভাইস অনলাইনে এলে সিঙ্ক হবে।')}
          </Notice>
        ) : (
          <Button
            block
            onClick={() => {
              if (!outcome) {
                setError(true);
                return;
              }
              setSaved(true);
            }}
          >
            {t('Record person check', 'ব্যক্তি যাচাই রেকর্ড করুন')}
          </Button>
        )}
      </section>
    </ScreenShell>
  );
}
