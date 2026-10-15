import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from './Icon';
import { useT } from '../i18n/lang';

export type SeatState = 'available' | 'taken' | 'held';

export interface Seat {
  row: number;
  col: string; // A–E
  state: SeatState;
}

export const SEAT_COLS = ['A', 'B', 'C', 'D', 'E'] as const;
/** 2 + 3 layout: aisle after column B. A and E are windows. */
const position = (col: string) => (col === 'A' || col === 'E' ? 'window' : col === 'B' || col === 'C' ? 'aisle' : 'middle');

export function makeCoach(rows: number, taken: string[] = [], held: string[] = []): Seat[] {
  const seats: Seat[] = [];
  for (let r = 1; r <= rows; r++) {
    for (const c of SEAT_COLS) {
      const id = `${r}${c}`;
      seats.push({ row: r, col: c, state: taken.includes(id) ? 'taken' : held.includes(id) ? 'held' : 'available' });
    }
  }
  return seats;
}

export interface SeatMapProps {
  coach: string;
  seats: Seat[];
  selected: string[];
  onChange: (selected: string[]) => void;
  /** Maximum seats this buyer can pick (e.g. travellers in the package). */
  maxSelectable: number;
  /** Optional label for "held" seats, e.g. "Held for Package A". */
  heldLabel?: string;
  /** Optional seat number shown instead of the row+column ID (e.g. coach seats numbered 1–100). */
  seatNumber?: (row: number, col: string) => number;
}

/**
 * Seat map using the ARIA grid pattern with a roving tabindex: one Tab stop,
 * arrow keys move between seats, Home/End jump within a row, Ctrl+Home/End to
 * the first/last seat, Space/Enter toggles. Taken seats stay focusable with
 * aria-disabled so their state can be discovered.
 */
export function SeatMap({ coach, seats, selected, onChange, maxSelectable, heldLabel: heldProp, seatNumber }: SeatMapProps) {
  const { bn, t, num } = useT();
  const heldLabel = heldProp ?? t('Held for your group', 'আপনার দলের জন্য হোল্ড');
  /** What a seat is called: "4C", or its number ("17" / "১৭"). */
  const label = (id: string) => {
    const s = byIdRef.current.get(id);
    return seatNumber && s ? num(seatNumber(s.row, s.col)) : id;
  };
  const byIdRef = useRef(new Map<string, Seat>());
  const rows = useMemo(() => Array.from(new Set(seats.map((s) => s.row))).sort((a, b) => a - b), [seats]);
  const byId = useMemo(() => new Map(seats.map((s) => [`${s.row}${s.col}`, s])), [seats]);
  byIdRef.current = byId;
  const firstAvail = seats.find((s) => s.state === 'available') ?? seats[0];
  const [active, setActive] = useState<string>(selected[0] ?? `${firstAvail.row}${firstAvail.col}`);
  const summaryId = `${useId()}-summary`;
  const [message, setMessage] = useState('');
  const refs = useRef(new Map<string, HTMLButtonElement | null>());

  const move = (rowIdx: number, colIdx: number) => {
    const r = rows[Math.max(0, Math.min(rows.length - 1, rowIdx))];
    const c = SEAT_COLS[Math.max(0, Math.min(SEAT_COLS.length - 1, colIdx))];
    const id = `${r}${c}`;
    setActive(id);
    refs.current.get(id)?.focus();
  };

  const toggle = (id: string) => {
    const seat = byId.get(id);
    if (!seat || seat.state !== 'available') {
      setMessage(bn ? `আসন ${label(id)} খালি নেই।` : `Seat ${label(id)} is not available.`);
      return;
    }
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
      setMessage(bn ? `আসন ${label(id)} বাদ দেওয়া হয়েছে। ${num(maxSelectable)}টির মধ্যে ${num(selected.length - 1)}টি বেছে নেওয়া হয়েছে।` : `Seat ${label(id)} removed. ${selected.length - 1} of ${maxSelectable} chosen.`);
    } else if (selected.length >= maxSelectable) {
      setMessage(bn ? `আপনি ইতিমধ্যে ${num(maxSelectable)}টি আসন বেছে নিয়েছেন। আগে একটি বাদ দিন।` : `You have already chosen ${maxSelectable} seats. Remove one first.`);
    } else {
      onChange([...selected, id]);
      setMessage(bn ? `আসন ${label(id)} বেছে নেওয়া হয়েছে। ${num(maxSelectable)}টির মধ্যে ${num(selected.length + 1)}টি বেছে নেওয়া হয়েছে।` : `Seat ${label(id)} chosen. ${selected.length + 1} of ${maxSelectable} chosen.`);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const seat = byId.get(id)!;
    const ri = rows.indexOf(seat.row);
    const ci = SEAT_COLS.indexOf(seat.col as (typeof SEAT_COLS)[number]);
    switch (e.key) {
      case 'ArrowRight': move(ri, ci + 1); break;
      case 'ArrowLeft': move(ri, ci - 1); break;
      case 'ArrowDown': move(ri + 1, ci); break;
      case 'ArrowUp': move(ri - 1, ci); break;
      case 'Home': e.ctrlKey ? move(0, 0) : move(ri, 0); break;
      case 'End': e.ctrlKey ? move(rows.length - 1, SEAT_COLS.length - 1) : move(ri, SEAT_COLS.length - 1); break;
      case ' ':
      case 'Enter': toggle(id); break;
      default: return;
    }
    e.preventDefault();
  };

  const describe = (s: Seat, isSel: boolean) => {
    const id = `${s.row}${s.col}`;
    if (bn) {
      const pos = { window: 'জানালার পাশে', aisle: 'আইলের পাশে', middle: 'মাঝখানে' }[position(s.col)];
      const st = s.state === 'taken' ? 'বুক করা' : s.state === 'held' ? heldLabel : isSel ? 'বেছে নেওয়া' : 'খালি';
      return `আসন ${label(id)}, ${pos}, ${st}`;
    }
    const state = s.state === 'taken' ? 'taken' : s.state === 'held' ? heldLabel.toLowerCase() : isSel ? 'chosen' : 'available';
    return `Seat ${label(id)}, ${position(s.col)}, ${state}`;
  };

  return (
    <div className="seatmap">
      <p className="seatmap__summary" id={summaryId}>
        {bn ? (
          <>
            বগি <strong>{coach}</strong> · <span className="mono">{num(maxSelectable)}</span>টির মধ্যে <span className="mono">{num(selected.length)}</span>টি আসন বেছে নেওয়া হয়েছে
          </>
        ) : (
          <>
            Coach <strong>{coach}</strong> · <span className="mono">{selected.length}</span> of <span className="mono">{maxSelectable}</span> seats chosen
          </>
        )}
      </p>
      <div
        role="grid"
        aria-label={t(`Coach ${coach} seats, 2 plus 3 layout. Use arrow keys to move, Space to choose.`, `বগি ${coach}-এর আসন, ২ + ৩ বিন্যাস। সরাতে তীর চিহ্নের কী, বেছে নিতে স্পেস চাপুন।`)}
        aria-describedby={summaryId}
        className="seatmap__grid"
      >
        <div role="row" className="seatmap__row seatmap__row--head">
          <span role="columnheader" className="seatmap__rowhead">
            <span className="visually-hidden">{t('Row', 'সারি')}</span>
          </span>
          {SEAT_COLS.map((c) => (
            <span role="columnheader" key={c} className={`seatmap__colhead ${c === 'B' ? 'aisle-after' : ''}`}>
              {c}
            </span>
          ))}
        </div>
        {rows.map((r) => (
          <div role="row" key={r} className="seatmap__row">
            <span role="rowheader" className="seatmap__rowhead mono">
              <span className="visually-hidden">{t('Row ', 'সারি ')}</span>
              {num(r)}
            </span>
            {SEAT_COLS.map((c) => {
              const id = `${r}${c}`;
              const s = byId.get(id)!;
              const isSel = selected.includes(id);
              const unavailable = s.state !== 'available';
              return (
                <div role="gridcell" key={id} className={c === 'B' ? 'aisle-after' : undefined}>
                  <button
                    type="button"
                    ref={(el) => {
                      refs.current.set(id, el);
                    }}
                    tabIndex={active === id ? 0 : -1}
                    className={`seat seat--${isSel ? 'selected' : s.state}`}
                    aria-label={describe(s, isSel)}
                    aria-pressed={unavailable ? undefined : isSel}
                    aria-disabled={unavailable || undefined}
                    onClick={() => {
                      setActive(id);
                      toggle(id);
                    }}
                    onFocus={() => setActive(id)}
                    onKeyDown={(e) => onKeyDown(e, id)}
                    data-seat={id}
                  >
                    {isSel ? <Icon name="check" size={16} /> : s.state === 'taken' ? <Icon name="x" size={14} /> : s.state === 'held' ? <Icon name="lock" size={14} /> : null}
                    <span aria-hidden="true" className="seat__id mono">{label(id)}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <ul className="legend" aria-label={t('Seat legend', 'আসনের চিহ্ন')}>
        <li><span className="seat seat--available seat--swatch" aria-hidden="true" /> {t('Available', 'খালি')}</li>
        <li><span className="seat seat--selected seat--swatch" aria-hidden="true"><Icon name="check" size={14} /></span> {t('Chosen', 'বেছে নেওয়া')}</li>
        <li><span className="seat seat--taken seat--swatch" aria-hidden="true"><Icon name="x" size={12} /></span> {t('Taken', 'বুক করা')}</li>
        <li><span className="seat seat--held seat--swatch" aria-hidden="true"><Icon name="lock" size={12} /></span> {heldLabel}</li>
      </ul>
      <p className="visually-hidden" aria-live="polite" aria-atomic="true" data-testid="seat-live">
        {message}
      </p>
    </div>
  );
}
