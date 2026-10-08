import type { Meta, StoryObj } from '@storybook/react';
import { Notice } from './Notice';
import { Button } from './Button';

const meta = {
  title: 'Components/Notice',
  component: Notice,
} satisfies Meta<typeof Notice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { tone: 'info', title: 'No seats are held yet', children: 'Seats for both packages are held together once Package B has a buyer.' },
};
export const Success: Story = { args: { tone: 'success', title: 'NID record matched', children: 'Name and date of birth match the NID record (simulated).' } };
export const Warning: Story = {
  args: {
    tone: 'warning',
    title: 'You can buy up to 4 tickets today',
    children: 'For more than 4 travellers, use a linked group booking (rule to confirm).',
    actions: <Button variant="secondary">Start a linked group booking</Button>,
  },
};
export const Danger: Story = { args: { tone: 'danger', title: 'Hold expired', children: 'Seats were released. You have not been charged.' } };
export const StaticNote: Story = {
  args: { tone: 'info', live: 'off', title: "Cancelling doesn't give tickets back (proposed)", children: "Cancelled tickets don't restore today's allowance." },
};
