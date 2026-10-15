/**
 * Fictional demo data only. These people, numbers and records do not exist.
 * NIDs and birth registrations are stored as masked last-4 only.
 */
export const FARE = 350; // ৳ per ticket (demo)
export const SERVICE_CHARGE = 20; // ৳ per ticket, non-refundable (demo; per-ticket rule to confirm)
// Purchase limits (published terms; Eid rules can differ):
export const SEATS_PER_BOOKING = 4; // max seats in one booking
export const BOOKINGS_PER_DAY = 2; // per NID; the second must be for a different train or route
export const SEATS_PER_DAY = SEATS_PER_BOOKING * BOOKINGS_PER_DAY; // 8

export const BOOKING_REF = 'RF-7Q2K-48';
export const INVITE_CODE = 'K7Q-48';

// Bangla fields (…Bn) are used in Bangla mode. Station codes are demo codes;
// the official railway abbreviations are still to come (railway-decisions.md #32).
export const trip = {
  from: { name: 'Dhaka', nameBn: 'ঢাকা', code: 'DHK' },
  to: { name: 'Chattogram', nameBn: 'চট্টগ্রাম', code: 'CTG' },
  train: 'Demo Intercity 701',
  trainBn: 'ডেমো আন্তঃনগর ৭০১',
  date: 'Thu 15 Oct',
  dateBn: 'বৃহস্পতি ১৫ অক্টো',
  departs: '07:30',
  arrives: '13:05',
  coach: 'GHA',
  coachBn: 'ঘ',
  className: 'AC chair',
  classNameBn: 'এসি চেয়ার',
};

export type TravellerKind = 'adult' | 'child';

export interface Traveller {
  id: string;
  name: string;
  /** Bangla name, shown on Bangla passenger screens. Tickets and staff checks use the English name. */
  nameBn: string;
  kind: TravellerKind;
  idType: 'NID' | 'Birth registration';
  idLast4: string;
  seat?: string;
}

// Seats are in coach GHA: Package A 1–4, Package B 5–7 (the G3b "front" block).
export const abdul: Traveller = { id: 't1', name: 'Abdul Karim', nameBn: 'আব্দুল করিম', kind: 'adult', idType: 'NID', idLast4: '4821', seat: '1' };
export const salma: Traveller = { id: 't2', name: 'Salma Karim', nameBn: 'সালমা করিম', kind: 'adult', idType: 'NID', idLast4: '1177', seat: '5' };
export const rahim: Traveller = { id: 't3', name: 'Rahim Karim', nameBn: 'রহিম করিম', kind: 'adult', idType: 'NID', idLast4: '3390', seat: '6' };
export const ayesha: Traveller = { id: 't4', name: 'Ayesha Karim', nameBn: 'আয়েশা করিম', kind: 'child', idType: 'Birth registration', idLast4: '0526', seat: '7' };

/** Package B of the linked group of 7 (A: 4 + B: 3). */
export const packageB: Traveller[] = [salma, rahim, ayesha];
export const PACKAGE_A_SIZE = 4;

export const taka = (n: number) => `৳${n.toLocaleString('en-US')}`;
export const masked = (last4: string) => `••${last4}`;

/** Group of 7 (Package A 4 + Package B 3): one class for the whole group (decision 7c). */
export const GROUP_SIZE = 7;

export interface Coach {
  code: string;
  codeBn: string;
  /** Free seat numbers in the chosen class. */
  free: number[];
}

/**
 * Coaches in the group's class (AC chair) with their free seats (demo).
 * GHA has the example from the brief: 1–9, 15–19, 48–54, 92–100 free.
 */
export const coaches: Coach[] = [
  { code: 'GHA', codeBn: 'ঘ', free: [...range(1, 9), ...range(15, 19), ...range(48, 54), ...range(92, 100)] },
  { code: 'DA', codeBn: 'ড', free: [...range(20, 26), 40, 41] },
  { code: 'DHA', codeBn: 'ঢ', free: [3, 4, 10, 11, 12, 30, 31, 60, 61] },
  { code: 'JHA', codeBn: 'ঝ', free: [8, 9, 30, 31, 44, 45] },
  { code: 'TA', codeBn: 'ট', free: [12, 13, 70, 71, 72] },
  { code: 'KA', codeBn: 'ক', free: [] },
];

function range(a: number, b: number) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

/** Longest run of consecutive free seats. */
export const longestRun = (free: number[]) => {
  let best = 0;
  let run = 0;
  free.forEach((n, i) => {
    run = i > 0 && free[i - 1] === n - 1 ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return best;
};

/** Destination stations for F01b (from Dhaka). Codes are demo codes. */
export const destinations = [
  { name: 'Chattogram', nameBn: 'চট্টগ্রাম', code: 'CTG' },
  { name: 'Chandpur', nameBn: 'চাঁদপুর', code: 'CDP' },
  { name: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', code: 'CDG' },
  { name: 'Rajshahi', nameBn: 'রাজশাহী', code: 'RJH' },
  { name: 'Sylhet', nameBn: 'সিলেট', code: 'SYT' },
  { name: 'Khulna', nameBn: 'খুলনা', code: 'KLN' },
];

// ---------- Fair access v2 (proposed; docs/fair-access-v2.md) ----------
// Every rule below is proposed and needs railway approval (decisions #35–#44).

/** Application window for a busy train, result time and pay-by time (demo, today). */
export const DRAW = {
  opens: '08:00',
  closes: '10:00',
  /** The last minute inside the window, used for "08:00 or 09:59 gives the same chance". */
  lastMinute: '09:59',
  result: '10:30',
  payBy: '11:00',
};
/** This party's application reference and draw place. */
export const APPLICATION_REF = 'AP-0214-7K';
export const DRAW_PLACE = '0214';
/** Another application that already includes Rahim Karim (duplicate-check example). */
export const DUPLICATE_APPLICATION = { ref: 'AP-0031', place: 'Kamalapur counter', placeBn: 'কমলাপুর কাউন্টার' };
/** Party for the v2 draw: 4 travellers, one draw place. */
export const drawParty: Traveller[] = [abdul, salma, rahim, ayesha];

/** Assistance fee of a registered agent (demo; rate to confirm). */
export const ASSISTANCE_FEE = 40;
export const AGENT_ID = 'RA-118';

/** A helper with limited rights on a booking (A1·v2). Fictional. */
export const helper = { name: 'Karim Uddin', nameBn: 'করিম উদ্দিন' };
/** Record of the access change after the helper is removed. */
export const ACCESS_RECORD = 'AC-5521';
/** Reference of an extra-charge report (R3·v2). */
export const REPORT_REF = 'OC-2207';
/** The traveller's own phone, last 2 digits (codes and SMS go here, never to the helper). */
export const OWN_PHONE_LAST2 = '62';
