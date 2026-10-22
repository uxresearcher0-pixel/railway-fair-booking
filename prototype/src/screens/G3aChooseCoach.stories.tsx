import type { Meta, StoryObj } from '@storybook/react';
import { G3aChooseCoach } from './G3aChooseCoach';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens/G3a Choose a coach · 7 together',
  component: G3aChooseCoach,
  parameters: screenParams,
  args: { timerPaused: true },
} satisfies Meta<typeof G3aChooseCoach>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CoachChosen: Story = { args: { initialCoach: 'GHA' } };
export const AllCoaches: Story = { args: { showAll: true } };

export const BanglaDefault: Story = { ...Default, ...bangla, name: 'বাংলা · Default' };
export const BanglaCoachChosen: Story = { ...CoachChosen, ...bangla, name: 'বাংলা · Coach chosen' };
export const BanglaAllCoaches: Story = { ...AllCoaches, ...bangla, name: 'বাংলা · All coaches' };

export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Coach chosen', args: { initialCoach: 'GHA' } };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Coach chosen', args: { initialCoach: 'GHA' } };
