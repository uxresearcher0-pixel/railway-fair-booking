import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { useT } from '../i18n/lang';
import type { SmsMessage } from '../sms/engine';

/** Keywords, report words and codes stay in Latin script: marked lang="en" inside Bangla text. */
const LATIN = /(\b(?:HELP|EXTRA|STATUS|SEND|EDIT|CANCEL|STOP|SKIP|CASH|DIGITAL|TOTAL|OTP|SMS)\b|\b[A-Z]{2}-[0-9A-Z]+(?:-[0-9A-Z]+)*\b|\brailfair\b)/;

/** Render SMS text, wrapping keywords and codes in lang="en" when the screen is in Bangla. */
export function SmsText({ text, bn }: { text: string; bn: boolean }) {
  if (!bn) return <>{text}</>;
  const parts = text.split(LATIN);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} lang="en">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** A keyword in running text: Latin, lang="en", in a code style. */
export function Kw({ children }: { children: ReactNode }) {
  return (
    <span lang="en" className="kw">
      {children}
    </span>
  );
}

export interface SmsThreadProps {
  messages: SmsMessage[];
  /** Quick-reply chips (the values sent). */
  quickReplies: string[];
  onSend: (text: string) => void;
  onRetry: (id: string) => void;
  /** Move focus to the newest message on mount (after loading a demo state). Never on each new message. */
  focusLatestOnMount?: boolean;
  /** Who this phone is, shown under the sender name. */
  phoneNote?: ReactNode;
}

/**
 * Phone Messages UI for the two-way SMS simulation. The message list is a polite live log: new
 * messages are announced without moving focus. Focus only moves after Retry (to that message,
 * because the button goes away) and after a quick reply (back to the input, because chips change).
 */
export function SmsThread({ messages, quickReplies, onSend, onRetry, focusLatestOnMount = false, phoneNote }: SmsThreadProps) {
  const { t, bn, num, lang } = useT();
  const uid = useId().replace(/:/g, '');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  // A new object each time, so focusing the same message twice still runs the effect.
  const [focusMsg, setFocusMsg] = useState<{ id: string } | undefined>(() => {
    const last = messages[messages.length - 1];
    return focusLatestOnMount && last ? { id: last.id } : undefined;
  });

  useEffect(() => {
    if (focusMsg) document.getElementById(`${uid}-${focusMsg.id}`)?.focus();
  }, [focusMsg, uid]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (draft.trim() === '') {
      setError(true);
      input.current?.focus();
      return;
    }
    setError(false);
    onSend(draft.trim());
    setDraft('');
  };

  const quick = (v: string) => {
    setError(false);
    onSend(v);
    input.current?.focus();
  };

  const titleId = `${uid}-title`;
  const hintId = `${uid}-hint`;
  const errId = `${uid}-err`;
  const quickId = `${uid}-quick`;

  return (
    <section className="card sms-phone" aria-labelledby={titleId} lang={lang}>
      <div className="sms-phone__head">
        <h2 id={titleId} className="section-title sms-phone__sender">
          <span lang="en">railfair</span> · {t('demo two-way number', 'ডেমো টু-ওয়ে নম্বর')}
        </h2>
        {phoneNote ? <p className="small-note">{phoneNote}</p> : null}
        <p className="sms-sim">
          <Icon name="info" size={18} />
          <span>
            <strong>{t('Simulation: no real SMS', 'সিমুলেশন: আসল SMS নয়')}</strong>{' '}
            {t('Nothing is sent to a phone. The two-way number and reply charges are to confirm.', 'কোনো ফোনে কিছু পাঠানো হয় না। টু-ওয়ে নম্বর ও উত্তরের খরচ নিশ্চিত হবে।')}
          </span>
        </p>
      </div>

      <div className="sms-log" role="log" aria-live="polite" aria-label={t('Messages', 'বার্তা')}>
        <ol className="sms-list">
          {messages.map((m) => {
            const mine = m.from === 'you';
            const textId = `${uid}-${m.id}-text`;
            return (
              <li key={m.id} id={`${uid}-${m.id}`} tabIndex={-1} className={`sms-msg sms-msg--${mine ? 'out' : 'in'}`}>
                <p className="sms-msg__meta">
                  <span className="sms-msg__from">{mine ? t('You', 'আপনি') : <span lang="en">railfair</span>}</span>
                  <span aria-hidden="true"> · </span>
                  <time className="mono">
                    <span className="visually-hidden">{t('at', 'সময়')} </span>
                    {num(m.time)}
                  </time>
                </p>
                <div className="sms-msg__bubble">
                  <p className="sms-msg__text" id={textId}>
                    <SmsText text={bn ? m.text.bn : m.text.en} bn={bn} />
                  </p>
                  {m.links?.length ? (
                    <ul className="sms-msg__links">
                      {m.links.map((l) => (
                        <li key={l.href + l.label.en}>
                          <a href={l.href}>{t(l.label.en, l.label.bn)}</a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {mine && m.delivery ? (
                  <p className={`sms-msg__status is-${m.delivery}`}>
                    {m.delivery === 'sent' ? (
                      <>
                        <Icon name="check" size={16} />
                        <span>{t('Sent', 'পাঠানো হয়েছে')}</span>
                      </>
                    ) : m.delivery === 'pending' ? (
                      <>
                        <Icon name="clock" size={16} />
                        <span>{t('Sending…', 'পাঠানো হচ্ছে…')}</span>
                      </>
                    ) : (
                      <>
                        <Icon name="warning" size={16} />
                        <span>{t('Not sent', 'পাঠানো যায়নি')}</span>
                        <Button
                          variant="secondary"
                          className="sms-retry"
                          aria-describedby={textId}
                          onClick={() => {
                            onRetry(m.id);
                            // the button goes away: keep the keyboard user on this message
                            setFocusMsg({ id: m.id });
                          }}
                        >
                          {t('Retry', 'আবার চেষ্টা করুন')}
                        </Button>
                      </>
                    )}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <form className="sms-composer" onSubmit={submit} noValidate>
        <div className="sms-quick" role="group" aria-labelledby={quickId}>
          <p id={quickId} className="sms-quick__label">
            {t('Quick replies', 'দ্রুত উত্তর')}
          </p>
          <div className="sms-quick__chips">
            {quickReplies.map((q) => (
              <button key={q} type="button" className="chip" lang={/^\d$/.test(q) ? undefined : 'en'} onClick={() => quick(q)}>
                {/^\d$/.test(q) ? num(q) : q}
              </button>
            ))}
          </div>
        </div>
        <label className="field__label" htmlFor={`${uid}-input`}>
          {t('Your reply', 'আপনার উত্তর')}
        </label>
        <p className="field__hint" id={hintId}>
          {bn ? (
            <>
              সাহায্যের জন্য <Kw>HELP</Kw> লিখে পাঠান। বেশি টাকা দিয়ে থাকলে <Kw>EXTRA</Kw>, অভিযোগের অবস্থা জানতে <Kw>STATUS</Kw>। কখনো এনআইডি, পিন, পাসওয়ার্ড বা{' '}
              <span lang="en">OTP</span> পাঠাবেন না।
            </>
          ) : (
            <>
              Send <Kw>HELP</Kw> for help, <Kw>EXTRA</Kw> to report paying more, <Kw>STATUS</Kw> for your report. Never send an NID, PIN, password or OTP.
            </>
          )}
        </p>
        {error ? (
          <p className="field__error" id={errId}>
            <Icon name="danger" size={18} />
            <span className="visually-hidden">{t('Error: ', 'ত্রুটি: ')}</span>
            {t('Type a reply or choose a quick reply.', 'উত্তর লিখুন বা একটি দ্রুত উত্তর বেছে নিন।')}
          </p>
        ) : null}
        <div className="sms-composer__row">
          <input
            ref={input}
            id={`${uid}-input`}
            className="field__input"
            type="text"
            autoComplete="off"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-describedby={error ? `${hintId} ${errId}` : hintId}
            aria-invalid={error || undefined}
          />
          <Button type="submit" icon="send">
            {t('Send', 'পাঠান')}
          </Button>
        </div>
      </form>
    </section>
  );
}
