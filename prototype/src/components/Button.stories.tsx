import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Continue', variant: 'primary' },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Start a linked group booking' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Decline and release 3 seats' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Change NID' } };
export const WithIcon: Story = { args: { icon: 'send', children: 'Send invite' } };
export const Disabled: Story = { args: { disabled: true, children: 'Join as buyer' } };
export const Loading: Story = { args: { loading: true, loadingLabel: 'Paying…', children: 'Pay ৳1,110' } };
export const Block: Story = { args: { block: true, iconAfter: 'arrow-right', children: 'Continue with 2 travellers' } };
