import type { Meta, StoryObj } from '@storybook/react';
import { OP08v2DrawRun } from './OP08v2DrawRun';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/OP08·v2 Draw run and replay',
  component: OP08v2DrawRun,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Operations, desktop-first. Inputs frozen at 10:00 (policy v4, 1,862 applications, 41 duplicates merged, 212 seats, fingerprint 9f3a…c71e), committed 10:00:04; public beacon 10:05; replay matches 10:31. Reruns are not allowed.' } },
  },
} satisfies Meta<typeof OP08v2DrawRun>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Run' };
export const DesktopPublished: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Published', args: { initialDone: 'published' } };
export const Mobile: Story = { name: 'Mobile · Run' };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Run' };
export const BanglaMobile: Story = { ...bangla, name: 'বাংলা · Mobile · Run' };
export const BanglaDesktopPublished: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Published', args: { initialDone: 'published' } };
