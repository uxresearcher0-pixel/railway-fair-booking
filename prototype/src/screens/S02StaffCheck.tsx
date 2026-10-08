import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { StatusPill } from '../components/StatusPill';
import { Notice } from '../components/Notice';
import { Button } from '../components/Button';
import { BOOKING_REF, masked, salma, trip } from '../data/demo';

type Outcome = 'matches' | 'mismatch' | 'not-checked';
const outcomes: { id: Outcome; label: string; meta: string }[] = [
  { id: 'matches', label: 'ID shown matches the ticket', meta: 'Name and photo ID agree with the named traveller' },
  { id: 'mismatch', label: "ID doesn't match", meta: 'Record an exception. This is not proof of misconduct.' },
  { id: 'not-checked', label: "Couldn't check", meta: 'Recorded as "not checked", never as invalid' },
];

export interface S02Props {
  initialOutcome?: Outcome;
  recorded?: boolean;
}

export function S02StaffCheck({ initialOutcome, recorded = false }: S02Props) {
  const [outcome, setOutcome] = useState<Outcome | undefined>(initialOutcome);
  const [saved, setSaved] = useState(recorded);
  const [error, setError] = useState('');

  return (
    <ScreenShell screenId="S02" title="Check a ticket" lede={`Staff view · ${trip.train} · Coach ${trip.coach}`} backLabel="Back to coach list">
      <section className="card panel panel--system" aria-labelledby="s02-system">
        <div className="card__head">
          <h2 id="s02-system" className="section-title">
            Ticket status <span className="panel__tag">System</span>
          </h2>
          <StatusPill tone="success" srPrefix="Ticket status:">
            Active
          </StatusPill>
        </div>
        <dl className="kv">
          <div>
            <dt>Booking</dt>
            <dd className="mono">{BOOKING_REF}</dd>
          </div>
          <div>
            <dt>
              Traveller <span lang="bn">· যাত্রী</span>
            </dt>
            <dd>
              {salma.name} · NID {masked(salma.idLast4)}
            </dd>
          </div>
          <div>
            <dt>Journey</dt>
            <dd>
              {trip.from.code} → {trip.to.code} · {trip.date} · Seat <span className="mono">{trip.coach}-{salma.seat}</span>
            </dd>
          </div>
          <div>
            <dt>QR signature</dt>
            <dd>Valid · checked against ticket status 07:42 (cached)</dd>
          </div>
          <div>
            <dt>Identity record</dt>
            <dd>NID record matched at booking</dd>
          </div>
        </dl>
        <p className="small-note">A QR shows the ticket is genuine. It does not prove who is holding it.</p>
      </section>

      <section className="card panel panel--staff" aria-labelledby="s02-person">
        <div className="card__head">
          <h2 id="s02-person" className="section-title">
            Person check <span className="panel__tag">Staff</span>
          </h2>
          {saved && outcome ? (
            <StatusPill tone={outcome === 'matches' ? 'success' : outcome === 'mismatch' ? 'warning' : 'neutral'} srPrefix="Person check:">
              Recorded
            </StatusPill>
          ) : (
            <StatusPill tone="neutral" srPrefix="Person check:">
              To check
            </StatusPill>
          )}
        </div>
        <fieldset className="radio-cards radio-cards--flat" disabled={saved} aria-describedby={error ? 's02-error' : undefined}>
          <legend className="sub-title">Result of ID check by staff</legend>
          {error ? (
            <p className="field__error" id="s02-error">
              <span className="visually-hidden">Error: </span>
              {error}
            </p>
          ) : null}
          {outcomes.map((o) => (
            <label key={o.id} className={`radio-card ${outcome === o.id ? 'is-checked' : ''}`}>
              <input
                type="radio"
                name="outcome"
                value={o.id}
                checked={outcome === o.id}
                onChange={() => {
                  setOutcome(o.id);
                  setError('');
                }}
              />
              <span className="radio-card__main">
                <span className="radio-card__title">{o.label}</span>
                <span className="radio-card__meta">{o.meta}</span>
              </span>
            </label>
          ))}
        </fieldset>
        {saved ? (
          <Notice tone="success" title="Person check recorded">
            Saved separately from the ticket status, which is unchanged. Syncs when the device is online.
          </Notice>
        ) : (
          <Button
            block
            onClick={() => {
              if (!outcome) {
                setError('Choose a result before recording.');
                return;
              }
              setSaved(true);
            }}
          >
            Record person check
          </Button>
        )}
      </section>
    </ScreenShell>
  );
}
