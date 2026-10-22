import type { Meta, StoryObj } from '@storybook/react';
import { Home } from './Home';
import { bangla, desktop, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens/Home · journeys by role',
  component: Home,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Start screen of the coded prototype: journeys grouped by role (Passenger, Staff). Each link goes to #/<id> in the Vite app.' } },
  },
} satisfies Meta<typeof Home>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Journeys: Story = {};
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop' };
export const BanglaJourneys: Story = { ...bangla, name: 'বাংলা · Journeys' };
