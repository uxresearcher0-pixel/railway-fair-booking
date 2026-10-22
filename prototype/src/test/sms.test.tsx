import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { LangProvider } from '../i18n/lang';
import {
  SM_CODES,
  buildState,
  createState,
  currentCode,
  deliver,
  failDelivery,
  handle,
  lastId,
  parseAmount,
  quickReplies,
  reply,
  retry,
  send,
  setCaseStage,
  type SmsState,
} from '../sms/engine';
import { abdul, ayesha, helper, rahim, salma } from '../data/demo';
import { SmsDemo } from '../screens/SmsDemo';
import { R3cV2CaseInApp } from '../screens/R3cV2CaseInApp';
import { CT05v2CounterReport } from '../screens/CT05v2CounterReport';
import { P14v2Receipt } from '../screens/P14v2Receipt';
import { OP10v2AgentReports } from '../screens/OP10v2AgentReports';
import { App } from '../App';

const inBangla = (ui: ReactNode) => render(<LangProvider initial="bn">{ui}</LangProvider>);
const h1 = () => screen.getByRole('heading', { level: 1 });
const run = (s: SmsState, inputs: string[]) => inputs.reduce(reply, s);
const last = (s: SmsState) => s.messages[s.messages.length - 1];
const railfair = (s: SmsState) => s.messages.filter((m) => m.from === 'railfair');
const report = ['EXTRA', '2500', 'RA-204', 'CASH'];

describe('SMS engine · receipt and HELP', () => {
  it('SM01: the receipt gives the itemised official total for the booking and the keywords', () => {
    const s = createState();
    expect(s.messages).toHaveLength(1);
    expect(s.messages[0]).toMatchObject({ from: 'railfair', code: 'SM01', time: '09:12' });
    expect(s.messages[0].text.en).toBe(
      'railfair: RF-7Q2K-48 confirmed. Fare Tk 1,400; service Tk 80; assistance Tk 40. Official total Tk 1,520 for this booking (4 travellers). Reply HELP for assistance or EXTRA to report paying more.',
    );
    expect(s.messages[0].text.bn).toContain('অফিসিয়াল মোট ৳১,৫২০ (৪ জন যাত্রী)');
    expect(s.messages[0].text.bn).toContain('সাহায্যের জন্য HELP লিখে পাঠান');
  });

  it('SM02: HELP lists options 1–4', () => {
    const s = reply(createState(), 'HELP');
    expect(s.mode).toBe('help-menu');
    expect(last(s).code).toBe('SM02');
    for (const o of ['1 Ticket access', '2 Cancellation/refund', '3 Booking without my permission', '4 Callback/other help']) expect(last(s).text.en).toContain(o);
    expect(quickReplies(s)).toEqual(['1', '2', '3', '4']);
  });

  it('SM03: option 3 gives support reference SR-4410 and hands off to the app and a counter', () => {
    const s = run(createState(), ['HELP', '3']);
    const m = last(s);
    expect(m.code).toBe('SM03');
    expect(m.text.en).toContain('Support reference SR-4410');
    expect(m.text.en).toContain('SMS can’t change a booking');
    expect(m.links?.map((l) => l.href)).toEqual(['#/a1v2', '#/p25v2']);
    expect(s.supportRef).toBe('SR-4410');
    expect(s.mode).toBe('idle');
    // the return path: STATUS knows the support request
    expect(last(reply(s, 'STATUS')).text.en).toContain('Support request SR-4410: received');
  });

  it('accepts Bangla digits and lower case', () => {
    const s = run(createState(), ['help', '৩']);
    expect(last(s).text.en).toContain('SR-4410');
  });

  it('answers options 1, 2 and 4 without a support reference', () => {
    for (const o of ['1', '2', '4']) {
      const s = run(createState(), ['HELP', o]);
      expect(last(s).code).toBe('SM03');
      expect(s.supportRef).toBeUndefined();
    }
    expect(last(run(createState(), ['HELP', '4'])).text.en).toContain('once they are confirmed');
  });

  it('SM09: an unknown menu option asks again', () => {
    const s = run(createState(), ['HELP', '9']);
    expect(last(s).code).toBe('SM09');
    expect(s.mode).toBe('help-menu');
  });
});

describe('SMS engine · EXTRA report', () => {
  it('SM04: EXTRA confirms the booking and official total and asks for the TOTAL paid', () => {
    const s = reply(createState(), 'EXTRA');
    expect(s.mode).toBe('extra-amount');
    expect(last(s).code).toBe('SM04');
    expect(last(s).text.en).toContain('RF-7Q2K-48 (Thu 15 Oct)');
    expect(last(s).text.en).toContain('Official total Tk 1,520 for this booking (4 travellers)');
    expect(last(s).text.en).toContain('What TOTAL did you pay');
  });

  it('SM05: 2500 gives reported total, official total and reported excess, then asks who collected it (optional, SKIP)', () => {
    const s = run(createState(), ['EXTRA', '2500']);
    expect(last(s).code).toBe('SM05');
    expect(last(s).text.en).toContain('Reported total Tk 2,500; official total Tk 1,520; reported excess Tk 980.');
    expect(last(s).text.en).toMatch(/Who collected it\?.*SKIP\. This is optional\./);
    expect(last(s).text.bn).toContain('আপনার জানানো মোট ৳২,৫০০; অফিসিয়াল মোট ৳১,৫২০; বাড়তি টাকার অভিযোগ ৳৯৮০।');
    expect(quickReplies(s)).toEqual(['SKIP', 'CANCEL']);
  });

  it('parses amounts in Western or Bangla digits, with Tk, ৳ or commas', () => {
    for (const ok of ['2500', '2,500', 'Tk 2,500', 'tk2500', '৳2500', '২৫০০', '৳২,৫০০', ' 2500 ']) expect(parseAmount(ok)).toBe(2500);
    for (const bad of ['', 'two thousand', '0', '12.5', '1234567', '25OO', '-2500']) expect(parseAmount(bad)).toBeNaN();
  });

  it('SM09: an invalid amount asks again and creates no case', () => {
    const s = run(createState(), ['EXTRA', 'two thousand']);
    expect(last(s).code).toBe('SM09');
    expect(last(s).text.en).toContain('No report was created.');
    expect(s.mode).toBe('extra-amount');
    expect(s.cases).toHaveLength(0);
  });

  it('SM09: an amount that is not more than the official total has nothing to report', () => {
    const s = run(createState(), ['EXTRA', '1520']);
    expect(last(s).code).toBe('SM09');
    expect(last(s).text.en).toContain('Tk 1,520 is not more than the official total Tk 1,520');
    expect(s.mode).toBe('extra-amount');
  });

  it('SM06: method CASH or DIGITAL, then a summary with SEND / EDIT / CANCEL', () => {
    let s = run(createState(), ['EXTRA', '2500', 'SKIP']);
    expect(last(s).text.en).toBe('railfair: How did you pay the extra? Reply CASH or DIGITAL.');
    expect(quickReplies(s)).toEqual(['CASH', 'DIGITAL', 'CANCEL']);
    s = reply(s, 'cheque');
    expect(last(s).code).toBe('SM09');
    s = reply(s, 'digital');
    expect(s.mode).toBe('extra-summary');
    expect(last(s).code).toBe('SM06');
    expect(last(s).text.en).toContain('Collected by: not given');
    expect(last(s).text.en).toContain('Paid: digital');
    expect(last(s).text.en).toContain('Reply SEND to send it, EDIT to change it, or CANCEL to drop it.');
    expect(quickReplies(s)).toEqual(['SEND', 'EDIT', 'CANCEL']);
    expect(s.cases).toHaveLength(0);
  });

  it('keeps the collector as typed, and refuses anything that looks like an ID number', () => {
    let s = run(createState(), ['EXTRA', '2500']);
    s = reply(s, '1990123456789');
    expect(last(s).code).toBe('SM09');
    expect(last(s).text.en).toContain('Please don’t send ID or card numbers by SMS.');
    expect(s.mode).toBe('extra-collector');
    s = run(s, ['RA-204', 'CASH']);
    expect(last(s).text.en).toContain('Collected by: RA-204');
    expect(last(s).text.en).toContain('Paid: cash');
  });

  it('SM07: SEND creates case OC-2207 from SMS, with STATUS instructions and an optional evidence link', () => {
    const s = run(createState(), [...report, 'SEND']);
    expect(s.cases).toHaveLength(1);
    expect(s.cases[0]).toMatchObject({ ref: 'OC-2207', booking: 'RF-7Q2K-48', amount: 2500, total: 1520, collector: 'RA-204', method: 'cash', channel: 'sms', stage: 'received' });
    const m = last(s);
    expect(m.code).toBe('SM07');
    expect(m.text.en).toContain('Case OC-2207 for RF-7Q2K-48. Your ticket stays valid.');
    expect(m.text.en).toContain('a report is a lead, not proof, so nobody is penalised automatically and no refund is promised before a decision');
    expect(m.text.en).toContain('Evidence is optional');
    expect(m.text.en).toContain('Reply STATUS for updates.');
    expect(m.links).toEqual([expect.objectContaining({ href: '#/r3cv2' })]);
    expect(s.mode).toBe('idle');
  });

  it('EDIT goes back to the amount and keeps the booking; CANCEL drops the report', () => {
    let s = run(createState(), [...report, 'EDIT']);
    expect(s.mode).toBe('extra-amount');
    expect(last(s).text.en).toContain('OK, let’s change it.');
    s = run(s, ['1800', 'SKIP', 'CASH', 'SEND']);
    expect(s.cases[0]).toMatchObject({ amount: 1800, collector: null });

    let c = run(createState(), [...report, 'CANCEL']);
    expect(last(c).text.en).toContain('Report dropped. Nothing was sent and no case was created.');
    c = reply(c, 'SEND');
    expect(last(c).code).toBe('SM09');
    expect(last(c).text.en).toContain('There is no report to send.');
    expect(c.cases).toHaveLength(0);
  });

  it('CANCEL works at any step of the report', () => {
    for (const steps of [['EXTRA'], ['EXTRA', '2500'], ['EXTRA', '2500', 'SKIP']]) {
      const s = run(createState(), [...steps, 'cancel']);
      expect(s.mode).toBe('idle');
      expect(s.draft).toBeUndefined();
    }
  });

  it('SEND or CANCEL with nothing in progress creates nothing', () => {
    expect(last(reply(createState(), 'SEND')).code).toBe('SM09');
    expect(last(reply(createState(), 'CANCEL')).code).toBe('SM09');
    expect(last(reply(createState(), 'EDIT')).code).toBe('SM09');
  });
});

describe('SMS engine · idempotent SEND (SM12)', () => {
  it('a duplicate SEND does not create a second case', () => {
    const once = run(createState(), [...report, 'SEND']);
    const twice = run(once, ['SEND', 'send']);
    expect(twice.cases).toHaveLength(1);
    expect(last(twice).code).toBe('SM12');
    expect(last(twice).text.en).toBe('railfair: Already received as OC-2207, no new case. Your ticket stays valid. Reply STATUS for updates.');
  });

  it('a failed send that the network received: the case exists once, and Retry says "Already received"', () => {
    let s = send(run(createState(), report), 'SEND');
    const id = lastId(s);
    expect(last(s).delivery).toBe('pending');
    s = failDelivery(s, id, true);
    expect(s.messages.find((m) => m.id === id)?.delivery).toBe('failed');
    expect(s.cases.map((c) => c.ref)).toEqual(['OC-2207']);
    expect(last(s).from).toBe('you'); // the phone never got the reply
    expect(currentCode(s)).toBe('SM12');

    s = retry(s, id);
    expect(s.messages.find((m) => m.id === id)?.delivery).toBe('pending');
    s = deliver(s, id);
    expect(s.messages.find((m) => m.id === id)?.delivery).toBe('sent');
    expect(last(s).text.en).toContain('Already received as OC-2207, no new case.');
    expect(s.cases).toHaveLength(1);
    // retrying again is still safe
    s = reply(s, 'SEND');
    expect(s.cases).toHaveLength(1);
  });

  it('a failed send that never arrived: Retry creates the case normally, once', () => {
    let s = send(run(createState(), report), 'SEND');
    const id = lastId(s);
    s = failDelivery(s, id, false);
    expect(s.cases).toHaveLength(0);
    s = deliver(retry(s, id), id);
    expect(last(s).code).toBe('SM07');
    expect(s.cases).toHaveLength(1);
  });

  it('EXTRA again for a booking that already has a case points to it: no new case', () => {
    const s = run(createState(), [...report, 'SEND', 'EXTRA']);
    expect(last(s).text.en).toContain('You already reported RF-7Q2K-48: case OC-2207. No new case was created.');
    expect(s.mode).toBe('idle');
    expect(s.cases).toHaveLength(1);
  });

  it('only pending messages can be delivered and only failed ones retried', () => {
    const s = run(createState(), ['HELP']);
    const id = s.messages[1].id;
    expect(deliver(s, id)).toBe(s);
    expect(retry(s, id)).toBe(s);
    expect(failDelivery(s, id)).toBe(s);
  });
});

describe('SMS engine · STATUS, shared phone, unknown sender, STOP', () => {
  it('SM08: STATUS shows the timeline with the proposed timing', () => {
    const s = reply(setCaseStage(run(createState(), [...report, 'SEND']), 'review'), 'STATUS');
    const text = last(s).text.en;
    expect(last(s).code).toBe('SM08');
    expect(text).toContain('Case OC-2207 (RF-7Q2K-48)');
    expect(text).toMatch(/Done: Received \d\d:\d\d\nNow: Under review\nNot yet: More information requested\nNot yet: Resolved, with outcome and appeal route/);
    expect(text).toContain('Proposed timing: first update within 10 working days, not guaranteed.');
  });

  it('STATUS with nothing open says so', () => {
    expect(last(reply(createState(), 'STATUS')).text.en).toContain('There is no open report or help request for this number.');
  });

  it('SM10: a shared phone chooses the booking by reference and date only, never by name', () => {
    let s = createState('shared');
    expect(s.messages).toHaveLength(2); // a receipt per booking
    s = reply(s, 'EXTRA');
    expect(last(s).code).toBe('SM10');
    expect(last(s).text.en).toContain('1 RF-7Q2K-48 · Thu 15 Oct\n2 RF-3M8D-15 · Fri 17 Oct');
    expect(quickReplies(s)).toEqual(['1', '2', 'CANCEL']);
    const names = [abdul, salma, rahim, ayesha, helper].flatMap((p) => [p.name, p.nameBn, p.name.split(' ')[0]]);
    for (const m of s.messages) for (const n of names) expect(`${m.text.en} ${m.text.bn}`).not.toContain(n);
    expect(last(reply(s, '7')).code).toBe('SM09');
    s = reply(s, '2');
    expect(last(s).code).toBe('SM04');
    expect(last(s).text.en).toContain('RF-3M8D-15 (Fri 17 Oct). Official total Tk 740 for this booking (2 travellers)');
    s = run(s, ['900', 'SKIP', 'CASH', 'SEND']);
    expect(s.cases[0]).toMatchObject({ ref: 'OC-2207', booking: 'RF-3M8D-15', amount: 900, total: 740 });
  });

  it('SM10: the booking can also be chosen by its reference', () => {
    const s = run(createState('shared'), ['EXTRA', 'rf-7q2k-48']);
    expect(last(s).text.en).toContain('Report paying more for RF-7Q2K-48');
  });

  it('SM11: an unknown sender gets no booking details, only a code to the own phone or counter help', () => {
    let s = createState('unknown');
    expect(s.messages).toHaveLength(0);
    for (const input of ['STATUS', 'EXTRA', 'HELP', '3', 'RF-7Q2K-48', '2500', 'SEND']) {
      s = reply(s, input);
      const m = last(s);
      expect(m.code).toBe('SM11');
      expect(m.text.en).not.toMatch(/RF-|OC-|SR-|Tk|\d/);
      expect(m.links?.map((l) => l.href)).toEqual(['#/p25v2']);
    }
    expect(last(s).text.en).toContain('ask for a code on the traveller’s own registered phone, or go to any counter with your ID');
    expect(s.cases).toHaveLength(0);
  });

  it('SM13: STOP turns off optional follow-ups; the open case is still handled and STATUS still works', () => {
    let s = run(createState(), [...report, 'SEND', 'STOP']);
    expect(s.followUps).toBe(false);
    expect(last(s).code).toBe('SM13');
    expect(last(s).text.en).toBe('railfair: Optional follow-up messages are off. Case OC-2207 is still handled. Reply STATUS any time.');
    s = reply(s, 'STATUS');
    expect(last(s).code).toBe('SM08');
    expect(s.cases).toHaveLength(1);
  });

  it('SM09: an unknown keyword gets a clear retry message and no case', () => {
    const s = reply(createState(), 'HLEP');
    expect(last(s).code).toBe('SM09');
    expect(last(s).text.en).toBe('railfair: Sorry, we didn’t understand that. Reply HELP, EXTRA or STATUS. No report was created.');
    expect(s.cases).toHaveLength(0);
  });

  it('is pure: handle() never changes the state it is given', () => {
    const s = run(createState(), report);
    const before = JSON.stringify(s);
    handle(s, 'SEND');
    expect(JSON.stringify(s)).toBe(before);
  });
});

describe('SMS engine · every demo state SM01–SM13', () => {
  const states = SM_CODES.map((c) => [c, buildState(c)] as const);

  it('builds each state and reports its demo code', () => {
    for (const [code, s] of states) expect(currentCode(s)).toBe(code);
  });

  it('never asks for a full NID, PIN, password or OTP', () => {
    for (const [, s] of states)
      for (const m of railfair(s)) {
        expect(m.text.en).not.toMatch(/\b(send|reply with|enter|type|give)\b[^.]*\b(NID|PIN|password|OTP)\b/i);
        if (/\b(NID|PIN|password|OTP)\b/.test(m.text.en)) expect(m.text.en).toMatch(/never ask|don’t send/i);
      }
  });

  it('English SMS money uses "Tk"; Bangla SMS uses ৳ and Bangla digits, with keywords and codes in Latin', () => {
    const code = /\b[A-Z]{2}-[0-9A-Z]+(?:-[0-9A-Z]+)*\b/g;
    for (const [, s] of states)
      for (const m of railfair(s)) {
        expect(m.text.en).not.toContain('৳');
        expect(m.text.bn).not.toContain('Tk');
        expect(m.text.bn.replace(code, '')).not.toMatch(/[0-9]/);
      }
    const bn = buildState('SM01').messages[0].text.bn;
    expect(bn).toContain('HELP');
    expect(bn).toContain('EXTRA');
  });

  it('times go forward a minute per message', () => {
    expect(buildState('SM05').messages.map((m) => m.time)).toEqual(['09:12', '09:13', '09:13', '09:14', '09:14']);
  });
});

describe('SmsDemo screen (#/sms)', () => {
  it('shows the phone UI with the simulation banner, a polite log and labelled bubbles', () => {
    render(<SmsDemo />);
    expect(h1()).toHaveTextContent('SMS help and reports');
    expect(screen.getByRole('heading', { level: 2, name: 'railfair · demo two-way number' })).toBeInTheDocument();
    expect(screen.getByText('Simulation: no real SMS')).toBeInTheDocument();
    const log = screen.getByRole('log', { name: 'Messages' });
    expect(log).toHaveAttribute('aria-live', 'polite');
    const items = within(log).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent(/^railfair · at 09:12railfair: RF-7Q2K-48 confirmed\./);
    expect(screen.getByRole('textbox', { name: 'Your reply' })).toHaveAccessibleDescription(/Send HELP for help/);
    expect(within(screen.getByRole('group', { name: 'Quick replies' })).getAllByRole('button').map((b) => b.textContent)).toEqual(['HELP', 'EXTRA', 'STATUS', 'STOP']);
  });

  it('sends a typed reply: pending, then sent with the answer; focus stays in the input', async () => {
    const user = userEvent.setup();
    render(<SmsDemo deliveryDelay={50} />);
    const input = screen.getByRole('textbox', { name: 'Your reply' });
    await user.type(input, 'help{Enter}');
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    const log = screen.getByRole('log');
    const mine = within(log).getAllByRole('listitem').slice(-1)[0];
    expect(mine).toHaveTextContent(/^You · at 09:13help/);
    expect(mine).toHaveTextContent('Sending…');
    expect(await within(log).findByText(/^railfair help\. Reply with a number:/, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(mine).toHaveTextContent('Sent');
    expect(input).toHaveFocus();
  });

  it('quick replies send and return focus to the input; an empty send shows an error', async () => {
    const user = userEvent.setup();
    render(<SmsDemo deliveryDelay={10} />);
    await user.click(screen.getByRole('button', { name: 'Send' }));
    const input = screen.getByRole('textbox', { name: 'Your reply' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/Error: Type a reply or choose a quick reply\./);
    expect(input).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'EXTRA' }));
    expect(input).toHaveFocus();
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(await screen.findByText(/What TOTAL did you pay/, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'CANCEL' })).toBeInTheDocument();
  });

  it('runs the whole EXTRA report by keyboard and links the case to the app', async () => {
    const user = userEvent.setup();
    render(<SmsDemo deliveryDelay={5} />);
    const input = screen.getByRole('textbox', { name: 'Your reply' });
    for (const [text, expected] of [
      ['EXTRA', /What TOTAL did you pay/],
      ['2500', /reported excess Tk 980/],
      ['SKIP', /Reply CASH or DIGITAL/],
      ['CASH', /Reply SEND to send it/],
      ['SEND', /Report received\. Case OC-2207/],
    ] as const) {
      await user.type(input, `${text}{Enter}`);
      expect(await screen.findByText(expected, {}, { timeout: 2000 })).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: 'Add evidence in the app (optional)' })).toHaveAttribute('href', '#/r3cv2');
  });

  it('SM12: Retry moves focus to the message and answers "Already received as OC-2207, no new case"', async () => {
    const user = userEvent.setup();
    render(<SmsDemo start="SM12" deliveryDelay={10} />);
    const log = screen.getByRole('log');
    const failed = within(log).getAllByRole('listitem').slice(-1)[0];
    expect(failed).toHaveTextContent('Not sent');
    const retryBtn = within(failed).getByRole('button', { name: 'Retry' });
    expect(retryBtn).toHaveAccessibleDescription('SEND');
    await user.click(retryBtn);
    expect(failed).toHaveFocus();
    expect(await within(log).findByText(/Already received as OC-2207, no new case\./, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(within(log).getAllByText(/Already received as OC-2207/)).toHaveLength(1);
    expect(within(log).queryByText(/Report received\. Case/)).not.toBeInTheDocument();
  });

  it('the failed-send toggle makes the next send fail, and loading a state focuses its latest message', async () => {
    const user = userEvent.setup();
    render(<SmsDemo start="SM06" deliveryDelay={10} />);
    await user.click(screen.getByRole('checkbox', { name: /Make the next send fail/ }));
    await user.click(screen.getByRole('button', { name: 'SEND' }));
    expect(await screen.findByRole('button', { name: 'Retry' }, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Make the next send fail/ })).not.toBeChecked();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Start from' }), 'SM10');
    await user.click(screen.getByRole('button', { name: 'Show this state' }));
    const items = within(screen.getByRole('log')).getAllByRole('listitem');
    expect(items.slice(-1)[0]).toHaveFocus();
    expect(items.slice(-1)[0]).toHaveTextContent('This phone has 2 bookings');
    expect(screen.getByText(/A phone shared by 2 bookings/)).toBeInTheDocument();
  });

  it('Bangla: Bangla digits and wording, keywords stay Latin with lang="en"', () => {
    inBangla(<SmsDemo start="SM05" />);
    expect(h1()).toHaveTextContent('SMS-এ সাহায্য ও অভিযোগ');
    const log = screen.getByRole('log', { name: 'বার্তা' });
    expect(within(log).getByText(/আপনার জানানো মোট ৳২,৫০০; অফিসিয়াল মোট ৳১,৫২০; বাড়তি টাকার অভিযোগ ৳৯৮০।/)).toBeInTheDocument();
    for (const kw of within(log).getAllByText('EXTRA')) expect(kw).toHaveAttribute('lang', 'en');
    expect(within(log).getByText('২৫০০')).toBeInTheDocument(); // the passenger's number in Bangla digits
    expect(screen.getByText('SKIP', { selector: 'button' })).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('textbox', { name: 'আপনার উত্তর' })).toHaveAccessibleDescription(/^সাহায্যের জন্য HELP লিখে পাঠান।/);
  });
});

describe('R3c·v2 case OC-2207 in the app', () => {
  it('shows the same case from SMS with the timeline, optional evidence and ticket valid', async () => {
    const user = userEvent.setup();
    render(<R3cV2CaseInApp />);
    expect(h1()).toHaveTextContent('Report OC-2207');
    expect(screen.getByText('Source').nextSibling).toHaveTextContent('SMS');
    expect(screen.getByText('Reported total').nextSibling).toHaveTextContent('৳2,500');
    expect(screen.getByText('Official total').nextSibling).toHaveTextContent('৳1,520');
    expect(screen.getByText('Reported excess').nextSibling).toHaveTextContent('৳980');
    expect(screen.getByText('Ticket stays valid')).toBeInTheDocument();
    const steps = within(screen.getByRole('region', { name: 'Status' })).getAllByRole('listitem');
    expect(steps.map((s) => s.textContent)).toEqual([
      expect.stringMatching(/^DoneReceived · 09:1\d$/),
      'NowUnder review',
      expect.stringMatching(/^Not yetMore information requested/),
      expect.stringMatching(/^Not yetResolved, with outcome and appeal route/),
    ]);
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText(/Timing is proposed/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add evidence (optional)' }));
    const msg = screen.getByRole('status');
    expect(msg).toHaveTextContent('Secure upload isn’t part of this prototype (demo)');
    expect(document.activeElement).toContainElement(msg);
    expect(screen.getByRole('link', { name: 'View the SMS conversation' })).toHaveAttribute('href', '#/sms');
  });

  it('uses Bangla digits', () => {
    inBangla(<R3cV2CaseInApp stage="resolved" />);
    expect(screen.getByText('বাড়তি টাকার অভিযোগ').nextSibling).toHaveTextContent('৳৯৮০');
    expect(screen.getByText(/১০ কর্মদিবসের মধ্যে/)).toBeInTheDocument();
  });
});

describe('CT05·v2 counter-assisted report', () => {
  it('validates, files OC-2207 for the passenger and prints an itemised receipt', async () => {
    const user = userEvent.setup();
    render(<CT05v2CounterReport />);
    expect(screen.getByText('Abdul Karim')).toHaveAttribute('lang', 'en');
    expect(screen.getByText('NID record matched')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'File report for the passenger' }));
    const amount = screen.getByRole('textbox', { name: 'Total the passenger paid (৳)' });
    expect(amount).toHaveFocus();
    expect(amount).toHaveAccessibleDescription(/Error: Enter the total the passenger paid/);
    await user.type(amount, '1500');
    await user.click(screen.getByRole('button', { name: 'File report for the passenger' }));
    expect(amount).toHaveAccessibleDescription(/That is not more than the official total ৳1,520\./);
    await user.clear(amount);
    await user.type(amount, '2500');
    expect(screen.getByText('Reported excess: ৳980.')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Cash' }));
    await user.click(screen.getByRole('button', { name: 'File report for the passenger' }));

    const filed = screen.getByRole('status');
    expect(filed).toHaveTextContent('Report filed: case OC-2207');
    expect(filed).toHaveTextContent('Channel: counter.');
    expect(document.activeElement).toContainElement(filed);
    const table = screen.getByRole('table');
    expect(within(table).getByRole('row', { name: /Fare 4 × ৳350 ৳1,400/ })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Official total ৳1,520' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Reported total paid ৳2,500' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Reported excess ৳980' })).toBeInTheDocument();
    expect(screen.getByText('Collected by (as reported)').nextSibling).toHaveTextContent('Not given');

    await user.click(screen.getByRole('button', { name: 'Print receipt' }));
    expect(screen.getByText('Receipt for OC-2207 sent to the printer (demo)')).toBeInTheDocument();
  });

  it('keeps the English name on the staff screen in Bangla', () => {
    inBangla(<CT05v2CounterReport initialPhase="filed" initialAmount="২৫০০" initialMethod="cash" />);
    expect(screen.getByText('Abdul Karim')).toHaveAttribute('lang', 'en');
    expect(screen.queryByText(/আব্দুল/)).not.toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'বাড়তি টাকার অভিযোগ ৳৯৮০' })).toBeInTheDocument();
  });
});

describe('SMS tie-ins: P14·v2, OP10·v2 and routes', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('P14·v2 keeps its actions and adds "View SMS demo"', () => {
    render(<P14v2Receipt />);
    expect(screen.getByRole('button', { name: 'Show my tickets' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Report an extra charge' })).toHaveAttribute('href', '#/r3v2');
    expect(screen.getByRole('link', { name: 'View SMS demo' })).toHaveAttribute('href', '#/sms');
  });

  it('OP10·v2 shows the channel of OC-2207', () => {
    render(<OP10v2AgentReports />);
    expect(screen.getByText('Channel').nextSibling).toHaveTextContent('Reported by: SMS');
    expect(screen.getByText('Channels: SMS, app or counter. One case per report.')).toBeInTheDocument();
  });

  it('opens #/sms, #/r3cv2 and #/ct05v2 from Home with focus on each h1', async () => {
    const user = userEvent.setup();
    window.location.hash = '';
    render(<App />);
    const passenger = screen.getByRole('region', { name: 'Passenger' });
    await user.click(within(passenger).getByRole('link', { name: /SMS help and reports \(demo\)/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'SMS help and reports' })).toHaveFocus();
    expect(screen.getAllByRole('main')).toHaveLength(1);
    await user.click(screen.getByRole('link', { name: 'See the case in the app' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Report OC-2207' })).toHaveFocus();
    await user.click(screen.getByRole('link', { name: 'Home' }));
    await user.click(within(await screen.findByRole('region', { name: 'Staff' })).getByRole('link', { name: /Counter-assisted report/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Counter-assisted report' })).toHaveFocus();
  });
});
