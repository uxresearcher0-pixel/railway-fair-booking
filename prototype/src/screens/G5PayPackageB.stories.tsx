import type { Meta, StoryObj } from '@storybook/react';
import { G5PayPackageB } from './G5PayPackageB';
import { bangla, screenParams } from './Screens.stories.helpers';

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

// Bangla versions of every state (axe runs on these too).
export const BanglaDuringHold: Story = { ...DuringHold, ...bangla, name: 'বাংলা · During Hold' };
export const BanglaLowTime: Story = { ...LowTime, ...bangla, name: 'বাংলা · Low Time' };
export const BanglaConfirmDecline: Story = { ...ConfirmDecline, ...bangla, name: 'বাংলা · Confirm Decline' };
export const BanglaPaying: Story = { ...Paying, ...bangla, name: 'বাংলা · Paying' };
export const BanglaPaid: Story = { ...Paid, ...bangla, name: 'বাংলা · Paid' };
export const BanglaDeclined: Story = { ...Declined, ...bangla, name: 'বাংলা · Declined' };
export const BanglaHoldExpired: Story = { ...HoldExpired, ...bangla, name: 'বাংলা · Hold Expired' };
