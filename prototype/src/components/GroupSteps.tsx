import { Icon } from './Icon';
import { useT } from '../i18n/lang';

export type GroupStep = 'group' | 'seats' | 'pay' | 'tickets';

const steps: { id: GroupStep; en: string; bn: string }[] = [
  { id: 'group', en: 'Group', bn: 'দল' },
  { id: 'seats', en: 'Coach & seats', bn: 'বগি ও আসন' },
  { id: 'pay', en: 'Pay (each package)', bn: 'পরিশোধ (প্রতিটি প্যাকেজ)' },
  { id: 'tickets', en: 'Tickets', bn: 'টিকিট' },
];

/**
 * Progress of the group-of-7 journey (DW09–DW12): an ordered list, the current step marked with
 * aria-current="step", finished steps with a check icon and the words "done". Not interactive.
 */
export function GroupSteps({ current }: { current: GroupStep }) {
  const { t, num } = useT();
  const at = steps.findIndex((s) => s.id === current);
  return (
    <ol className="group-steps" aria-label={t('Group booking steps', 'দলের বুকিংয়ের ধাপ')}>
      {steps.map((s, i) => (
        <li key={s.id} className={i === at ? 'is-current' : i < at ? 'is-done' : undefined} aria-current={i === at ? 'step' : undefined}>
          <span className="group-steps__n mono" aria-hidden="true">
            {num(String(i + 1).padStart(2, '0'))}
          </span>
          <span>{t(s.en, s.bn)}</span>
          {i < at ? (
            <>
              <Icon name="check" size={14} />
              <span className="visually-hidden">{t(' (done)', ' (সম্পন্ন)')}</span>
            </>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
