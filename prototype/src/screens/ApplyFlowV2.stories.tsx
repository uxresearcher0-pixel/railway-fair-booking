import type { Meta, StoryObj } from '@storybook/react';
import { ApplyFlowV2 } from './ApplyFlowV2';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Flows/v2 busy train · P21 → P22 → P10 (→ R3)',
  component: ApplyFlowV2,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed): apply in the window, get picked, see the official total, and report an extra charge.' } },
  },
  args: { timerPaused: true },
} satisfies Meta<typeof ApplyFlowV2>;
export default meta;
type Story = StoryObj<typeof meta>;

export const StartAtApply: Story = {};
export const StartAtOffer: Story = { args: { start: 'p22' } };
export const BanglaStartAtApply: Story = { ...bangla, name: 'বাংলা · Start at apply' };
export const BanglaStartAtOffer: Story = { ...bangla, name: 'বাংলা · Start at offer', args: { start: 'p22' } };
