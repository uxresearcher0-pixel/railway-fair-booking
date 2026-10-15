import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';

const defaultIcon: Record<Tone, IconName> = {
  neutral: 'clock',
  info: 'info',
  success: 'check',
  warning: 'warning',
  danger: 'x',
  accent: 'check',
};

export interface StatusPillProps {
  tone?: Tone;
  icon?: IconName | null;
  /** Optional visually-hidden prefix, e.g. "Invite status:" */
  srPrefix?: string;
  children: ReactNode;
}

/** Status shown with icon + text, never colour alone. */
export function StatusPill({ tone = 'neutral', icon, srPrefix, children }: StatusPillProps) {
  const iconName = icon === null ? null : icon ?? defaultIcon[tone];
  return (
    <span className={`pill pill--${tone}`}>
      {iconName ? <Icon name={iconName} size={16} /> : null}
      {srPrefix ? <span className="visually-hidden">{srPrefix} </span> : null}
      <span>{children}</span>
    </span>
  );
}

/** Alias kept for the design-system naming in Figma. */
export const Badge = StatusPill;
