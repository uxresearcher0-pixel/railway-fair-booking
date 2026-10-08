import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon } from './Icon';

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  id?: string;
  /** Extra content shown after the input (e.g. a masked value action). */
  after?: ReactNode;
}

/**
 * Labelled text input. Hint and error are linked with aria-describedby;
 * aria-invalid is set when there is an error. Errors are prefixed with
 * a visually-hidden "Error:" and an icon so they never rely on colour.
 */
export function Field({ label, hint, error, id, after, className = '', ...inputProps }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? `f${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={errorId}>
          <Icon name="danger" size={18} />
          <span className="visually-hidden">Error: </span>
          {error}
        </p>
      ) : null}
      <input
        id={inputId}
        className="field__input"
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        {...inputProps}
      />
      {after}
    </div>
  );
}
