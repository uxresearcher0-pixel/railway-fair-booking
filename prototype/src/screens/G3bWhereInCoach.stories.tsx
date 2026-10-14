import type { Meta, StoryObj } from '@storybook/react';
import { G3bWhereInCoach } from './G3bWhereInCoach';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens/G3b Where in the coach · 7 together',
  component: G3bWhereInCoach,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Coach GHA has seats 1–9, 15–19, 48–54 and 92–100 free. Front = 1–7, middle = 48–54, back = 94–100.' } },
  },
  args: { timerPaused: true },
} satisfies Meta<typeof G3bWhereInCoach>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Front: Story = {};
export const Middle: Story = { args: { initialPlace: 'middle' } };
export const Back: Story = { args: { initialPlace: 'back' } };
export const Customise: Story = { args: { initialPlace: 'custom' } };
export const NoBlockOfSeven: Story = { args: { coachCode: 'DHA' } };

export const BanglaFront: Story = { ...Front, ...bangla, name: 'বাংলা · Front' };
export const BanglaMiddle: Story = { ...Middle, ...bangla, name: 'বাংলা · Middle' };
export const BanglaBack: Story = { ...Back, ...bangla, name: 'বাংলা · Back' };
export const BanglaCustomise: Story = { ...Customise, ...bangla, name: 'বাংলা · Customise' };
