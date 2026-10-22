import type { Meta, StoryObj } from '@storybook/react';
import { CT04v2AgentReceipt } from './CT04v2AgentReceipt';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/CT04·v2 Agent receipt',
  component: CT04v2AgentReceipt,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Printed receipt from registered agent RA-118 · Mirpur. Application AP-0388-2C, 701 · Fri 17 Oct · S_CHAIR, 2 travellers (NID records matched), same draw as the app. Free application, assistance fee ৳20 (demo, rate to confirm), fare only if picked.' } },
  },
} satisfies Meta<typeof CT04v2AgentReceipt>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Receipt: Story = {};
export const Printed: Story = { args: { initialPrinted: true } };
export const BanglaReceipt: Story = { ...bangla, name: 'বাংলা · Receipt' };
export const BanglaPrinted: Story = { ...Printed, ...bangla, name: 'বাংলা · Printed' };
