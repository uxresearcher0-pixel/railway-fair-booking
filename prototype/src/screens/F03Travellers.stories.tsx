import type { Meta, StoryObj } from '@storybook/react';
import { F03Travellers } from './F03Travellers';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = { title: 'Screens/F03 Travellers & class', component: F03Travellers, parameters: screenParams } satisfies Meta<typeof F03Travellers>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FamilyOfFour: Story = { args: { initialAdults: 2, initialChildren: 2 } };
export const OverLimitGuidance: Story = { args: { initialAdults: 3, initialChildren: 1, showLimitGuidance: true } };
export const SomeAllowanceUsed: Story = { args: { usedToday: 1, initialAdults: 2 } };

// Bangla versions of every state (axe runs on these too).
export const BanglaDefault: Story = { ...Default, ...bangla, name: 'বাংলা · Default' };
export const BanglaFamilyOfFour: Story = { ...FamilyOfFour, ...bangla, name: 'বাংলা · Family Of Four' };
export const BanglaOverLimitGuidance: Story = { ...OverLimitGuidance, ...bangla, name: 'বাংলা · Over Limit Guidance' };
export const BanglaSomeAllowanceUsed: Story = { ...SomeAllowanceUsed, ...bangla, name: 'বাংলা · Some Allowance Used' };
