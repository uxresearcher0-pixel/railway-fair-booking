import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { HoldTimer } from '../components/HoldTimer';
import { StatusPill } from '../components/StatusPill';
import { BOOKING_REF, FARE, SERVICE_CHARGE, abdul, packageB, salma, taka, trip } from '../data/demo';

type Phase = 'pay' | 'confirm-decline' | 'paying' | 'paid' | 'declined' | 'expired';

export interface G5Props {
  initialPhase?: Phase;
  holdSeconds?: number;
  /** Freeze the timer (static stories / tests). */
  timerPaused?: boolean;
  focusHeading?: boolean;
}

export function G5PayPackageB({ initialPhase = 'pay', holdSeconds = 9 * 60 + 12, timerPaused = false, focusHeading }: G5Props) {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [method, setMethod] = useState('wallet');
  const n = packageB.length;
  const fare = n * FARE;
  const charge = n * SERVICE_CHARGE;
  const total = fare + charge;
  const active = phase === 'pay' || phase === 'confirm-decline' || phase === 'paying';

  const pay = () => {
    setPhase('paying');
    setTimeout(() => setPhase('paid'), 900);
  };

  return (
    <ScreenShell
      screenId="G5"
      title="Pay for Package B"
      lede={`Linked booking ${BOOKING_REF} · invited by ${abdul.name}`}
      focusHeading={focusHeading}
      footer={
        active ? (
          <div className="footer-stack">
            <Button block onClick={pay} loading={phase === 'paying'} loadingLabel="Paying…">
              Pay {taka(total)}
            </Button>
            <Button block variant="ghost" onClick={() => setPhase('confirm-decline')} disabled={phase === 'paying'}>
              Decline Package B
            </Button>
          </div>
        ) : undefined
      }
    >
      {active ? (
        <HoldTimer
          initialSeconds={holdSeconds}
          paused={timerPaused || phase === 'paying'}
          subject="Package B seats"
          onExpire={() => setPhase('expired')}
        />
      ) : null}

      {phase === 'confirm-decline' ? (
        <Notice
          tone="danger"
          title="Decline Package B?"
          actions={
            <>
              <Button variant="danger" onClick={() => setPhase('declined')}>
                Decline and release 3 seats
              </Button>
              <Button variant="secondary" onClick={() => setPhase('pay')}>
                Keep Package B
              </Button>
            </>
          }
        >
          Package B's 3 seats go back to the queue for other passengers. They are not passed to the Package A buyer.
          Package A stays booked.
        </Notice>
      ) : null}

      <section className="card" aria-labelledby="g5-trip">
        <div className="card__head">
          <h2 id="g5-trip" className="section-title">
            Package B · {n} tickets
          </h2>
          <StatusPill tone="success" srPrefix="Package A:">
            Package A paid
          </StatusPill>
        </div>
        <p>
          {trip.from.name} <span className="mono">({trip.from.code})</span> → {trip.to.name}{' '}
          <span className="mono">({trip.to.code})</span>
          <br />
          {trip.train} · {trip.date} · {trip.departs}–{trip.arrives} · Coach {trip.coach}, {trip.className}
        </p>
        <ul className="people">
          {packageB.map((t) => (
            <li key={t.id}>
              <span className="people__name">{t.name}</span>
              <span className="people__meta">
                {t.kind === 'child' ? 'Child' : 'Adult'} · Seat <span className="mono">{t.seat}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="g5-cost">
        <h2 id="g5-cost" className="section-title">
          Amount
        </h2>
        <table className="cost">
          <caption className="visually-hidden">Package B cost breakdown</caption>
          <tbody>
            <tr>
              <th scope="row">Fare · {n} × {taka(FARE)}</th>
              <td className="mono">{taka(fare)}</td>
            </tr>
            <tr>
              <th scope="row">
                Service charge · {n} × {taka(SERVICE_CHARGE)}
                <span className="cost__note">Non-refundable</span>
              </th>
              <td className="mono">{taka(charge)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td className="mono">{taka(total)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="small-note">Paid by: {salma.name}. Refunds go back to the account that paid.</p>
      </section>

      {active ? (
        <fieldset className="card radio-cards">
          <legend className="section-title">Pay with</legend>
          {[
            { id: 'wallet', label: 'Mobile wallet (demo)' },
            { id: 'card', label: 'Card (demo)' },
          ].map((m) => (
            <label key={m.id} className={`radio-card ${method === m.id ? 'is-checked' : ''}`}>
              <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
              <span className="radio-card__main">
                <span className="radio-card__title">{m.label}</span>
              </span>
            </label>
          ))}
        </fieldset>
      ) : null}

      {phase === 'paid' ? (
        <Notice tone="success" title={`Paid ${taka(total)} · Package B booked`}>
          3 named tickets are ready. Both packages of {BOOKING_REF} are paid.
        </Notice>
      ) : null}
      {phase === 'declined' ? (
        <Notice tone="info" title="Package B declined">
          3 seats were released back to the queue, not to the Package A buyer. You have not been charged.
        </Notice>
      ) : null}
      {phase === 'expired' ? (
        <Notice tone="danger" title="Hold expired">
          Package B seats were released back to the queue. You have not been charged.
        </Notice>
      ) : null}
    </ScreenShell>
  );
}
