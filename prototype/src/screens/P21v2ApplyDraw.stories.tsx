import type { Meta, StoryObj } from '@storybook/react';
import { P21v2ApplyDraw } from './P21v2ApplyDraw';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/P21·v2 Apply for the draw',
  component: P21v2ApplyDraw,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Window 08:00–10:00, result 10:30, pay by 11:00. One application per traveller across all channels; the party is locked when you apply.' } },
  },
} satisfies Meta<typeof P21v2ApplyDraw>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Apply: Story = {};
export const DuplicateFound: Story = { name: 'Duplicate found', args: { initialPhase: 'duplicate', hasDuplicate: true } };
export const Received: Story = { name: 'Received · AP-0214-7K', args: { initialPhase: 'received' } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Apply' };
export const DesktopReceived: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Received', args: { initialPhase: 'received' } };

export const BanglaApply: Story = { ...Apply, ...bangla, name: 'বাংলা · Apply' };
export const BanglaDuplicateFound: Story = { ...DuplicateFound, ...bangla, name: 'বাংলা · Duplicate found' };
export const BanglaReceived: Story = { ...Received, ...bangla, name: 'বাংলা · Received' };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Apply' };
