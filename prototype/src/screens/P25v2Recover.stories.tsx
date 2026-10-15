import type { Meta, StoryObj } from '@storybook/react';
import { P25v2Recover } from './P25v2Recover';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/P25·v2 Recover a ticket',
  component: P25v2Recover,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Recover at any counter with NID, passport or birth registration (the accompanying adult for a child); the helper’s phone is not needed. Or a code to the traveller’s own phone ••41.' } },
  },
} satisfies Meta<typeof P25v2Recover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = {};
export const CodeSent: Story = { name: 'Code sent', args: { initialPhase: 'sent' } };
export const BanglaStart: Story = { ...bangla, name: 'বাংলা · Start' };
export const BanglaCodeSent: Story = { ...CodeSent, ...bangla, name: 'বাংলা · Code sent' };
