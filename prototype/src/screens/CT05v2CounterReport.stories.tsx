import type { Meta, StoryObj } from '@storybook/react';
import { CT05v2CounterReport } from './CT05v2CounterReport';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/CT05·v2 Counter-assisted report',
  component: CT05v2CounterReport,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). Staff at counter C-12 file an extra-charge report for a passenger with no phone or lost access (Abdul Karim, NID record matched), then print an itemised receipt. Case OC-2207, channel counter. Staff screen: names in English.' } },
  },
} satisfies Meta<typeof CT05v2CounterReport>;
export default meta;
type Story = StoryObj<typeof meta>;

const filled = { initialAmount: '2500', initialCollector: 'RA-204', initialMethod: 'cash' } as const;

export const Empty: Story = {};
export const Errors: Story = { args: { showErrors: true } };
export const Filled: Story = { args: filled };
export const Filed: Story = { name: 'Filed · receipt OC-2207', args: { ...filled, initialPhase: 'filed' } };
export const Printed: Story = { name: 'Printed (demo)', args: { ...filled, initialPhase: 'filed', initialPrinted: true } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Filed', args: { ...filled, initialPhase: 'filed' } };

export const BanglaEmpty: Story = { ...bangla, name: 'বাংলা · Empty' };
export const BanglaErrors: Story = { ...bangla, name: 'বাংলা · Errors', args: { showErrors: true } };
export const BanglaFilled: Story = { ...bangla, name: 'বাংলা · Filled', args: { ...filled, initialAmount: '২৫০০' } };
export const BanglaFiled: Story = { ...bangla, name: 'বাংলা · Filed', args: { ...filled, initialAmount: '২৫০০', initialPhase: 'filed' } };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Filed', args: { ...filled, initialAmount: '২৫০০', initialPhase: 'filed' } };
