import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { HoldTimer } from '../components/HoldTimer';
import { StatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { useTrip } from '../components/Route';
import { GROUP_SIZE, coaches, longestRun, type Coach } from '../data/demo';
import { useT } from '../i18n/lang';

export interface G3aProps {
  initialCoach?: string;
  /** Start with every coach listed (the "show all" state). */
  showAll?: boolean;
  holdSeconds?: number;
  timerPaused?: boolean;
  focusHeading?: boolean;
  onNext?: (coach: Coach) => void;
}

const FIRST = 4;

/**
 * G3a · Choose a coach (bogi) for a group of 7 (decision 7d).
 * Only coaches in the group's one class are listed. Choosing happens inside the
 * same fixed seat hold, so the timer keeps running.
 */
export function G3aChooseCoach({ initialCoach, showAll = false, holdSeconds = 9 * 60 + 12, timerPaused = false, focusHeading, onNext }: G3aProps) {
  const { bn, t, num } = useT();
  const tr = useTrip();
  const [code, setCode] = useState<string | undefined>(initialCoach);
  const [all, setAll] = useState(showAll);
  const [error, setError] = useState(false);
  // Coaches with 7 together first, then by free seats; full coaches last.
  const sorted = [...coaches].sort((a, b) => {
    const ta = longestRun(a.free) >= GROUP_SIZE ? 1 : 0;
    const tb = longestRun(b.free) >= GROUP_SIZE ? 1 : 0;
    return tb - ta || b.free.length - a.free.length;
  });
  const shown = all ? sorted : sorted.slice(0, FIRST);
  const chosen = coaches.find((c) => c.code === code);
  const coachName = (c: Coach) => (bn ? c.codeBn : c.code);

  const next = () => {
    if (!chosen) {
      setError(true);
      document.getElementById(`g3a-${shown[0].code}`)?.focus();
      return;
    }
    onNext?.(chosen);
  };

  return (
    <ScreenShell
      screenId="G3a"
      title={t('Choose a coach', 'বগি বেছে নিন')}
      lede={t(`${GROUP_SIZE} seats together in ${tr.className}, the class for the whole group. Coaches (bogi) with ${GROUP_SIZE} free seats side by side are listed first.`, `পুরো দলের শ্রেণি ${tr.className}-এ ${num(GROUP_SIZE)}টি আসন একসাথে। যেসব বগিতে পাশাপাশি ${num(GROUP_SIZE)}টি খালি আসন আছে সেগুলো আগে দেখানো হয়েছে।`)}
      backLabel={t('Back to group travellers', 'দলের যাত্রীদের তালিকায় ফিরে যান')}
      focusHeading={focusHeading}
      footer={
        <Button block iconAfter="arrow-right" onClick={next}>
          {chosen ? t(`Continue with coach ${chosen.code}`, `বগি ${chosen.codeBn} নিয়ে এগিয়ে যান`) : t('Continue', 'এগিয়ে যান')}
        </Button>
      }
    >
      <HoldTimer initialSeconds={holdSeconds} paused={timerPaused} subject={t(`${GROUP_SIZE} seats`, `${num(GROUP_SIZE)}টি আসন`)} />

      <fieldset id="g3a-list" className="card radio-list" aria-describedby={error ? 'g3a-error' : 'g3a-help'}>
        <legend className="section-title">{t('Coaches with free seats', 'খালি আসনসহ বগি')}</legend>
        <p className="small-note" id="g3a-help">
          {t(`Package A and Package B sit together. Only free seats in ${tr.className} are shown.`, `প্যাকেজ A ও প্যাকেজ B একসাথে বসবে। শুধু ${tr.className}-এর খালি আসন দেখানো হয়েছে।`)}
        </p>
        {error ? (
          <p className="field__error" id="g3a-error">
            <Icon name="danger" size={18} />
            <span className="visually-hidden">{t('Error: ', 'ত্রুটি: ')}</span>
            {t('Choose a coach.', 'একটি বগি বেছে নিন।')}
          </p>
        ) : null}
        {shown.map((c) => {
          const run = longestRun(c.free);
          const full = c.free.length === 0;
          const together = run >= GROUP_SIZE;
          const metaId = `g3a-meta-${c.code}`;
          return (
            <label key={c.code} className={`radio-card ${code === c.code ? 'is-checked' : ''} ${full ? 'is-disabled' : ''}`}>
              <input
                type="radio"
                name="coach"
                id={`g3a-${c.code}`}
                value={c.code}
                checked={code === c.code}
                disabled={full}
                aria-describedby={metaId}
                aria-invalid={error ? true : undefined}
                onChange={() => {
                  setCode(c.code);
                  setError(false);
                }}
              />
              <span className="radio-card__main">
                <span className="radio-card__title">
                  {t('Coach', 'বগি')} {coachName(c)} · {full ? t('full', 'পূর্ণ') : t(`${c.free.length} free`, `${num(c.free.length)}টি খালি`)}
                </span>
                <span className="radio-card__meta" id={metaId}>
                  {full
                    ? t('No free seats in this class', 'এই শ্রেণিতে কোনো খালি আসন নেই')
                    : together
                      ? t(`Up to ${run} seats side by side`, `পাশাপাশি সর্বোচ্চ ${num(run)}টি আসন`)
                      : t(`Most together: ${run}. The group would be split; you choose the seats.`, `সবচেয়ে বেশি একসাথে: ${num(run)}টি। দল আলাদা হয়ে বসবে; আসন আপনি বেছে নেবেন।`)}
                </span>
                {full ? null : (
                  <span className="radio-card__pill">
                    {together ? (
                      <StatusPill tone="success" srPrefix={t('Seating:', 'বসার ব্যবস্থা:')}>
                        {t(`${GROUP_SIZE} together`, `${num(GROUP_SIZE)} জন একসাথে`)}
                      </StatusPill>
                    ) : (
                      <StatusPill tone="warning" srPrefix={t('Seating:', 'বসার ব্যবস্থা:')}>
                        {t('Split needed', 'আলাদা বসতে হবে')}
                      </StatusPill>
                    )}
                  </span>
                )}
              </span>
            </label>
          );
        })}
        <Button variant="ghost" aria-expanded={all} aria-controls="g3a-list" onClick={() => setAll((v) => !v)}>
          {all ? t('Show fewer coaches', 'কম বগি দেখান') : t(`Show all ${coaches.length} coaches`, `সব ${num(coaches.length)}টি বগি দেখান`)}
        </Button>
      </fieldset>
    </ScreenShell>
  );
}
