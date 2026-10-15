import type { Meta, StoryObj } from '@storybook/react';
import { P24v2Waitlist } from './P24v2Waitlist';
import { bangla, desktop, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/P24·v2 Waiting list · place kept',
  component: P24v2Waitlist,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Place #3, needs 4 seats together. Releases 09:40 (2 seats → #1), 10:05 (1 seat → #2), 10:20 (3 seats → #4): your place is kept.' } },
  },
} satisfies Meta<typeof P24v2Waitlist>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PlaceKept: Story = { name: 'Place kept' };
export const ConfirmLeave: Story = { name: 'Confirm leave', args: { initialPhase: 'confirm' } };
export const Left: Story = { args: { initialPhase: 'left' } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Place kept' };

export const BanglaPlaceKept: Story = { ...bangla, name: 'বাংলা · Place kept' };
export const BanglaConfirmLeave: Story = { ...ConfirmLeave, ...bangla, name: 'বাংলা · Confirm leave' };
export const BanglaLeft: Story = { ...Left, ...bangla, name: 'বাংলা · Left' };
