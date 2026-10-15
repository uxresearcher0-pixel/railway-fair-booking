import type { Meta, StoryObj } from '@storybook/react';
import { R3v2ReportCharge } from './R3v2ReportCharge';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/R3·v2 Report an extra charge',
  component: R3v2ReportCharge,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Private report to the independent review team. Reporting never cancels the ticket. Sent → reference OC-2207.' } },
  },
} satisfies Meta<typeof R3v2ReportCharge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Errors: Story = { args: { showErrors: true } };
export const Filled: Story = { args: { initialAmount: '1820', initialPaidTo: 'Agent at the station gate', initialHow: 'cash' } };
export const Sent: Story = { name: 'Sent · OC-2207', args: { initialPhase: 'sent', initialAmount: '1820', initialHow: 'cash' } };

export const BanglaEmpty: Story = { ...Empty, ...bangla, name: 'বাংলা · Empty' };
export const BanglaErrors: Story = { ...Errors, ...bangla, name: 'বাংলা · Errors' };
export const BanglaFilled: Story = { ...bangla, name: 'বাংলা · Filled', args: { initialAmount: '১৮২০', initialPaidTo: 'স্টেশনের গেটে একজন এজেন্ট', initialHow: 'cash' } };
export const BanglaSent: Story = { ...bangla, name: 'বাংলা · Sent', args: { initialPhase: 'sent', initialAmount: '১৮২০', initialHow: 'cash' } };
