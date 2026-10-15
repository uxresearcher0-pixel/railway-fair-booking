import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from './Icon';
import { useT } from '../i18n/lang';

/** Persistent concept banner — shown on every screen. */
export function DemoBanner() {
  const { t } = useT();
  return (
    <p className="demo-banner">
      <Icon name="info" size={16} />
      <span>{t('Concept demo — not a real booking service', 'কনসেপ্ট ডেমো — এটি আসল বুকিং সেবা নয়')}</span>
    </p>
  );
}

/** EN / বাংলা switch. Each button is a toggle (aria-pressed) in a labelled group. */
export function LangSwitch() {
  const { lang, setLang, t } = useT();
  return (
    <div className="lang-switch" role="group" aria-label={t('Language', 'ভাষা')}>
      <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
      <button type="button" lang="bn" aria-pressed={lang === 'bn'} onClick={() => setLang('bn')}>
        বাংলা
      </button>
    </div>
  );
}

export interface ScreenShellProps {
  /** Screen ID from the UI map, e.g. "F03". Shown small, for reviewers. */
  screenId: string;
  title: ReactNode;
  /** Optional Bangla gloss shown beside the English title (rendered with lang="bn"; hidden in Bangla mode). */
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
  /** Small context line above the h1 (e.g. "Station counter · shift 08:00–14:00"). */
  eyebrow?: ReactNode;
  /**
   * Side-rail navigation (a <nav>), rendered between the header and <main>. At ≥ 1024px it sits
   * in a column on the left; below that it is a wrapping list above the content.
   */
  rail?: ReactNode;
  /** Wider desktop column (main + side layouts). */
  wide?: boolean;
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
  eyebrow,
  rail,
  wide = false,
  children,
}: ScreenShellProps) {
  const { lang, bn, t } = useT();
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusHeading) h1.current?.focus();
  }, [focusHeading]);

  return (
    <div className={['screen', wide || rail ? 'screen--wide' : '', rail ? 'screen--rail' : ''].filter(Boolean).join(' ')} lang={lang}>
      <header className="topbar">
        <a className="skip-link" href="#main">
          {t('Skip to main content', 'মূল অংশে যান')}
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
          <LangSwitch />
        </div>
      </header>
      {rail}
      <main id="main" className="screen__main">
        <div className="screen__head">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 ref={h1} tabIndex={-1}>
            {title}
            {titleBn && !bn ? (
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
