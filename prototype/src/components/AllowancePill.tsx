import { Icon } from './Icon';

export interface AllowancePillProps {
  used: number;
  limit?: number;
}

/** "Today: N of 4 tickets used (rule to confirm)" — the daily buyer allowance. */
export function AllowancePill({ used, limit = 4 }: AllowancePillProps) {
  const full = used >= limit;
  return (
    <p className={`allowance ${full ? 'allowance--full' : ''}`}>
      <span className="allowance__pips" aria-hidden="true">
        {Array.from({ length: limit }, (_, i) => (
          <span key={i} className={`allowance__pip ${i < used ? 'is-used' : ''}`} />
        ))}
      </span>
      {full ? <Icon name="warning" size={16} /> : null}
      <span>
        Today: <strong className="mono">{used}</strong> of <span className="mono">{limit}</span> tickets used{' '}
        <span className="rule-tag">(rule to confirm)</span>
      </span>
    </p>
  );
}
