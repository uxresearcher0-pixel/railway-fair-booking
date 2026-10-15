import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SeatMap, makeCoach, type SeatMapProps } from './SeatMap';

function Controlled(props: Omit<SeatMapProps, 'onChange'>) {
  const [sel, setSel] = useState(props.selected);
  return <SeatMap {...props} selected={sel} onChange={setSel} />;
}

const coach = makeCoach(6, ['1A', '1B', '2C', '2D', '3E', '5A', '5B', '6C'], ['3A', '3B', '4A', '4B']);

const meta = {
  title: 'Components/SeatMap',
  component: Controlled,
  args: { coach: 'C2', seats: coach, selected: [], maxSelectable: 3, heldLabel: 'Held for Package A' },
} satisfies Meta<typeof Controlled>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const PartlyChosen: Story = { args: { selected: ['4C', '4D'] } };
export const FullyChosen: Story = { args: { selected: ['4C', '4D', '4E'] } };
export const MostlyTaken: Story = {
  args: { seats: makeCoach(4, ['1A', '1B', '1C', '1D', '1E', '2A', '2B', '2C', '2E', '3A', '3B', '3C', '3D', '4B', '4C', '4D', '4E']), maxSelectable: 2 },
};
