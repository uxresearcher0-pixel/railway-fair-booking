import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Stepper } from '../components/Stepper';
import { Notice } from '../components/Notice';
import { Button } from '../components/Button';
import { AllowancePill } from '../components/AllowancePill';
import { DAILY_LIMIT, FARE, taka, trip } from '../data/demo';

const classes = [
  { id: 'ac-chair', label: 'AC chair', fare: FARE, seats: '42 seats left' },
  { id: 'non-ac-chair', label: 'Non-AC chair', fare: 210, seats: '8 seats left' },
  { id: 'ac-berth', label: 'AC berth', fare: 640, seats: 'Fair queue only' },
];

export interface F03Props {
  initialAdults?: number;
  initialChildren?: number;
  usedToday?: number;
  /** Start with the over-limit guidance visible (for the story state). */
  showLimitGuidance?: boolean;
}

export function F03Travellers({ initialAdults = 1, initialChildren = 0, usedToday = 0, showLimitGuidance = false }: F03Props) {
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [cls, setCls] = useState('ac-chair');
  const [blocked, setBlocked] = useState(showLimitGuidance);
  const remaining = DAILY_LIMIT - usedToday;
  const total = adults + children;
  const canAdd = () => total < remaining;
  const fare = classes.find((c) => c.id === cls)!.fare;

  return (
    <ScreenShell
      screenId="F03"
      title="Travellers & class"
      lede={
        <>
          {trip.from.name} <span className="mono">({trip.from.code})</span> → {trip.to.name}{' '}
          <span className="mono">({trip.to.code})</span> · {trip.date}
        </>
      }
      backLabel="Back to search"
      footer={
        <Button block iconAfter="arrow-right" aria-describedby="f03-total">
          Continue with {total} {total === 1 ? 'traveller' : 'travellers'}
        </Button>
      }
    >
      <section className="card" aria-labelledby="f03-who">
        <h2 id="f03-who" className="section-title">
          Who's travelling <span lang="bn">· যাত্রী</span>
        </h2>
        <Stepper
          label="Adults"
          hint="Age 12 and over (age band to confirm)"
          unit={['adult', 'adults']}
          value={adults}
          min={1}
          onChange={(n) => {
            setAdults(n);
            setBlocked(false);
          }}
          canIncrement={canAdd}
          onBlockedIncrement={() => setBlocked(true)}
        />
        <Stepper
          label="Children"
          hint="Age 3 to 11 (age band to confirm)"
          unit={['child', 'children']}
          value={children}
          onChange={(n) => {
            setChildren(n);
            setBlocked(false);
          }}
          canIncrement={canAdd}
          onBlockedIncrement={() => setBlocked(true)}
        />
        <p className="small-note">
          Max {DAILY_LIMIT} tickets per buyer per day <span className="rule-tag">(rule to confirm)</span> · you've used{' '}
          <span className="mono">{usedToday}</span> today
        </p>
        {blocked ? (
          <Notice
            tone="warning"
            title={`You can buy up to ${remaining} ${remaining === 1 ? 'ticket' : 'tickets'} today`}
            actions={
              <Button variant="secondary" iconAfter="arrow-right">
                Start a linked group booking
              </Button>
            }
          >
            For more than {DAILY_LIMIT} travellers, use a linked group booking: you buy one package and another adult
            traveller buys the other. Both packages share one seat hold <span className="rule-tag">(rule to confirm)</span>.
          </Notice>
        ) : null}
        <AllowancePill used={usedToday} />
      </section>

      <fieldset className="card radio-cards">
        <legend className="section-title">
          Class <span lang="bn">· শ্রেণি</span>
        </legend>
        {classes.map((c) => (
          <label key={c.id} className={`radio-card ${cls === c.id ? 'is-checked' : ''}`}>
            <input type="radio" name="class" value={c.id} checked={cls === c.id} onChange={() => setCls(c.id)} />
            <span className="radio-card__main">
              <span className="radio-card__title">{c.label}</span>
              <span className="radio-card__meta">{c.seats}</span>
            </span>
            <span className="radio-card__price mono">{taka(c.fare)}</span>
          </label>
        ))}
      </fieldset>

      <p className="total-line" id="f03-total">
        Estimated: <span className="mono">{total} × {taka(fare)}</span> fare + <span className="mono">{taka(20)}</span>{' '}
        non-refundable service charge per ticket
      </p>
    </ScreenShell>
  );
}
