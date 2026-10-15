import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { useActionFocus } from '../components/useActionFocus';
import { GROUP_SIZE, PACKAGE_A_SIZE, PARTY_LOCK, abdul, salma } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'review' | 'confirmed';

export interface G2v2Props {
  initialPhase?: Phase;
  focusHeading?: boolean;
}

/**
 * G2·v2 One group, one chance. A group of 7 makes one application: Package A (4) and Package B (3)
 * are paid separately but share one draw place and one class. "All 7 travel, or none" is chosen
 * before the draw, and nobody can be added to a picked group.
 */
export function G2v2Group({ initialPhase = 'review', focusHeading }: G2v2Props) {
  const { t, num, name } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const { ref, acted } = useActionFocus([phase]);
  const b = GROUP_SIZE - PACKAGE_A_SIZE;
  const lock = num(PARTY_LOCK);

  return (
    <ScreenShell
      screenId="G2·v2"
      title={t('Your group', 'আপনার দল')}
      lede={t(`Group of ${GROUP_SIZE} · one application. One place in the draw.`, `${num(GROUP_SIZE)} জনের দল · একটি আবেদন। ড্র-এ একটি স্থান।`)}
      focusHeading={focusHeading}
      footer={
        <div className="footer-stack">
          {phase === 'review' ? (
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
          ) : null}
          <a className="btn btn--ghost btn--block" href="#/f03">
            {t(`Change who travels (before ${PARTY_LOCK})`, `কে যাবেন তা বদলান (${lock}-এর আগে)`)}
          </a>
        </div>
      }
    >
      <div ref={ref} tabIndex={-1} className="focus-target">
        {phase === 'confirmed' ? (
          <Notice tone="success" title={t(`Group confirmed · one application for all ${GROUP_SIZE}`, `দল নিশ্চিত · ${num(GROUP_SIZE)} জনের জন্য একটি আবেদন`)}>
            {t(
              `The party locks at ${PARTY_LOCK}. You can change who travels until then. If Package B isn’t paid, none of the ${GROUP_SIZE} travel.`,
              `দল ${lock}-এ লক হবে। ততক্ষণ কে যাবেন তা বদলাতে পারেন। প্যাকেজ B পরিশোধ না হলে ${num(GROUP_SIZE)} জনের কেউ যাবেন না।`,
            )}
          </Notice>
        ) : null}
      </div>

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
        </dl>
        <p className="small-note">
          {t(
            'Two payments do not create two applications. The whole group gets one place in the draw and one class.',
            'দুটি পেমেন্টে দুটি আবেদন হয় না। পুরো দল ড্র-এ একটি স্থান ও একটি শ্রেণি পায়।',
          )}
        </p>
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
        <p className="big-answer">{t(`All ${GROUP_SIZE} travel, or none`, `${num(GROUP_SIZE)} জনই যাবেন, নয়তো কেউ নয়`)}</p>
        <p className="small-note">
          {t(
            'Children always stay in the same package as their accompanying adult. This choice can’t be changed after the draw.',
            'শিশু সবসময় সঙ্গী প্রাপ্তবয়স্কের সাথে একই প্যাকেজে থাকে। ড্র-এর পর এই পছন্দ বদলানো যায় না।',
          )}
        </p>
      </section>

      <Notice tone="info" live="off" title={t('Adding someone after the draw', 'ড্র-এর পর কাউকে যোগ করা')}>
        {t(
          'A new traveller needs their own application. They can’t join a picked group, and a cancelled member’s seat goes to the waiting list — not to someone the group chooses.',
          'নতুন যাত্রীর নিজের আবেদন লাগবে। তিনি নির্বাচিত দলে যোগ দিতে পারবেন না, আর বাতিল হওয়া সদস্যের আসন অপেক্ষমাণ তালিকায় যায় — দলের বেছে নেওয়া কারো কাছে নয়।',
        )}
      </Notice>
    </ScreenShell>
  );
}
