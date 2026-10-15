import type { Meta, StoryObj } from '@storybook/react';
import { G4v2GroupTickets } from './G4v2GroupTickets';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/G4·v2 Group tickets',
  component: G4v2GroupTickets,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed), Figma DW12. Seven named tickets in GHA 1–7: Package A RF-7Q2K-48 (Abdul Karim, Ayesha Karim, Rahim Karim, Nadia Rahman) and Package B RF-7Q2K-49 (Salma Karim, Imran Hossain, Tania Akter). Tickets keep the English name.' } },
  },
} satisfies Meta<typeof G4v2GroupTickets>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tickets: Story = {};
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Tickets' };
export const BanglaTickets: Story = { ...bangla, name: 'বাংলা · Tickets' };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Tickets' };
