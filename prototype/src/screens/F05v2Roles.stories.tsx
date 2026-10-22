import type { Meta, StoryObj } from '@storybook/react';
import { F05v2Roles } from './F05v2Roles';
import { bangla, desktop, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/F05·v2 Who does what',
  component: F05v2Roles,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Booking roles for Ayesha Karim (child, 8): accompanying adult Abdul Karim, booked and paid by the helper Karim Uddin (bKash ••9024). The helper can book, pay and see the ticket, not cancel or change. Refunds go to the account that paid.' } },
  },
} satisfies Meta<typeof F05v2Roles>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Roles: Story = {};
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Roles' };
export const BanglaRoles: Story = { ...bangla, name: 'বাংলা · Roles' };
