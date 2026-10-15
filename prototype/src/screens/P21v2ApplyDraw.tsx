import { useEffect, useRef, useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { Route, useTrip } from '../components/Route';
import { APPLICATION_REF, DRAW, DUPLICATE_APPLICATION, abdul, drawParty, rahim } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'apply' | 'duplicate' | 'received';

export interface P21v2Props {
  initialPhase?: Phase;
  /** Demo: the duplicate check finds Rahim Karim in another application when you apply. */
  hasDuplicate?: boolean;
  focusHeading?: boolean;
  /** From the receipt: go on to the result (P22·v2). */
  onNext?: () => void;
}

/**
 * P21·v2 Apply for the draw (and P21b·v2 Application received).
 * A busy train opens an application window; places are given by a published random draw,
 * so applying early gives no extra chance. One application per traveller across all channels.
 */
export function P21v2ApplyDraw({ initialPhase = 'apply', hasDuplicate = false, focusHeading, onNext }: P21v2Props) {
  const { t, num, masked, name } = useT();
  const tr = useTrip();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [party, setParty] = useState(drawParty);
  const [dupResolved, setDupResolved] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const n = party.length;

  useEffect(() => {
    if (moved.current) resultRef.current?.focus();
  }, [phase]);
  const go = (p: Phase) => {
    moved.current = true;
    setPhase(p);
  };

  const apply = () => go(hasDuplicate && !dupResolved && party.includes(rahim) ? 'duplicate' : 'received');
  const removeRahim = () => {
    setParty((p) => p.filter((x) => x.id !== rahim.id));
    setDupResolved(true);
    go('apply');
  };

  const win = `${num(DRAW.opens)}–${num(DRAW.closes)}`;

  return (
    <ScreenShell
      screenId={phase === 'received' ? 'P21b·v2' : 'P21·v2'}
      title={phase === 'received' ? t('Application received', 'আবেদন জমা হয়েছে') : t('Apply for the draw', 'লটারির জন্য আবেদন করুন')}
      lede={
        <>
          <Route /> · {tr.train} · {tr.date}
        </>
      }
      focusHeading={focusHeading}
      footer={
        phase === 'received' ? (
          <Button block iconAfter="arrow-right" onClick={onNext}>
            {t(`See the result at ${DRAW.result} (demo)`, `${num(DRAW.result)}-এ ফলাফল দেখুন (ডেমো)`)}
          </Button>
        ) : (
          <Button block iconAfter="arrow-right" onClick={apply} disabled={phase === 'duplicate'}>
            {t(`Apply for ${n} travellers`, `${num(n)} জন যাত্রীর জন্য আবেদন করুন`)}
          </Button>
        )
      }
    >
      <section className="card" aria-labelledby="p21-times">
        <h2 id="p21-times" className="section-title">
          {t('Busy train: places are drawn', 'ভিড়ের ট্রেন: আসন লটারিতে')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Application window', 'আবেদনের সময়')}</dt>
            <dd className="mono">{t(`${DRAW.opens}–${DRAW.closes} today`, `আজ ${win}`)}</dd>
          </div>
          <div>
            <dt>{t('Draw result', 'লটারির ফল')}</dt>
            <dd className="mono">{t(`${DRAW.result} today, in the app and by SMS`, `আজ ${num(DRAW.result)}, অ্যাপে ও SMS-এ`)}</dd>
          </div>
          <div>
            <dt>{t('If picked, pay by', 'নির্বাচিত হলে পরিশোধ করুন')}</dt>
            <dd className="mono">{t(`${DRAW.payBy} today`, `আজ ${num(DRAW.payBy)}-এর মধ্যে`)}</dd>
          </div>
        </dl>
        <p>
          <strong>
            {t(
              `Applying at ${DRAW.opens} or at ${DRAW.lastMinute} gives exactly the same chance.`,
              `${num(DRAW.opens)}-এ বা ${num(DRAW.lastMinute)}-এ আবেদন করলে সুযোগ একদম সমান।`,
            )}
          </strong>{' '}
          {t('The order is set by a published random draw, not by speed. Applying is free.', 'ক্রম ঠিক হয় প্রকাশিত দৈব লটারিতে, গতিতে নয়। আবেদন করতে কোনো টাকা লাগে না।')}
        </p>
      </section>

      <section className="card" aria-labelledby="p21-party">
        <div className="card__head">
          <h2 id="p21-party" className="section-title">
            {t(`Your party · ${n} travellers`, `আপনার দল · ${num(n)} জন যাত্রী`)}
          </h2>
          {phase === 'received' ? (
            <StatusPill tone="accent" icon="lock" srPrefix={t('Party:', 'দল:')}>
              {t('Locked', 'লক করা')}
            </StatusPill>
          ) : null}
        </div>
        <ul className="people">
          {party.map((p) => (
            <li key={p.id}>
              <span className="people__name">{name(p)}</span>
              <span className="people__meta">
                {p.kind === 'child'
                  ? t(`Traveller · child · Birth registration ${masked(p.idLast4)} · Accompanying adult: ${abdul.name}`, `যাত্রী · শিশু · জন্মনিবন্ধন ${masked(p.idLast4)} · সঙ্গী প্রাপ্তবয়স্ক: ${name(abdul)}`)
                  : t(`Traveller · adult · NID ${masked(p.idLast4)}`, `যাত্রী · প্রাপ্তবয়স্ক · এনআইডি ${masked(p.idLast4)}`)}
              </span>
            </li>
          ))}
        </ul>
        <p className="small-note">
          {t(
            'One application per traveller, across the app, website, counters and registered agents. Your group gets one draw place, and everyone is picked or no one is.',
            'প্রতি যাত্রীর একটিই আবেদন — অ্যাপ, ওয়েবসাইট, কাউন্টার ও নিবন্ধিত এজেন্ট মিলিয়ে। আপনার দল একটি লটারির স্থান পায়; সবাই নির্বাচিত হন, নয়তো কেউ নন।',
          )}
        </p>
      </section>

      <div ref={resultRef} tabIndex={-1} className="focus-target">
        {phase === 'duplicate' ? (
          <Notice
            tone="warning"
            title={t('Rahim Karim is already in another application', 'রহিম করিম আরেকটি আবেদনে আছেন')}
            actions={
              <>
                <Button variant="secondary" onClick={removeRahim}>
                  {t(`Remove ${rahim.name} from this application`, `এই আবেদন থেকে ${name(rahim)}-কে বাদ দিন`)}
                </Button>
                <Button variant="ghost" onClick={() => go('apply')}>
                  {t('Back to the party', 'দলে ফিরে যান')}
                </Button>
              </>
            }
          >
            {t(
              `${rahim.name} is already in application ${DUPLICATE_APPLICATION.ref} made at ${DUPLICATE_APPLICATION.place}. Each traveller can be in one application only. Remove them here, or ask for ${DUPLICATE_APPLICATION.ref} to be withdrawn at any counter before ${DRAW.closes}.`,
              `${name(rahim)} ইতিমধ্যে ${DUPLICATE_APPLICATION.placeBn}-এ করা আবেদন ${DUPLICATE_APPLICATION.ref}-এ আছেন। প্রতি যাত্রী একটিমাত্র আবেদনে থাকতে পারেন। এখানে তাঁকে বাদ দিন, অথবা ${num(DRAW.closes)}-এর আগে যেকোনো কাউন্টারে ${DUPLICATE_APPLICATION.ref} তুলে নিতে বলুন।`,
            )}
          </Notice>
        ) : null}

        {phase === 'received' ? (
          <Notice tone="success" title={t(`Application ${APPLICATION_REF} received`, `আবেদন ${APPLICATION_REF} জমা হয়েছে`)}>
            {t(
              `Your party is locked: no one can be added or swapped after you apply. The result comes at ${DRAW.result}. Applied by: ${abdul.name}. You have not been charged.`,
              `আপনার দল লক করা হয়েছে: আবেদনের পর কাউকে যোগ বা বদল করা যায় না। ফল আসবে ${num(DRAW.result)}-এ। আবেদন করেছেন: ${name(abdul)}। আপনার কাছ থেকে কোনো টাকা কাটা হয়নি।`,
            )}
          </Notice>
        ) : null}
      </div>

      {phase === 'received' ? (
        <section className="card" aria-labelledby="p21-receipt">
          <h2 id="p21-receipt" className="section-title">
            {t('Receipt', 'রসিদ')}
          </h2>
          <dl className="kv">
            <div>
              <dt>{t('Application reference', 'আবেদনের রেফারেন্স')}</dt>
              <dd>
                <span className="code-chip mono">{APPLICATION_REF}</span>
              </dd>
            </div>
            <div>
              <dt>{t('Travellers', 'যাত্রী')}</dt>
              <dd>{t(`${n}, one draw place`, `${num(n)} জন, একটি লটারির স্থান`)}</dd>
            </div>
            <div>
              <dt>{t('Fee', 'ফি')}</dt>
              <dd>{t('Free', 'বিনামূল্যে')}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </ScreenShell>
  );
}
