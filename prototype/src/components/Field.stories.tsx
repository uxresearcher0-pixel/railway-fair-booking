import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';

const meta = {
  title: 'Components/Field',
  component: Field,
  args: { label: 'Full name as on NID' },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { label: 'NID number', hint: '10 or 17 digits. Hidden after you leave the field.', inputMode: 'numeric' } };
export const WithError: Story = {
  args: {
    label: 'NID number',
    hint: '10 or 17 digits.',
    defaultValue: '12345',
    error: 'NID number must be 10 or 17 digits. You entered 5.',
  },
};
export const Filled: Story = { args: { defaultValue: 'Abdul Karim' } };
export const ReadOnly: Story = { args: { defaultValue: 'Abdul Karim', readOnly: true } };
export const BanglaLabel: Story = {
  args: {
    label: (
      <>
        Traveller name <span lang="bn">· যাত্রীর নাম</span>
      </>
    ),
  },
};
