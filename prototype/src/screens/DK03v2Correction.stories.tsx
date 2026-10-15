import type { Meta, StoryObj } from '@storybook/react';
import { DK03v2Correction } from './DK03v2Correction';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/DK03·v2 Correction — same person only',
  component: DK03v2Correction,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Desk, desktop-first. Case CV-206: date of birth 05/07/1993 on the ticket vs 05/07/1992 on the NID record, same person (NID record matched, photo ID seen). Needs a second approver (RV-07); self-approval blocked. A different person can’t take this seat.' } },
  },
} satisfies Meta<typeof DK03v2Correction>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Review' };
export const DesktopSent: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Sent for approval', args: { initialPhase: 'sent' } };
export const DesktopDifferentPerson: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Different person', args: { initialPhase: 'different' } };
export const Mobile: Story = { name: 'Mobile · Review' };

export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Review' };
export const BanglaDesktopSent: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Sent for approval', args: { initialPhase: 'sent' } };
export const BanglaMobile: Story = { ...bangla, name: 'বাংলা · Mobile · Review' };
export const BanglaDesktopDifferentPerson: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Different person', args: { initialPhase: 'different' } };
