import type { Meta, StoryObj } from '@storybook/react';
import { L1DailyLimit } from './L1DailyLimit';
import { screenParams } from './Screens.stories.helpers';

const meta = { title: 'Screens/L1 Daily limit reached', component: L1DailyLimit, parameters: screenParams } satisfies Meta<typeof L1DailyLimit>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
