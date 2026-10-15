import { useState } from 'react';
import { P21v2ApplyDraw } from './P21v2ApplyDraw';
import { P22v2Offer } from './P22v2Offer';
import { P10v2OfficialTotal } from './P10v2OfficialTotal';
import { R3v2ReportCharge } from './R3v2ReportCharge';
import { useT } from '../i18n/lang';

const stepIds = ['p21', 'p22', 'p10', 'r3'] as const;
type StepId = (typeof stepIds)[number];

/** v2 busy-train flow: P21·v2 apply → P22·v2 picked → P10·v2 official total (→ R3·v2 report an extra charge). */
export function ApplyFlowV2({ start = 'p21', timerPaused = false }: { start?: StepId; timerPaused?: boolean }) {
  const { t, lang } = useT();
  const [step, setStep] = useState<StepId>(start);
  const [moved, setMoved] = useState(false);
  const go = (s: StepId) => {
    setMoved(true);
    setStep(s);
  };
  // Screen codes stay in Latin script (lang="en"), the step name is translated.
  const labels: Record<StepId, [string, string]> = {
    p21: ['P21·v2', t('Apply', 'আবেদন')],
    p22: ['P22·v2', t('Picked', 'নির্বাচিত')],
    p10: ['P10·v2', t('Official total', 'অফিশিয়াল মোট')],
    r3: ['R3·v2', t('Report a charge', 'বাড়তি টাকার রিপোর্ট')],
  };

  return (
    <div className="flow" lang={lang}>
      <nav className="flow__nav" aria-label={t('Prototype flow', 'প্রোটোটাইপের ধাপ')}>
        <ol>
          {stepIds.map((s) => (
            <li key={s}>
              <button type="button" className="flow__step" aria-current={step === s ? 'step' : undefined} onClick={() => go(s)}>
                <span lang="en">{labels[s][0]}</span> · {labels[s][1]}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      {step === 'p21' ? <P21v2ApplyDraw key="p21" focusHeading={moved} onNext={() => go('p22')} /> : null}
      {step === 'p22' ? <P22v2Offer key="p22" focusHeading={moved} timerPaused={timerPaused} onNext={() => go('p10')} /> : null}
      {step === 'p10' ? <P10v2OfficialTotal key="p10" focusHeading={moved} onReport={() => go('r3')} /> : null}
      {step === 'r3' ? <R3v2ReportCharge key="r3" focusHeading={moved} onBack={() => go('p10')} /> : null}
    </div>
  );
}
