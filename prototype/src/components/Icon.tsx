import type { SVGProps } from 'react';

export type IconName =
  | 'check' | 'info' | 'warning' | 'danger' | 'clock' | 'plus' | 'minus'
  | 'x' | 'arrow-right' | 'arrow-left' | 'user' | 'send' | 'ticket' | 'shield' | 'seat' | 'lock';

const paths: Record<IconName, JSX.Element> = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>),
  warning: (<><path d="M12 3.5l9.5 16.5h-19z" /><path d="M12 10v4.5M12 17.5v.5" /></>),
  danger: (<><circle cx="12" cy="12" r="9" /><path d="M12 7.5v6M12 16.5v.5" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-left': <path d="M19 12H5M11 6l-6 6 6 6" />,
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>),
  send: <path d="M4 12l16-8-6 16-2.5-6.5z" />,
  ticket: (<><path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v8a2 2 0 00-2 2H5a2 2 0 00-2-2z" /><path d="M9 6v12" strokeDasharray="2 2" /></>),
  shield: <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />,
  seat: <path d="M7 4v9h10M7 13l-1 7M17 13l1 7M7 17h10" />,
  lock: (<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>),
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

/** Decorative icon. Always paired with visible or visually-hidden text. */
export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
