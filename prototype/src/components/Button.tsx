import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Shows a spinner, sets aria-busy and blocks activation while keeping focus. */
  loading?: boolean;
  /** Text announced/displayed while loading, e.g. "Paying…" */
  loadingLabel?: string;
  icon?: IconName;
  iconAfter?: IconName;
  block?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  loadingLabel,
  icon,
  iconAfter,
  block = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, block ? 'btn--block' : '', loading ? 'is-loading' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={(e) => {
        if (loading) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : icon ? <Icon name={icon} /> : null}
      <span>{loading && loadingLabel ? loadingLabel : children}</span>
      {!loading && iconAfter ? <Icon name={iconAfter} /> : null}
    </button>
  );
}
