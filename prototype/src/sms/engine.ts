/**
 * Two-way SMS simulation engine (docs/sms-help-extra.md, demo IDs SM01–SM13; proposed).
 *
 * A small pure state machine: every function takes a state and returns a new one, nothing is mutated
 * and there are no timers or side effects. The UI (SmsThread / SmsDemo) adds the delivery delay.
 *
 * - Keywords stay in Latin script in both languages (HELP, EXTRA, STATUS, SEND, EDIT, CANCEL, STOP,
 *   plus SKIP, CASH, DIGITAL inside the report). They are case-insensitive.
 * - Every railfair message carries English and Bangla text. English SMS money is "Tk 1,520"; Bangla
 *   SMS money is "৳১,৫২০" with Bangla digits. Codes (RF-7Q2K-48, OC-2207, SR-4410) stay Latin.
 * - Reports are leads, not proof. A case is created only by SEND on a complete summary, and a repeated
 *   SEND (a retry after a failed send) never creates a second case.
 * - Never asks for a full NID, PIN, password or OTP.
 */
import { ASSISTANCE_FEE, BOOKING_REF, FARE, SERVICE_CHARGE, SMS_DEMO, drawParty, trip } from '../data/demo';

export const SM_CODES = ['SM01', 'SM02', 'SM03', 'SM04', 'SM05', 'SM06', 'SM07', 'SM08', 'SM09', 'SM10', 'SM11', 'SM12', 'SM13'] as const;
export type SmCode = (typeof SM_CODES)[number];

/** The keywords. They stay Latin in Bangla too. */
export const KEYWORDS = ['HELP', 'EXTRA', 'STATUS', 'SEND', 'EDIT', 'CANCEL', 'STOP'] as const;
/** Replies used inside the report flow. */
export const REPORT_WORDS = ['SKIP', 'CASH', 'DIGITAL'] as const;

export interface Text {
  en: string;
  bn: string;
}
export interface SmsLink {
  href: string;
  label: Text;
}
export type Sender = 'railfair' | 'you';
export type Delivery = 'sent' | 'pending' | 'failed';

export interface SmsMessage {
  id: string;
  from: Sender;
  /** "HH:MM", Western digits (the UI converts for Bangla). */
  time: string;
  text: Text;
  /** Outgoing messages only. */
  delivery?: Delivery;
  /** What the passenger typed (outgoing only). */
  raw?: string;
  links?: SmsLink[];
  /** Demo state this railfair reply belongs to. */
  code?: SmCode;
}

/** Who is texting: the traveller's own registered phone, a phone shared by 2 bookings, or an unknown number. */
export type SenderKind = 'own' | 'shared' | 'unknown';
export type Mode = 'idle' | 'help-menu' | 'extra-booking' | 'extra-amount' | 'extra-collector' | 'extra-method' | 'extra-summary';
export type CaseStage = 'received' | 'review' | 'info' | 'resolved';
export type Method = 'cash' | 'digital';

export interface SmsBooking {
  ref: string;
  date: Text;
  travellers: number;
  total: number;
}

export interface Draft {
  id: number;
  booking: SmsBooking;
  amount?: number;
  /** null = SKIP (not given). */
  collector?: string | null;
  method?: Method;
}

export interface SmsCase {
  ref: string;
  booking: string;
  draftId: number;
  amount: number;
  total: number;
  collector: string | null;
  method: Method;
  channel: 'sms';
  receivedAt: string;
  stage: CaseStage;
}

export interface SmsState {
  senderKind: SenderKind;
  mode: Mode;
  bookings: SmsBooking[];
  draft?: Draft;
  draftSeq: number;
  /** Draft id of the last report that was sent (for idempotent retries). */
  lastSubmitted?: number;
  cases: SmsCase[];
  supportRef?: string;
  followUps: boolean;
  /** Minutes since midnight of the latest message. */
  minute: number;
  seq: number;
  messages: SmsMessage[];
}

// ---------- helpers ----------

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const bnDigits = (s: string) => s.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
/** Bangla digits → Western digits. */
export const westernDigits = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
const group = (n: number) => n.toLocaleString('en-US');
const tk = (n: number) => `Tk ${group(n)}`;
const bnTk = (n: number) => `৳${bnDigits(group(n))}`;
const both = (en: string, bn: string): Text => ({ en, bn });

const toMinute = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (minute: number) => `${String(Math.floor(minute / 60) % 24).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;

/**
 * Read a TOTAL amount: Western or Bangla digits, optional "Tk" or ৳, thousands commas.
 * Returns NaN for anything else (words, decimals, zero, more than 6 digits).
 */
export const parseAmount = (raw: string) => {
  const s = westernDigits(raw)
    .trim()
    .replace(/^(tk\.?|৳)\s*/i, '')
    .replace(/[,\s]/g, '');
  if (!/^\d{1,6}$/.test(s)) return NaN;
  const n = Number(s);
  return n > 0 ? n : NaN;
};

/** Long digit runs look like an ID or card number: never stored. */
const looksLikeId = (s: string) => /\d{6,}/.test(westernDigits(s).replace(/[\s-]/g, ''));

/** The demo bookings this phone is linked to. */
export const bookingMain: SmsBooking = {
  ref: BOOKING_REF,
  date: both(trip.date, trip.dateBn),
  travellers: drawParty.length,
  total: drawParty.length * (FARE + SERVICE_CHARGE) + ASSISTANCE_FEE,
};
export const bookingSecond: SmsBooking = {
  ref: SMS_DEMO.secondBooking.ref,
  date: both(SMS_DEMO.secondBooking.date, SMS_DEMO.secondBooking.dateBn),
  travellers: SMS_DEMO.secondBooking.travellers,
  total: SMS_DEMO.secondBooking.total,
};

// ---------- messages ----------

type Reply = Pick<SmsMessage, 'text' | 'links' | 'code'>;

const LINK_EVIDENCE: SmsLink = { href: '#/r3cv2', label: both('Add evidence in the app (optional)', 'অ্যাপে প্রমাণ যোগ করুন (ঐচ্ছিক)') };
const LINK_ACCESS: SmsLink = { href: '#/a1v2', label: both('In the app: who can act on my booking', 'অ্যাপে: আমার বুকিংয়ে কে কী করতে পারেন') };
const LINK_COUNTER: SmsLink = { href: '#/p25v2', label: both('Help at any counter with your ID', 'পরিচয়পত্র নিয়ে যেকোনো কাউন্টারে সাহায্য') };
const LINK_OWN_PHONE: SmsLink = { href: '#/p25v2', label: both('Code to the traveller’s own phone, or counter help', 'যাত্রীর নিজের ফোনে কোড, বা কাউন্টারে সাহায্য') };

const SAFETY = both(
  'We never ask for your NID, PIN, password or OTP.',
  'আমরা কখনো আপনার এনআইডি, পিন, পাসওয়ার্ড বা OTP চাই না।',
);

export const receiptMessage = (b: SmsBooking = bookingMain): Reply => {
  const fare = b.travellers * FARE;
  const service = b.travellers * SERVICE_CHARGE;
  const fee = b.total - fare - service;
  return {
    code: 'SM01',
    text: both(
      `railfair: ${b.ref} confirmed. Fare ${tk(fare)}; service ${tk(service)}; assistance ${tk(fee)}. Official total ${tk(b.total)} for this booking (${b.travellers} travellers). Reply HELP for assistance or EXTRA to report paying more.`,
      `railfair: ${b.ref} নিশ্চিত। ভাড়া ${bnTk(fare)}; সার্ভিস ${bnTk(service)}; সহায়তা ${bnTk(fee)}। এই বুকিংয়ের অফিসিয়াল মোট ${bnTk(b.total)} (${bnDigits(String(b.travellers))} জন যাত্রী)। সাহায্যের জন্য HELP লিখে পাঠান। বেশি টাকা দিয়ে থাকলে জানাতে EXTRA লিখে পাঠান।`,
    ),
  };
};

const helpMenu = (): Reply => ({
  code: 'SM02',
  text: both(
    'railfair help. Reply with a number:\n1 Ticket access\n2 Cancellation/refund\n3 Booking without my permission\n4 Callback/other help',
    'railfair সাহায্য। একটি সংখ্যা লিখে পাঠান:\n১ টিকিট পাওয়া\n২ বাতিল/টাকা ফেরত\n৩ আমার অনুমতি ছাড়া বুকিং\n৪ কলব্যাক/অন্য সাহায্য',
  ),
});

const helpAnswer = (option: number, ref: string): Reply => {
  switch (option) {
    case 1:
      return {
        code: 'SM03',
        text: both(
          'railfair: Ticket access. Your tickets are in the app. Lost access? Get a code on the traveller’s own phone, or go to any counter with your ID. Reply HELP for the menu.',
          'railfair: টিকিট পাওয়া। আপনার টিকিট অ্যাপে আছে। প্রবেশ হারিয়েছেন? যাত্রীর নিজের ফোনে কোড নিন, বা পরিচয়পত্র নিয়ে যেকোনো কাউন্টারে যান। মেনুর জন্য HELP লিখে পাঠান।',
        ),
        links: [LINK_COUNTER],
      };
    case 2:
      return {
        code: 'SM03',
        text: both(
          'railfair: Cancellation or refund. SMS can’t cancel a ticket. The traveller cancels in the app or at a counter, and a refund goes to the account that paid. Ticket rules apply. Reply HELP for the menu.',
          'railfair: বাতিল বা টাকা ফেরত। SMS দিয়ে টিকিট বাতিল করা যায় না। যাত্রী অ্যাপে বা কাউন্টারে বাতিল করেন, টাকা ফেরত যায় যে অ্যাকাউন্ট থেকে পরিশোধ হয়েছে সেখানে। টিকিটের নিয়ম প্রযোজ্য। মেনুর জন্য HELP লিখে পাঠান।',
        ),
      };
    case 3:
      return {
        code: 'SM03',
        text: both(
          `railfair: Thank you. Support reference ${ref}: booking without your permission. SMS can’t change a booking. Check who can act on your booking in the app, or go to any counter with your ID. Keep ${ref}: it works in the app, at a counter and here. Reply STATUS any time.`,
          `railfair: ধন্যবাদ। সাহায্যের রেফারেন্স ${ref}: আপনার অনুমতি ছাড়া বুকিং। SMS দিয়ে বুকিং বদলানো যায় না। অ্যাপে দেখুন আপনার বুকিংয়ে কে কী করতে পারেন, বা পরিচয়পত্র নিয়ে যেকোনো কাউন্টারে যান। ${ref} রেখে দিন: অ্যাপে, কাউন্টারে ও এখানে কাজ করে। অবস্থা জানতে যেকোনো সময় STATUS লিখে পাঠান।`,
        ),
        links: [LINK_ACCESS, LINK_COUNTER],
      };
    default:
      return {
        code: 'SM03',
        text: both(
          'railfair: Callback and other help. Callback hours and cost will be shown here once they are confirmed. For now, use the app or any counter. Reply HELP for the menu.',
          'railfair: কলব্যাক ও অন্য সাহায্য। কলব্যাকের সময় ও খরচ নিশ্চিত হলে এখানে জানানো হবে। আপাতত অ্যাপ বা যেকোনো কাউন্টার ব্যবহার করুন। মেনুর জন্য HELP লিখে পাঠান।',
        ),
        links: [LINK_COUNTER],
      };
  }
};

const askAmount = (b: SmsBooking, again = false): Reply => ({
  code: 'SM04',
  text: both(
    `railfair: ${again ? 'OK, let’s change it. ' : ''}Report paying more for ${b.ref} (${b.date.en}). Official total ${tk(b.total)} for this booking (${b.travellers} travellers). What TOTAL did you pay for the whole booking? Reply with numbers only, e.g. 1800. Reply CANCEL to stop. ${SAFETY.en}`,
    `railfair: ${again ? 'ঠিক আছে, বদলে নিন। ' : ''}${b.ref} (${b.date.bn})-এর জন্য বেশি টাকা দেওয়ার অভিযোগ। এই বুকিংয়ের অফিসিয়াল মোট ${bnTk(b.total)} (${bnDigits(String(b.travellers))} জন যাত্রী)। পুরো বুকিংয়ের জন্য মোট কত টাকা দিয়েছেন? শুধু সংখ্যা লিখুন, যেমন ১৮০০। থামাতে CANCEL লিখে পাঠান। ${SAFETY.bn}`,
  ),
});

const amountLine = (amount: number, total: number): Text =>
  both(
    `Reported total ${tk(amount)}; official total ${tk(total)}; reported excess ${tk(amount - total)}.`,
    `আপনার জানানো মোট ${bnTk(amount)}; অফিসিয়াল মোট ${bnTk(total)}; বাড়তি টাকার অভিযোগ ${bnTk(amount - total)}।`,
  );

const askCollector = (amount: number, total: number): Reply => {
  const line = amountLine(amount, total);
  return {
    code: 'SM05',
    text: both(
      `railfair: ${line.en} Who collected it? Reply with an agent number, name or place, or SKIP. This is optional.`,
      `railfair: ${line.bn} কে টাকা নিয়েছিলেন? এজেন্ট নম্বর, নাম বা জায়গা লিখুন, না জানাতে চাইলে SKIP লিখে পাঠান। এটি ঐচ্ছিক।`,
    ),
  };
};

const askMethod = (): Reply => ({
  code: 'SM06',
  text: both('railfair: How did you pay the extra? Reply CASH or DIGITAL.', 'railfair: বাড়তি টাকা কীভাবে দিয়েছেন? নগদ হলে CASH, ডিজিটাল হলে DIGITAL লিখে পাঠান।'),
});

const summary = (d: Required<Pick<Draft, 'amount' | 'method'>> & Draft): Reply => {
  const line = amountLine(d.amount, d.booking.total);
  const who = d.collector ? both(d.collector, d.collector) : both('not given', 'জানানো হয়নি');
  const how = d.method === 'cash' ? both('cash', 'নগদ') : both('digital', 'ডিজিটাল');
  return {
    code: 'SM06',
    text: both(
      `railfair: Check your report for ${d.booking.ref}.\n${line.en}\nCollected by: ${who.en}\nPaid: ${how.en}\nReply SEND to send it, EDIT to change it, or CANCEL to drop it.`,
      `railfair: ${d.booking.ref}-এর অভিযোগ মিলিয়ে নিন।\n${line.bn}\nকে নিয়েছিলেন: ${who.bn}\nকীভাবে: ${how.bn}\nপাঠাতে SEND, বদলাতে EDIT, বাদ দিতে CANCEL লিখে পাঠান।`,
    ),
  };
};

const caseCreated = (c: SmsCase): Reply => ({
  code: 'SM07',
  text: both(
    `railfair: Report received. Case ${c.ref} for ${c.booking}. Your ticket stays valid. An independent team reviews it: a report is a lead, not proof, so nobody is penalised automatically and no refund is promised before a decision. Evidence is optional: add it securely in the app, or show it at any counter (SMS can’t take photos). Reply STATUS for updates.`,
    `railfair: অভিযোগ পাওয়া গেছে। ${c.booking}-এর জন্য কেস ${c.ref}। আপনার টিকিট বৈধ থাকে। একটি স্বাধীন দল এটি পর্যালোচনা করবে: অভিযোগ একটি সূত্র, প্রমাণ নয়, তাই কাউকে স্বয়ংক্রিয়ভাবে শাস্তি দেওয়া হয় না এবং সিদ্ধান্তের আগে টাকা ফেরতের প্রতিশ্রুতি নেই। প্রমাণ ঐচ্ছিক: অ্যাপে নিরাপদে যোগ করুন, বা যেকোনো কাউন্টারে দেখান (SMS-এ ছবি পাঠানো যায় না)। হালনাগাদ জানতে STATUS লিখে পাঠান।`,
  ),
  links: [LINK_EVIDENCE],
});

const STAGES: CaseStage[] = ['received', 'review', 'info', 'resolved'];
const stageText: Record<CaseStage, Text> = {
  received: both('Received', 'পাওয়া গেছে'),
  review: both('Under review', 'পর্যালোচনা চলছে'),
  info: both('More information requested', 'আরও তথ্য চাওয়া হয়েছে'),
  resolved: both('Resolved, with outcome and appeal route', 'নিষ্পত্তি, ফলাফল ও আপিলের উপায়সহ'),
};

/** The 4 status steps of a case, each done, current or to come. */
export const caseTimeline = (stage: CaseStage) =>
  STAGES.map((s, i) => ({ stage: s, text: stageText[s], state: i < STAGES.indexOf(stage) ? 'done' : i === STAGES.indexOf(stage) ? 'current' : 'next' }) as const);

const statusReply = (state: SmsState): Reply => {
  const c = state.cases[state.cases.length - 1];
  if (c) {
    const lines = caseTimeline(c.stage).map((step) => {
      const when = step.stage === 'received' ? ` ${c.receivedAt}` : '';
      const whenBn = step.stage === 'received' ? ` ${bnDigits(c.receivedAt)}` : '';
      const tag = step.state === 'done' ? both('Done', 'হয়েছে') : step.state === 'current' ? both('Now', 'এখন') : both('Not yet', 'এখনো নয়');
      return both(`${tag.en}: ${step.text.en}${when}`, `${tag.bn}: ${step.text.bn}${whenBn}`);
    });
    const days = SMS_DEMO.firstUpdateDays;
    return {
      code: 'SM08',
      text: both(
        `railfair: Case ${c.ref} (${c.booking})\n${lines.map((l) => l.en).join('\n')}\nProposed timing: first update within ${days} working days, not guaranteed. Your ticket stays valid.`,
        `railfair: কেস ${c.ref} (${c.booking})\n${lines.map((l) => l.bn).join('\n')}\nপ্রস্তাবিত সময়: ${bnDigits(String(days))} কর্মদিবসের মধ্যে প্রথম হালনাগাদ, নিশ্চিত নয়। আপনার টিকিট বৈধ থাকে।`,
      ),
      links: [LINK_EVIDENCE],
    };
  }
  if (state.supportRef) {
    return {
      code: 'SM08',
      text: both(
        `railfair: Support request ${state.supportRef}: received. A person follows up in the app or at a counter. Reply HELP for the menu.`,
        `railfair: সাহায্যের অনুরোধ ${state.supportRef}: পাওয়া গেছে। একজন কর্মী অ্যাপে বা কাউন্টারে যোগাযোগ করবেন। মেনুর জন্য HELP লিখে পাঠান।`,
      ),
    };
  }
  return {
    code: 'SM08',
    text: both(
      'railfair: There is no open report or help request for this number. Reply HELP for help or EXTRA to report paying more.',
      'railfair: এই নম্বরে কোনো খোলা অভিযোগ বা সাহায্যের অনুরোধ নেই। সাহায্যের জন্য HELP, বেশি টাকা দিয়ে থাকলে EXTRA লিখে পাঠান।',
    ),
  };
};

const invalid = (kind: 'keyword' | 'amount' | 'not-more' | 'menu' | 'booking' | 'method' | 'summary' | 'nothing-to-send' | 'nothing-to-change' | 'id-number', ctx?: { amount?: number; total?: number }): Reply => {
  const none = both('No report was created.', 'কোনো অভিযোগ তৈরি হয়নি।');
  const map: Record<typeof kind, Text> = {
    keyword: both(
      `railfair: Sorry, we didn’t understand that. Reply HELP, EXTRA or STATUS. ${none.en}`,
      `railfair: দুঃখিত, বুঝতে পারিনি। HELP, EXTRA বা STATUS লিখে পাঠান। ${none.bn}`,
    ),
    amount: both(
      `railfair: We couldn’t read that amount. Reply with numbers only for the TOTAL you paid, e.g. 2500. ${none.en}`,
      `railfair: পরিমাণটি পড়া যায়নি। মোট কত টাকা দিয়েছেন তা শুধু সংখ্যায় লিখুন, যেমন ২৫০০। ${none.bn}`,
    ),
    'not-more': both(
      `railfair: ${tk(ctx?.amount ?? 0)} is not more than the official total ${tk(ctx?.total ?? 0)}, so there is nothing extra to report. Reply with the TOTAL you paid, or CANCEL. ${none.en}`,
      `railfair: ${bnTk(ctx?.amount ?? 0)} অফিসিয়াল মোট ${bnTk(ctx?.total ?? 0)}-এর বেশি নয়, তাই বাড়তি কিছু জানানোর নেই। মোট কত দিয়েছেন লিখুন, বা CANCEL লিখে পাঠান। ${none.bn}`,
    ),
    menu: both('railfair: Please reply 1, 2, 3 or 4, or HELP to see the menu again.', 'railfair: অনুগ্রহ করে ১, ২, ৩ বা ৪ লিখে পাঠান, অথবা মেনু আবার দেখতে HELP।'),
    booking: both(`railfair: Please reply 1 or 2 to choose the booking, or CANCEL. ${none.en}`, `railfair: বুকিং বেছে নিতে ১ বা ২ লিখে পাঠান, অথবা CANCEL। ${none.bn}`),
    method: both(`railfair: Please reply CASH or DIGITAL, or CANCEL. ${none.en}`, `railfair: অনুগ্রহ করে CASH বা DIGITAL লিখে পাঠান, অথবা CANCEL। ${none.bn}`),
    summary: both(`railfair: Please reply SEND, EDIT or CANCEL. ${none.en}`, `railfair: অনুগ্রহ করে SEND, EDIT বা CANCEL লিখে পাঠান। ${none.bn}`),
    'nothing-to-send': both(`railfair: There is no report to send. Reply EXTRA to start one. ${none.en}`, `railfair: পাঠানোর মতো কোনো অভিযোগ নেই। শুরু করতে EXTRA লিখে পাঠান। ${none.bn}`),
    'nothing-to-change': both('railfair: There is nothing to change or cancel. Reply HELP, EXTRA or STATUS.', 'railfair: বদলানো বা বাতিল করার কিছু নেই। HELP, EXTRA বা STATUS লিখে পাঠান।'),
    'id-number': both(
      `railfair: Please don’t send ID or card numbers by SMS. Reply with an agent number, name or place, or SKIP. ${SAFETY.en}`,
      `railfair: অনুগ্রহ করে SMS-এ পরিচয়পত্র বা কার্ডের নম্বর পাঠাবেন না। এজেন্ট নম্বর, নাম বা জায়গা লিখুন, অথবা SKIP। ${SAFETY.bn}`,
    ),
  };
  return { code: 'SM09', text: map[kind] };
};

const chooseBooking = (bookings: SmsBooking[]): Reply => ({
  code: 'SM10',
  text: both(
    `railfair: This phone has ${bookings.length} bookings. Which one is this about?\n${bookings.map((b, i) => `${i + 1} ${b.ref} · ${b.date.en}`).join('\n')}\nReply with the number, or CANCEL.`,
    `railfair: এই ফোনে ${bnDigits(String(bookings.length))}টি বুকিং আছে। কোনটির বিষয়ে?\n${bookings.map((b, i) => `${bnDigits(String(i + 1))} ${b.ref} · ${b.date.bn}`).join('\n')}\nসংখ্যাটি লিখে পাঠান, অথবা CANCEL।`,
  ),
});

const unknownSender = (): Reply => ({
  code: 'SM11',
  text: both(
    `railfair: We can’t share booking details with this number. To get help, ask for a code on the traveller’s own registered phone, or go to any counter with your ID. ${SAFETY.en}`,
    `railfair: এই নম্বরে আমরা কোনো বুকিংয়ের তথ্য দিতে পারি না। সাহায্যের জন্য যাত্রীর নিজের নিবন্ধিত ফোনে কোড নিন, বা পরিচয়পত্র নিয়ে যেকোনো কাউন্টারে যান। ${SAFETY.bn}`,
  ),
  links: [LINK_OWN_PHONE],
});

const alreadyReceived = (ref: string): Reply => ({
  code: 'SM12',
  text: both(
    `railfair: Already received as ${ref}, no new case. Your ticket stays valid. Reply STATUS for updates.`,
    `railfair: আগেই ${ref} হিসেবে পাওয়া গেছে, নতুন কেস হয়নি। আপনার টিকিট বৈধ থাকে। হালনাগাদ জানতে STATUS লিখে পাঠান।`,
  ),
  links: [LINK_EVIDENCE],
});

const alreadyReported = (c: SmsCase): Reply => ({
  code: 'SM12',
  text: both(
    `railfair: You already reported ${c.booking}: case ${c.ref}. No new case was created. Reply STATUS for updates.`,
    `railfair: ${c.booking}-এর অভিযোগ আগেই করেছেন: কেস ${c.ref}। নতুন কেস তৈরি হয়নি। হালনাগাদ জানতে STATUS লিখে পাঠান।`,
  ),
  links: [LINK_EVIDENCE],
});

const stopped = (state: SmsState): Reply => {
  const c = state.cases[state.cases.length - 1];
  return {
    code: 'SM13',
    text: c
      ? both(
          `railfair: Optional follow-up messages are off. Case ${c.ref} is still handled. Reply STATUS any time.`,
          `railfair: ঐচ্ছিক ফলো-আপ বার্তা বন্ধ। কেস ${c.ref} এখনো দেখা হচ্ছে। যেকোনো সময় STATUS লিখে পাঠান।`,
        )
      : both('railfair: Optional follow-up messages are off. Reply HELP any time.', 'railfair: ঐচ্ছিক ফলো-আপ বার্তা বন্ধ। যেকোনো সময় HELP লিখে পাঠান।'),
  };
};

const cancelled = (): Reply => ({
  code: 'SM06',
  text: both(
    'railfair: Report dropped. Nothing was sent and no case was created. Reply EXTRA to start again.',
    'railfair: অভিযোগ বাদ দেওয়া হয়েছে। কিছু পাঠানো হয়নি, কোনো কেস তৈরি হয়নি। আবার শুরু করতে EXTRA লিখে পাঠান।',
  ),
});

// ---------- the state machine ----------

export const createState = (senderKind: SenderKind = 'own'): SmsState => {
  const bookings = senderKind === 'own' ? [bookingMain] : senderKind === 'shared' ? [bookingMain, bookingSecond] : [];
  const minute = toMinute(SMS_DEMO.start);
  const base: SmsState = { senderKind, mode: 'idle', bookings, draftSeq: 0, cases: [], followUps: true, minute, seq: 0, messages: [] };
  // An unknown number never got a receipt. A shared phone got one per booking.
  return bookings.reduce((s, b) => appendReplies(s, [receiptMessage(b)]), base);
};

function appendReplies(state: SmsState, replies: Reply[]): SmsState {
  let seq = state.seq;
  const added = replies.map((r) => ({ ...r, id: `m${++seq}`, from: 'railfair' as const, time: fmt(state.minute) }));
  return { ...state, seq, messages: [...state.messages, ...added] };
}

const caseFor = (state: SmsState, ref: string) => state.cases.find((c) => c.booking === ref);

const startExtra = (state: SmsState, booking: SmsBooking): [SmsState, Reply] => {
  const existing = caseFor(state, booking.ref);
  if (existing) return [{ ...state, mode: 'idle', draft: undefined }, alreadyReported(existing)];
  const id = state.draftSeq + 1;
  return [{ ...state, mode: 'extra-amount', draftSeq: id, draft: { id, booking } }, askAmount(booking)];
};

/** The server side: what railfair does with one received text. Pure. */
export function handle(state: SmsState, raw: string): [SmsState, Reply[]] {
  const text = raw.trim();
  const kw = text.toUpperCase();
  const digits = westernDigits(text);

  if (state.senderKind === 'unknown') {
    if (kw === 'STOP') return [{ ...state, followUps: false }, [stopped(state)]];
    return [state, [unknownSender()]];
  }

  switch (kw) {
    case 'STOP':
      return [{ ...state, followUps: false }, [stopped(state)]];
    case 'HELP':
      return [{ ...state, mode: 'help-menu', draft: undefined }, [helpMenu()]];
    case 'STATUS':
      return [state, [statusReply(state)]];
    case 'EXTRA': {
      if (state.bookings.length > 1) return [{ ...state, mode: 'extra-booking', draft: undefined }, [chooseBooking(state.bookings)]];
      const [next, reply] = startExtra(state, state.bookings[0]);
      return [next, [reply]];
    }
    case 'CANCEL':
      if (state.mode.startsWith('extra')) return [{ ...state, mode: 'idle', draft: undefined }, [cancelled()]];
      return [state, [invalid('nothing-to-change')]];
    case 'SEND': {
      const d = state.draft;
      if (state.mode === 'extra-summary' && d && d.amount !== undefined && d.method) {
        const c: SmsCase = {
          ref: `OC-${2207 + state.cases.length}`,
          booking: d.booking.ref,
          draftId: d.id,
          amount: d.amount,
          total: d.booking.total,
          collector: d.collector ?? null,
          method: d.method,
          channel: 'sms',
          receivedAt: fmt(state.minute),
          stage: 'received',
        };
        return [{ ...state, mode: 'idle', draft: undefined, lastSubmitted: d.id, cases: [...state.cases, c] }, [caseCreated(c)]];
      }
      // A repeated SEND (retry after a failed or pending send) is idempotent: no new case.
      const sent = state.cases.find((c) => c.draftId === state.lastSubmitted);
      if (sent) return [state, [alreadyReceived(sent.ref)]];
      return [state, [invalid('nothing-to-send')]];
    }
    case 'EDIT':
      if (state.mode === 'extra-summary' && state.draft) {
        const booking = state.draft.booking;
        return [{ ...state, mode: 'extra-amount', draft: { id: state.draft.id, booking } }, [askAmount(booking, true)]];
      }
      return [state, [invalid('nothing-to-change')]];
  }

  switch (state.mode) {
    case 'help-menu': {
      const n = /^[1-4]$/.test(digits) ? Number(digits) : NaN;
      if (Number.isNaN(n)) return [state, [invalid('menu')]];
      const supportRef = n === 3 ? SMS_DEMO.supportRef : state.supportRef;
      return [{ ...state, mode: 'idle', supportRef }, [helpAnswer(n, SMS_DEMO.supportRef)]];
    }
    case 'extra-booking': {
      const i = /^\d$/.test(digits) ? Number(digits) - 1 : state.bookings.findIndex((b) => b.ref === kw);
      const booking = state.bookings[i];
      if (!booking) return [state, [invalid('booking')]];
      const [next, reply] = startExtra(state, booking);
      return [next, [reply]];
    }
    case 'extra-amount': {
      const d = state.draft!;
      const amount = parseAmount(text);
      if (Number.isNaN(amount)) return [state, [invalid('amount')]];
      if (amount <= d.booking.total) return [state, [invalid('not-more', { amount, total: d.booking.total })]];
      return [{ ...state, mode: 'extra-collector', draft: { ...d, amount } }, [askCollector(amount, d.booking.total)]];
    }
    case 'extra-collector': {
      const d = state.draft!;
      if (text === '') return [state, [invalid('keyword')]];
      if (looksLikeId(text)) return [state, [invalid('id-number')]];
      const collector = kw === 'SKIP' ? null : text.slice(0, 60);
      return [{ ...state, mode: 'extra-method', draft: { ...d, collector } }, [askMethod()]];
    }
    case 'extra-method': {
      const d = state.draft!;
      const method: Method | undefined = kw === 'CASH' ? 'cash' : kw === 'DIGITAL' ? 'digital' : undefined;
      if (!method) return [state, [invalid('method')]];
      const draft = { ...d, method };
      return [{ ...state, mode: 'extra-summary', draft }, [summary(draft as Parameters<typeof summary>[0])]];
    }
    case 'extra-summary':
      return [state, [invalid('summary')]];
    default:
      return [state, [invalid('keyword')]];
  }
}

const userText = (raw: string): Text => {
  // A plain number the passenger typed reads with Bangla digits in Bangla; anything else is shown as typed.
  const plain = /^[\d,\s]+$/.test(raw.trim());
  return { en: raw, bn: plain ? bnDigits(raw) : raw };
};

/** The passenger sends a text. It is pending until delivered. */
export function send(state: SmsState, raw: string): SmsState {
  const seq = state.seq + 1;
  const minute = state.minute + 1;
  const msg: SmsMessage = { id: `m${seq}`, from: 'you', time: fmt(minute), text: userText(raw), raw, delivery: 'pending' };
  return { ...state, seq, minute, messages: [...state.messages, msg] };
}

const setDelivery = (state: SmsState, id: string, delivery: Delivery, time?: string): SmsState => ({
  ...state,
  messages: state.messages.map((m) => (m.id === id ? { ...m, delivery, time: time ?? m.time } : m)),
});

/** A pending message arrives: it is marked sent and railfair replies. */
export function deliver(state: SmsState, id: string): SmsState {
  const msg = state.messages.find((m) => m.id === id);
  if (!msg || msg.from !== 'you' || msg.delivery !== 'pending') return state;
  const [next, replies] = handle(setDelivery(state, id, 'sent'), msg.raw ?? '');
  return appendReplies(next, replies);
}

/**
 * The phone reports a failed send. If `received` is true the network did deliver it (the delivery report
 * was lost): railfair acts on it, but its reply doesn't reach the phone. A retry is then safe.
 */
export function failDelivery(state: SmsState, id: string, received = false): SmsState {
  const msg = state.messages.find((m) => m.id === id);
  if (!msg || msg.from !== 'you' || msg.delivery !== 'pending') return state;
  const failed = setDelivery(state, id, 'failed');
  if (!received) return failed;
  const [next] = handle(failed, msg.raw ?? '');
  return next;
}

/** Retry a failed message: it goes back to pending (deliver it next). */
export function retry(state: SmsState, id: string): SmsState {
  const msg = state.messages.find((m) => m.id === id);
  if (!msg || msg.delivery !== 'failed') return state;
  const minute = state.minute + 1;
  return { ...setDelivery(state, id, 'pending', fmt(minute)), minute };
}

/** Send and deliver in one step (tests and the scripted demo states). */
export const reply = (state: SmsState, raw: string) => {
  const sent = send(state, raw);
  return deliver(sent, lastId(sent));
};

export const lastId = (state: SmsState) => state.messages[state.messages.length - 1]?.id ?? '';

/** Move the latest case on (the review team's side, simulated). */
export const setCaseStage = (state: SmsState, stage: CaseStage): SmsState => ({
  ...state,
  cases: state.cases.map((c, i) => (i === state.cases.length - 1 ? { ...c, stage } : c)),
});

/** Quick-reply chips for the current conversation state. Values are what gets sent. */
export function quickReplies(state: SmsState): string[] {
  if (state.senderKind === 'unknown') return ['HELP', 'STATUS'];
  switch (state.mode) {
    case 'help-menu':
      return ['1', '2', '3', '4'];
    case 'extra-booking':
      return [...state.bookings.map((_, i) => String(i + 1)), 'CANCEL'];
    case 'extra-amount':
      return ['CANCEL'];
    case 'extra-collector':
      return ['SKIP', 'CANCEL'];
    case 'extra-method':
      return ['CASH', 'DIGITAL', 'CANCEL'];
    case 'extra-summary':
      return ['SEND', 'EDIT', 'CANCEL'];
    default:
      return ['HELP', 'EXTRA', 'STATUS', 'STOP'];
  }
}

/** The demo code of the latest railfair reply (shown as the screen ID). */
export const currentCode = (state: SmsState): SmCode => {
  const last = state.messages[state.messages.length - 1];
  if (last?.from === 'you' && last.delivery === 'failed') return 'SM12';
  for (let i = state.messages.length - 1; i >= 0; i--) {
    const c = state.messages[i].code;
    if (c) return c;
  }
  return 'SM01';
};

const reportSteps = ['EXTRA', '2500', SMS_DEMO.collector, 'CASH'];
const run = (s: SmsState, inputs: string[]) => inputs.reduce(reply, s);

/** Build the conversation for a demo state SM01–SM13 (deterministic). */
export function buildState(code: SmCode): SmsState {
  switch (code) {
    case 'SM01':
      return createState('own');
    case 'SM02':
      return run(createState('own'), ['HELP']);
    case 'SM03':
      return run(createState('own'), ['HELP', '3']);
    case 'SM04':
      return run(createState('own'), ['EXTRA']);
    case 'SM05':
      return run(createState('own'), ['EXTRA', '2500']);
    case 'SM06':
      return run(createState('own'), reportSteps);
    case 'SM07':
      return run(createState('own'), [...reportSteps, 'SEND']);
    case 'SM08':
      return reply(setCaseStage(run(createState('own'), [...reportSteps, 'SEND']), 'review'), 'STATUS');
    case 'SM09':
      return run(createState('own'), ['HLEP', 'EXTRA', 'two thousand']);
    case 'SM10':
      return run(createState('shared'), ['EXTRA']);
    case 'SM11':
      return run(createState('unknown'), ['STATUS']);
    case 'SM12': {
      // SEND was received (case created) but the phone shows it failed: Retry is safe.
      const s = send(run(createState('own'), reportSteps), 'SEND');
      return failDelivery(s, lastId(s), true);
    }
    case 'SM13':
      return run(createState('own'), [...reportSteps, 'SEND', 'STOP']);
  }
}
