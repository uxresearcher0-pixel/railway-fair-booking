import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { destinations, trip } from '../data/demo';
import { useT } from '../i18n/lang';

export interface F01bProps {
  initialQuery?: string;
  initialStation?: string;
  onDone?: (code: string) => void;
}

/**
 * F01b · Station picker, "To". Search in English or Bangla. Results are a radio group;
 * the count of matches is announced politely. Station codes are demo codes until the
 * railway's official abbreviations arrive (railway-decisions.md #32), so Bangla mode
 * shows station names only.
 */
export function F01bStationTo({ initialQuery = '', initialStation = 'CTG', onDone }: F01bProps) {
  const { bn, t, num } = useT();
  const [q, setQ] = useState(initialQuery);
  const [code, setCode] = useState(initialStation);
  const query = q.trim().toLowerCase();
  const matches = destinations.filter((d) => !query || d.name.toLowerCase().includes(query) || d.nameBn.includes(q.trim()) || d.code.toLowerCase().startsWith(query));
  const chosen = destinations.find((d) => d.code === code);

  return (
    <ScreenShell
      screenId="F01b"
      title={t('Travelling to', 'কোথায় যাবেন')}
      lede={t(`From ${trip.from.name}. Search in English or Bangla.`, `${trip.from.nameBn} থেকে। ইংরেজি বা বাংলায় খুঁজুন।`)}
      backLabel={t('Back to search', 'খোঁজে ফিরে যান')}
      footer={
        <Button block iconAfter="arrow-right" disabled={!chosen} onClick={() => chosen && onDone?.(chosen.code)}>
          {chosen ? t(`Travel to ${chosen.name}`, `${chosen.nameBn} যাবেন`) : t('Choose a station', 'একটি স্টেশন বেছে নিন')}
        </Button>
      }
    >
      <div className="card">
        <Field
          id="f01b-q"
          type="search"
          label={t('Search stations', 'স্টেশন খুঁজুন')}
          hint={bn ? 'যেমন চট্টগ্রাম বা Chattogram' : <>For example Chattogram or <span lang="bn">চট্টগ্রাম</span></>}
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <p className="visually-hidden" aria-live="polite" data-testid="f01b-live">
          {bn ? `${num(matches.length)}টি স্টেশন মিলেছে` : `${matches.length} ${matches.length === 1 ? 'station matches' : 'stations match'}`}
        </p>
      </div>

      <fieldset className="card radio-list">
        <legend className="section-title">{query ? t('Matching stations', 'মিলে যাওয়া স্টেশন') : t('Stations from Dhaka', 'ঢাকা থেকে যাওয়া যায় এমন স্টেশন')}</legend>
        {matches.length ? (
          matches.map((d) => (
            <label key={d.code} className={`radio-card ${code === d.code ? 'is-checked' : ''}`}>
              <input type="radio" name="to" value={d.code} checked={code === d.code} onChange={() => setCode(d.code)} />
              <span className="radio-card__main">
                <span className="radio-card__title">{t(d.name, d.nameBn)}</span>
                {bn ? null : (
                  <span className="radio-card__meta">
                    <span lang="bn">{d.nameBn}</span> · <span className="mono">{d.code}</span>
                  </span>
                )}
              </span>
            </label>
          ))
        ) : (
          <p className="small-note">{t('No station matches. Check the spelling, or try the Bangla name.', 'কোনো স্টেশন মেলেনি। বানান দেখুন, অথবা ইংরেজি নামে খুঁজুন।')}</p>
        )}
      </fieldset>
    </ScreenShell>
  );
}
