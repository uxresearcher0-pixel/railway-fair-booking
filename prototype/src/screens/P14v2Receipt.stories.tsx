import type { Meta, StoryObj } from '@storybook/react';
import { P14v2Receipt } from './P14v2Receipt';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/P14·v2 Your receipt',
  component: P14v2Receipt,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Receipt RF-7Q2K-48: fare 4 × ৳350 = ৳1,400, service charge ৳80, assistance fee RA-118 ৳40, official total ৳1,520, paid by Karim Uddin (bKash ••9024). The demo SMS each adult traveller gets is the SM01 text from the SMS engine (English, or its Bangla equivalent).' } },
  },
} satisfies Meta<typeof P14v2Receipt>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Receipt: Story = {};
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Receipt' };
export const BanglaReceipt: Story = { ...bangla, name: 'বাংলা · Receipt' };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Receipt' };
