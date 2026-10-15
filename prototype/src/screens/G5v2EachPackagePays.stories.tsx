import type { Meta, StoryObj } from '@storybook/react';
import { G5v2EachPackagePays } from './G5v2EachPackagePays';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/G5·v2 Each package pays its own share',
  component: G5v2EachPackagePays,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed), Figma DW11. Package A (4) paid ৳1,480 at 10:21 by bKash ••9024; Package B (3, ৳1,110) waiting for Salma Karim, code sent 10:22, with "Resend code". Tickets when both are paid, by 11:00.' } },
  },
} satisfies Meta<typeof G5v2EachPackagePays>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Waiting: Story = {};
export const Resent: Story = { name: 'Code resent', args: { initialPhase: 'resent' } };
export const BothPaid: Story = { name: 'Both paid', args: { initialPhase: 'paid' } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Waiting' };

export const BanglaWaiting: Story = { ...bangla, name: 'বাংলা · Waiting' };
export const BanglaBothPaid: Story = { ...bangla, name: 'বাংলা · Both paid', args: { initialPhase: 'paid' } };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Waiting' };
