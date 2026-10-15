import type { Meta, StoryObj } from '@storybook/react';
import { G3CustomiseSeats } from './G3CustomiseSeats';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens/G3 Customise seats · 7 together',
  component: G3CustomiseSeats,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Coach GHA, seats 1–100. Free: 1–9, 15–19, 48–54, 92–100; the rest are taken.' } },
  },
  args: { timerPaused: true },
} satisfies Meta<typeof G3CustomiseSeats>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const SplitGroup: Story = { args: { initialSeats: [15, 16, 17, 18, 19, 8, 9] } };
export const Together: Story = { args: { initialSeats: [48, 49, 50, 51, 52, 53, 54] } };

export const BanglaEmpty: Story = { ...Empty, ...bangla, name: 'বাংলা · Empty' };
export const BanglaSplitGroup: Story = { ...SplitGroup, ...bangla, name: 'বাংলা · Split group' };
