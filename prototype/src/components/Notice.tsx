import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger';

const icons: Record<NoticeTone, IconName> = { info: 'info', success: 'check', warning: 'warning', danger: 'danger' };
const labels: Record<NoticeTone, string> = { info: 'Information', success: 'Done', warning: 'Warning', danger: 'Problem' };

export interface NoticeProps {
  tone?: NoticeTone;
  title?: ReactNode;
  children?: ReactNode;
  /**
   * Live behaviour. "auto" (default): danger → role="alert" (assertive),
   * others → role="status" (polite). "off": a static note with no live role,
   * for guidance that is present when the screen loads.
   */
  live?: 'auto' | 'off';
  actions?: ReactNode;
  id?: string;
}

export function Notice({ tone = 'info', title, children, live = 'auto', actions, id }: NoticeProps) {
  const role = live === 'off' ? undefined : tone === 'danger' ? 'alert' : 'status';
  return (
    <div className={`notice notice--${tone}`} role={role} id={id}>
      <span className="notice__icon">
        <Icon name={icons[tone]} />
      </span>
      <div className="notice__body">
        {title ? (
          <p className="notice__title">
            <span className="visually-hidden">{labels[tone]}: </span>
            {title}
          </p>
        ) : (
          <span className="visually-hidden">{labels[tone]}: </span>
        )}
        {children ? <div className="notice__text">{children}</div> : null}
        {actions ? <div className="notice__actions">{actions}</div> : null}
      </div>
    </div>
  );
}
