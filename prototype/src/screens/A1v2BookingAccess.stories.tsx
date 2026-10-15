import type { Meta, StoryObj } from '@storybook/react';
import { A1v2BookingAccess } from './A1v2BookingAccess';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/A1·v2 Who can act on my booking',
  component: A1v2BookingAccess,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Booking RF-7Q2K-48: Abdul Karim (traveller, full access) and Karim Uddin (helper: view and pay). Remove the helper → record AC-5521.' } },
  },
} satisfies Meta<typeof A1v2BookingAccess>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithHelper: Story = { name: 'With helper' };
export const ConfirmRemove: Story = { name: 'Confirm remove', args: { initialPhase: 'confirm' } };
export const Removed: Story = { name: 'Removed · AC-5521', args: { initialPhase: 'removed' } };

export const BanglaWithHelper: Story = { ...WithHelper, ...bangla, name: 'বাংলা · With helper' };
export const BanglaConfirmRemove: Story = { ...ConfirmRemove, ...bangla, name: 'বাংলা · Confirm remove' };
export const BanglaRemoved: Story = { ...Removed, ...bangla, name: 'বাংলা · Removed' };
