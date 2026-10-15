import type { Meta, StoryObj } from '@storybook/react';
import { F01bStationTo } from './F01bStationTo';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = { title: 'Screens/F01b Station picker · to', component: F01bStationTo, parameters: screenParams } satisfies Meta<typeof F01bStationTo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AllStations: Story = {};
export const Searching: Story = { args: { initialQuery: 'Ch' } };
export const NoMatch: Story = { args: { initialQuery: 'Xyz' } };

export const BanglaAllStations: Story = { ...AllStations, ...bangla, name: 'বাংলা · All stations' };
export const BanglaSearching: Story = { ...bangla, name: 'বাংলা · Searching', args: { initialQuery: 'চ' } };
