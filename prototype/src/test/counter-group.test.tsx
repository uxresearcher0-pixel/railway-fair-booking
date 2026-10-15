import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { LangProvider } from '../i18n/lang';
import { CTD01FindBooking } from '../screens/CTD01FindBooking';
import { CTD02WalkInApply } from '../screens/CTD02WalkInApply';
import { CTD03TakePayment } from '../screens/CTD03TakePayment';
import { CTD04RecoverTicket } from '../screens/CTD04RecoverTicket';
import { G2v2Group } from '../screens/G2v2Group';
import { G3v2GroupSeats } from '../screens/G3v2GroupSeats';
import { G5v2EachPackagePays } from '../screens/G5v2EachPackagePays';
import { G4v2GroupTickets } from '../screens/G4v2GroupTickets';
import { App } from '../App';
import { axe } from './axe';

const inBangla = (ui: ReactNode) => render(<LangProvider initial="bn">{ui}</LangProvider>);
const h1 = () => screen.getByRole('heading', { level: 1 });

describe('Counter terminal side rail', () => {
  it('is a labelled nav with aria-current on the open section, and Shift and cash is not a dead link', () => {
    render(<CTD03TakePayment />);
    const nav = screen.getByRole('navigation', { name: 'Counter terminal' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Find or start', '#/ctd01'],
      ['Apply for a draw', '#/ctd02'],
      ['Take payment', '#/ctd03'],
      ['Recover a ticket', '#/ctd04'],
    ]);
    expect(within(nav).getByRole('link', { name: 'Take payment' })).toHaveAttribute('aria-current', 'page');
    expect(links.filter((a) => a.hasAttribute('aria-current'))).toHaveLength(1);
    expect(within(nav).getByText('Shift and cash').closest('a')).toBeNull();
    // the rail comes before main and never contains it
    expect(nav.compareDocumentPosition(screen.getByRole('main')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('uses Bangla text and digits, and keeps the counter code Latin', () => {
    inBangla(<CTD01FindBooking />);
    const nav = screen.getByRole('navigation', { name: 'কাউন্টার টার্মিনাল' });
    expect(within(nav).getByRole('link', { name: 'খুঁজুন বা শুরু করুন' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByText('C-2')).toHaveAttribute('lang', 'en');
    expect(within(nav).getByText('২০৭')).toBeInTheDocument();
    expect(screen.getByText('স্টেশন কাউন্টার · শিফট ০৮:০০–১৪:০০')).toBeInTheDocument();
  });
});

describe('CTD01 find a booking or start one', () => {
  it('finds AP-0214-7K, moves focus to the result and links to Take payment', async () => {
    const user = userEvent.setup();
    render(<CTD01FindBooking />);
    expect(h1()).toHaveTextContent('Find a booking or start one');
    await user.type(screen.getByRole('textbox', { name: 'Reference, application or ID number' }), 'ap-0214-7k');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    const result = screen.getByRole('region', { name: 'Result · AP-0214-7K' });
    expect(document.activeElement).toContainElement(result);
    expect(within(result).getByText('Travellers').nextSibling).toHaveTextContent('4 · party locked at 10:00');
    expect(within(result).getByText('Picked · pay by 11:00')).toBeInTheDocument();
    expect(within(result).getByText('Abdul Karim')).toHaveAttribute('lang', 'en');
    expect(within(result).getByRole('link', { name: 'Take payment' })).toHaveAttribute('href', '#/ctd03');
    expect(screen.getByText('No counter fee is added. Registered agents show their fee on a printed receipt.')).toBeInTheDocument();
  });

  it('shows an error for an empty search and a message when nothing matches', async () => {
    const user = userEvent.setup();
    render(<CTD01FindBooking />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    const input = screen.getByRole('textbox', { name: 'Reference, application or ID number' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(document.activeElement).toBe(input);
    await user.type(input, 'AP-9999-0X');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('status')).toHaveTextContent('Nothing found');
  });

  it('keeps the staff name in English in Bangla mode', () => {
    inBangla(<CTD01FindBooking initialQuery="AP-0214-7K" searched />);
    expect(screen.getByText('Abdul Karim')).toHaveAttribute('lang', 'en');
    expect(screen.getByText('৪ জন · দল ১০:০০-এ লক')).toBeInTheDocument();
    expect(within(screen.getByRole('region', { name: 'ফলাফল · AP-0214-7K' })).getByRole('link', { name: 'টাকা নিন' })).toHaveAttribute('href', '#/ctd03');
  });
});

describe('CTD02 apply for a walk-in passenger', () => {
  it('lists travellers with NID record matched, the window, the result time and the fee', () => {
    render(<CTD02WalkInApply />);
    expect(screen.getAllByText('NID record matched')).toHaveLength(2);
    expect(screen.getByText('Mohammad Ali')).toHaveAttribute('lang', 'en');
    expect(screen.getByText('Window').nextSibling).toHaveTextContent('08:00–10:00');
    expect(screen.getByText('Result').nextSibling).toHaveTextContent('10:30 · by SMS');
    expect(screen.getByText('Fee').nextSibling).toHaveTextContent('Free');
    expect(screen.getByText('Duplicate check (example)')).toBeInTheDocument();
    expect(screen.getByText(/Proposed rules/)).toBeInTheDocument();
  });

  it('blocks a duplicate, lets staff remove it, then submits with focus on each message', async () => {
    const user = userEvent.setup();
    render(<CTD02WalkInApply />);
    await user.click(screen.getByRole('button', { name: /Add traveller/ }));
    const warning = screen.getByRole('status');
    expect(warning).toHaveTextContent('Rahim Karim is already in application AP-0214-7K');
    expect(document.activeElement).toContainElement(warning);
    expect(screen.getByRole('button', { name: 'Submit and print receipt' })).toBeDisabled();
    await user.click(within(warning).getByRole('button', { name: 'Remove Rahim Karim from this application' }));
    expect(screen.getByRole('status')).toHaveTextContent('Rahim Karim removed from this application');
    expect(document.activeElement).toContainElement(screen.getByRole('status'));
    await user.click(screen.getByRole('button', { name: 'Submit and print receipt' }));
    const done = screen.getByRole('status');
    expect(done).toHaveTextContent('Application AP-0415-3M received');
    expect(done).toHaveTextContent('The result comes at 10:30 by SMS');
    expect(document.activeElement).toContainElement(done);
  });

  it('uses Bangla digits for the window and result', () => {
    inBangla(<CTD02WalkInApply />);
    expect(screen.getByText('০৮:০০–১০:০০')).toBeInTheDocument();
    expect(screen.getByText('১০:৩০ · SMS-এ')).toBeInTheDocument();
    expect(screen.getByText('বিনামূল্যে')).toBeInTheDocument();
  });
});

describe('CTD03 take payment', () => {
  it('shows ৳1,480 with no counter fee, takes cash, issues tickets and updates the shift', async () => {
    const user = userEvent.setup();
    render(<CTD03TakePayment />);
    const table = screen.getByRole('table');
    expect(within(table).getByRole('row', { name: 'Fare · 4 × ৳350 ৳1,400' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Service charge · 4 × ৳20 ৳80' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Counter fee None' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Official total ৳1,480' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Cash' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'bKash or Nagad (QR on customer display)' })).not.toBeChecked();
    expect(screen.getByText('Cash taken today').nextSibling).toHaveTextContent('৳18,240');
    await user.click(screen.getByRole('button', { name: 'Received ৳1,480 · issue tickets' }));
    const msg = screen.getByRole('status');
    expect(msg).toHaveTextContent('4 tickets issued · ৳1,480 received');
    expect(document.activeElement).toContainElement(msg);
    expect(screen.getByText('Cash taken today').nextSibling).toHaveTextContent('৳19,720');
    expect(screen.getByText('Receipts').nextSibling).toHaveTextContent('15');
    expect(screen.getByRole('radio', { name: 'Cash' })).toBeDisabled();
  });

  it('counts a bKash or Nagad payment apart from cash', async () => {
    const user = userEvent.setup();
    render(<CTD03TakePayment />);
    await user.click(screen.getByRole('radio', { name: /bKash or Nagad/ }));
    await user.click(screen.getByRole('button', { name: /Received/ }));
    expect(screen.getByText('Cash taken today').nextSibling).toHaveTextContent('৳18,240');
    expect(screen.getByText('bKash or Nagad today').nextSibling).toHaveTextContent('৳8,140');
  });

  it('uses Bangla digits', () => {
    inBangla(<CTD03TakePayment />);
    expect(screen.getByRole('button', { name: '৳১,৪৮০ পেয়েছি · টিকিট ইস্যু করুন' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'কাউন্টার ফি নেই' })).toBeInTheDocument();
  });
});

describe('CTD04 recover a ticket', () => {
  it('checks ID, reissues to the traveller’s own phone, removes the helper and records it', async () => {
    const user = userEvent.setup();
    render(<CTD04RecoverTicket />);
    expect(screen.getByText('Document seen').nextSibling).toHaveTextContent('NID card · NID record matched');
    expect(screen.getByRole('radio', { name: 'Reissue to the traveller’s own phone' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Reissue to the traveller’s own phone' })).toHaveAccessibleDescription('New QR sent to ••41. The old copy stops working.');
    expect(screen.getByRole('checkbox', { name: 'Remove the helper’s access' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Reissue and record' }));
    const msg = screen.getByRole('status');
    expect(msg).toHaveTextContent('Recorded · RC-0907');
    expect(msg).toHaveTextContent('Ticket reissued to ••41');
    expect(msg).toHaveTextContent('Helper access removed · AC-5521');
    expect(msg).toHaveTextContent('Staff 207 · 10:42 · NID card seen');
    expect(document.activeElement).toContainElement(msg);
  });

  it('prints paper and keeps the helper when chosen', async () => {
    const user = userEvent.setup();
    render(<CTD04RecoverTicket />);
    await user.click(screen.getByRole('radio', { name: 'Print a paper ticket' }));
    await user.click(screen.getByRole('checkbox', { name: 'Remove the helper’s access' }));
    await user.click(screen.getByRole('button', { name: 'Reissue and record' }));
    expect(screen.getByRole('status')).toHaveTextContent('Paper ticket printed (demo)');
    expect(screen.getByRole('status')).not.toHaveTextContent('Helper access removed');
  });
});

describe('Group of 7 · desktop journey', () => {
  it('G2·v2 lists both packages and lets the group choose what happens if Package B isn’t paid', async () => {
    const user = userEvent.setup();
    render(<G2v2Group />);
    expect(screen.getByRole('region', { name: 'Package A · paid by Abdul Karim' })).toHaveTextContent('Nadia Rahman');
    expect(screen.getByRole('region', { name: 'Package B · paid by Salma Karim' })).toHaveTextContent('Tania Akter');
    expect(screen.getByRole('radio', { name: 'All 7 travel, or none' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'Package A can still travel' }));
    await user.click(screen.getByRole('button', { name: 'Confirm group' }));
    expect(screen.getByRole('status')).toHaveTextContent('If Package B isn’t paid, Package A still travels.');
    expect(screen.getByRole('radio', { name: 'Package A can still travel' })).toBeDisabled();
    expect(screen.getByRole('link', { name: /choose where the group sits/ })).toHaveAttribute('href', '#/g3v2');
    expect(screen.getByRole('list', { name: 'Group booking steps' }).querySelector('[aria-current="step"]')).toHaveTextContent('Group');
  });

  it('G3·v2 shows GHA 1–7 for the group and holds them', async () => {
    const user = userEvent.setup();
    render(<G3v2GroupSeats />);
    expect(h1()).toHaveTextContent('Choose where the group sits');
    expect(screen.getByRole('radio', { name: 'Coach GHA · 7 together' })).toBeChecked();
    expect(screen.getByRole('img', { name: /Chosen for the group: 1–7/ })).toBeInTheDocument();
    expect(screen.getByText('Package A', { selector: 'dt' }).nextSibling).toHaveTextContent('GHA 1–4');
    expect(screen.getByText('Package B', { selector: 'dt' }).nextSibling).toHaveTextContent('GHA 5–7');
    expect(screen.getByRole('link', { name: 'Hold seats GHA 1–7' })).toHaveAttribute('href', '#/g5v2');
    await user.click(screen.getByRole('radio', { name: 'Middle · GHA 48–54' }));
    expect(screen.getByRole('link', { name: 'Hold seats GHA 48–54' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Coach DHA · split needed' }));
    expect(screen.queryByRole('link', { name: /Hold seats/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Customise seats' })).toHaveAttribute('href', '#/g3');
  });

  it('G5·v2 Package A paid ৳1,480, Package B ৳1,110 waiting with resend code', async () => {
    const user = userEvent.setup();
    render(<G5v2EachPackagePays />);
    const a = screen.getByRole('region', { name: 'Package A · you pay' });
    expect(within(a).getByRole('row', { name: 'Official total ৳1,480' })).toBeInTheDocument();
    expect(within(a).getByText('Status').nextSibling).toHaveTextContent('Paid 10:21 · bKash ••9024');
    const b = screen.getByRole('region', { name: 'Package B · Salma Karim pays' });
    expect(within(b).getByRole('row', { name: 'Official total ৳1,110' })).toBeInTheDocument();
    expect(within(b).getByText('Status').nextSibling).toHaveTextContent('Waiting · code sent 10:22');
    expect(screen.getByRole('button', { name: 'See tickets when both are paid' })).toBeDisabled();
    await user.click(within(b).getByRole('button', { name: 'Resend code to Salma Karim' }));
    expect(screen.getByRole('status')).toHaveTextContent('Code sent again to Salma Karim');
    expect(document.activeElement).toContainElement(screen.getByRole('status'));
    await user.click(within(b).getByRole('button', { name: /Demo: Salma Karim pays ৳1,110/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Both packages paid');
    expect(screen.getByRole('link', { name: 'See group tickets' })).toHaveAttribute('href', '#/g4v2');
  });

  it('G4·v2 shows 7 named tickets in English and both references', () => {
    inBangla(<G4v2GroupTickets />);
    const tickets = screen.getAllByRole('listitem').filter((li) => li.classList.contains('ticket'));
    expect(tickets).toHaveLength(7);
    expect(tickets.map((li) => li.querySelector('.ticket__name')?.textContent)).toEqual([
      'Abdul Karim',
      'Ayesha Karim (child)',
      'Rahim Karim',
      'Nadia Rahman',
      'Salma Karim',
      'Imran Hossain',
      'Tania Akter',
    ]);
    for (const li of tickets) expect(li.querySelector('.ticket__name')).toHaveAttribute('lang', 'en');
    expect(tickets[0]).toHaveTextContent('প্যাকেজ A · ঘ-১');
    expect(tickets[6]).toHaveTextContent('প্যাকেজ B · ঘ-৭');
    expect(screen.getAllByText('RF-7Q2K-48').length).toBeGreaterThan(0);
    expect(screen.getAllByText('RF-7Q2K-49').length).toBeGreaterThan(0);
  });

  it('has no axe violations on the new screens in Bangla', async () => {
    for (const ui of [<G3v2GroupSeats key="g3" />, <G5v2EachPackagePays key="g5" initialPhase="paid" />, <CTD04RecoverTicket key="c4" initialPhase="recorded" />]) {
      const { unmount } = inBangla(ui);
      expect(await axe(document)).toHaveNoViolations();
      unmount();
    }
  });
});

describe('Routes: counter CTD01 → CTD03 and the group journey G2·v2 → G4·v2', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('opens the counter from Home and chains CTD01 → CTD03 with focus on each h1', async () => {
    const user = userEvent.setup();
    window.location.hash = '';
    render(<App />);
    await user.click(within(screen.getByRole('region', { name: 'Staff' })).getByRole('link', { name: /Counter terminal · find or start/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Find a booking or start one' })).toHaveFocus();
    await user.type(screen.getByRole('textbox', { name: 'Reference, application or ID number' }), 'AP-0214-7K');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.click(within(screen.getByRole('region', { name: 'Result · AP-0214-7K' })).getByRole('link', { name: 'Take payment' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Take payment' })).toHaveFocus();
    expect(window.location.hash).toBe('#/ctd03');
    await user.click(within(screen.getByRole('navigation', { name: 'Counter terminal' })).getByRole('link', { name: 'Recover a ticket' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Recover a ticket' })).toHaveFocus();
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('chains the group journey G2·v2 → G3·v2 → G5·v2 → G4·v2', async () => {
    const user = userEvent.setup();
    window.location.hash = '';
    render(<App />);
    await user.click(within(screen.getByRole('region', { name: 'Passenger' })).getByRole('link', { name: /one group, one chance/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'One group, one chance' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Confirm group' }));
    await user.click(screen.getByRole('link', { name: /choose where the group sits/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Choose where the group sits' })).toHaveFocus();
    await user.click(screen.getByRole('link', { name: 'Hold seats GHA 1–7' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Each package pays its own share' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: /Demo: Salma Karim pays/ }));
    await user.click(screen.getByRole('link', { name: 'See group tickets' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Group tickets' })).toHaveFocus();
  });
});
