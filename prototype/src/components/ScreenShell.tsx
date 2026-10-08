import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from './Icon';

/** Persistent concept banner — shown on every screen. */
export function DemoBanner() {
  return (
    <p className="demo-banner">
      <Icon name="info" size={16} />
      <span>Concept demo — not a real booking service</span>
    </p>
  );
}

export interface ScreenShellProps {
  /** Screen ID from the UI map, e.g. "F03". Shown small, for reviewers. */
  screenId: string;
  title: ReactNode;
  /** Optional Bangla gloss shown beside the title (rendered with lang="bn"). */
  titleBn?: string;
  /** Text under the h1. */
  lede?: ReactNode;
  /** Back link label; omit to hide. */
  backLabel?: string;
  onBack?: () => void;
  /** Move focus to the h1 on mount (used when screens change in a flow). */
  focusHeading?: boolean;
  /** Sticky footer actions. */
  footer?: ReactNode;
  children: ReactNode;
}

export function ScreenShell({
  screenId,
  title,
  titleBn,
  lede,
  backLabel,
  onBack,
  focusHeading = false,
  footer,
  children,
}: ScreenShellProps) {
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusHeading) h1.current?.focus();
  }, [focusHeading]);

  return (
    <div className="screen">
      <header className="topbar">
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <DemoBanner />
        <div className="topbar__row">
          {backLabel ? (
            <button type="button" className="icon-btn" onClick={onBack}>
              <Icon name="arrow-left" />
              <span className="visually-hidden">{backLabel}</span>
            </button>
          ) : null}
          <p className="wordmark">
            rail<span>fair</span>
          </p>
          <span className="screen-id mono" aria-hidden="true">
            {screenId}
          </span>
        </div>
      </header>
      <main id="main" className="screen__main">
        <div className="screen__head">
          <h1 ref={h1} tabIndex={-1}>
            {title}
            {titleBn ? (
              <>
                {' '}
                <span className="title-bn" lang="bn">
                  {titleBn}
                </span>
              </>
            ) : null}
          </h1>
          {lede ? <p className="lede">{lede}</p> : null}
        </div>
        {children}
      </main>
      {footer ? <footer className="screen__footer">{footer}</footer> : null}
    </div>
  );
}
