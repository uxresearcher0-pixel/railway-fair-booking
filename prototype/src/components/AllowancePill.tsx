import { Icon } from './Icon';
import { useT } from '../i18n/lang';
import { BOOKINGS_PER_DAY, SEATS_PER_BOOKING } from '../data/demo';

export interface AllowancePillProps {
  /** Bookings already made today on this NID. */
  used: number;
  limit?: number;
}

/** "Today: N of 2 bookings · max 4 seats each" — the daily per-NID allowance (published terms). */
export function AllowancePill({ used, limit = BOOKINGS_PER_DAY }: AllowancePillProps) {
  const { bn, num } = useT();
  const full = used >= limit;
  return (
    <p className={`allowance ${full ? 'allowance--full' : ''}`}>
      <span className="allowance__pips" aria-hidden="true">
        {Array.from({ length: limit }, (_, i) => (
          <span key={i} className={`allowance__pip ${i < used ? 'is-used' : ''}`} />
        ))}
      </span>
      {full ? <Icon name="warning" size={16} /> : null}
      {bn ? (
        <span>
          আজ: <span className="mono">{num(limit)}</span>টি বুকিংয়ের মধ্যে <strong className="mono">{num(used)}</strong>টি · প্রতিটিতে সর্বোচ্চ{' '}
          <span className="mono">{num(SEATS_PER_BOOKING)}</span>টি আসন
        </span>
      ) : (
        <span>
          Today: <strong className="mono">{used}</strong> of <span className="mono">{limit}</span> bookings · max{' '}
          <span className="mono">{SEATS_PER_BOOKING}</span> seats each
        </span>
      )}
    </p>
  );
}
