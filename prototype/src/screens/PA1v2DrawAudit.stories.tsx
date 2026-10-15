import type { Meta, StoryObj } from '@storybook/react';
import { PA1v2DrawAudit } from './PA1v2DrawAudit';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/PA1·v2 Draw audit',
  component: PA1v2DrawAudit,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Public audit of DRAW-17OCT-EVE: 1,862 applications frozen at 10:00, 212 S_CHAIR seats, fingerprint 9f3a…c71e, public beacon 10:05, 53 picked, 1,809 waiting, replay matches at 10:31. No personal data. Try AP-0388-2C (picked) or AP-1502-9D (waiting list).' } },
  },
} satisfies Meta<typeof PA1v2DrawAudit>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Audit: Story = {};
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Audit' };
export const BanglaAudit: Story = { ...bangla, name: 'বাংলা · Audit' };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Audit' };
