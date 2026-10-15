import type { Meta, StoryObj } from '@storybook/react';
import { H1v2HoldPaused } from './H1v2HoldPaused';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/H1·v2 Hold paused',
  component: H1v2HoldPaused,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed rule, values to confirm). 3 holds on this train ended unpaid today, so new holds pause for 30 minutes, until 10:40. The waiting list is not affected.' } },
  },
} satisfies Meta<typeof H1v2HoldPaused>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Paused: Story = {};
export const BanglaPaused: Story = { ...bangla, name: 'বাংলা · Paused' };
