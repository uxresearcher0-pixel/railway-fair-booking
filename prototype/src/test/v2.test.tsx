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
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Passenger', 'Staff']);
    // the screen picker is still there for direct access; no Home link on Home itself
    expect(screen.getByRole('combobox', { name: 'Screen' })).toHaveValue('home');
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();

    const passenger = screen.getByRole('region', { name: 'Passenger' });
    expect(within(passenger).getAllByRole('link')).toHaveLength(8);
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
