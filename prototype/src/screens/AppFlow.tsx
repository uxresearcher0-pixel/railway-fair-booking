import { useState } from 'react';
import { G2aInvite } from './G2aInvite';
import { G2bJoin } from './G2bJoin';
import { G3aChooseCoach } from './G3aChooseCoach';
import { G3bWhereInCoach } from './G3bWhereInCoach';
import { G5PayPackageB } from './G5PayPackageB';
import { useT } from '../i18n/lang';

const stepIds = ['g2a', 'g2b', 'g3a', 'g3b', 'g5'] as const;
type StepId = (typeof stepIds)[number];

/** Linked group flow: G2a → G2b → G3a → G3b → G5, with simulated state passed forward. */
export function AppFlow({ start = 'g2a' }: { start?: StepId }) {
  const { t, lang } = useT();
  const [step, setStep] = useState<StepId>(start);
  const [moved, setMoved] = useState(false);
  const [coach, setCoach] = useState('GHA');
  const go = (s: StepId) => {
    setMoved(true);
    setStep(s);
  };
  const labels: Record<StepId, string> = {
    g2a: t('G2a · Invite (Abdul’s phone)', 'G2a · আমন্ত্রণ (আব্দুলের ফোন)'),
    g2b: t('G2b · Join (Salma’s phone)', 'G2b · যোগ দিন (সালমার ফোন)'),
    g3a: t('G3a · Choose a coach', 'G3a · বগি বেছে নিন'),
    g3b: t('G3b · Where in the coach', 'G3b · বগির কোথায়'),
    g5: t('G5 · Pay Package B', 'G5 · প্যাকেজ B-এর টাকা'),
  };

  return (
    <div className="flow" lang={lang}>
      <nav className="flow__nav" aria-label={t('Prototype flow', 'প্রোটোটাইপের ধাপ')}>
        <ol>
          {stepIds.map((s) => (
            <li key={s}>
              <button type="button" className="flow__step" aria-current={step === s ? 'step' : undefined} onClick={() => go(s)}>
                {labels[s]}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      {step === 'g2a' ? <G2aInvite key="g2a" initialBuyerId="t2" focusHeading={moved} onNext={() => go('g2b')} /> : null}
      {step === 'g2b' ? <G2bJoin key="g2b" focusHeading={moved} onNext={() => go('g3a')} /> : null}
      {step === 'g3a' ? (
        <G3aChooseCoach
          key="g3a"
          initialCoach={coach}
          focusHeading={moved}
          onNext={(c) => {
            setCoach(c.code);
            go('g3b');
          }}
        />
      ) : null}
      {step === 'g3b' ? <G3bWhereInCoach key="g3b" coachCode={coach} focusHeading={moved} onBack={() => go('g3a')} onNext={() => go('g5')} /> : null}
      {step === 'g5' ? <G5PayPackageB key="g5" focusHeading={moved} /> : null}
    </div>
  );
}
