import type { Meta, StoryObj } from '@storybook/react';
import { G3v2GroupSeats } from './G3v2GroupSeats';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/G3·v2 Choose where the group sits',
  component: G3v2GroupSeats,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed), Figma DW10. Picked in DRAW-17OCT-EVE, pay by 11:00. Coach GHA (7 together), DA (7 together) or DHA (split needed); the coach plan shows GHA 1–7 chosen: Package A 1–4, Package B 5–7.' } },
  },
} satisfies Meta<typeof G3v2GroupSeats>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Front: Story = { name: 'GHA 1–7 (front)' };
export const Middle: Story = { args: { initialPlace: 'middle' } };
export const SplitNeeded: Story = { name: 'DHA · split needed', args: { initialCoach: 'DHA' } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · GHA 1–7' };

export const BanglaFront: Story = { ...bangla, name: 'বাংলা · GHA 1–7' };
export const BanglaSplitNeeded: Story = { ...bangla, name: 'বাংলা · DHA · split needed', args: { initialCoach: 'DHA' } };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · GHA 1–7' };
