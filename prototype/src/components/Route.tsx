import { useT } from '../i18n/lang';
import { trip } from '../data/demo';

/**
 * "Dhaka (DHK) → Chattogram (CTG)" in English. In Bangla: "ঢাকা → চট্টগ্রাম", station names only,
 * until the railway's official abbreviations are confirmed (railway-decisions.md #32).
 */
export function Route() {
  const { bn } = useT();
  if (bn) return <>{`${trip.from.nameBn} → ${trip.to.nameBn}`}</>;
  return (
    <>
      {trip.from.name} <span className="mono">({trip.from.code})</span> → {trip.to.name}{' '}
      <span className="mono">({trip.to.code})</span>
    </>
  );
}

/** Train, date and class/coach text for the demo trip. */
export function useTrip() {
  const { t, num } = useT();
  return {
    train: t(trip.train, trip.trainBn),
    date: t(trip.date, trip.dateBn),
    departs: num(trip.departs),
    arrives: num(trip.arrives),
    coach: t(trip.coach, trip.coachBn),
    className: t(trip.className, trip.classNameBn),
  };
}
