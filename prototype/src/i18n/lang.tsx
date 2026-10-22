import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Language switch for the prototype: English or Bangla.
 * Bangla mode follows the decisions in docs/bangla-copy-review.md:
 * Bangla digits, Bangla station/train/class/coach names, and Bangla people's
 * names on passenger screens. Tickets and staff checks keep the English name.
 * Codes (RF-7Q2K-48, K7Q-48) stay in Latin script.
 */
export type Lang = 'en' | 'bn';

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangState>({ lang: 'en', setLang: () => {} });

export interface LangProviderProps {
  initial?: Lang;
  /** Also set <html lang> (the running app does this; stories and tests don't). */
  syncDocument?: boolean;
  children: ReactNode;
}

export function LangProvider({ initial = 'en', syncDocument = false, children }: LangProviderProps) {
  const [lang, setLang] = useState<Lang>(initial);
  useEffect(() => {
    if (syncDocument) document.documentElement.lang = lang;
  }, [lang, syncDocument]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

/** Replace Western digits with Bangla digits. Use only for values, never for codes. */
export const toBnDigits = (s: string) => s.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);

export interface Named {
  name: string;
  nameBn?: string;
}

export function useT() {
  const { lang, setLang } = useContext(LangContext);
  const bn = lang === 'bn';
  /** Pick the English or the Bangla text. */
  const t = <T,>(en: T, bnText: T): T => (bn ? bnText : en);
  /** A number or time as a value: Bangla digits in Bangla mode. */
  const num = (v: string | number) => (bn ? toBnDigits(String(v)) : String(v));
  /** Taka amount, e.g. ৳1,110 / ৳১,১১০. */
  const taka = (n: number) => `৳${num(n.toLocaleString('en-US'))}`;
  /** Masked ID, e.g. ••4821 / ••৪৮২১. */
  const masked = (last4: string) => `••${num(last4)}`;
  /** A person's name on passenger screens: Bangla name in Bangla mode. */
  const name = (p: Named) => (bn && p.nameBn ? p.nameBn : p.name);
  return { lang, bn, setLang, t, num, taka, masked, name };
}
