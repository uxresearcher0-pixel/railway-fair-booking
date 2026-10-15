import { useState, type FormEvent } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { Code } from '../components/Code';
import { useActionFocus } from '../components/useActionFocus';
import { AUDIT_LOOKUP, DRAW_AUDIT, evening } from '../data/demo';
import { useT } from '../i18n/lang';

const BN = '০১২৩৪৫৬৭৮৯';
/** Normalise an application number: trim, upper case, Bangla digits → Western. */
export const normaliseApplication = (s: string) => s.trim().toUpperCase().replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));

type Result = { kind: 'found'; ref: string; picked: boolean; place: number } | { kind: 'missing'; ref: string };

export interface PA1v2Props {
  initialQuery?: string;
  focusHeading?: boolean;
}

/**
 * PA1·v2 Public draw audit. Frozen inputs, snapshot fingerprint, random source, result and an
 * independent replay. No names, NID or phone numbers. Anyone can check their own application number.
 */
export function PA1v2DrawAudit({ initialQuery = '', focusHeading }: PA1v2Props) {
  const { t, num } = useT();
  const a = DRAW_AUDIT;
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<Result>();
  const { ref, acted } = useActionFocus([result]);

  const check = (e: FormEvent) => {
    e.preventDefault();
    const q = normaliseApplication(query);
    if (!q) {
      setError(true);
      setResult(undefined);
      document.getElementById('pa1-number')?.focus();
      return;
    }
    setError(false);
    acted();
    const hit = AUDIT_LOOKUP[q];
    setResult(hit ? { kind: 'found', ref: q, ...hit } : { kind: 'missing', ref: q });
  };

  return (
    <ScreenShell
      screenId="PA1·v2"
      title={t('Draw audit', 'ড্র অডিট')}
      lede={
        <>
          {t('Public', 'পাবলিক')} · <span className="mono">{a.id}</span> ·{' '}
          {t(`Train ${evening.number} · ${evening.date}`, `ট্রেন ${num(evening.number)} · ${evening.dateBn}`)}
        </>
      }
      focusHeading={focusHeading}
    >
      <p>
        <StatusPill tone="success" icon="check" srPrefix={t('Audit:', 'অডিট:')}>
          {t('Replay matches', 'পুনরায় চালানোর ফল মিলেছে')}
        </StatusPill>
      </p>

      <section className="card" aria-labelledby="pa1-before">
        <h2 id="pa1-before" className="section-title">
          {t(`Before the draw (${a.frozenAt})`, `ড্র-এর আগে (${num(a.frozenAt)})`)}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Applications frozen', 'স্থির করা আবেদন')}</dt>
            <dd className="mono">{num(a.applications.toLocaleString('en-US'))}</dd>
          </div>
          <div>
            <dt>{t('Seats in this pool', 'এই পুলে আসন')}</dt>
            <dd>{t(`${a.seats} · ${evening.classCode} · ${evening.number}`, `${num(a.seats)} · ${evening.classBn} · ${num(evening.number)}`)}</dd>
          </div>
          <div>
            <dt>{t('Snapshot fingerprint', 'স্ন্যাপশটের ফিঙ্গারপ্রিন্ট')}</dt>
            <dd>
              <Code>{a.fingerprint}</Code>
            </dd>
          </div>
          <div>
            <dt>{t('Random number from', 'দৈব সংখ্যার উৎস')}</dt>
            <dd>{t(`Public beacon · ${a.beacon}`, `পাবলিক বিকন · ${num(a.beacon)}`)}</dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="pa1-result">
        <h2 id="pa1-result" className="section-title">
          {t('Result', 'ফল')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Picked', 'নির্বাচিত')}</dt>
            <dd>{t(`${a.picked} applications · ${a.seats} seats`, `${num(a.picked)}টি আবেদন · ${num(a.seats)}টি আসন`)}</dd>
          </div>
          <div>
            <dt>{t('Waiting list', 'অপেক্ষমাণ তালিকা')}</dt>
            <dd>{t(`${a.waiting.toLocaleString('en-US')} in draw order`, `${num(a.waiting.toLocaleString('en-US'))}টি ড্র-এর ক্রমে`)}</dd>
          </div>
          <div>
            <dt>{t('Independent replay', 'স্বাধীনভাবে পুনরায় চালানো')}</dt>
            <dd>{t(`Matches · ${a.replay}`, `মিলেছে · ${num(a.replay)}`)}</dd>
          </div>
        </dl>
        <p className="small-note">
          {t(
            'No names, NID or phone numbers are shown. Anyone with an application number can check their own place.',
            'কোনো নাম, এনআইডি বা ফোন নম্বর দেখানো হয় না। আবেদন নম্বর থাকলে যে কেউ নিজের স্থান দেখতে পারেন।',
          )}
        </p>
      </section>

      <form className="card form" onSubmit={check} noValidate aria-labelledby="pa1-check">
        <h2 id="pa1-check" className="section-title">
          {t('Check my application number', 'আমার আবেদন নম্বর দেখুন')}
        </h2>
        <Field
          id="pa1-number"
          label={t('Application number', 'আবেদন নম্বর')}
          hint={
            <>
              {t('As on your receipt or SMS, for example', 'রসিদ বা SMS-এ যেমন আছে, যেমন')} <span className="mono">AP-0388-2C</span>
            </>
          }
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          error={error ? t('Enter your application number.', 'আপনার আবেদন নম্বর লিখুন।') : undefined}
        />
        <div>
          <Button type="submit" variant="secondary" icon="arrow-right">
            {t('Check', 'দেখুন')}
          </Button>
        </div>
        <div ref={ref} tabIndex={-1} className="focus-target">
          {result?.kind === 'found' ? (
            <Notice
              tone={result.picked ? 'success' : 'info'}
              title={
                <>
                  <Code>{result.ref}</Code> · {result.picked ? t('Picked', 'নির্বাচিত') : t('Waiting list', 'অপেক্ষমাণ তালিকা')}
                </>
              }
            >
              {t(`Place #${result.place} in draw order (demo).`, `ড্র-এর ক্রমে স্থান #${num(result.place)} (ডেমো)।`)}
            </Notice>
          ) : null}
          {result?.kind === 'missing' ? (
            <Notice
              tone="warning"
              title={
                <>
                  <Code>{result.ref}</Code> {t('isn’t in this draw', 'এই ড্র-এ নেই')}
                </>
              }
            >
              {t('Check the number on your receipt or SMS. Each draw has its own audit page.', 'রসিদ বা SMS-এ নম্বরটি মিলিয়ে দেখুন। প্রতিটি ড্র-এর আলাদা অডিট পেজ আছে।')}
            </Notice>
          ) : null}
        </div>
      </form>
    </ScreenShell>
  );
}
