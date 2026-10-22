import type { Meta, StoryObj } from '@storybook/react';
import { AllowancePill } from './AllowancePill';

const meta = {
  title: 'Components/AllowancePill',
  component: AllowancePill,
  args: { used: 0 },
} satisfies Meta<typeof AllowancePill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NoneUsed: Story = {};
export const OneUsed: Story = { args: { used: 1 } };
export const LimitReached: Story = { args: { used: 2 } };
