import type { Meta, StoryObj } from '@storybook/react';
import { G2v2Group } from './G2v2Group';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/G2·v2 One group, one chance',
  component: G2v2Group,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Group of 7, one application and one draw place. Package A (4, paid by Abdul Karim) and Package B (3, paid by Salma Karim). "All 7 travel, or none" is chosen before the draw; party locked at 10:00.' } },
  },
} satisfies Meta<typeof G2v2Group>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Review: Story = {};
export const Confirmed: Story = { args: { initialPhase: 'confirmed' } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Review' };

export const BanglaReview: Story = { ...bangla, name: 'বাংলা · Review' };
export const BanglaConfirmed: Story = { ...Confirmed, ...bangla, name: 'বাংলা · Confirmed' };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Review' };
