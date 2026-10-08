import { useState } from 'react';
import { G2aInvite } from './G2aInvite';
import { G2bJoin } from './G2bJoin';
import { G5PayPackageB } from './G5PayPackageB';

const steps = [
  { id: 'g2a', label: 'G2a · Invite (Abdul’s phone)' },
  { id: 'g2b', label: 'G2b · Join (Salma’s phone)' },
  { id: 'g5', label: 'G5 · Pay Package B' },
] as const;
type StepId = (typeof steps)[number]['id'];

/** Linked group flow: G2a → G2b → G5, with simulated state passed forward. */
export function AppFlow({ start = 'g2a' }: { start?: StepId }) {
  const [step, setStep] = useState<StepId>(start);
  const [moved, setMoved] = useState(false);
  const go = (s: StepId) => {
    setMoved(true);
    setStep(s);
  };

  return (
    <div className="flow">
      <nav className="flow__nav" aria-label="Prototype flow">
        <ol>
          {steps.map((s) => (
            <li key={s.id}>
              <button type="button" className="flow__step" aria-current={step === s.id ? 'step' : undefined} onClick={() => go(s.id)}>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      {step === 'g2a' ? <G2aInvite key="g2a" initialBuyerId="t2" focusHeading={moved} onNext={() => go('g2b')} /> : null}
      {step === 'g2b' ? <G2bJoin key="g2b" focusHeading={moved} onNext={() => go('g5')} /> : null}
      {step === 'g5' ? <G5PayPackageB key="g5" focusHeading={moved} /> : null}
    </div>
  );
}
