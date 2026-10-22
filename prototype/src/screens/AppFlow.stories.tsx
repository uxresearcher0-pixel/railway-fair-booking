import type { Meta, StoryObj } from '@storybook/react';
import { AppFlow } from './AppFlow';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Flows/App flow · G2a → G2b → G3a → G3b → G5',
  component: AppFlow,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Linked group of 7. Use the buttons to move from the invite (Abdul Karim) to the join (Salma Karim), the coach and seat choice, and payment.' } },
  },
} satisfies Meta<typeof AppFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const StartAtInvite: Story = {};
export const StartAtJoin: Story = { args: { start: 'g2b' } };
export const StartAtPay: Story = { args: { start: 'g5' } };
export const StartAtCoach: Story = { args: { start: 'g3a' } };
export const BanglaStartAtInvite: Story = { ...bangla, name: 'বাংলা · Start at invite' };
export const BanglaStartAtCoach: Story = { ...bangla, name: 'বাংলা · Start at coach', args: { start: 'g3a' } };
