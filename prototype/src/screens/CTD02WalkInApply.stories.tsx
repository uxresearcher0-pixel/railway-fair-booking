import type { Meta, StoryObj } from '@storybook/react';
import { CTD02WalkInApply } from './CTD02WalkInApply';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Counter terminal/CTD02 Apply for a walk-in passenger',
  component: CTD02WalkInApply,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Station counter terminal, desktop-first (Figma 02e CTD02). Two walk-in travellers with NID record matched, the duplicate check (example: Rahim Karim already in AP-0214-7K), window 08:00–10:00, result 10:30 by SMS, free. Proposed rules.' } },
  },
} satisfies Meta<typeof CTD02WalkInApply>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {};
export const Duplicate: Story = { name: 'Duplicate found', args: { withDuplicate: true } };
export const Submitted: Story = { name: 'Submitted · receipt printed', args: { initialPhase: 'submitted' } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Form' };

export const BanglaForm: Story = { ...bangla, name: 'বাংলা · Form' };
export const BanglaDuplicate: Story = { ...bangla, name: 'বাংলা · Duplicate found', args: { withDuplicate: true } };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Form' };
