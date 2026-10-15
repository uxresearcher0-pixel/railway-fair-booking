import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { LangProvider } from '../i18n/lang';
import { P21v2ApplyDraw } from '../screens/P21v2ApplyDraw';
import { P22v2Offer } from '../screens/P22v2Offer';
import { P10v2OfficialTotal } from '../screens/P10v2OfficialTotal';
import { R3v2ReportCharge, parseTaka } from '../screens/R3v2ReportCharge';
import { A1v2BookingAccess } from '../screens/A1v2BookingAccess';
import { ApplyFlowV2 } from '../screens/ApplyFlowV2';
import { G2v2Group } from '../screens/G2v2Group';
import { F05v2Roles } from '../screens/F05v2Roles';
import { H1v2HoldPaused } from '../screens/H1v2HoldPaused';
import { P24v2Waitlist, releaseFits } from '../screens/P24v2Waitlist';
import { P14v2Receipt } from '../screens/P14v2Receipt';
import { P25v2Recover } from '../screens/P25v2Recover';
import { CT04v2AgentReceipt } from '../screens/CT04v2AgentReceipt';
import { PA1v2DrawAudit, normaliseApplication } from '../screens/PA1v2DrawAudit';
import { DK03v2Correction } from '../screens/DK03v2Correction';
import { OP08v2DrawRun } from '../screens/OP08v2DrawRun';
import { OP09v2SeatReconciliation, seatsInStates } from '../screens/OP09v2SeatReconciliation';
import { OP10v2AgentReports } from '../screens/OP10v2AgentReports';
import { App } from '../App';

const inBangla = (ui: ReactNode) => render(<LangProvider initial="bn">{ui}</LangProvider>);
const h1 = () => screen.getByRole('heading', { level: 1 });

describe('P21·v2 apply for the draw', () => {
  it('says applying early gives no extra chance, with the window, result and pay-by times', () => {
    render(<P21v2ApplyDraw />);
    expect(screen.getByText('Applying at 08:00 or at 09:59 gives exactly the same chance.')).toBeInTheDocument();
    expect(screen.getByText('08:00–10:00 today')).toBeInTheDocument();
    expect(screen.getByText(/^10:30 today/)).toBeInTheDocument();
    expect(screen.getByText('11:00 today')).toBeInTheDocument();
    expect(screen.getByText(/One application per traveller, across the app, website, counters and registered agents/)).toBeInTheDocument();
  });

  it('applies and shows the receipt AP-0214-7K with the party locked', async () => {
    const user = userEvent.setup();
    render(<P21v2ApplyDraw />);
    await user.click(screen.getByRole('button', { name: 'Apply for 4 travellers' }));
    expect(h1()).toHaveTextContent('Application received');
    expect(screen.getByRole('status')).toHaveTextContent('Application AP-0214-7K received');
    expect(screen.getByText('Locked')).toBeInTheDocument();
    expect(screen.getByText(/Party:/)).toHaveClass('visually-hidden');
    expect(screen.getByText(/no one can be added or swapped after you apply/)).toBeInTheDocument();
  });

  it('warns about a duplicate and lets you remove that traveller before applying', async () => {
    const user = userEvent.setup();
    render(<P21v2ApplyDraw hasDuplicate />);
    await user.click(screen.getByRole('button', { name: 'Apply for 4 travellers' }));
    const warning = screen.getByRole('status');
    expect(warning).toHaveTextContent('Rahim Karim is already in application AP-0031 made at Kamalapur counter');
    // focus moves to the warning so keyboard users land on it
    expect(document.activeElement).toContainElement(warning);
    expect(screen.getByRole('button', { name: 'Apply for 4 travellers' })).toBeDisabled();

    await user.click(within(warning).getByRole('button', { name: 'Remove Rahim Karim from this application' }));
    expect(screen.queryByText('Rahim Karim')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Apply for 3 travellers' }));
    expect(h1()).toHaveTextContent('Application received');
  });
});

describe('P22·v2 picked · pay by 11:00', () => {
  it('shows the draw place, the absolute deadline and the official total', () => {
    render(<P22v2Offer timerPaused />);
    expect(h1()).toHaveTextContent('Picked · pay by 11:00');
    expect(screen.getByText('#0214')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Pay by 11:00 today' })).toBeInTheDocument();
    expect(screen.getByText('The time does not restart when you open this offer, change phone or retry a payment.')).toBeInTheDocument();
    const total = screen.getByRole('table');
    expect(within(total).getByRole('rowheader', { name: /Fare · 4 × ৳350/ })).toBeInTheDocument();
    expect(within(total).getByRole('rowheader', { name: /Service charge · 4 × ৳20/ })).toBeInTheDocument();
    expect(within(total).getByRole('row', { name: /Total ৳1,480/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pay ৳1,480' })).toBeInTheDocument();
  });

  it('expired: seats passed on in draw order, not charged', () => {
    render(<P22v2Offer initialPhase="expired" />);
    expect(h1()).toHaveTextContent('Offer expired');
    expect(screen.getByRole('alert')).toHaveTextContent('The seats passed to the next application in draw order. You have not been charged.');
    expect(screen.queryByRole('button', { name: /Pay/ })).not.toBeInTheDocument();
  });

  it('uses Bangla digits for the draw place, time and money', () => {
    inBangla(<P22v2Offer timerPaused />);
    expect(h1()).toHaveTextContent('নির্বাচিত · ১১:০০-এর মধ্যে পরিশোধ করুন');
    expect(screen.getByText('#০২১৪')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '৳১,৪৮০ পরিশোধ করুন' })).toBeInTheDocument();
    expect(screen.getByText('এই অফার খুললে, ফোন বদলালে বা আবার পরিশোধের চেষ্টা করলে সময় নতুন করে শুরু হয় না।')).toBeInTheDocument();
    // codes stay in Latin script
    expect(screen.getByText(/AP-0214-7K/)).toBeInTheDocument();
  });
});

describe('P10·v2 official total', () => {
  it('itemises fare, service charge and assistance fee to ৳1,520 and links to the report', async () => {
    const user = userEvent.setup();
    const onReport = vi.fn();
    render(<P10v2OfficialTotal onReport={onReport} />);
    const table = screen.getByRole('table');
    expect(within(table).getByRole('row', { name: /Fare · 4 × ৳350 ৳1,400/ })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: /Service charge .* ৳80/ })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: /Assistance fee · RA-118 Demo amount, rate to confirm ৳40/ })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Total ৳1,520' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pay ৳1,520' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Report an extra charge' }));
    expect(onReport).toHaveBeenCalledOnce();
  });
});

describe('R3·v2 report an extra charge', () => {
  afterEach(() => vi.useRealTimers());

  it('says the ticket stays valid and who sees the report', () => {
    render(<R3v2ReportCharge />);
    expect(screen.getByText('Your ticket stays valid. Reporting never cancels it.')).toBeInTheDocument();
    expect(screen.getByText(/Who sees this: only the independent review team/)).toBeInTheDocument();
    expect(screen.getByText('৳1,520')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Paid to (optional)' })).not.toBeRequired();
  });

  it('validates, then sends and shows the reference OC-2207', async () => {
    const user = userEvent.setup();
    render(<R3v2ReportCharge />);
    await user.click(screen.getByRole('button', { name: 'Send report' }));
    const amount = screen.getByRole('textbox', { name: 'Amount you paid in total (৳)' });
    expect(amount).toHaveAttribute('aria-invalid', 'true');
    expect(amount).toHaveAccessibleDescription(/Error: Enter the amount you paid, in taka\./);
    expect(document.activeElement).toBe(amount);
    expect(screen.getByText('Choose how you paid.')).toBeInTheDocument();

    await user.type(amount, '1820');
    expect(screen.getByText('That is ৳300 more than the official total.')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Paid to (optional)' }), 'Someone at the gate');
    await user.click(screen.getByRole('radio', { name: 'Cash' }));
    await user.click(screen.getByRole('button', { name: 'Send report' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Report sent' }, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getByText('Reference OC-2207')).toBeInTheDocument();
    expect(screen.getByText('৳1,820')).toBeInTheDocument();
    expect(screen.getByText('Your ticket stays valid. Reporting never cancels it.')).toBeInTheDocument();
  });

  it('accepts Bangla digits in the amount', () => {
    expect(parseTaka('১,৮২০')).toBe(1820);
    expect(parseTaka('৳1820')).toBe(1820);
    expect(parseTaka('abc')).toBeNaN();
  });
});

describe('A1·v2 who can act on my booking', () => {
  it('lists the traveller and the helper with their rights, and the own-phone SMS note', () => {
    render(<A1v2BookingAccess />);
    expect(screen.getByText(/Booking RF-7Q2K-48/)).toBeInTheDocument();
    expect(screen.getByText('Full access')).toBeInTheDocument();
    expect(screen.getByText('Karim Uddin')).toBeInTheDocument();
    expect(screen.getByText('View and pay')).toBeInTheDocument();
    expect(screen.getByText(/SMS about this booking goes to the traveller’s own phone/)).toBeInTheDocument();
  });

  it('removes the helper after a confirmation and shows record AC-5521', async () => {
    const user = userEvent.setup();
    render(<A1v2BookingAccess />);
    await user.click(screen.getByRole('button', { name: 'Remove Karim Uddin' }));
    const confirm = screen.getByRole('alert');
    expect(confirm).toHaveTextContent('Remove Karim Uddin as helper?');
    expect(document.activeElement).toContainElement(confirm);

    // Keep: nothing changes and focus returns to the remove button
    await user.click(within(confirm).getByRole('button', { name: 'Keep helper' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Remove Karim Uddin' }));

    await user.click(screen.getByRole('button', { name: 'Remove Karim Uddin' }));
    await user.click(screen.getByRole('button', { name: 'Remove helper' }));
    expect(screen.getByRole('status')).toHaveTextContent('Karim Uddin removed · record AC-5521');
    expect(screen.queryByText('View and pay')).not.toBeInTheDocument();
    expect(screen.getByText('Full access')).toBeInTheDocument();
  });

  it('shows Bangla names and digits', () => {
    inBangla(<A1v2BookingAccess />);
    expect(screen.getByText('করিম উদ্দিন')).toBeInTheDocument();
    expect(screen.getByText(/নিজের ••৬২ নম্বরের ফোনে/)).toBeInTheDocument();
  });
});

describe('v2 busy-train flow', () => {
  it('goes P21·v2 → P22·v2 → P10·v2 → R3·v2 and moves focus to each h1', async () => {
    const user = userEvent.setup();
    render(<ApplyFlowV2 timerPaused />);
    await user.click(screen.getByRole('button', { name: 'Apply for 4 travellers' }));
    await user.click(screen.getByRole('button', { name: 'See the result at 10:30 (demo)' }));
    expect(h1()).toHaveTextContent('Picked · pay by 11:00');
    expect(document.activeElement).toBe(h1());
    await user.click(screen.getByRole('button', { name: 'Pay ৳1,480' }));
    expect(h1()).toHaveTextContent('Official total');
    expect(document.activeElement).toBe(h1());
    await user.click(screen.getByRole('button', { name: 'Report an extra charge' }));
    expect(h1()).toHaveTextContent('Report an extra charge');
    expect(document.activeElement).toBe(h1());
  });
});

describe('Home · journeys by role', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('opens on Home with one h1 and an h2 per role, and the links navigate', async () => {
    const user = userEvent.setup();
    window.location.hash = '';
    render(<App />);
    expect(h1()).toHaveTextContent('railfair prototype');
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Passenger', 'Staff', 'Operations', 'Public']);
    // the screen picker is still there for direct access; no Home link on Home itself
    expect(screen.getByRole('combobox', { name: 'Screen' })).toHaveValue('home');
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();

    const passenger = screen.getByRole('region', { name: 'Passenger' });
    expect(within(passenger).getAllByRole('link')).toHaveLength(16);
    const report = within(passenger).getByRole('link', { name: /Report an extra charge \(v2\)/ });
    expect(report).toHaveAttribute('href', '#/r3v2');
    expect(report).toHaveAccessibleName(/Tell the independent review team privately/);

    await user.click(report);
    expect(await screen.findByRole('heading', { level: 1, name: 'Report an extra charge' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#/r3v2');
    expect(document.activeElement).toBe(h1());

    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'railfair prototype' })).toBeInTheDocument();

    await user.click(within(screen.getByRole('region', { name: 'Staff' })).getByRole('link', { name: /Check a ticket/ }));
    expect(await screen.findByRole('heading', { level: 1, name: /Check a ticket/ })).toBeInTheDocument();
  });

  it('links every journey to a real route', () => {
    window.location.hash = '';
    render(<App />);
    const options = within(screen.getByRole('combobox', { name: 'Screen' }))
      .getAllByRole('option')
      .map((o) => (o as HTMLOptionElement).value);
    for (const link of screen.getAllByRole('link').filter((a) => a.getAttribute('href')?.startsWith('#/'))) {
      expect(options).toContain(link.getAttribute('href')!.slice(2));
    }
  });

  it('switches Home to Bangla', async () => {
    const user = userEvent.setup();
    window.location.hash = '';
    render(<App />);
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'বাংলা' }));
    });
    expect(h1()).toHaveTextContent('railfair প্রোটোটাইপ');
    expect(screen.getByRole('link', { name: /দিনে ২টি বুকিংয়ের পর/ })).toBeInTheDocument();
  });
});

describe('G2·v2 one group, one chance', () => {
  it('shows one application for 7 with both packages and the all-or-none choice', () => {
    render(<G2v2Group />);
    expect(h1()).toHaveTextContent('Your group');
    expect(screen.getByRole('heading', { level: 2, name: 'Party · locked at 10:00' })).toBeInTheDocument();
    expect(screen.getByText('4 travellers · paid by Abdul Karim')).toBeInTheDocument();
    expect(screen.getByText('3 travellers · paid by Salma Karim')).toBeInTheDocument();
    expect(screen.getByText('One place for all 7')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'If Package B isn’t paid' })).toBeInTheDocument();
    expect(screen.getByText('All 7 travel, or none')).toBeInTheDocument();
    expect(screen.getByText('Chosen before the draw')).toBeInTheDocument();
    expect(screen.getByText(/A new traveller needs their own application/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change who travels (before 10:00)' })).toHaveAttribute('href', '#/f03');
  });

  it('confirms the group and moves focus to the message', async () => {
    const user = userEvent.setup();
    render(<G2v2Group />);
    await user.click(screen.getByRole('button', { name: 'Confirm group' }));
    const msg = screen.getByRole('status');
    expect(msg).toHaveTextContent('Group confirmed · one application for all 7');
    expect(document.activeElement).toContainElement(msg);
    expect(screen.queryByRole('button', { name: 'Confirm group' })).not.toBeInTheDocument();
  });

  it('uses Bangla names and digits', () => {
    inBangla(<G2v2Group />);
    expect(screen.getByText('৪ জন যাত্রী · পরিশোধ করবেন আব্দুল করিম')).toBeInTheDocument();
    expect(screen.getByText('৭ জনই যাবেন, নয়তো কেউ নয়')).toBeInTheDocument();
  });
});

describe('F05·v2 who does what', () => {
  it('lists the roles and what the helper can and cannot do', () => {
    render(<F05v2Roles />);
    expect(screen.getByText('Ayesha Karim · child, 8')).toBeInTheDocument();
    expect(screen.getByText('Accompanying adult').nextSibling).toHaveTextContent('Abdul Karim');
    expect(screen.getByText('Booked by (helper)').nextSibling).toHaveTextContent('Karim Uddin');
    expect(screen.getByText('Paid by').nextSibling).toHaveTextContent('Karim Uddin · bKash ••9024');
    const rights = screen.getByRole('table', { name: 'What Karim Uddin can do on this booking' });
    expect(within(rights).getByRole('row', { name: /Book and pay Helper: Yes/ })).toBeInTheDocument();
    expect(within(rights).getByRole('row', { name: /See the ticket Helper: Yes/ })).toBeInTheDocument();
    expect(within(rights).getByRole('row', { name: /Cancel or change Helper: No — traveller or accompanying adult only/ })).toBeInTheDocument();
    expect(within(rights).getByRole('row', { name: 'Refund goes to The account that paid' })).toBeInTheDocument();
  });

  it('shows Bangla names, বিকাশ and Bangla digits', () => {
    inBangla(<F05v2Roles />);
    expect(screen.getByText('আয়েশা করিম · শিশু, ৮')).toBeInTheDocument();
    expect(screen.getByText('করিম উদ্দিন · বিকাশ ••৯০২৪')).toBeInTheDocument();
  });
});

describe('H1·v2 hold paused', () => {
  it('labels the rule as proposed and says when holds are possible again', () => {
    render(<H1v2HoldPaused />);
    expect(h1()).toHaveTextContent('Hold paused');
    expect(screen.getByText('Proposed rule')).toBeInTheDocument();
    expect(screen.getByText('You can hold seats again at 10:40')).toBeInTheDocument();
    expect(screen.getByText(/3 holds on this train ended without payment today\. .*pause for 30 minutes \(rule to confirm\)\./)).toBeInTheDocument();
    expect(screen.getByText('The waiting list is not affected.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Join the waiting list' })).toHaveAttribute('href', '#/p24v2');
  });
});

describe('P24·v2 waiting list · place kept', () => {
  it('shows place #3 and which releases fit, keeping your place when 3 seats arrive for 4', () => {
    render(<P24v2Waitlist />);
    expect(screen.getByRole('heading', { level: 2, name: 'Your place: #3' })).toBeInTheDocument();
    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual([
      '09:40 · 2 seatsOffered to #1 · fits',
      '10:05 · 1 seatOffered to #2 · fits',
      '10:20 · 3 seatsOffered to #4 · you need 4, place kept',
    ]);
    expect(releaseFits(3, 4)).toBe(false);
    expect(releaseFits(4, 4)).toBe(true);
  });

  it('asks before leaving, returns focus on keep, and confirms after leaving', async () => {
    const user = userEvent.setup();
    render(<P24v2Waitlist />);
    await user.click(screen.getByRole('button', { name: 'Leave the waiting list' }));
    const confirm = screen.getByRole('alert');
    expect(confirm).toHaveTextContent('Leave the waiting list?');
    expect(document.activeElement).toContainElement(confirm);
    await user.click(within(confirm).getByRole('button', { name: 'Keep place #3' }));
    await vi.waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Leave the waiting list' })));
    await user.click(screen.getByRole('button', { name: 'Leave the waiting list' }));
    await user.click(screen.getByRole('button', { name: 'Leave the list' }));
    expect(screen.getByRole('status')).toHaveTextContent('You left the waiting list');
    expect(document.activeElement).toContainElement(screen.getByRole('status'));
  });

  it('uses Bangla digits', () => {
    inBangla(<P24v2Waitlist />);
    expect(screen.getByRole('heading', { level: 2, name: 'আপনার স্থান: #৩' })).toBeInTheDocument();
    expect(screen.getByText('১০:২০ · ৩টি আসন')).toBeInTheDocument();
  });
});

describe('P14·v2 your receipt', () => {
  it('itemises ৳1,400 + ৳80 + ৳40 = ৳1,520 and shows the demo SMS', () => {
    render(<P14v2Receipt />);
    expect(screen.getByRole('heading', { level: 2, name: 'Receipt · RF-7Q2K-48' })).toBeInTheDocument();
    const table = screen.getByRole('table');
    expect(within(table).getByRole('row', { name: /Fare 4 × ৳350 ৳1,400/ })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: /Service charge .* ৳80/ })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: /Assistance fee · RA-118 .* ৳40/ })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Official total ৳1,520' })).toBeInTheDocument();
    expect(screen.getByText('Karim Uddin · bKash ••9024')).toBeInTheDocument();
    expect(screen.getByText(/^railfair: RF-7Q2K-48 confirmed\. Official total ৳1,520 \(fare 1,400 · service 80 · assistance 40\)\..*Demo message\.$/)).toBeInTheDocument();
    expect(screen.getByText(/Sent to the 3 adult travellers’ own phones/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Report an extra charge' })).toHaveAttribute('href', '#/r3v2');
  });

  it('uses Bangla digits, the Bangla name and বিকাশ', () => {
    inBangla(<P14v2Receipt />);
    expect(screen.getByRole('row', { name: 'অফিসিয়াল মোট ৳১,৫২০' })).toBeInTheDocument();
    expect(screen.getByText('করিম উদ্দিন · বিকাশ ••৯০২৪')).toBeInTheDocument();
    expect(screen.getByText(/অফিসিয়াল মোট ৳১,৫২০ \(ভাড়া ১,৪০০ · সার্ভিস ৮০ · সহায়তা ৪০\)/)).toBeInTheDocument();
  });
});

describe('P25·v2 recover a ticket', () => {
  it('says who can recover, what to bring, and that the helper’s phone is not needed', () => {
    render(<P25v2Recover />);
    expect(screen.getByText('The traveller · accompanying adult for a child')).toBeInTheDocument();
    expect(screen.getByText('NID, passport or birth registration')).toBeInTheDocument();
    expect(screen.getByText('Helper’s phone').nextSibling).toHaveTextContent('Not needed');
    expect(screen.getByText('The traveller’s own phone ••41')).toBeInTheDocument();
  });

  it('sends a code to the traveller’s own phone and moves focus to the message', async () => {
    const user = userEvent.setup();
    render(<P25v2Recover />);
    await user.click(screen.getByRole('button', { name: 'Send code to my phone' }));
    const msg = await screen.findByText('Code sent to the traveller’s own phone ••41', {}, { timeout: 2000 });
    expect(document.activeElement).toContainElement(msg);
    expect(screen.getByText(/The helper doesn’t get this code\./)).toBeInTheDocument();
  });
});

describe('CT04·v2 agent receipt', () => {
  it('shows the free application, the itemised fee and the same draw', async () => {
    const user = userEvent.setup();
    render(<CT04v2AgentReceipt />);
    expect(screen.getByText(/registered agent RA-118 · Mirpur/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Application AP-0388-2C' })).toBeInTheDocument();
    expect(screen.getByText('701 · Fri 17 Oct · S_CHAIR')).toBeInTheDocument();
    expect(screen.getByText('2 · NID records matched')).toBeInTheDocument();
    expect(screen.getByText('Same draw as the app · 10:00')).toBeInTheDocument();
    const table = screen.getByRole('table');
    expect(within(table).getByRole('row', { name: 'Application Free' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Assistance fee Demo, rate to confirm ৳20' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: /Fare if picked 2 × ৳350 \+ 2 × ৳20, paid only if picked/ })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Paid today ৳20' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Print receipt' }));
    expect(screen.getByRole('status')).toHaveTextContent('Receipt for AP-0388-2C sent to the printer (demo)');
    expect(document.activeElement).toContainElement(screen.getByRole('status'));
  });

  it('writes the class name and digits in Bangla, codes in Latin', () => {
    inBangla(<CT04v2AgentReceipt />);
    expect(screen.getByText('৭০১ · শুক্র ১৭ অক্টো · শোভন চেয়ার')).toBeInTheDocument();
    expect(screen.getByText('২ · এনআইডি রেকর্ড মিলেছে')).toBeInTheDocument();
  });
});

describe('PA1·v2 public draw audit', () => {
  it('shows frozen inputs, result and replay, with no personal data', () => {
    render(<PA1v2DrawAudit />);
    expect(screen.getByText('Applications frozen').nextSibling).toHaveTextContent('1,862');
    expect(screen.getByText('212 · S_CHAIR · 701')).toBeInTheDocument();
    expect(screen.getByText('9f3a…c71e')).toHaveAttribute('lang', 'en');
    expect(screen.getByText('Public beacon · 10:05')).toBeInTheDocument();
    expect(screen.getByText('53 applications · 212 seats')).toBeInTheDocument();
    expect(screen.getByText('1,809 in draw order')).toBeInTheDocument();
    expect(screen.getByText('Matches · 10:31')).toBeInTheDocument();
    expect(screen.getByText(/No names, NID or phone numbers are shown/)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Karim|••/);
  });

  it('checks an application number, with an error for an empty field', async () => {
    const user = userEvent.setup();
    render(<PA1v2DrawAudit />);
    const input = screen.getByRole('textbox', { name: 'Application number' });
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/Error: Enter your application number\./);
    expect(document.activeElement).toBe(input);

    await user.type(input, ' ap-0388-2c ');
    await user.click(screen.getByRole('button', { name: 'Check' }));
    const found = screen.getByRole('status');
    expect(found).toHaveTextContent('AP-0388-2C · Picked');
    expect(found).toHaveTextContent('Place #12 in draw order (demo).');
    expect(document.activeElement).toContainElement(found);

    await user.clear(input);
    await user.type(input, 'AP-9999-0Z');
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('status')).toHaveTextContent('AP-9999-0Z isn’t in this draw');
  });

  it('accepts Bangla digits in the application number', () => {
    expect(normaliseApplication(' ap-০৩৮৮-২c ')).toBe('AP-0388-2C');
  });
});

describe('DK03·v2 correction — same person only', () => {
  it('compares the ticket with the NID record and blocks self-approval', () => {
    render(<DK03v2Correction />);
    expect(screen.getByText(/Case/)).toHaveTextContent('Case CV-206 · Decision: system or data error');
    expect(screen.getByRole('row', { name: 'Date of birth 05/07/1993 05/07/1992' })).toBeInTheDocument();
    expect(screen.getByText('Yes — NID record matched, photo ID seen')).toBeInTheDocument();
    expect(screen.getByText('A different person can’t take this seat')).toBeInTheDocument();
    expect(screen.getByText('Second approver needed')).toBeInTheDocument();
    expect(screen.getByText('Self-approval').nextSibling).toHaveTextContent('Self-approval: Blocked');
    expect(screen.getByText('Reviewer RV-07 (different person)')).toBeInTheDocument();
  });

  it('sends for second approval with focus on the message', async () => {
    const user = userEvent.setup();
    render(<DK03v2Correction />);
    await user.click(screen.getByRole('button', { name: 'Send for second approval' }));
    const msg = screen.getByRole('status');
    expect(msg).toHaveTextContent('Sent to Reviewer RV-07 for second approval');
    expect(msg).toHaveTextContent('You can’t approve your own case.');
    expect(document.activeElement).toContainElement(msg);
    expect(screen.queryByRole('button', { name: 'This is a different person' })).not.toBeInTheDocument();
  });

  it('a different person: cancel under the normal rules, no seat for a fine', async () => {
    const user = userEvent.setup();
    render(<DK03v2Correction />);
    await user.click(screen.getByRole('button', { name: 'This is a different person' }));
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Not a correction: cancel under the normal rules');
    expect(alert).toHaveTextContent('Paying a fine never creates a seat.');
    expect(document.activeElement).toContainElement(alert);
    await user.click(within(alert).getByRole('button', { name: 'Back to the correction' }));
    expect(screen.getByRole('button', { name: 'Send for second approval' })).toBeInTheDocument();
  });

  it('uses Bangla digits for the dates', () => {
    inBangla(<DK03v2Correction />);
    expect(screen.getByRole('row', { name: 'জন্মতারিখ ০৫/০৭/১৯৯৩ ০৫/০৭/১৯৯২' })).toBeInTheDocument();
  });
});

describe('OP08·v2 draw run and replay', () => {
  it('shows frozen inputs, the run and the replay, and offers no rerun', async () => {
    const user = userEvent.setup();
    render(<OP08v2DrawRun />);
    expect(screen.getByText('1,862 · 41 duplicates merged')).toBeInTheDocument();
    expect(screen.getByText('Independent log · 10:00:04')).toBeInTheDocument();
    expect(screen.getByText('Public beacon · pulse 10:05')).toBeInTheDocument();
    expect(screen.getByText('53 picked · 1,809 waiting')).toBeInTheDocument();
    expect(screen.getByText('Reruns are not allowed')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /rerun|run again/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Publish audit page' }));
    const msg = screen.getByRole('status');
    expect(msg).toHaveTextContent('Audit page for DRAW-17OCT-EVE published');
    expect(within(msg).getByRole('link', { name: 'Open the public audit page' })).toHaveAttribute('href', '#/pa1v2');
    expect(document.activeElement).toContainElement(msg);
  });
});

describe('OP09·v2 every seat accounted for', () => {
  it('adds the seat states up to the coach plan and flags GHA-31', async () => {
    const user = userEvent.setup();
    expect(seatsInStates()).toBe(240);
    render(<OP09v2SeatReconciliation />);
    const table = screen.getByRole('table');
    expect(within(table).getByRole('row', { name: 'Coach plan 240' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Sold 198' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'Unexplained Needs a record 1' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'In all states Matches the coach plan 240' })).toBeInTheDocument();
    expect(screen.getByText('1 seat to explain')).toBeInTheDocument();
    expect(screen.getByText('GHA-31')).toBeInTheDocument();
    expect(screen.getByText('Blocked 09:58 · no approval record · by account OPS-11')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open case for GHA-31' }));
    expect(screen.getByRole('status')).toHaveTextContent('Case opened for seat GHA-31');
    expect(document.activeElement).toContainElement(screen.getByRole('status'));
  });

  it('writes the coach letter in Bangla', () => {
    inBangla(<OP09v2SeatReconciliation />);
    expect(screen.getByText('ঘ-৩১')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ঘ-৩১-এর জন্য কেস খুলুন' })).toBeInTheDocument();
  });
});

describe('OP10·v2 agents and extra-charge reports', () => {
  it('lists agents with status and report OC-2207 with no automatic penalty', async () => {
    const user = userEvent.setup();
    render(<OP10v2AgentReports />);
    const table = screen.getByRole('table');
    expect(within(table).getByRole('row', { name: 'RA-118 Mirpur 412 0 Normal' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'RA-204 Tejgaon 390 6 Under review' })).toBeInTheDocument();
    expect(within(table).getByRole('row', { name: 'RA-311 Gazipur 88 1 Normal' })).toBeInTheDocument();
    expect(screen.getByText('Official total').nextSibling).toHaveTextContent('৳1,520');
    expect(screen.getByText('Passenger paid').nextSibling).toHaveTextContent('৳2,500 (৳980 more)');
    expect(screen.getByText('Ticket').nextSibling).toHaveTextContent('Stays valid');
    expect(screen.getByText('No automatic penalty')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ask passenger for more detail' }));
    expect(screen.getByRole('status')).toHaveTextContent('One SMS sent to the passenger');
    expect(screen.getByRole('status')).toHaveTextContent('Replying is optional.');
  });
});

describe('v2 second-pass routes', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('opens each ops and desk screen by hash with one h1 and focus on it', async () => {
    const user = userEvent.setup();
    window.location.hash = '';
    render(<App />);
    const ops = screen.getByRole('region', { name: 'Operations' });
    expect(within(ops).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['#/op08v2', '#/op09v2', '#/op10v2']);
    await user.click(within(ops).getByRole('link', { name: /Every seat accounted for/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Every seat accounted for' })).toBeInTheDocument();
    expect(document.activeElement).toBe(h1());
    await user.click(screen.getByRole('link', { name: 'Home' }));
    await user.click(within(await screen.findByRole('region', { name: 'Staff' })).getByRole('link', { name: /Desk correction/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Correction — same person only' })).toBeInTheDocument();
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });
});
