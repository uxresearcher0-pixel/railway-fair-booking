import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { CounterRail } from '../components/CounterRail';
import { useActionFocus } from '../components/useActionFocus';
import { ACCESS_RECORD, BOOKING_REF, COUNTER_TERMINAL, RECOVERY, TRAVELLER_PHONE_LAST2, abdul, helper } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'check' | 'recorded';
type Reissue = 'phone' | 'paper';

export interface CTD04Props {
  initialPhase?: Phase;
  initialReissue?: Reissue;
  initialRemoveHelper?: boolean;
  focusHeading?: boolean;
}

/**
 * CTD04 · Recover a ticket (station counter terminal, desktop-first). The traveller (or the
 * accompanying adult for a child) shows photo ID; the helper's phone is not needed. Staff reissue the
 * ticket to the traveller's own phone or print a paper ticket, can remove the helper's access, and the
 * change is recorded (who, when, which ID). Staff screen: names stay in English (decision #31).
 */
export function CTD04RecoverTicket({ initialPhase = 'check', initialReissue = 'phone', initialRemoveHelper = true, focusHeading }: CTD04Props) {
  const { t, num } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [reissue, setReissue] = useState<Reissue>(initialReissue);
  const [removeHelper, setRemoveHelper] = useState(initialRemoveHelper);
  const { ref, acted } = useActionFocus([phase]);
  const recorded = phase === 'recorded';
  const phone = `••${num(TRAVELLER_PHONE_LAST2)}`;

  return (
    <ScreenShell
      screenId="CTD04"
      eyebrow={
        <>
          <span lang="en">{BOOKING_REF}</span> · {t('Recovery without the helper', 'সাহায্যকারী ছাড়া পুনরুদ্ধার')}
        </>
      }
      title={t('Recover a ticket', 'টিকিট পুনরুদ্ধার')}
      lede={t(
        'The traveller (or accompanying adult for a child) shows photo ID. The helper’s phone is not needed.',
        'যাত্রী (শিশুর ক্ষেত্রে সঙ্গী প্রাপ্তবয়স্ক) ছবিসহ পরিচয়পত্র দেখান। সাহায্যকারীর ফোন লাগবে না।',
      )}
      rail={<CounterRail current="ctd04" />}
      focusHeading={focusHeading}
    >
      <div className="split">
        <div className="split__main">
          <section className="card" aria-labelledby="ctd04-id">
            <h2 id="ctd04-id" className="card__eyebrow">
              {t('ID check', 'পরিচয় যাচাই')}
            </h2>
            <dl className="rows">
              <div>
                <dt>{t('Traveller', 'যাত্রী')}</dt>
                <dd lang="en">{abdul.name}</dd>
              </div>
              <div>
                <dt>{t('Document seen', 'যে কাগজ দেখা হয়েছে')}</dt>
                <dd>
                  {t('NID card', 'এনআইডি কার্ড')} ·{' '}
                  <StatusPill tone="success" icon="check">
                    {t('NID record matched', 'এনআইডি রেকর্ড মিলেছে')}
                  </StatusPill>
                </dd>
              </div>
              <div>
                <dt>{t('Booked by', 'বুক করেছেন')}</dt>
                <dd>
                  <span lang="en">{helper.name}</span> {t('(helper)', '(সাহায্যকারী)')}
                </dd>
              </div>
            </dl>
          </section>

          <section className="card" aria-labelledby="ctd04-actions">
            <h2 id="ctd04-actions" className="card__eyebrow">
              {t('Actions', 'করণীয়')}
            </h2>
            <fieldset className="radio-cards radio-cards--flat" disabled={recorded}>
              <legend className="field__label">{t('Reissue the ticket', 'টিকিট নতুন করে দিন')}</legend>
              {(
                [
                  { id: 'phone', title: t('Reissue to the traveller’s own phone', 'যাত্রীর নিজের ফোনে নতুন করে দিন'), meta: t(`New QR sent to ${phone}. The old copy stops working.`, `নতুন QR ${phone}-এ পাঠানো হবে। পুরোনো কপি আর কাজ করবে না।`) },
                  { id: 'paper', title: t('Print a paper ticket', 'কাগজের টিকিট প্রিন্ট করুন'), meta: t('A4 ticket with a new QR. The old copy stops working.', 'নতুন QR-সহ A4 টিকিট। পুরোনো কপি আর কাজ করবে না।') },
                ] as const
              ).map((o) => (
                <label key={o.id} className={`radio-card ${reissue === o.id ? 'is-checked' : ''}`}>
                  <input type="radio" name="ctd04-reissue" value={o.id} checked={reissue === o.id} onChange={() => setReissue(o.id)} aria-labelledby={`ctd04-${o.id}-title`} aria-describedby={`ctd04-${o.id}-meta`} />
                  <span className="radio-card__main">
                    <span className="radio-card__title" id={`ctd04-${o.id}-title`}>
                      {o.title}
                    </span>
                    <span className="radio-card__meta" id={`ctd04-${o.id}-meta`}>
                      {o.meta}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
            <label className={`radio-card ${removeHelper ? 'is-checked' : ''}`}>
              <input type="checkbox" checked={removeHelper} disabled={recorded} onChange={(e) => setRemoveHelper(e.target.checked)} aria-labelledby="ctd04-helper-title" aria-describedby="ctd04-helper-meta" />
              <span className="radio-card__main">
                <span className="radio-card__title" id="ctd04-helper-title">{t('Remove the helper’s access', 'সাহায্যকারীর প্রবেশাধিকার সরান')}</span>
                <span className="radio-card__meta" id="ctd04-helper-meta">
                  <span lang="en">{helper.name}</span>
                  {t(' is told by SMS. Ticket, seat and refund rules don’t change.', '-কে SMS-এ জানানো হবে। টিকিট, আসন ও টাকা ফেরতের নিয়ম বদলায় না।')}
                </span>
              </span>
            </label>
          </section>
        </div>

        <div className="split__side">
          {!recorded ? (
            <Button
              block
              icon="check"
              onClick={() => {
                acted();
                setPhase('recorded');
              }}
            >
              {t('Reissue and record', 'নতুন করে দিন ও রেকর্ড করুন')}
            </Button>
          ) : null}
          <div ref={ref} tabIndex={-1} className="focus-target">
            {recorded ? (
              <Notice tone="success" title={t(`Recorded · ${RECOVERY.record}`, `রেকর্ড হয়েছে · ${RECOVERY.record}`)}>
                <p>
                  {reissue === 'phone'
                    ? t(`Ticket reissued to ${phone}. The old copy no longer works.`, `টিকিট ${phone}-এ নতুন করে দেওয়া হয়েছে। পুরোনো কপি আর কাজ করে না।`)
                    : t('Paper ticket printed (demo). The old copy no longer works.', 'কাগজের টিকিট প্রিন্ট হয়েছে (ডেমো)। পুরোনো কপি আর কাজ করে না।')}
                </p>
                {removeHelper ? (
                  <p>
                    {t('Helper access removed', 'সাহায্যকারীর প্রবেশাধিকার সরানো হয়েছে')} · <span lang="en" className="mono">{ACCESS_RECORD}</span>
                  </p>
                ) : null}
                <p>
                  {t(
                    `Staff ${COUNTER_TERMINAL.staff} · ${RECOVERY.time} · NID card seen. The traveller gets an SMS for the change.`,
                    `কর্মী ${num(COUNTER_TERMINAL.staff)} · ${num(RECOVERY.time)} · এনআইডি কার্ড দেখা হয়েছে। পরিবর্তনের জন্য যাত্রী একটি SMS পান।`,
                  )}
                </p>
              </Notice>
            ) : null}
          </div>
          {!recorded ? (
            <Notice tone="info" live="off" title={t('Recorded', 'রেকর্ড হয়')}>
              {t('Who did it, when, which ID was seen. The traveller gets an SMS for the change.', 'কে করেছেন, কখন, কোন পরিচয়পত্র দেখা হয়েছে। পরিবর্তনের জন্য যাত্রী একটি SMS পান।')}
            </Notice>
          ) : null}
        </div>
      </div>
    </ScreenShell>
  );
}
