import type { Meta, StoryObj } from '@storybook/react';
import { SmsDemo } from './SmsDemo';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/SM01–SM13 SMS help and reports',
  component: SmsDemo,
  parameters: {
    ...screenParams,
    docs: {
      description: {
        component:
          'Simulation of the proposed two-way SMS (docs/sms-help-extra.md): receipt, HELP, EXTRA, STATUS, SEND/EDIT/CANCEL, STOP. No real SMS. Each story opens in one demo state (SM01–SM13); keywords stay Latin in Bangla. Case OC-2207, support reference SR-4410.',
      },
    },
  },
} satisfies Meta<typeof SmsDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SM01: Story = { name: 'SM01 · Receipt SMS', args: { start: 'SM01' } };
export const SM02: Story = { name: 'SM02 · HELP menu', args: { start: 'SM02' } };
export const SM03: Story = { name: 'SM03 · HELP answered (SR-4410)', args: { start: 'SM03' } };
export const SM04: Story = { name: 'SM04 · EXTRA start', args: { start: 'SM04' } };
export const SM05: Story = { name: 'SM05 · Amount and excess', args: { start: 'SM05' } };
export const SM06: Story = { name: 'SM06 · Method and summary', args: { start: 'SM06' } };
export const SM07: Story = { name: 'SM07 · Report received (OC-2207)', args: { start: 'SM07' } };
export const SM08: Story = { name: 'SM08 · STATUS', args: { start: 'SM08' } };
export const SM09: Story = { name: 'SM09 · Invalid keyword or amount', args: { start: 'SM09' } };
export const SM10: Story = { name: 'SM10 · Shared phone, 2 bookings', args: { start: 'SM10' } };
export const SM11: Story = { name: 'SM11 · Unknown sender', args: { start: 'SM11' } };
export const SM12: Story = { name: 'SM12 · Send failed, safe retry', args: { start: 'SM12' } };
export const SM13: Story = { name: 'SM13 · STOP', args: { start: 'SM13' } };

export const BanglaSM01: Story = { ...bangla, name: 'বাংলা · SM01 · Receipt SMS', args: { start: 'SM01' } };
export const BanglaSM02: Story = { ...bangla, name: 'বাংলা · SM02 · HELP menu', args: { start: 'SM02' } };
export const BanglaSM03: Story = { ...bangla, name: 'বাংলা · SM03 · HELP answered', args: { start: 'SM03' } };
export const BanglaSM04: Story = { ...bangla, name: 'বাংলা · SM04 · EXTRA start', args: { start: 'SM04' } };
export const BanglaSM05: Story = { ...bangla, name: 'বাংলা · SM05 · Amount and excess', args: { start: 'SM05' } };
export const BanglaSM06: Story = { ...bangla, name: 'বাংলা · SM06 · Method and summary', args: { start: 'SM06' } };
export const BanglaSM07: Story = { ...bangla, name: 'বাংলা · SM07 · Report received', args: { start: 'SM07' } };
export const BanglaSM08: Story = { ...bangla, name: 'বাংলা · SM08 · STATUS', args: { start: 'SM08' } };
export const BanglaSM09: Story = { ...bangla, name: 'বাংলা · SM09 · Invalid keyword or amount', args: { start: 'SM09' } };
export const BanglaSM10: Story = { ...bangla, name: 'বাংলা · SM10 · Shared phone', args: { start: 'SM10' } };
export const BanglaSM11: Story = { ...bangla, name: 'বাংলা · SM11 · Unknown sender', args: { start: 'SM11' } };
export const BanglaSM12: Story = { ...bangla, name: 'বাংলা · SM12 · Send failed, safe retry', args: { start: 'SM12' } };
export const BanglaSM13: Story = { ...bangla, name: 'বাংলা · SM13 · STOP', args: { start: 'SM13' } };

export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · SM07 · Phone demonstration', args: { start: 'SM07' } };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · SM06 · Phone demonstration', args: { start: 'SM06' } };
