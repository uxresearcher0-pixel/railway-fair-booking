import type { Meta, StoryObj } from '@storybook/react';
import { CTD04RecoverTicket } from './CTD04RecoverTicket';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Counter terminal/CTD04 Recover a ticket',
  component: CTD04RecoverTicket,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Station counter terminal, desktop-first (Figma 02e CTD04). RF-7Q2K-48: ID check (NID card, NID record matched), reissue to the traveller’s own phone ••41 or print a paper ticket, remove the helper’s access (Karim Uddin), and record who, when and which ID. Staff screen: names in English.' } },
  },
} satisfies Meta<typeof CTD04RecoverTicket>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Check: Story = {};
export const Paper: Story = { name: 'Print paper, keep helper', args: { initialReissue: 'paper', initialRemoveHelper: false } };
export const Recorded: Story = { args: { initialPhase: 'recorded' } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Check' };

export const BanglaCheck: Story = { ...bangla, name: 'বাংলা · Check' };
export const BanglaRecorded: Story = { ...bangla, name: 'বাংলা · Recorded', args: { initialPhase: 'recorded' } };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Check' };
