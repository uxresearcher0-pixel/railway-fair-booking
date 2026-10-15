import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { GroupSteps } from '../components/GroupSteps';
import { useActionFocus } from '../components/useActionFocus';
import { AYESHA_AGE, DRAW, GROUP_SIZE, GROUP_V2, PACKAGE_A_SIZE, PARTY_LOCK, abdul, evening, salma, trip, type Traveller } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'review' | 'confirmed';
type IfUnpaid = 'none' | 'a-travels';

export interface G2v2Props {
  initialPhase?: Phase;
  initialChoice?: IfUnpaid;
  focusHeading?: boolean;
  /** After confirming: on to coach and seats (G3·v2). Without it, a link to #/g3v2. */
  onNext?: () => void;
}

/**
 * G2·v2 One group, one chance (DW09). A group of 7 makes one application: Package A (4) and Package B (3)
 * are paid separately but share one draw place and one class. What happens if Package B isn't paid is
 * chosen before the draw (all 7 travel, or none — the default), and nobody can be added to a picked group.
 * Proposed rules.
 */
export function G2v2Group({ initialPhase = 'review', initialChoice = 'none', focusHeading, onNext }: G2v2Props) {
  const { t, num, name } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [choice, setChoice] = useState<IfUnpaid>(initialChoice);
  const { ref, acted } = useActionFocus([phase]);
  const b = GROUP_SIZE - PACKAGE_A_SIZE;
  const lock = num(PARTY_LOCK);
  const confirmed = phase === 'confirmed';

  const roster = (people: Traveller[]) => (
    <dl className="rows">
      {people.map((p) => (
        <div key={p.id}>
          <dt>{name(p)}</dt>
          <dd>
            {p.kind === 'child'
              ? t(`Child, ${AYESHA_AGE} · with ${abdul.name.split(' ')[0]}`, `শিশু, ${num(AYESHA_AGE)} · ${name(abdul)}-এর সাথে`)
              : t('Adult · NID record matched', 'প্রাপ্তবয়স্ক · এনআইডি রেকর্ড মিলেছে')}
          </dd>
        </div>
      ))}
    </dl>
  );

  return (
    <ScreenShell
      screenId="G2·v2"
      wide
      eyebrow={t(
        `Group of ${GROUP_SIZE} · ${evening.name} · ${evening.date} · ${trip.className}`,
        `${num(GROUP_SIZE)} জনের দল · ${evening.nameBn} · ${evening.dateBn} · ${trip.classNameBn}`,
      )}
      title={t('One group, one chance', 'এক দল, একটি সুযোগ')}
      lede={t(
        `Your group of ${GROUP_SIZE} is one application with one place in the draw. Two payments never create two applications.`,
        `আপনার ${num(GROUP_SIZE)} জনের দল একটি আবেদন, ড্র-এ একটি স্থান। দুটি পেমেন্টে কখনো দুটি আবেদন হয় না।`,
      )}
      focusHeading={focusHeading}
    >
      <GroupSteps current="group" />
      <div className="split">
        <div className="split__main">
          <section className="card" aria-labelledby="g2v2-a">
            <h2 id="g2v2-a" className="card__eyebrow">
              {t(`Package A · paid by ${abdul.name}`, `প্যাকেজ A · পরিশোধ করবেন ${name(abdul)}`)}
            </h2>
            {roster(GROUP_V2.packageA)}
          </section>
          <section className="card" aria-labelledby="g2v2-b">
            <h2 id="g2v2-b" className="card__eyebrow">
              {t(`Package B · paid by ${salma.name}`, `প্যাকেজ B · পরিশোধ করবেন ${name(salma)}`)}
            </h2>
            {roster(GROUP_V2.packageB)}
          </section>

          <section className="card" aria-labelledby="g2v2-unpaid">
            <div className="card__head">
              <h2 id="g2v2-unpaid" className="section-title">
                {t('If Package B isn’t paid', 'প্যাকেজ B পরিশোধ না হলে')}
              </h2>
              <StatusPill tone="neutral" icon="lock" srPrefix={t('Choice:', 'পছন্দ:')}>
                {t('Chosen before the draw', 'ড্র-এর আগে বেছে নেওয়া')}
              </StatusPill>
            </div>
            <fieldset className="radio-cards radio-cards--flat" disabled={confirmed}>
              <legend className="visually-hidden">{t('If Package B isn’t paid', 'প্যাকেজ B পরিশোধ না হলে')}</legend>
              {(
                [
                  {
                    id: 'none',
                    title: t(`All ${GROUP_SIZE} travel, or none`, `${num(GROUP_SIZE)} জনই যাবেন, নয়তো কেউ নয়`),
                    meta: t(`If Package B isn’t paid by ${DRAW.payBy}, Package A is refunded too.`, `প্যাকেজ B ${num(DRAW.payBy)}-এর মধ্যে পরিশোধ না হলে প্যাকেজ A-এর টাকাও ফেরত দেওয়া হয়।`),
                  },
                  {
                    id: 'a-travels',
                    title: t('Package A can still travel', 'প্যাকেজ A তবুও যেতে পারবে'),
                    meta: t(`Package B’s ${b} seats go to the waiting list in draw order.`, `প্যাকেজ B-এর ${num(b)}টি আসন ড্র-এর ক্রমে অপেক্ষমাণ তালিকায় যায়।`),
                  },
                ] as const
              ).map((o) => (
                <label key={o.id} className={`radio-card ${choice === o.id ? 'is-checked' : ''}`}>
                  <input type="radio" name="g2v2-unpaid" value={o.id} checked={choice === o.id} onChange={() => setChoice(o.id)} aria-labelledby={`g2v2-${o.id}-title`} aria-describedby={`g2v2-${o.id}-meta`} />
                  <span className="radio-card__main">
                    <span className="radio-card__title" id={`g2v2-${o.id}-title`}>
                      {o.title}
                    </span>
                    <span className="radio-card__meta" id={`g2v2-${o.id}-meta`}>
                      {o.meta}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="small-note">
              {t(
                'Children always stay in the same package as their accompanying adult. This choice can’t be changed after the draw. Proposed rule.',
                'শিশু সবসময় সঙ্গী প্রাপ্তবয়স্কের সাথে একই প্যাকেজে থাকে। ড্র-এর পর এই পছন্দ বদলানো যায় না। প্রস্তাবিত নিয়ম।',
              )}
            </p>
          </section>
        </div>

        <div className="split__side">
          <section className="card" aria-labelledby="g2v2-party">
            <div className="card__head">
              <h2 id="g2v2-party" className="section-title">
                {t(`Party · locked at ${PARTY_LOCK}`, `দল · ${lock}-এ লক`)}
              </h2>
              <StatusPill tone="accent" icon="lock" srPrefix={t('Draw:', 'ড্র:')}>
                {t('One application', 'একটি আবেদন')}
              </StatusPill>
            </div>
            <dl className="kv">
              <div>
                <dt>{t('Package A', 'প্যাকেজ A')}</dt>
                <dd>{t(`${PACKAGE_A_SIZE} travellers · paid by ${abdul.name}`, `${num(PACKAGE_A_SIZE)} জন যাত্রী · পরিশোধ করবেন ${name(abdul)}`)}</dd>
              </div>
              <div>
                <dt>{t('Package B', 'প্যাকেজ B')}</dt>
                <dd>{t(`${b} travellers · paid by ${salma.name}`, `${num(b)} জন যাত্রী · পরিশোধ করবেন ${name(salma)}`)}</dd>
              </div>
              <div>
                <dt>{t('Draw place', 'ড্র-এ স্থান')}</dt>
                <dd>
                  <strong>{t(`One place for all ${GROUP_SIZE}`, `${num(GROUP_SIZE)} জনের জন্য একটি স্থান`)}</strong>
                </dd>
              </div>
              <div>
                <dt>{t('Class', 'শ্রেণি')}</dt>
                <dd>{t(`${trip.className}, for the whole group`, `${trip.classNameBn}, পুরো দলের জন্য`)}</dd>
              </div>
            </dl>
            <p className="small-note">
              {t(
                'Two payments do not create two applications. The whole group gets one place in the draw and one class.',
                'দুটি পেমেন্টে দুটি আবেদন হয় না। পুরো দল ড্র-এ একটি স্থান ও একটি শ্রেণি পায়।',
              )}
            </p>
          </section>

          <Notice tone="info" live="off" title={t('Adding someone after the draw', 'ড্র-এর পর কাউকে যোগ করা')}>
            {t(
              'A new traveller needs their own application. They can’t join a picked group, and a cancelled member’s seat goes to the waiting list — not to someone the group chooses.',
              'নতুন যাত্রীর নিজের আবেদন লাগবে। তিনি নির্বাচিত দলে যোগ দিতে পারবেন না, আর বাতিল হওয়া সদস্যের আসন অপেক্ষমাণ তালিকায় যায় — দলের বেছে নেওয়া কারো কাছে নয়।',
            )}
          </Notice>

          <div ref={ref} tabIndex={-1} className="focus-target">
            {confirmed ? (
              <Notice tone="success" title={t(`Group confirmed · one application for all ${GROUP_SIZE}`, `দল নিশ্চিত · ${num(GROUP_SIZE)} জনের জন্য একটি আবেদন`)}>
                {choice === 'none'
                  ? t(
                      `The party locks at ${PARTY_LOCK}. You can change who travels until then. If Package B isn’t paid, none of the ${GROUP_SIZE} travel.`,
                      `দল ${lock}-এ লক হবে। ততক্ষণ কে যাবেন তা বদলাতে পারেন। প্যাকেজ B পরিশোধ না হলে ${num(GROUP_SIZE)} জনের কেউ যাবেন না।`,
                    )
                  : t(
                      `The party locks at ${PARTY_LOCK}. You can change who travels until then. If Package B isn’t paid, Package A still travels.`,
                      `দল ${lock}-এ লক হবে। ততক্ষণ কে যাবেন তা বদলাতে পারেন। প্যাকেজ B পরিশোধ না হলে প্যাকেজ A তবুও যাবে।`,
                    )}
              </Notice>
            ) : null}
          </div>

          <div className="side-actions">
            {!confirmed ? (
              <Button
                block
                icon="check"
                onClick={() => {
                  acted();
                  setPhase('confirmed');
                }}
              >
                {t('Confirm group', 'দল নিশ্চিত করুন')}
              </Button>
            ) : onNext ? (
              <Button block iconAfter="arrow-right" onClick={onNext}>
                {t('Picked: choose where the group sits (demo)', 'নির্বাচিত: দল কোথায় বসবে বেছে নিন (ডেমো)')}
              </Button>
            ) : (
              <a className="btn btn--primary btn--block" href="#/g3v2">
                {t('Picked: choose where the group sits (demo)', 'নির্বাচিত: দল কোথায় বসবে বেছে নিন (ডেমো)')}
              </a>
            )}
            <a className="btn btn--ghost btn--block" href="#/f03">
              {t(`Change who travels (before ${PARTY_LOCK})`, `কে যাবেন তা বদলান (${lock}-এর আগে)`)}
            </a>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
