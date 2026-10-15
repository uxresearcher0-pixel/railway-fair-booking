import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Notice } from '../components/Notice';
import { AllowancePill } from '../components/AllowancePill';
import { StatusPill } from '../components/StatusPill';
import { Route, useTrip } from '../components/Route';
import { BOOKINGS_PER_DAY, INVITE_CODE, abdul, packageB, salma } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'invite' | 'joined' | 'declined';

export interface G2bProps {
  usedToday?: number;
  initialPhase?: Phase;
  initialOtp?: string;
  showOtpError?: boolean;
  focusHeading?: boolean;
  onNext?: () => void;
}

export function G2bJoin({ usedToday = 0, initialPhase = 'invite', initialOtp = '', showOtpError = false, focusHeading, onNext }: G2bProps) {
  const { bn, t, num, masked, name } = useT();
  const tr = useTrip();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [otp, setOtp] = useState(initialOtp);
  const [otpError, setOtpError] = useState(showOtpError);
  const [busy, setBusy] = useState(false);
  const need = packageB.length;
  // Package B is one booking (max 4 seats); the buyer needs a booking left today.
  const fits = usedToday < BOOKINGS_PER_DAY;
  const abdulName = name(abdul);

  const join = () => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError(true);
      document.getElementById('g2b-otp')?.focus();
      return;
    }
    setOtpError(false);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setPhase('joined');
    }, 600);
  };

  return (
    <ScreenShell
      screenId="G2b"
      title={t('Join Package B', 'প্যাকেজ B-তে যোগ দিন')}
      lede={t(`${abdul.name} invited you to buy Package B (${need} seats).`, `${abdulName} আপনাকে প্যাকেজ B (${num(need)}টি আসন) কেনার আমন্ত্রণ জানিয়েছেন।`)}
      focusHeading={focusHeading}
      footer={
        phase === 'invite' ? (
          <div className="footer-actions">
            <Button variant="secondary" onClick={() => setPhase('declined')}>
              {t('Decline', 'প্রত্যাখ্যান')}
            </Button>
            <Button onClick={join} disabled={!fits} loading={busy} loadingLabel={t('Joining…', 'যোগ দেওয়া হচ্ছে…')}>
              {t('Join as buyer', 'ক্রেতা হিসেবে যোগ দিন')}
            </Button>
          </div>
        ) : phase === 'joined' && onNext ? (
          <Button block iconAfter="arrow-right" onClick={onNext}>
            {t('Continue to choose seats', 'আসন বেছে নিতে এগিয়ে যান')}
          </Button>
        ) : undefined
      }
    >
      <section className="card" aria-labelledby="g2b-trip">
        <div className="card__head">
          <h2 id="g2b-trip" className="section-title">
            {t('Package B', 'প্যাকেজ B')}
          </h2>
          <span className="code-chip mono">
            <span className="visually-hidden">{t('Invite code ', 'আমন্ত্রণ কোড ')}</span>
            {INVITE_CODE}
          </span>
        </div>
        <p>
          <Route /> · {tr.train} · {tr.date}, {tr.departs}
        </p>
        <h3 className="sub-title">
          {t('Travellers', 'যাত্রী')} {bn ? null : <span lang="bn">· যাত্রী</span>}
        </h3>
        <ul className="people">
          {packageB.map((p) => (
            <li key={p.id}>
              <span className="people__name">
                {name(p)}
                {p.id === salma.id ? <strong className="you-tag">{t(' (you)', ' (আপনি)')}</strong> : null}
              </span>
              <span className="people__meta">
                {p.kind === 'child'
                  ? t(`Child · ${p.idType} ${masked(p.idLast4)} · Accompanying adult: ${salma.name}`, `শিশু · জন্মনিবন্ধন ${masked(p.idLast4)} · সঙ্গী প্রাপ্তবয়স্ক: ${name(salma)}`)
                  : t(`Adult · NID ${masked(p.idLast4)}`, `প্রাপ্তবয়স্ক · এনআইডি ${masked(p.idLast4)}`)}
              </span>
            </li>
          ))}
        </ul>
        <p className="small-note">
          {t(`You're a traveller in this package, so you can buy it. Booked by: ${abdul.name} (Package A).`, `আপনি এই প্যাকেজের একজন যাত্রী, তাই এটি কিনতে পারেন। বুক করেছেন: ${abdulName} (প্যাকেজ A)।`)}
        </p>
      </section>

      <section className="card" aria-labelledby="g2b-allow">
        <h2 id="g2b-allow" className="section-title">
          {t('Your allowance', 'আপনার সীমা')}
        </h2>
        <AllowancePill used={phase === 'joined' ? usedToday + 1 : usedToday} />
        {fits ? (
          <p className="small-note">
            {t(`Buying Package B uses 1 of your ${BOOKINGS_PER_DAY} bookings today (${need} seats).`, `প্যাকেজ B কিনলে আজকের ${num(BOOKINGS_PER_DAY)}টি বুকিংয়ের ১টি ব্যবহার হবে (${num(need)}টি আসন)।`)}
          </p>
        ) : (
          <Notice tone="warning" title={t('No bookings left today', 'আজ আর কোনো বুকিং বাকি নেই')} live="off">
            {t(`You've used ${usedToday} of ${BOOKINGS_PER_DAY} bookings today, so you can't buy Package B. Ask ${abdul.name} to invite another adult Package B traveller.`, `আজ আপনি ${num(BOOKINGS_PER_DAY)}টির মধ্যে ${num(usedToday)}টি বুকিং ব্যবহার করেছেন, তাই প্যাকেজ B কিনতে পারবেন না। ${abdulName}-কে প্যাকেজ B-এর অন্য একজন প্রাপ্তবয়স্ক যাত্রীকে আমন্ত্রণ জানাতে বলুন।`)}
          </Notice>
        )}
      </section>

      {phase === 'invite' && fits ? (
        <section className="card" aria-labelledby="g2b-confirm">
          <h2 id="g2b-confirm" className="section-title">
            {t("Confirm it's you", 'নিশ্চিত করুন এটি আপনি')}
          </h2>
          <Field
            id="g2b-otp"
            label={t('One-time code', 'ওয়ান-টাইম কোড')}
            hint={t('Sent by SMS to your phone ending ••62. Demo: any 6 digits.', 'আপনার ••৬২ নম্বরের ফোনে SMS-এ পাঠানো হয়েছে। ডেমো: যেকোনো ৬টি অঙ্ক।')}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ''));
              setOtpError(false);
            }}
            error={otpError ? t('Enter the 6-digit code sent to your phone.', 'আপনার ফোনে পাঠানো ৬ অঙ্কের কোডটি দিন।') : undefined}
          />
          <Notice tone="info" live="off">
            {t('Joining doesn\'t hold seats yet. After you join, the buyer chooses the coach and seats for both packages, they are held together, and you pay for Package B from your own account or at any station counter.', 'যোগ দিলে এখনই আসন হোল্ড হয় না। আপনি যোগ দেওয়ার পর দুই প্যাকেজের বগি ও আসন বেছে নেওয়া হয়, সেগুলো একসাথে হোল্ড হয়, আর আপনি নিজের অ্যাকাউন্ট থেকে বা যেকোনো স্টেশন কাউন্টারে প্যাকেজ B-এর টাকা দেন।')}
          </Notice>
        </section>
      ) : null}

      {phase === 'joined' ? (
        <Notice tone="success" title={t("You've joined as Package B buyer", 'আপনি প্যাকেজ B-এর ক্রেতা হিসেবে যোগ দিয়েছেন')}>
          <StatusPill tone="success" srPrefix={t('Invite status:', 'আমন্ত্রণের অবস্থা:')}>
            {t('Joined', 'যোগ দিয়েছেন')}
          </StatusPill>{' '}
          {t('No seats are held yet — next, the coach and seats for the group are chosen.', 'এখনও কোনো আসন হোল্ড হয়নি — এরপর দলের বগি ও আসন বেছে নেওয়া হবে।')}
        </Notice>
      ) : null}
      {phase === 'declined' ? (
        <Notice tone="info" title={t('You declined the invite', 'আপনি আমন্ত্রণ প্রত্যাখ্যান করেছেন')}>
          {t(`${abdul.name} has been told. Nothing was booked or charged, and your allowance is unchanged.`, `${abdulName}-কে জানানো হয়েছে। কিছু বুক বা চার্জ করা হয়নি, আর আপনার সীমা অপরিবর্তিত আছে।`)}
        </Notice>
      ) : null}
    </ScreenShell>
  );
}
