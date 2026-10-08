import type { Meta, StoryObj } from '@storybook/react';
import { F03Travellers } from './F03Travellers';
import { screenParams } from './Screens.stories.helpers';

const meta = { title: 'Screens/F03 Travellers & class', component: F03Travellers, parameters: screenParams } satisfies Meta<typeof F03Travellers>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FamilyOfFour: Story = { args: { initialAdults: 2, initialChildren: 2 } };
export const OverLimitGuidance: Story = { args: { initialAdults: 3, initialChildren: 1, showLimitGuidance: true } };
export const SomeAllowanceUsed: Story = { args: { usedToday: 2, initialAdults: 2 } };
