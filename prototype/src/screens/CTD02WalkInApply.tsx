import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { CounterRail } from '../components/CounterRail';
import { useActionFocus } from '../components/useActionFocus';
import { APPLICATION_REF, DRAW, WALK_IN_APPLICATION, evening, rahim, walkIns } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'form' | 'submitted';

export interface CTD02Props {
  initialPhase?: Phase;
  /** Start with the duplicate example added (Rahim Karim is already in AP-0214-7K). */
  withDuplicate?: boolean;
  focusHeading?: boolean;
}

/**
 * CTD02 · Apply for a walk-in passenger (station counter terminal, desktop-first). Each traveller's
 * ID is checked against the NID record; the duplicate check covers the app, website, counters and
 * agents. Window 08:00–10:00, result at 10:30 by SMS, applying is free. Rules are proposed.
 * Staff screen: names stay in English (decision #31).
 */
export function CTD02WalkInApply({ initialPhase = 'form', withDuplicate = false, focusHeading }: CTD02Props) {
  const { t, num, masked } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [dup, setDup] = useState(withDuplicate);
  const [removed, setRemoved] = useState(false);
  const { ref, acted } = useActionFocus([phase, dup]);
  const count = walkIns.length + (dup ? 1 : 0);
  const done = phase === 'submitted';

  return (
    <ScreenShell
      screenId="CTD02"
      eyebrow={t(
        `${evening.name} · ${evening.date} · window ${DRAW.opens}–${DRAW.closes}`,
        `${evening.nameBn} · ${evening.dateBn} · আবেদনের সময় ${num(DRAW.opens)}–${num(DRAW.closes)}`,
      )}
      title={t('Apply for a walk-in passenger', 'কাউন্টারে আসা যাত্রীর জন্য আবেদন')}
      lede={t(
        'Check each traveller’s ID against the NID record. The duplicate check covers app, website, counter and agents.',
        'প্রত্যেক যাত্রীর পরিচয়পত্র এনআইডি রেকর্ডের সাথে মিলিয়ে দেখুন। ডুপ্লিকেট যাচাই অ্যাপ, ওয়েবসাইট, কাউন্টার ও এজেন্ট সব জায়গা জুড়ে হয়।',
      )}
      rail={<CounterRail current="ctd02" />}
      focusHeading={focusHeading}
    >
      <div className="split">
        <div className="split__main">
          <section className="card" aria-labelledby="ctd02-travellers">
            <h2 id="ctd02-travellers" className="card__eyebrow">
              {t('Travellers', 'যাত্রী')}
            </h2>
            <ul className="people">
              {walkIns.map((w) => (
                <li key={w.id}>
                  <span className="people__name">
                    <span lang="en">{w.name}</span> · {t('adult', 'প্রাপ্তবয়স্ক')}
                  </span>
                  <span className="people__meta">
                    {t('NID', 'এনআইডি')} {masked(w.idLast4)} ·{' '}
                    <StatusPill tone="success" icon="check">
                      {t('NID record matched', 'এনআইডি রেকর্ড মিলেছে')}
                    </StatusPill>
                  </span>
                </li>
              ))}
              {dup ? (
                <li>
                  <span className="people__name">
                    <span lang="en">{rahim.name}</span> · {t('adult', 'প্রাপ্তবয়স্ক')}
                  </span>
                  <span className="people__meta">
                    {t('NID', 'এনআইডি')} {masked(rahim.idLast4)} ·{' '}
                    <StatusPill tone="warning" icon="warning">
                      {t('Already in', 'আগে থেকেই আছেন:')} <span lang="en">{APPLICATION_REF}</span>
                    </StatusPill>
                  </span>
                </li>
              ) : null}
            </ul>
            {!done && !dup ? (
              <p>
                <Button
                  variant="secondary"
                  icon="plus"
                  onClick={() => {
                    acted();
                    setRemoved(false);
                    setDup(true);
                  }}
                >
                  {t('Add traveller (demo: a duplicate)', 'যাত্রী যোগ করুন (ডেমো: ডুপ্লিকেট)')}
                </Button>
              </p>
            ) : null}
          </section>

          <div ref={ref} tabIndex={-1} className="focus-target">
            {dup ? (
              <Notice
                tone="warning"
                title={t(`${rahim.name} is already in application ${APPLICATION_REF}`, `${rahim.name} আগে থেকেই আবেদন ${APPLICATION_REF}-এ আছেন`)}
                actions={
                  done ? undefined : (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        acted();
                        setDup(false);
                        setRemoved(true);
                      }}
                    >
                      {t(`Remove ${rahim.name} from this application`, `এই আবেদন থেকে ${rahim.name}-কে বাদ দিন`)}
                    </Button>
                  )
                }
              >
                {t(
                  'It was made in the app. One application per traveller: remove them there first, or apply without them.',
                  'আবেদনটি অ্যাপে করা হয়েছে। প্রতি যাত্রীর একটি আবেদন: আগে সেখান থেকে বাদ দিন, নয়তো তাঁকে ছাড়া আবেদন করুন।',
                )}
              </Notice>
            ) : null}
            {removed && !dup && !done ? (
              <Notice tone="success" title={t(`${rahim.name} removed from this application`, `${rahim.name}-কে এই আবেদন থেকে বাদ দেওয়া হয়েছে`)}>
                {t(`You can now apply for ${count} travellers.`, `এখন ${num(count)} জন যাত্রীর জন্য আবেদন করতে পারেন।`)}
              </Notice>
            ) : null}
            {done ? (
              <Notice tone="success" title={t(`Application ${WALK_IN_APPLICATION} received · receipt printed (demo)`, `আবেদন ${WALK_IN_APPLICATION} গ্রহণ করা হয়েছে · রসিদ প্রিন্ট হয়েছে (ডেমো)`)}>
                {t(
                  `${count} travellers, party locked. The result comes at ${DRAW.result} by SMS to each adult traveller’s own phone. No fee was charged.`,
                  `${num(count)} জন যাত্রী, দল লক। ফলাফল ${num(DRAW.result)}-এ প্রত্যেক প্রাপ্তবয়স্ক যাত্রীর নিজের ফোনে SMS-এ আসবে। কোনো ফি নেওয়া হয়নি।`,
                )}
              </Notice>
            ) : null}
          </div>

          {!dup ? (
            <Notice tone="warning" live="off" title={t('Duplicate check (example)', 'ডুপ্লিকেট যাচাই (উদাহরণ)')}>
              {t(
                'If a traveller is already in another application for this train, the system shows where it was made. Remove them there first.',
                'কোনো যাত্রী এই ট্রেনের অন্য আবেদনে আগে থেকে থাকলে সিস্টেম দেখায় সেটি কোথায় করা হয়েছে। আগে সেখান থেকে বাদ দিন।',
              )}
            </Notice>
          ) : null}
        </div>

        <div className="split__side">
          <section className="card" aria-labelledby="ctd02-application">
            <h2 id="ctd02-application" className="card__eyebrow">
              {t('Application', 'আবেদন')}
            </h2>
            <dl className="rows">
              <div>
                <dt>{t('Window', 'আবেদনের সময়')}</dt>
                <dd>
                  {num(DRAW.opens)}–{num(DRAW.closes)}
                </dd>
              </div>
              <div>
                <dt>{t('Result', 'ফলাফল')}</dt>
                <dd>{t(`${DRAW.result} · by SMS`, `${num(DRAW.result)} · SMS-এ`)}</dd>
              </div>
              <div>
                <dt>{t('Fee', 'ফি')}</dt>
                <dd>{t('Free', 'বিনামূল্যে')}</dd>
              </div>
            </dl>
            <p className="small-note">
              {t('Proposed rules: one application per traveller across every channel; needs railway approval.', 'প্রস্তাবিত নিয়ম: সব মাধ্যমে প্রতি যাত্রীর একটি আবেদন; রেলওয়ের অনুমোদন সাপেক্ষ।')}
            </p>
          </section>
          {!done ? (
            <Button
              block
              icon="ticket"
              disabled={dup}
              aria-describedby={dup ? 'ctd02-blocked' : undefined}
              onClick={() => {
                acted();
                setPhase('submitted');
              }}
            >
              {t('Submit and print receipt', 'জমা দিন ও রসিদ প্রিন্ট করুন')}
            </Button>
          ) : null}
          {dup && !done ? (
            <p id="ctd02-blocked" className="small-note">
              {t('Remove the duplicate traveller first.', 'আগে ডুপ্লিকেট যাত্রীকে বাদ দিন।')}
            </p>
          ) : null}
          <Notice tone="info" live="off" title={t('Same chance as the app', 'অ্যাপের মতোই সুযোগ')}>
            {t('Applying at a counter gives exactly the same chance as applying online.', 'কাউন্টারে আবেদন করলে অনলাইনে আবেদনের মতো ঠিক একই সুযোগ পাওয়া যায়।')}
          </Notice>
        </div>
      </div>
    </ScreenShell>
  );
}
