import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { toBnDigits, useT } from '../i18n/lang';

export interface HoldTimerProps {
  /** Seconds left on the hold when mounted. */
  initialSeconds: number;
  /** Freeze the countdown (used for static stories/screenshots). */
  paused?: boolean;
  /** What the hold covers, e.g. "Package B seats". */
  subject?: string;
  onExpire?: () => void;
}

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const minutesText = (m: number) => `${m} minute${m === 1 ? '' : 's'}`;
const minutesTextBn = (m: number) => `${toBnDigits(String(m))} মিনিট`;

/**
 * Visible mm:ss countdown (role="timer", not live) plus a separate polite live
 * region that only speaks at whole-minute marks and on expiry — never every second.
 */
export function HoldTimer({ initialSeconds, paused = false, subject: subjectProp, onExpire }: HoldTimerProps) {
  const { bn, t, num } = useT();
  const subject = subjectProp ?? t('Seats', 'আসন');
  const [left, setLeft] = useState(Math.max(0, initialSeconds));
  const [announcement, setAnnouncement] = useState('');
  const expiredRef = useRef(false);

  useEffect(() => {
    if (paused || left <= 0) return;
    const t = setTimeout(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [left, paused]);

  useEffect(() => {
    if (left === initialSeconds) return; // nothing to announce on mount
    if (left === 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        setAnnouncement(bn ? `হোল্ড শেষ। ${subject} ছেড়ে দেওয়া হয়েছে।` : `Hold expired. ${subject} have been released.`);
        onExpire?.();
      }
    } else if (left % 60 === 0) {
      setAnnouncement(bn ? `হোল্ডে আর ${minutesTextBn(left / 60)} বাকি।` : `${minutesText(left / 60)} left on the hold.`);
    }
  }, [left, initialSeconds, subject, onExpire, bn]);

  const expired = left === 0;
  const low = !expired && left < 120;
  const pct = initialSeconds > 0 ? (left / initialSeconds) * 100 : 0;

  return (
    <section className={`hold ${low ? 'hold--low' : ''} ${expired ? 'hold--expired' : ''}`} aria-label={t('Seat hold', 'আসন হোল্ড')}>
      <div className="hold__row">
        <Icon name={expired ? 'x' : 'clock'} />
        <p className="hold__label">{expired ? t(`${subject} released`, `${subject} ছেড়ে দেওয়া হয়েছে`) : t(`${subject} held for`, `${subject} হোল্ড আছে আর`)}</p>
        <p className="hold__time mono" role="timer" aria-label={expired ? t('Hold expired', 'হোল্ড শেষ') : t(`${fmt(left)} left`, `${num(fmt(left))} বাকি`)}>
          {num(expired ? '00:00' : fmt(left))}
        </p>
      </div>
      <div className="hold__bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="hold__note">
        {expired
          ? t('You have not been charged.', 'আপনার কাছ থেকে কোনো টাকা কাটা হয়নি।')
          : t('Pay before the timer ends. Seats are released when it reaches zero.', 'টাইমার শেষ হওয়ার আগে পরিশোধ করুন। শূন্যে পৌঁছালে আসন ছেড়ে দেওয়া হয়।')}
      </p>
      <p className="visually-hidden" aria-live="polite" aria-atomic="true" data-testid="hold-live">
        {announcement}
      </p>
    </section>
  );
}
