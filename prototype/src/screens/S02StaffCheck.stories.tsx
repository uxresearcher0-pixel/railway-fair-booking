import type { Meta, StoryObj } from '@storybook/react';
import { S02StaffCheck } from './S02StaffCheck';
import { screenParams } from './Screens.stories.helpers';

const meta = { title: 'Screens/S02 Staff check a ticket', component: S02StaffCheck, parameters: screenParams } satisfies Meta<typeof S02StaffCheck>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ToCheck: Story = {};
export const OutcomeChosen: Story = { args: { initialOutcome: 'matches' } };
export const Recorded: Story = { args: { initialOutcome: 'matches', recorded: true } };
export const CouldNotCheck: Story = { args: { initialOutcome: 'not-checked', recorded: true } };
