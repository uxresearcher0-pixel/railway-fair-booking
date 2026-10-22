import { useEffect, useRef, useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Kw, SmsThread } from '../components/SmsThread';
import { BOOKING_REF, OWN_PHONE_LAST2 } from '../data/demo';
import { SM_CODES, buildState, currentCode, deliver, failDelivery, lastId, quickReplies, retry, send, type SmCode, type SmsState } from '../sms/engine';
import { useT } from '../i18n/lang';

/** Names of the demo states (docs/sms-help-extra.md). Bangla labels leave out the Latin demo IDs. */
export const SM_LABELS: Record<SmCode, [string, string]> = {
  SM01: ['Receipt SMS', 'রসিদের SMS'],
  SM02: ['HELP menu', 'সাহায্যের মেনু'],
  SM03: ['HELP answered (option 3)', 'সাহায্যের উত্তর (বিকল্প ৩)'],
  SM04: ['EXTRA start', 'বাড়তি টাকার অভিযোগ শুরু'],
  SM05: ['Amount and excess', 'পরিমাণ ও বাড়তি টাকা'],
  SM06: ['Method and summary', 'পদ্ধতি ও সারাংশ'],
  SM07: ['Report received', 'অভিযোগ পাওয়া গেছে'],
  SM08: ['STATUS', 'অবস্থা'],
  SM09: ['Invalid keyword or amount', 'ভুল শব্দ বা পরিমাণ'],
  SM10: ['Shared phone, 2 bookings', 'একই ফোনে ২টি বুকিং'],
  SM11: ['Unknown sender', 'অচেনা নম্বর'],
  SM12: ['Send failed, safe retry', 'পাঠানো যায়নি, নিরাপদে আবার চেষ্টা'],
  SM13: ['STOP', 'ফলো-আপ বন্ধ'],
};

export interface SmsDemoProps {
  /** Demo state to open in (SM01–SM13). */
  start?: SmCode;
  /** Delay before a sent message is delivered and answered (ms). */
  deliveryDelay?: number;
  focusHeading?: boolean;
}

/**
 * Two-way SMS demo (route #/sms): receipt, HELP, EXTRA, STATUS, STOP. A simulation: no real SMS, number,
 * payment or NID. The phone UI is SmsThread; the conversation logic is the pure engine in src/sms/engine.ts.
 * On desktop (DW06/DW08) it opens as a phone demonstration beside the notes.
 */
export function SmsDemo({ start = 'SM01', deliveryDelay = 700, focusHeading }: SmsDemoProps) {
  const { t, bn, masked } = useT();
  const [state, setState] = useState<SmsState>(() => buildState(start));
  const live = useRef(state);
  const update = (fn: (s: SmsState) => SmsState) => {
    live.current = fn(live.current);
    setState(live.current);
  };
  const [threadKey, setThreadKey] = useState(0);
  const [pick, setPick] = useState<SmCode>(start);
  const [failNext, setFailNext] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void) => {
    timers.current.push(setTimeout(fn, deliveryDelay));
  };

  const onSend = (text: string) => {
    update((s) => send(s, text));
    const id = lastId(live.current);
    const fail = failNext;
    if (fail) setFailNext(false);
    later(() => update((s) => (fail ? failDelivery(s, id, true) : deliver(s, id))));
  };

  const onRetry = (id: string) => {
    update((s) => retry(s, id));
    later(() => update((s) => deliver(s, id)));
  };

  const load = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    update(() => buildState(pick));
    setThreadKey((k) => k + 1);
  };

  const phoneNote =
    state.senderKind === 'own'
      ? t(`Traveller’s own registered phone ••${OWN_PHONE_LAST2}`, `যাত্রীর নিজের নিবন্ধিত ফোন ${masked(OWN_PHONE_LAST2)}`)
      : state.senderKind === 'shared'
        ? t(`A phone shared by 2 bookings ••${OWN_PHONE_LAST2}`, `${masked(OWN_PHONE_LAST2)} · একটি ফোনে ২টি বুকিং`)
        : t('A number not linked to any booking', 'কোনো বুকিংয়ের সাথে যুক্ত নয় এমন নম্বর');

  return (
    <ScreenShell
      screenId={currentCode(state)}
      title={t('SMS help and reports', 'SMS-এ সাহায্য ও অভিযোগ')}
      lede={t(
        `Two-way SMS for booking ${BOOKING_REF}: receipt, HELP, EXTRA and STATUS. A simulation of a proposed service.`,
        `বুকিং ${BOOKING_REF}-এর টু-ওয়ে SMS: রসিদ, সাহায্য, বাড়তি টাকার অভিযোগ ও অবস্থা। একটি প্রস্তাবিত সেবার সিমুলেশন।`,
      )}
      focusHeading={focusHeading}
      footer={
        <div className="footer-stack">
          <a className="btn btn--secondary btn--block" href="#/r3cv2">
            {t('See the case in the app', 'অ্যাপে কেসটি দেখুন')}
          </a>
          <a className="btn btn--ghost btn--block" href="#/p14v2">
            {t('Back to your receipt', 'আপনার রসিদে ফিরে যান')}
          </a>
        </div>
      }
    >
      <SmsThread
        key={threadKey}
        messages={state.messages}
        quickReplies={quickReplies(state)}
        onSend={onSend}
        onRetry={onRetry}
        focusLatestOnMount={threadKey > 0}
        phoneNote={phoneNote}
      />

      <section className="card" aria-labelledby="sms-about">
        <h2 id="sms-about" className="section-title">
          {t('Keywords', 'কি-ওয়ার্ড')}
        </h2>
        <p className="small-note">
          {t('Keywords are the same in English and Bangla. Upper or lower case both work.', 'কি-ওয়ার্ড ইংরেজি ও বাংলায় একই। বড় বা ছোট হাতের অক্ষর দুটোই চলে।')}
        </p>
        <dl className="kv">
          <div>
            <dt>
              <Kw>HELP</Kw>
            </dt>
            <dd>{t('Menu: 1 ticket access · 2 cancellation/refund · 3 booking without my permission · 4 callback/other help', 'মেনু: ১ টিকিট পাওয়া · ২ বাতিল/টাকা ফেরত · ৩ আমার অনুমতি ছাড়া বুকিং · ৪ কলব্যাক/অন্য সাহায্য')}</dd>
          </div>
          <div>
            <dt>
              <Kw>EXTRA</Kw>
            </dt>
            <dd>{t('Report paying more than the official total', 'অফিসিয়াল মোটের চেয়ে বেশি টাকা দিলে বাড়তি টাকার অভিযোগ করুন')}</dd>
          </div>
          <div>
            <dt>
              <Kw>STATUS</Kw>
            </dt>
            <dd>{t('Status of your report or help request', 'আপনার অভিযোগ বা সাহায্যের অনুরোধের অবস্থা')}</dd>
          </div>
          <div>
            <dt>
              <Kw>SEND</Kw> / <Kw>EDIT</Kw> / <Kw>CANCEL</Kw>
            </dt>
            <dd>{t('Confirm, change or drop a report before it is sent', 'পাঠানোর আগে অভিযোগ নিশ্চিত করুন, বদলান বা বাদ দিন')}</dd>
          </div>
          <div>
            <dt>
              <Kw>STOP</Kw>
            </dt>
            <dd>{t('Turn off optional follow-up messages. Open cases are still handled.', 'ঐচ্ছিক ফলো-আপ বার্তা বন্ধ করুন। খোলা কেস তবুও দেখা হয়।')}</dd>
          </div>
        </dl>
        <ul className="steps small-note">
          <li>{t('A report is a lead, not proof. No automatic penalty, and no promise of money back before a decision.', 'অভিযোগ একটি সূত্র, প্রমাণ নয়। স্বয়ংক্রিয় শাস্তি নেই, সিদ্ধান্তের আগে টাকা ফেরতের প্রতিশ্রুতিও নেই।')}</li>
          <li>{t('Reporting never cancels a valid ticket.', 'অভিযোগ করলে বৈধ টিকিট কখনো বাতিল হয় না।')}</li>
          <li>{t('An SMS reply can’t cancel, reissue or change a booking. That needs the app or a counter.', 'SMS-এর উত্তরে বুকিং বাতিল, পুনরায় ইস্যু বা পরিবর্তন করা যায় না। এর জন্য অ্যাপ বা কাউন্টার লাগবে।')}</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="sms-states">
        <h2 id="sms-states" className="section-title">
          {t('Demo states', 'ডেমো অবস্থা')}
        </h2>
        <div className="field">
          <label className="field__label" htmlFor="sms-start">
            {t('Start from', 'যেখান থেকে শুরু')}
          </label>
          <select id="sms-start" className="field__input" value={pick} onChange={(e) => setPick(e.target.value as SmCode)}>
            {SM_CODES.map((c) => (
              <option key={c} value={c}>
                {bn ? SM_LABELS[c][1] : `${c} · ${SM_LABELS[c][0]}`}
              </option>
            ))}
          </select>
        </div>
        <Button variant="secondary" onClick={load}>
          {t('Show this state', 'এই অবস্থা দেখান')}
        </Button>
        <label className="check-row">
          <input type="checkbox" checked={failNext} onChange={(e) => setFailNext(e.target.checked)} />
          <span>{t('Make the next send fail (the network still receives it)', 'পরের বার্তা পাঠানো ব্যর্থ দেখাক (নেটওয়ার্ক তবুও পায়)')}</span>
        </label>
      </section>
    </ScreenShell>
  );
}
