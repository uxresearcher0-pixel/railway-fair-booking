import type { Meta, StoryObj } from '@storybook/react';
import { AppFlow } from './AppFlow';
import { screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Flows/App flow · G2a → G2b → G5',
  component: AppFlow,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Linked group of 7. Use the buttons to move from the invite (Abdul Karim) to the join (Salma Karim) and payment screens.' } },
  },
} satisfies Meta<typeof AppFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const StartAtInvite: Story = {};
export const StartAtJoin: Story = { args: { start: 'g2b' } };
export const StartAtPay: Story = { args: { start: 'g5' } };
