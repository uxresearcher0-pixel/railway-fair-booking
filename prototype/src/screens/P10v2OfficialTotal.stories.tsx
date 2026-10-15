import type { Meta, StoryObj } from '@storybook/react';
import { P10v2OfficialTotal } from './P10v2OfficialTotal';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/P10·v2 Official total',
  component: P10v2OfficialTotal,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Fare ৳1,400 + service charge ৳80 + assistance fee ৳40 (demo, rate to confirm) = ৳1,520, with "Report an extra charge".' } },
  },
} satisfies Meta<typeof P10v2OfficialTotal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Total: Story = {};
export const Paid: Story = { args: { initialPhase: 'paid' } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Total' };

export const BanglaTotal: Story = { ...Total, ...bangla, name: 'বাংলা · Total' };
export const BanglaPaid: Story = { ...Paid, ...bangla, name: 'বাংলা · Paid' };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Total' };
