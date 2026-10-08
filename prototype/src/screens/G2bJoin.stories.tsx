import type { Meta, StoryObj } from '@storybook/react';
import { G2bJoin } from './G2bJoin';
import { screenParams } from './Screens.stories.helpers';

const meta = { title: 'Screens/G2b Join Package B', component: G2bJoin, parameters: screenParams } satisfies Meta<typeof G2bJoin>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Invited: Story = {};
export const OtpError: Story = { args: { initialOtp: '12', showOtpError: true } };
export const NotEnoughAllowance: Story = { args: { usedToday: 2 } };
export const Joined: Story = { args: { initialPhase: 'joined' } };
export const Declined: Story = { args: { initialPhase: 'declined' } };
