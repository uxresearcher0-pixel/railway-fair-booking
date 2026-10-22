import { COUNTER_TERMINAL } from '../data/demo';
import { useT } from '../i18n/lang';

export type CounterSection = 'ctd01' | 'ctd02' | 'ctd03' | 'ctd04';

const items: { id: CounterSection | 'shift'; en: string; bn: string }[] = [
  { id: 'ctd01', en: 'Find or start', bn: 'খুঁজুন বা শুরু করুন' },
  { id: 'ctd02', en: 'Apply for a draw', bn: 'ড্র-এর জন্য আবেদন' },
  { id: 'ctd03', en: 'Take payment', bn: 'টাকা নিন' },
  { id: 'ctd04', en: 'Recover a ticket', bn: 'টিকিট পুনরুদ্ধার' },
  { id: 'shift', en: 'Shift and cash', bn: 'শিফট ও নগদ' },
];

/**
 * Side-rail navigation of the station counter terminal (CTD01–CTD04). A labelled <nav> with
 * aria-current="page" on the open section. At ≥ 1024px it is a column on the left; on smaller
 * screens it is a wrapping list above the content (it never covers or hides the content).
 * "Shift and cash" is not built in this prototype: it is shown as text, not as a dead link.
 */
export function CounterRail({ current }: { current: CounterSection }) {
  const { t, num } = useT();
  return (
    <nav className="rail" aria-label={t('Counter terminal', 'কাউন্টার টার্মিনাল')}>
      <p className="rail__place">
        <span className="rail__label">{t('Station counter', 'স্টেশন কাউন্টার')}</span>
        <span>
          {t(COUNTER_TERMINAL.station, COUNTER_TERMINAL.stationBn)} · <span lang="en" className="mono">{COUNTER_TERMINAL.id}</span>
        </span>
        <span className="rail__staff">
          {t('Staff', 'কর্মী')} <span className="mono">{num(COUNTER_TERMINAL.staff)}</span>
        </span>
      </p>
      <ul className="rail__list">
        {items.map((i) => (
          <li key={i.id}>
            {i.id === 'shift' ? (
              <span className="rail__item rail__item--off">
                {t(i.en, i.bn)}
                <span className="rail__soon">{t('not in this prototype', 'এই প্রোটোটাইপে নেই')}</span>
              </span>
            ) : (
              <a className="rail__item" href={`#/${i.id}`} aria-current={i.id === current ? 'page' : undefined}>
                {t(i.en, i.bn)}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
