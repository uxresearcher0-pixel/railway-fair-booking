import type { Meta, StoryObj } from '@storybook/react';
import { OP09v2SeatReconciliation } from './OP09v2SeatReconciliation';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/OP09·v2 Every seat accounted for',
  component: OP09v2SeatReconciliation,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Operations, desktop-first. Train 701 · Fri 17 Oct · S_CHAIR: 240 seats = 198 sold + 8 held + 6 waiting-list offers + 27 blocked (approved) + 1 unexplained. GHA-31 blocked 09:58 with no approval record, by account OPS-11.' } },
  },
} satisfies Meta<typeof OP09v2SeatReconciliation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · One seat to explain' };
export const DesktopCaseOpened: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Case opened', args: { initialDone: 'case' } };
export const Mobile: Story = { name: 'Mobile · One seat to explain' };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · One seat to explain' };
export const BanglaMobile: Story = { ...bangla, name: 'বাংলা · Mobile · One seat to explain' };
export const BanglaDesktopCaseOpened: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Case opened', args: { initialDone: 'case' } };
