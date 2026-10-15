import type { Meta, StoryObj } from '@storybook/react';
import { CTD01FindBooking } from './CTD01FindBooking';
import { bangla, desktop, desktopBangla, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Counter terminal/CTD01 Find a booking or start one',
  component: CTD01FindBooking,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Station counter terminal, desktop-first (Figma 02e CTD01). Search by reference, application number or ID; the result AP-0214-7K (picked, pay by 11:00) leads to Take payment (CTD03). Side-rail navigation collapses to a list above the content on mobile. Staff screen: names in English.' } },
  },
} satisfies Meta<typeof CTD01FindBooking>;
export default meta;
type Story = StoryObj<typeof meta>;

const found = { initialQuery: 'AP-0214-7K', searched: true } as const;

export const Empty: Story = {};
export const Result: Story = { name: 'Result · AP-0214-7K', args: found };
export const NotFound: Story = { name: 'Nothing found', args: { initialQuery: 'AP-9999-0X', searched: true } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Result', args: found };

export const BanglaEmpty: Story = { ...bangla, name: 'বাংলা · Empty' };
export const BanglaResult: Story = { ...bangla, name: 'বাংলা · Result', args: found };
export const BanglaDesktop: Story = { ...desktopBangla, tags: ['desktop'], name: 'বাংলা · Desktop · Result', args: found };
