import type { Meta, StoryObj } from '@storybook/react';
import { OP10v2AgentReports } from './OP10v2AgentReports';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/OP10·v2 Agents and extra-charge reports',
  component: OP10v2AgentReports,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Operations, desktop-first. Agents in the last 30 days: RA-118 Normal, RA-204 Under review, RA-311 Normal. Report OC-2207: official total ৳1,520, passenger paid ৳2,500, named RA-204, ticket stays valid. No automatic penalty.' } },
  },
} satisfies Meta<typeof OP10v2AgentReports>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Agents and report' };
export const DesktopReviewOpened: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Review opened', args: { initialDone: 'review' } };
export const Mobile: Story = { name: 'Mobile · Agents and report' };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Agents and report' };
export const BanglaMobile: Story = { ...bangla, name: 'বাংলা · Mobile · Agents and report' };
export const BanglaDesktopReviewOpened: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Review opened', args: { initialDone: 'review' } };
