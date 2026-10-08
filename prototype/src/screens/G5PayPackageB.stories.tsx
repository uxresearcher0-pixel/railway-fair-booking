import type { Meta, StoryObj } from '@storybook/react';
import { G5PayPackageB } from './G5PayPackageB';
import { screenParams } from './Screens.stories.helpers';

const meta = { title: 'Screens/G5 Pay for Package B', component: G5PayPackageB, parameters: screenParams } satisfies Meta<typeof G5PayPackageB>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DuringHold: Story = {};
export const LowTime: Story = { args: { holdSeconds: 75 } };
export const ConfirmDecline: Story = { args: { initialPhase: 'confirm-decline', timerPaused: true } };
export const Paying: Story = { args: { initialPhase: 'paying' } };
export const Paid: Story = { args: { initialPhase: 'paid' } };
export const Declined: Story = { args: { initialPhase: 'declined' } };
export const HoldExpired: Story = { args: { initialPhase: 'expired' } };
