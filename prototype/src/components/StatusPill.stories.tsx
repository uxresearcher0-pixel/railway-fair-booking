import type { Meta, StoryObj } from '@storybook/react';
import { StatusPill } from './StatusPill';

const meta = {
  title: 'Components/StatusPill',
  component: StatusPill,
  args: { children: 'Sent', tone: 'info' },
} satisfies Meta<typeof StatusPill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sent: Story = { args: { tone: 'info', icon: 'send', children: 'Sent', srPrefix: 'Invite status:' } };
export const Joined: Story = { args: { tone: 'success', children: 'Joined', srPrefix: 'Invite status:' } };
export const Declined: Story = { args: { tone: 'danger', children: 'Declined', srPrefix: 'Invite status:' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Not checked' } };
export const Neutral: Story = { args: { tone: 'neutral', children: 'To check' } };
export const Accent: Story = { args: { tone: 'accent', children: 'NID record matched' } };
export const AllTones: Story = {
  render: () => (
    <ul className="checklist" aria-label="All status pills">
      <li><StatusPill tone="info" icon="send">Sent</StatusPill></li>
      <li><StatusPill tone="success">Joined</StatusPill></li>
      <li><StatusPill tone="danger">Declined</StatusPill></li>
      <li><StatusPill tone="warning">Not checked</StatusPill></li>
      <li><StatusPill tone="neutral">To check</StatusPill></li>
      <li><StatusPill tone="accent">NID record matched</StatusPill></li>
    </ul>
  ),
};
