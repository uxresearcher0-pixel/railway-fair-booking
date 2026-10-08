import { describe, expect, it, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { SeatMap, makeCoach } from '../components/SeatMap';
import { Stepper } from '../components/Stepper';
import { HoldTimer } from '../components/HoldTimer';
import { F03Travellers } from '../screens/F03Travellers';
import { G2aInvite } from '../screens/G2aInvite';
import { F04aAddTraveller } from '../screens/F04aAddTraveller';

function SeatHarness() {
  const [sel, setSel] = useState<string[]>([]);
  return (
    <>
      <button type="button">before</button>
      <SeatMap coach="C2" seats={makeCoach(3, ['1B'], ['3E'])} selected={sel} onChange={setSel} maxSelectable={2} />
      <button type="button">after</button>
    </>
  );
}

const seat = (id: string) => document.querySelector<HTMLButtonElement>(`[data-seat="${id}"]`)!;

describe('SeatMap keyboard (roving tabindex grid)', () => {
  it('has a single tab stop and arrow keys move focus between seats', async () => {
    const user = userEvent.setup();
    render(<SeatHarness />);
    const grid = screen.getByRole('grid');
    expect(within(grid).getAllByRole('row')).toHaveLength(4); // header + 3 rows
    expect(grid.querySelectorAll('button[tabindex="0"]')).toHaveLength(1);

    await user.click(screen.getByText('before'));
    await user.tab();
    expect(document.activeElement).toBe(seat('1A'));

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(seat('1B'));
    expect(seat('1B')).toHaveAttribute('tabindex', '0');
    expect(seat('1A')).toHaveAttribute('tabindex', '-1');

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(seat('2B'));
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(seat('2E'));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(seat('2A'));
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowLeft}'); // clamps at edges
    expect(document.activeElement).toBe(seat('1A'));
    await user.keyboard('{Control>}{End}{/Control}');
    expect(document.activeElement).toBe(seat('3E'));

    // Tab leaves the grid in one step
    await user.tab();
    expect(document.activeElement).toBe(screen.getByText('after'));
  });

  it('Space/Enter toggle aria-pressed; taken seats are aria-disabled and cannot be chosen', async () => {
    const user = userEvent.setup();
    render(<SeatHarness />);
    await user.click(screen.getByText('before'));
    await user.tab();
    await user.keyboard(' ');
    expect(seat('1A')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('seat-live')).toHaveTextContent('Seat 1A chosen. 1 of 2 chosen.');

    await user.keyboard('{ArrowRight}{Enter}');
    expect(seat('1B')).toHaveAttribute('aria-disabled', 'true');
    expect(seat('1B')).not.toHaveAttribute('aria-pressed');
    expect(seat('1B')).toHaveAccessibleName('Seat 1B, aisle, taken');
    expect(screen.getByTestId('seat-live')).toHaveTextContent('Seat 1B is not available.');

    await user.keyboard('{ArrowDown} {ArrowRight} '); // 2B, 2C → max reached on 2C
    expect(seat('2B')).toHaveAttribute('aria-pressed', 'true');
    expect(seat('2C')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('seat-live')).toHaveTextContent('already chosen 2 seats');

    await user.keyboard('{ArrowLeft} '); // un-choose 2B
    expect(seat('2B')).toHaveAttribute('aria-pressed', 'false');
  });
});

function StepperHarness({ max = 4, block = false }: { max?: number; block?: boolean }) {
  const [v, setV] = useState(1);
  const [blocked, setBlocked] = useState(false);
  return (
    <>
      <Stepper
        label="Adults"
        unit={['adult', 'adults']}
        value={v}
        min={1}
        max={max}
        onChange={setV}
        canIncrement={block ? () => v < 2 : undefined}
        onBlockedIncrement={() => setBlocked(true)}
      />
      {blocked ? <p>blocked</p> : null}
    </>
  );
}

describe('Stepper', () => {
  it('has labelled +/- buttons operable by keyboard and announces the value', async () => {
    const user = userEvent.setup();
    render(<StepperHarness />);
    expect(screen.getByRole('group', { name: 'Adults' })).toBeInTheDocument();
    const add = screen.getByRole('button', { name: 'Add one adult' });
    const remove = screen.getByRole('button', { name: 'Remove one adult' });
    expect(remove).toHaveAttribute('aria-disabled', 'true');

    await user.tab(); // remove (aria-disabled stays focusable)
    expect(document.activeElement).toBe(remove);
    await user.tab();
    expect(document.activeElement).toBe(add);
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    const live = screen.getByTestId('stepper-live');
    expect(live).toHaveAttribute('aria-live', 'polite');
    expect(live).toHaveTextContent('3 adults');
    await user.keyboard('{Enter}{Enter}'); // capped at 4
    expect(live).toHaveTextContent('4 adults');
    expect(add).toHaveAttribute('aria-disabled', 'true');
    expect(document.activeElement).toBe(add); // focus not lost at the bound

    await user.click(remove);
    expect(live).toHaveTextContent('3 adults');
  });

  it('calls onBlockedIncrement instead of changing when the allowance blocks it', async () => {
    const user = userEvent.setup();
    render(<StepperHarness block />);
    const add = screen.getByRole('button', { name: 'Add one adult' });
    await user.click(add);
    await user.click(add);
    expect(screen.getByTestId('stepper-live')).toHaveTextContent('2 adults');
    expect(screen.getByText('blocked')).toBeInTheDocument();
  });
});

describe('HoldTimer', () => {
  it('announces politely only at minute marks, not every second', () => {
    vi.useFakeTimers();
    try {
      render(<HoldTimer initialSeconds={125} subject="Package B seats" />);
      const live = screen.getByTestId('hold-live');
      expect(live).toHaveAttribute('aria-live', 'polite');
      expect(live).toHaveTextContent('');
      for (let i = 0; i < 4; i++) act(() => vi.advanceTimersByTime(1000));
      expect(live).toHaveTextContent(''); // 121 s: still silent
      act(() => vi.advanceTimersByTime(1000)); // 120 s
      expect(live).toHaveTextContent('2 minutes left on the hold.');
      act(() => vi.advanceTimersByTime(1000)); // 119 s
      expect(live).toHaveTextContent('2 minutes left on the hold.'); // unchanged, no per-second speech
      for (let i = 0; i < 59; i++) act(() => vi.advanceTimersByTime(1000));
      expect(live).toHaveTextContent('1 minute left on the hold.');
      for (let i = 0; i < 60; i++) act(() => vi.advanceTimersByTime(1000));
      expect(live).toHaveTextContent('Hold expired. Package B seats have been released.');
      expect(screen.getByRole('timer')).toHaveTextContent('00:00');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('Screen behaviour', () => {
  it('F03: trying to exceed 4 shows linked-group guidance', async () => {
    const user = userEvent.setup();
    render(<F03Travellers initialAdults={2} initialChildren={2} />);
    expect(screen.queryByText(/linked group booking/i, { selector: '.notice *' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add one adult' }));
    expect(screen.getByText(/You can buy up to 4 tickets today/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start a linked group booking' })).toBeInTheDocument();
    expect(screen.getAllByTestId('stepper-live')[0]).toHaveTextContent('2 adults');
  });

  it('G2a: only Package B travellers are offered; the child is disabled with a reason', () => {
    render(<G2aInvite />);
    const radios = screen.getAllByRole('radio');
    expect(radios.map((r) => (r.closest('label') as HTMLElement).querySelector('.radio-card__title')!.textContent)).toEqual([
      'Salma Karim',
      'Rahim Karim',
      'Ayesha Karim',
    ]);
    const child = screen.getByRole('radio', { name: /Ayesha Karim/ });
    expect(child).toBeDisabled();
    expect(child).toHaveAccessibleDescription(/buyers must be adults/);
    expect(screen.queryByText(/Abdul Karim's NID-linked/)).not.toBeInTheDocument();
  });

  it('F04a: invalid NID shows a linked error and an error summary', async () => {
    const user = userEvent.setup();
    render(<F04aAddTraveller />);
    await user.type(screen.getByLabelText('NID number'), '12345');
    await user.click(screen.getByRole('button', { name: 'Check NID record' }));
    const nid = screen.getByLabelText('NID number');
    expect(nid).toHaveAttribute('aria-invalid', 'true');
    expect(nid).toHaveAccessibleDescription(/must be 10 or 17 digits\. You entered 5/);
    expect(screen.getByRole('alert')).toHaveTextContent('Fix 3 problems');
  });

  it('F04a: valid entry masks the NID and reports "NID record matched"', async () => {
    const user = userEvent.setup();
    render(<F04aAddTraveller />);
    await user.type(screen.getByLabelText('Full name as on NID'), 'Abdul Karim');
    await user.type(screen.getByLabelText('Date of birth as on NID'), '1984-03-12');
    await user.type(screen.getByLabelText('NID number'), '0000004821');
    await user.tab(); // blur masks
    expect(screen.queryByLabelText('NID number')).not.toBeInTheDocument();
    expect(screen.getByText('••••••4821')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Check NID record' }));
    expect(await screen.findByText('NID record matched', {}, { timeout: 2000 })).toBeInTheDocument();
  });
});
