import type { Meta, StoryObj } from '@storybook/react';
import { P22v2Offer } from './P22v2Offer';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/P22·v2 Picked · pay by 11:00',
  component: P22v2Offer,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Draw place #0214. The pay-by time is an absolute clock time that never restarts. Official total ৳1,480 (4 × ৳350 + 4 × ৳20).' } },
  },
  args: { timerPaused: true },
} satisfies Meta<typeof P22v2Offer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Picked: Story = {};
export const Expired: Story = { name: 'Expired', args: { initialPhase: 'expired' } };

export const BanglaPicked: Story = { ...Picked, ...bangla, name: 'বাংলা · Picked' };
export const BanglaExpired: Story = { ...Expired, ...bangla, name: 'বাংলা · Expired' };
