/**
 * Fictional demo data only. These people, numbers and records do not exist.
 * NIDs and birth registrations are stored as masked last-4 only.
 */
export const FARE = 350; // ৳ per ticket (demo)
export const SERVICE_CHARGE = 20; // ৳ per ticket, non-refundable (demo; per-ticket rule to confirm)
export const DAILY_LIMIT = 4; // tickets per buyer per day (rule to confirm)

export const BOOKING_REF = 'RF-7Q2K-48';
export const INVITE_CODE = 'K7Q-48';

export const trip = {
  from: { name: 'Dhaka', code: 'DHK' },
  to: { name: 'Chattogram', code: 'CTG' },
  train: 'Demo Intercity 701',
  date: 'Thu 15 Oct',
  departs: '07:30',
  arrives: '13:05',
  coach: 'C2',
  className: 'AC chair',
};

export type TravellerKind = 'adult' | 'child';

export interface Traveller {
  id: string;
  name: string;
  kind: TravellerKind;
  idType: 'NID' | 'Birth registration';
  idLast4: string;
  seat?: string;
}

export const abdul: Traveller = { id: 't1', name: 'Abdul Karim', kind: 'adult', idType: 'NID', idLast4: '4821', seat: '3A' };
export const salma: Traveller = { id: 't2', name: 'Salma Karim', kind: 'adult', idType: 'NID', idLast4: '1177', seat: '4C' };
export const rahim: Traveller = { id: 't3', name: 'Rahim Karim', kind: 'adult', idType: 'NID', idLast4: '3390', seat: '4D' };
export const ayesha: Traveller = { id: 't4', name: 'Ayesha Karim', kind: 'child', idType: 'Birth registration', idLast4: '0526', seat: '4E' };

/** Package B of the linked group of 7 (A: 4 + B: 3). */
export const packageB: Traveller[] = [salma, rahim, ayesha];
export const PACKAGE_A_SIZE = 4;

export const taka = (n: number) => `৳${n.toLocaleString('en-US')}`;
export const masked = (last4: string) => `••${last4}`;
