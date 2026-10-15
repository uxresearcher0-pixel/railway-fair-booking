import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { useActionFocus } from '../components/useActionFocus';
import { WAITLIST, evening } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'list' | 'confirm' | 'left';

export interface P24v2Props {
  initialPhase?: Phase;
  focusHeading?: boolean;
}

/** A release fits a request when it has at least as many seats as the request needs. */
export const releaseFits = (seats: number, need: number) => seats >= need;

/**
 * P24·v2 Waiting list · place kept. Released seats are offered in list order. A release that is too
 * small for your group goes to the next request that fits, and you keep your place.
 */
export function P24v2Waitlist({ initialPhase = 'list', focusHeading }: P24v2Props) {
  const { t, num } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const { ref, acted } = useActionFocus([phase]);
  const { place, need, releases } = WAITLIST;
  const p = `#${num(place)}`;
  const go = (next: Phase) => {
    acted();
    setPhase(next);
  };
  // Back from the confirmation: focus returns to the button that opened it.
  const keep = () => {
    setPhase('list');
    setTimeout(() => document.getElementById('p24-leave')?.focus(), 0);
  };
  const left = phase === 'left';

  return (
    <ScreenShell
      screenId="P24·v2"
      title={t('Waiting list', 'অপেক্ষমাণ তালিকা')}
      lede={t(`${evening.name} · ${evening.date}`, `${evening.nameBn} · ${evening.dateBn}`)}
      focusHeading={focusHeading}
      footer={
        phase === 'list' ? (
          <Button id="p24-leave" block variant="secondary" onClick={() => go('confirm')}>
            {t('Leave the waiting list', 'অপেক্ষমাণ তালিকা ছেড়ে দিন')}
          </Button>
        ) : undefined
      }
    >
      <div ref={ref} tabIndex={-1} className="focus-target">
        {phase === 'confirm' ? (
          <Notice
            tone="danger"
            title={t('Leave the waiting list?', 'অপেক্ষমাণ তালিকা ছেড়ে দেবেন?')}
            actions={
              <>
                <Button variant="danger" onClick={() => go('left')}>
                  {t('Leave the list', 'তালিকা ছেড়ে দিন')}
                </Button>
                <Button variant="secondary" onClick={keep}>
                  {t(`Keep place #${place}`, `স্থান ${p} রাখুন`)}
                </Button>
              </>
            }
          >
            {t(`You lose place #${place}. If you join again, you go to the end of the list.`, `আপনি স্থান ${p} হারাবেন। আবার যোগ দিলে তালিকার শেষে যাবেন।`)}
          </Notice>
        ) : null}
        {left ? (
          <Notice tone="success" title={t('You left the waiting list', 'আপনি অপেক্ষমাণ তালিকা ছেড়েছেন')}>
            {t(`Place #${place} is released to the next request. You have not been charged.`, `স্থান ${p} পরের অনুরোধে চলে গেছে। আপনার কাছ থেকে কোনো টাকা কাটা হয়নি।`)}
          </Notice>
        ) : null}
      </div>

      {!left ? (
        <section className="card" aria-labelledby="p24-place">
          <div className="card__head">
            <h2 id="p24-place" className="section-title">
              {t(`Your place: #${place}`, `আপনার স্থান: ${p}`)}
            </h2>
            <StatusPill tone="accent" icon="check" srPrefix={t('Place:', 'স্থান:')}>
              {t('Kept', 'বজায় আছে')}
            </StatusPill>
          </div>
          <p className="sub-title">{t('Your place is kept', 'আপনার স্থান বজায় আছে')}</p>
          <p>
            {t(
              `Released seats are offered in list order. If ${need} seats together aren’t free, they go to the next request that fits — and you keep place #${place} for the next release.`,
              `ছেড়ে দেওয়া আসন তালিকার ক্রমে প্রস্তাব করা হয়। একসাথে ${num(need)}টি আসন খালি না থাকলে তা পরের মানানসই অনুরোধে যায় — আর পরের বার ছাড়ার জন্য আপনার স্থান ${p} বজায় থাকে।`,
            )}
          </p>
        </section>
      ) : null}

      <section className="card" aria-labelledby="p24-releases">
        <h2 id="p24-releases" className="section-title">
          {t('Releases today', 'আজ ছাড়া আসন')}
        </h2>
        <ol className="timeline">
          {releases.map((r) => {
            const skipsYou = r.offeredTo > place && !releaseFits(r.seats, need);
            return (
              <li key={r.time}>
                <span className="timeline__when mono">
                  {t(`${r.time} · ${r.seats} ${r.seats === 1 ? 'seat' : 'seats'}`, `${num(r.time)} · ${num(r.seats)}টি আসন`)}
                </span>
                <span>
                  {skipsYou ? (
                    <StatusPill tone="neutral" icon="info" srPrefix={t('Offered to', 'প্রস্তাব')}>
                      {t(`#${r.offeredTo} · you need ${need}, place kept`, `#${num(r.offeredTo)} · আপনার ${num(need)}টি দরকার, স্থান বজায়`)}
                    </StatusPill>
                  ) : (
                    <StatusPill tone="success" icon="check" srPrefix={t('Offered to', 'প্রস্তাব')}>
                      {t(`#${r.offeredTo} · fits`, `#${num(r.offeredTo)} · মিলেছে`)}
                    </StatusPill>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="small-note">
          {t('Every offer has a fixed end time. Every skip is recorded and can be audited.', 'প্রতিটি প্রস্তাবের নির্দিষ্ট শেষ সময় আছে। প্রতিটি বাদ পড়া রেকর্ড হয় এবং অডিট করা যায়।')}
        </p>
      </section>
    </ScreenShell>
  );
}
