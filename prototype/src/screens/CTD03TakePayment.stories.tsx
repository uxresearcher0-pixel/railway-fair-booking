import type { Meta, StoryObj } from '@storybook/react';
import { CTD03TakePayment } from './CTD03TakePayment';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Counter terminal/CTD03 Take payment',
  component: CTD03TakePayment,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Station counter terminal, desktop-first (Figma 02e CTD03). Official total ৳1,480 (fare 4 × ৳350, service charge 4 × ৳20, counter fee: none); cash or bKash/Nagad QR on the customer display; "Received ৳1,480 · issue tickets"; shift summary.' } },
  },
} satisfies Meta<typeof CTD03TakePayment>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Cash: Story = {};
export const Wallet: Story = { name: 'bKash or Nagad', args: { initialMethod: 'wallet' } };
export const Issued: Story = { name: 'Issued', args: { initialPhase: 'issued' } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Cash' };
export const DesktopIssued: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Issued', args: { initialPhase: 'issued' } };

export const BanglaCash: Story = { ...bangla, name: 'বাংলা · Cash' };
export const BanglaIssued: Story = { ...bangla, name: 'বাংলা · Issued', args: { initialPhase: 'issued' } };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Cash' };
