import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { Code } from '../components/Code';
import { OpsContext } from '../components/OpsContext';
import { useActionFocus } from '../components/useActionFocus';
import { DRAW_AUDIT } from '../data/demo';
import { useT } from '../i18n/lang';

type Done = 'none' | 'published' | 'downloaded';

export interface OP08v2Props {
  initialDone?: Done;
  focusHeading?: boolean;
}

/**
 * OP08·v2 Draw run and replay (operations, desktop-first). Inputs are frozen and fingerprinted
 * before the random number exists; an independent auditor replays the result. There is no rerun.
 */
export function OP08v2DrawRun({ initialDone = 'none', focusHeading }: OP08v2Props) {
  const { t, num } = useT();
  const [done, setDone] = useState<Done>(initialDone);
  const { ref, acted } = useActionFocus([done]);
  const a = DRAW_AUDIT;
  const n = (v: number) => num(v.toLocaleString('en-US'));
  const act = (d: Done) => {
    acted();
    setDone(d);
  };

  return (
    <ScreenShell
      screenId="OP08·v2"
      title={t('Draw run and replay', 'ড্র চালানো ও পুনরায় চালানো')}
      lede={t(
        'Inputs are frozen and fingerprinted before the random number exists. An independent auditor replays the result.',
        'দৈব সংখ্যা তৈরির আগেই ইনপুট স্থির করে ফিঙ্গারপ্রিন্ট নেওয়া হয়। একজন স্বাধীন অডিটর ফল পুনরায় চালিয়ে দেখেন।',
      )}
      focusHeading={focusHeading}
      footer={
        <div className="footer-stack">
          <Button block icon="send" onClick={() => act('published')}>
            {t('Publish audit page', 'অডিট পেজ প্রকাশ করুন')}
          </Button>
          <Button block variant="secondary" onClick={() => act('downloaded')}>
            {t('Download replay pack', 'পুনরায় চালানোর প্যাক ডাউনলোড করুন')}
          </Button>
        </div>
      }
    >
      <OpsContext code="OP08" />
      <p className="staff-context">
        <span className="mono">{a.id}</span>
        <StatusPill tone="success" icon="check" srPrefix={t('Replay:', 'পুনরায় চালানো:')}>
          {t(`Replay matches · ${a.replay}`, `পুনরায় চালানোর ফল মিলেছে · ${num(a.replay)}`)}
        </StatusPill>
      </p>

      <div ref={ref} tabIndex={-1} className="focus-target">
        {done === 'published' ? (
          <Notice tone="success" title={t(`Audit page for ${a.id} published`, `${a.id}-এর অডিট পেজ প্রকাশিত`)}>
            {t('It shows no names, NID or phone numbers.', 'এতে কোনো নাম, এনআইডি বা ফোন নম্বর দেখানো হয় না।')}{' '}
            <a href="#/pa1v2">{t('Open the public audit page', 'পাবলিক অডিট পেজ খুলুন')}</a>
          </Notice>
        ) : null}
        {done === 'downloaded' ? (
          <Notice tone="success" title={t('Replay pack ready (demo)', 'পুনরায় চালানোর প্যাক তৈরি (ডেমো)')}>
            {t('Frozen inputs, fingerprint, beacon pulse and algorithm version, so anyone can rerun the check.', 'স্থির ইনপুট, ফিঙ্গারপ্রিন্ট, বিকন পালস ও অ্যালগরিদমের সংস্করণ, যাতে যে কেউ যাচাই আবার চালাতে পারেন।')}
          </Notice>
        ) : null}
      </div>

      <section className="card" aria-labelledby="op08-inputs">
        <h2 id="op08-inputs" className="section-title">
          {t(`Inputs frozen at ${a.frozenAt}`, `${num(a.frozenAt)}-এ স্থির করা ইনপুট`)}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Policy version', 'নীতির সংস্করণ')}</dt>
            <dd>
              <Code>{a.policy}</Code> · {t('one application per traveller', 'প্রতি যাত্রী একটি আবেদন')}
            </dd>
          </div>
          <div>
            <dt>{t('Applications', 'আবেদন')}</dt>
            <dd>{t(`${n(a.applications)} · ${a.duplicatesMerged} duplicates merged`, `${n(a.applications)} · ${num(a.duplicatesMerged)}টি ডুপ্লিকেট একীভূত`)}</dd>
          </div>
          <div>
            <dt>{t('Seat snapshot', 'আসনের স্ন্যাপশট')}</dt>
            <dd>
              {t(`${a.seats} seats · fingerprint`, `${num(a.seats)}টি আসন · ফিঙ্গারপ্রিন্ট`)} <Code>{a.fingerprint}</Code>
            </dd>
          </div>
          <div>
            <dt>{t('Committed to', 'জমা হয়েছে')}</dt>
            <dd>{t(`Independent log · ${a.committedAt}`, `স্বাধীন লগ · ${num(a.committedAt)}`)}</dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="op08-run">
        <h2 id="op08-run" className="section-title">
          {t('Run', 'চালানো')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Random source', 'দৈব উৎস')}</dt>
            <dd>{t(`Public beacon · pulse ${a.beacon}`, `পাবলিক বিকন · পালস ${num(a.beacon)}`)}</dd>
          </div>
          <div>
            <dt>{t('Algorithm', 'অ্যালগরিদম')}</dt>
            <dd>
              <Code>{a.algorithm}</Code> · {t('published', 'প্রকাশিত')}
            </dd>
          </div>
          <div>
            <dt>{t('Result', 'ফল')}</dt>
            <dd>{t(`${a.picked} picked · ${n(a.waiting)} waiting`, `${num(a.picked)}টি নির্বাচিত · ${n(a.waiting)}টি অপেক্ষমাণ`)}</dd>
          </div>
          <div>
            <dt>{t('Replay by auditor', 'অডিটরের পুনরায় চালানো')}</dt>
            <dd>{t(`Matches · ${a.replay}`, `মিলেছে · ${num(a.replay)}`)}</dd>
          </div>
        </dl>
      </section>

      <Notice tone="warning" live="off" title={t('Reruns are not allowed', 'আবার চালানোর অনুমতি নেই')}>
        {t(
          'A failed run follows the published outage rule. Nobody can rerun a draw to get a different result.',
          'ব্যর্থ রান প্রকাশিত বিভ্রাট-নিয়ম মেনে চলে। ভিন্ন ফল পেতে কেউ ড্র আবার চালাতে পারেন না।',
        )}
      </Notice>

      <section className="card" aria-labelledby="op08-changes">
        <h2 id="op08-changes" className="section-title">
          {t(`Changes after ${a.frozenAt}`, `${num(a.frozenAt)}-এর পর পরিবর্তন`)}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Seat snapshot', 'আসনের স্ন্যাপশট')}</dt>
            <dd>{t('None', 'নেই')}</dd>
          </div>
          <div>
            <dt>{t('Applications', 'আবেদন')}</dt>
            <dd>{t('None', 'নেই')}</dd>
          </div>
          <div>
            <dt>{t('Exceptions', 'ব্যতিক্রম')}</dt>
            <dd className="mono">{num(0)}</dd>
          </div>
        </dl>
      </section>
    </ScreenShell>
  );
}
