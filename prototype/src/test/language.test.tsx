import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { LangProvider, toBnDigits } from '../i18n/lang';
import { G2bJoin } from '../screens/G2bJoin';
import { G3aChooseCoach } from '../screens/G3aChooseCoach';
import { G3bWhereInCoach, blocksFor } from '../screens/G3bWhereInCoach';
import { F01bStationTo } from '../screens/F01bStationTo';
import { S02StaffCheck } from '../screens/S02StaffCheck';
import { AppFlow } from '../screens/AppFlow';
import { coaches, longestRun } from '../data/demo';

const inBangla = (ui: ReactNode) => render(<LangProvider initial="bn">{ui}</LangProvider>);

describe('language switch', () => {
  it('switches the screen to Bangla and back, with lang and aria-pressed', async () => {
    const user = userEvent.setup();
    render(
      <LangProvider>
        <G2bJoin />
      </LangProvider>,
    );
    const group = screen.getByRole('group', { name: 'Language' });
    const en = within(group).getByRole('button', { name: 'EN' });
    const bn = within(group).getByRole('button', { name: 'বাংলা' });
    expect(en).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Join Package B');

    await user.click(bn);
    expect(bn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('প্যাকেজ B-তে যোগ দিন');
    expect(document.querySelector('.screen')).toHaveAttribute('lang', 'bn');
    // Bangla names and digits on passenger screens; codes stay Latin
    expect(screen.getByText(/আব্দুল করিম আপনাকে প্যাকেজ B \(৩টি আসন\)/)).toBeInTheDocument();
    expect(screen.getByText('K7Q-48')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Join Package B');
    expect(document.querySelector('.screen')).toHaveAttribute('lang', 'en');
  });

  it('keeps the English name on the staff check in Bangla mode (decision #31)', () => {
    inBangla(<S02StaffCheck />);
    const name = screen.getByText('Salma Karim');
    expect(name).toHaveAttribute('lang', 'en');
    expect(screen.queryByText(/সালমা/)).not.toBeInTheDocument();
  });

  it('converts digits for values only', () => {
    expect(toBnDigits('৳1,110 · 07:30')).toBe('৳১,১১০ · ০৭:৩০');
  });
});

describe('G3a · choose a coach', () => {
  it('lists coaches with 7 together first and shows all on request', async () => {
    const user = userEvent.setup();
    render(<G3aChooseCoach timerPaused />);
    const titles = () => screen.getAllByRole('radio').map((r) => (r.closest('label') as HTMLElement).querySelector('.radio-card__title')!.textContent);
    expect(titles()[0]).toBe('Coach GHA · 30 free');
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    const more = screen.getByRole('button', { name: 'Show all 6 coaches' });
    expect(more).toHaveAttribute('aria-expanded', 'false');
    await user.click(more);
    expect(screen.getAllByRole('radio')).toHaveLength(6);
    expect(screen.getByRole('button', { name: 'Show fewer coaches' })).toHaveAttribute('aria-expanded', 'true');
    // a full coach can't be chosen and says why
    const full = screen.getByRole('radio', { name: /Coach KA · full/ });
    expect(full).toBeDisabled();
    expect(full).toHaveAccessibleDescription('No free seats in this class');
  });

  it('asks for a coach before continuing', async () => {
    const user = userEvent.setup();
    render(<G3aChooseCoach timerPaused />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Choose a coach.')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getAllByRole('radio')[0]);
  });
});

describe('G3b · where in the coach (seats 1–9, 15–19, 48–54, 92–100 free)', () => {
  it('finds the front, middle and back blocks of 7', () => {
    const gha = coaches.find((c) => c.code === 'GHA')!;
    expect(longestRun(gha.free)).toBe(9);
    expect(blocksFor(gha)).toEqual({ front: 1, middle: 48, back: 94 });
  });

  it('updates the hold button and the package split when the block changes', async () => {
    const user = userEvent.setup();
    render(<G3bWhereInCoach timerPaused />);
    expect(screen.getByRole('button', { name: 'Hold seats GHA 1–7' })).toBeInTheDocument();
    expect(screen.getByText('Seats GHA 5–7, next to Package A')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /Middle of the coach/ }));
    expect(screen.getByRole('button', { name: 'Hold seats GHA 48–54' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /Back of the coach/ }));
    expect(screen.getByRole('button', { name: 'Hold seats GHA 94–100' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /Customise seats/ }));
    expect(screen.getByRole('button', { name: 'Open the seat map' })).toBeInTheDocument();
  });

  it('shows Bangla coach letters and digits', () => {
    inBangla(<G3bWhereInCoach timerPaused initialPlace="back" />);
    expect(screen.getByRole('button', { name: 'আসন ঘ ৯৪–১০০ হোল্ড করুন' })).toBeInTheDocument();
  });

  it('offers only customising when the coach has no block of 7', () => {
    render(<G3bWhereInCoach timerPaused coachCode="DHA" />);
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    expect(screen.getByRole('radio', { name: /Customise seats/ })).toBeChecked();
  });
});

describe('F01b · station picker (to)', () => {
  it('filters in English and Bangla and announces the count', async () => {
    const user = userEvent.setup();
    render(<F01bStationTo initialStation="" />);
    await user.type(screen.getByRole('searchbox', { name: 'Search stations' }), 'ch');
    expect(screen.getAllByRole('radio').map((r) => r.getAttribute('value'))).toEqual(['CTG', 'CDP', 'CDG']);
    expect(screen.getByTestId('f01b-live')).toHaveTextContent('3 stations match');
    await user.click(screen.getByRole('radio', { name: /Chandpur/ }));
    expect(screen.getByRole('button', { name: 'Travel to Chandpur' })).toBeEnabled();
  });

  it('finds stations by Bangla name', async () => {
    const user = userEvent.setup();
    inBangla(<F01bStationTo initialStation="" />);
    await user.type(screen.getByRole('searchbox', { name: 'স্টেশন খুঁজুন' }), 'রাজ');
    expect(screen.getAllByRole('radio').map((r) => r.getAttribute('value'))).toEqual(['RJH']);
    expect(screen.getByTestId('f01b-live')).toHaveTextContent('১টি স্টেশন মিলেছে');
  });
});

describe('group flow', () => {
  it('goes G2b → G3a → G3b → G5 and moves focus to each h1', async () => {
    const user = userEvent.setup();
    render(<AppFlow start="g2b" />);
    await user.type(screen.getByLabelText('One-time code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Join as buyer' }));
    await user.click(await screen.findByRole('button', { name: 'Continue to choose seats' }, { timeout: 2000 }));
    expect(screen.getByRole('heading', { level: 1, name: 'Choose a coach' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Continue with coach GHA' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Where in the coach?' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Hold seats GHA 1–7' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Pay for Package B' })).toHaveFocus();
  });
});

describe('Bangla digit check (sanity)', () => {
  it('a Bangla screen shows no Western digits in values', () => {
    inBangla(<G3bWhereInCoach timerPaused />);
    const main = document.querySelector('main')!;
    const text = main.textContent!.replace(/\b[A-Z]{1,4}\d*-[0-9A-Z-]*\d[0-9A-Z-]*\b/g, '');
    expect(text).not.toMatch(/[0-9]/);
    expect(text).toMatch(/[০-৯]/);
  });
});
