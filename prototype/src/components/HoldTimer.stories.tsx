import type { Meta, StoryObj } from '@storybook/react';
import { HoldTimer } from './HoldTimer';

const meta = {
  title: 'Components/HoldTimer',
  component: HoldTimer,
  args: { initialSeconds: 9 * 60 + 12, subject: 'Package B seats' },
} satisfies Meta<typeof HoldTimer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {};
export const Paused: Story = { args: { paused: true } };
export const LowTime: Story = { args: { initialSeconds: 65 } };
export const NearlyExpired: Story = { args: { initialSeconds: 5 } };
export const Expired: Story = { args: { initialSeconds: 0 } };
