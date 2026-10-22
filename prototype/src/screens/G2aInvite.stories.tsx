import type { Meta, StoryObj } from '@storybook/react';
import { G2aInvite } from './G2aInvite';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = { title: 'Screens/G2a Invite Package B buyer', component: G2aInvite, parameters: screenParams } satisfies Meta<typeof G2aInvite>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ChooseBuyer: Story = {};
export const BuyerChosen: Story = { args: { initialBuyerId: 't2' } };
export const Sent: Story = { args: { initialBuyerId: 't2', initialStatus: 'sent' } };
export const Joined: Story = { args: { initialBuyerId: 't2', initialStatus: 'joined' } };
export const Declined: Story = { args: { initialBuyerId: 't3', initialStatus: 'declined' } };

// Bangla versions of every state (axe runs on these too).
export const BanglaChooseBuyer: Story = { ...ChooseBuyer, ...bangla, name: 'বাংলা · Choose Buyer' };
export const BanglaBuyerChosen: Story = { ...BuyerChosen, ...bangla, name: 'বাংলা · Buyer Chosen' };
export const BanglaSent: Story = { ...Sent, ...bangla, name: 'বাংলা · Sent' };
export const BanglaJoined: Story = { ...Joined, ...bangla, name: 'বাংলা · Joined' };
export const BanglaDeclined: Story = { ...Declined, ...bangla, name: 'বাংলা · Declined' };
