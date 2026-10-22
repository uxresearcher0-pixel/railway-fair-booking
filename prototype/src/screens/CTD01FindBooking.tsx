import { useState, type FormEvent } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { CounterRail } from '../components/CounterRail';
import { useActionFocus } from '../components/useActionFocus';
import { APPLICATION_REF, COUNTER_TERMINAL, DRAW, PARTY_LOCK, abdul, drawParty, evening } from '../data/demo';
import { normaliseApplication } from './PA1v2DrawAudit';
import { useT } from '../i18n/lang';

export interface CTD01Props {
  /** Text in the search box on load (stories). */
  initialQuery?: string;
  /** Run the search on load (stories). */
  searched?: boolean;
  focusHeading?: boolean;
  /** "Take payment" → CTD03. Without it, the button is a link to #/ctd03. */
  onTakePayment?: () => void;
}

/** What the counter can find (demo). The application of the 4 travellers on the evening train. */
const lookup = (q: string) => (q === APPLICATION_REF ? 'found' : 'missing');

/**
 * CTD01 · Find a booking or start one (station counter terminal, desktop-first). Search by booking
 * reference, application number or the traveller's ID; the result card leads to "Take payment" (CTD03).
 * Staff screen: names stay in English (decision #31); UI text and digits follow the language.
 */
export function CTD01FindBooking({ initialQuery = '', searched = false, focusHeading, onTakePayment }: CTD01Props) {
  const { t, num } = useT();
  const [query, setQuery] = useState(initialQuery);
  const [shown, setShown] = useState<string | undefined>(searched ? normaliseApplication(initialQuery) : undefined);
  const [error, setError] = useState(false);
  const { ref, acted } = useActionFocus([shown]);

  const search = (e: FormEvent) => {
    e.preventDefault();
    const q = normaliseApplication(query);
    if (!q) {
      setError(true);
      setShown(undefined);
      document.getElementById('ctd01-q')?.focus();
      return;
    }
    setError(false);
    acted();
    setShown(q);
  };

  const result = shown ? lookup(shown) : undefined;
  const shift = `${num(COUNTER_TERMINAL.shiftFrom)}–${num(COUNTER_TERMINAL.shiftTo)}`;

  return (
    <ScreenShell
      screenId="CTD01"
      eyebrow={t(`Station counter · shift ${COUNTER_TERMINAL.shiftFrom}–${COUNTER_TERMINAL.shiftTo}`, `স্টেশন কাউন্টার · শিফট ${shift}`)}
      title={t('Find a booking or start one', 'বুকিং খুঁজুন বা নতুন শুরু করুন')}
      lede={t(
        'Search by booking reference, application number or the traveller’s ID. Same rules and fares as the app.',
        'বুকিং রেফারেন্স, আবেদন নম্বর বা যাত্রীর পরিচয়পত্র নম্বর দিয়ে খুঁজুন। অ্যাপের মতোই নিয়ম ও ভাড়া।',
      )}
      rail={<CounterRail current="ctd01" />}
      focusHeading={focusHeading}
    >
      <div className="split">
        <div className="split__main">
          <form className="card" role="search" onSubmit={search} noValidate aria-label={t('Find a booking', 'বুকিং খুঁজুন')}>
            <div className="search-row">
              <Field
                id="ctd01-q"
                label={t('Reference, application or ID number', 'রেফারেন্স, আবেদন বা পরিচয়পত্র নম্বর')}
                hint={t(`For example ${APPLICATION_REF}`, `যেমন ${APPLICATION_REF}`)}
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                error={error ? t('Enter a reference, application or ID number.', 'রেফারেন্স, আবেদন বা পরিচয়পত্র নম্বর লিখুন।') : undefined}
              />
              <Button type="submit" variant="secondary">
                {t('Search', 'খুঁজুন')}
              </Button>
            </div>
          </form>

          <div ref={ref} tabIndex={-1} className="focus-target">
            {result === 'found' ? (
              <section className="card" aria-labelledby="ctd01-result">
                <h2 id="ctd01-result" className="card__eyebrow">
                  {t('Result', 'ফলাফল')} · <span lang="en" className="mono">{APPLICATION_REF}</span>
                </h2>
                <dl className="rows">
                  <div>
                    <dt>{t('Train', 'ট্রেন')}</dt>
                    <dd>
                      {num(evening.number)} · {t(evening.name, evening.nameBn)} · {t(evening.date, evening.dateBn)}
                    </dd>
                  </div>
                  <div>
                    <dt>{t('Travellers', 'যাত্রী')}</dt>
                    <dd>{t(`${drawParty.length} · party locked at ${PARTY_LOCK}`, `${num(drawParty.length)} জন · দল ${num(PARTY_LOCK)}-এ লক`)}</dd>
                  </div>
                  <div>
                    <dt>{t('Status', 'অবস্থা')}</dt>
                    <dd>
                      <StatusPill tone="success" icon="check">
                        {t(`Picked · pay by ${DRAW.payBy}`, `নির্বাচিত · ${num(DRAW.payBy)}-এর মধ্যে পরিশোধ`)}
                      </StatusPill>
                    </dd>
                  </div>
                  <div>
                    <dt>{t('Made by', 'কোথা থেকে')}</dt>
                    <dd>
                      {t('App', 'অ্যাপ')} · <span lang="en">{abdul.name}</span>
                    </dd>
                  </div>
                </dl>
                <p>
                  {onTakePayment ? (
                    <Button onClick={onTakePayment} iconAfter="arrow-right">
                      {t('Take payment', 'টাকা নিন')}
                    </Button>
                  ) : (
                    <a className="btn btn--primary" href="#/ctd03">
                      {t('Take payment', 'টাকা নিন')}
                    </a>
                  )}
                </p>
              </section>
            ) : null}
            {result === 'missing' && shown ? (
              <Notice tone="warning" title={t('Nothing found', 'কিছু পাওয়া যায়নি')}>
                <p>
                  {t('No booking or application matches', 'কোনো বুকিং বা আবেদনের সাথে মেলেনি:')} <span lang="en" className="mono">{shown}</span>
                  {t('. Check the number with the passenger, or start a new one.', '। যাত্রীর সাথে নম্বরটি মিলিয়ে দেখুন, বা নতুন শুরু করুন।')}
                </p>
              </Notice>
            ) : null}
          </div>
        </div>

        <div className="split__side">
          <section className="card" aria-labelledby="ctd01-new">
            <h2 id="ctd01-new" className="card__eyebrow">
              {t('Start new', 'নতুন শুরু')}
            </h2>
            <dl className="rows">
              <div>
                <dt>{t('Busy train (draw open)', 'ভিড়ের ট্রেন (ড্র খোলা)')}</dt>
                <dd>
                  <a href="#/ctd02">{t('Apply for a draw', 'ড্র-এর জন্য আবেদন')}</a>
                </dd>
              </div>
              <div>
                <dt>{t('Normal train', 'সাধারণ ট্রেন')}</dt>
                <dd>{t('Book seats as in the app (not in this prototype)', 'অ্যাপের মতো আসন বুক (এই প্রোটোটাইপে নেই)')}</dd>
              </div>
              <div>
                <dt>{t('Lost phone or helper', 'ফোন বা সাহায্যকারী নেই')}</dt>
                <dd>
                  <a href="#/ctd04">{t('Recover a ticket', 'টিকিট পুনরুদ্ধার')}</a>
                </dd>
              </div>
            </dl>
          </section>
          <Notice tone="info" live="off" title={t('Help at the counter is free', 'কাউন্টারে সাহায্য বিনামূল্যে')}>
            {t(
              'No counter fee is added. Registered agents show their fee on a printed receipt.',
              'কোনো কাউন্টার ফি যোগ হয় না। নিবন্ধিত এজেন্টরা তাঁদের ফি প্রিন্ট করা রসিদে দেখান।',
            )}
          </Notice>
        </div>
      </div>
    </ScreenShell>
  );
}
