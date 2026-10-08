import { useId, type ReactNode } from 'react';
import { Icon } from './Icon';

export interface StepperProps {
  label: ReactNode;
  /** Singular / plural nouns used in button labels and announcements. */
  unit: [singular: string, plural: string];
  hint?: ReactNode;
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  /**
   * When provided and returns false, + does not change the value; instead
   * onBlockedIncrement is called (e.g. to show daily-limit guidance).
   */
  canIncrement?: () => boolean;
  onBlockedIncrement?: () => void;
}

/**
 * Number stepper. Buttons use aria-disabled (not disabled) at the bounds so
 * focus is never lost; the current value is announced politely on change.
 */
export function Stepper({
  label,
  unit,
  hint,
  value,
  min = 0,
  max = 9,
  onChange,
  canIncrement,
  onBlockedIncrement,
}: StepperProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const atMin = value <= min;
  const atMax = value >= max;
  const noun = (n: number) => (n === 1 ? unit[0] : unit[1]);

  const dec = () => {
    if (atMin) return;
    onChange(value - 1);
  };
  const inc = () => {
    if (atMax) return;
    if (canIncrement && !canIncrement()) {
      onBlockedIncrement?.();
      return;
    }
    onChange(value + 1);
  };

  return (
    <div className="stepper" role="group" aria-labelledby={labelId} aria-describedby={hint ? hintId : undefined}>
      <div className="stepper__text">
        <span className="stepper__label" id={labelId}>
          {label}
        </span>
        {hint ? (
          <span className="stepper__hint" id={hintId}>
            {hint}
          </span>
        ) : null}
      </div>
      <div className="stepper__controls">
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Remove one ${unit[0]}`}
          aria-disabled={atMin || undefined}
          onClick={dec}
        >
          <Icon name="minus" />
        </button>
        <span className="stepper__value mono" aria-hidden="true">
          {value}
        </span>
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Add one ${unit[0]}`}
          aria-disabled={atMax || undefined}
          onClick={inc}
        >
          <Icon name="plus" />
        </button>
      </div>
      {/* Current value: readable in browse mode and announced politely when it changes */}
      <span className="visually-hidden" aria-live="polite" aria-atomic="true" data-testid="stepper-live">
        {`${value} ${noun(value)}`}
      </span>
    </div>
  );
}
