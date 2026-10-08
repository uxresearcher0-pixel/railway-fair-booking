import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Notice } from '../components/Notice';
import { AllowancePill } from '../components/AllowancePill';
import { StatusPill } from '../components/StatusPill';
import { DAILY_LIMIT, INVITE_CODE, abdul, masked, packageB, salma, trip } from '../data/demo';

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
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [otp, setOtp] = useState(initialOtp);
  const [otpError, setOtpError] = useState(showOtpError ? 'Enter the 6-digit code sent to your phone.' : '');
  const [busy, setBusy] = useState(false);
  const need = packageB.length;
  const fits = usedToday + need <= DAILY_LIMIT;

  const join = () => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError('Enter the 6-digit code sent to your phone.');
      document.getElementById('g2b-otp')?.focus();
      return;
    }
    setOtpError('');
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setPhase('joined');
    }, 600);
  };

  return (
    <ScreenShell
      screenId="G2b"
      title="Join Package B"
      lede={`${abdul.name} invited you to buy Package B (${need} tickets).`}
      focusHeading={focusHeading}
      footer={
        phase === 'invite' ? (
          <div className="footer-actions">
            <Button variant="secondary" onClick={() => setPhase('declined')}>
              Decline
            </Button>
            <Button onClick={join} disabled={!fits} loading={busy} loadingLabel="Joining…">
              Join as buyer
            </Button>
          </div>
        ) : phase === 'joined' && onNext ? (
          <Button block iconAfter="arrow-right" onClick={onNext}>
            Continue to payment (demo: hold opens)
          </Button>
        ) : undefined
      }
    >
      <section className="card" aria-labelledby="g2b-trip">
        <div className="card__head">
          <h2 id="g2b-trip" className="section-title">
            Package B
          </h2>
          <span className="code-chip mono">
            <span className="visually-hidden">Invite code </span>
            {INVITE_CODE}
          </span>
        </div>
        <p>
          {trip.from.name} <span className="mono">({trip.from.code})</span> → {trip.to.name}{' '}
          <span className="mono">({trip.to.code})</span> · {trip.train} · {trip.date}, {trip.departs}
        </p>
        <h3 className="sub-title">
          Travellers <span lang="bn">· যাত্রী</span>
        </h3>
        <ul className="people">
          {packageB.map((t) => (
            <li key={t.id}>
              <span className="people__name">
                {t.name}
                {t.id === salma.id ? <strong className="you-tag"> (you)</strong> : null}
              </span>
              <span className="people__meta">
                {t.kind === 'child'
                  ? `Child · ${t.idType} ${masked(t.idLast4)} · Accompanying adult: ${salma.name}`
                  : `Adult · NID ${masked(t.idLast4)}`}
              </span>
            </li>
          ))}
        </ul>
        <p className="small-note">You're a traveller in this package, so you can buy it. Booked by: {abdul.name} (Package A).</p>
      </section>

      <section className="card" aria-labelledby="g2b-allow">
        <h2 id="g2b-allow" className="section-title">
          Your allowance
        </h2>
        <AllowancePill used={phase === 'joined' ? usedToday + need : usedToday} />
        {fits ? (
          <p className="small-note">
            Buying Package B uses {need} of your {DAILY_LIMIT} tickets today.
          </p>
        ) : (
          <Notice tone="warning" title="Not enough allowance left today" live="off">
            Package B needs {need} tickets but you have {DAILY_LIMIT - usedToday} left. Ask {abdul.name} to invite another adult
            Package B traveller.
          </Notice>
        )}
      </section>

      {phase === 'invite' && fits ? (
        <section className="card" aria-labelledby="g2b-confirm">
          <h2 id="g2b-confirm" className="section-title">
            Confirm it's you
          </h2>
          <Field
            id="g2b-otp"
            label="One-time code"
            hint="Sent by SMS to your phone ending ••62. Demo: any 6 digits."
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ''));
              setOtpError('');
            }}
            error={otpError}
          />
          <Notice tone="info" live="off">
            Joining doesn't hold seats yet. Seats for both packages are held together after you join, and you pay for
            Package B from your own account.
          </Notice>
        </section>
      ) : null}

      {phase === 'joined' ? (
        <Notice tone="success" title="You've joined as Package B buyer">
          <StatusPill tone="success" srPrefix="Invite status:">Joined</StatusPill> No seats are held yet — you'll get a
          message when the shared hold opens.
        </Notice>
      ) : null}
      {phase === 'declined' ? (
        <Notice tone="info" title="You declined the invite">
          {abdul.name} has been told. Nothing was booked or charged, and your allowance is unchanged.
        </Notice>
      ) : null}
    </ScreenShell>
  );
}
