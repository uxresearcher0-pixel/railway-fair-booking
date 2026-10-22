import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stepper, type StepperProps } from './Stepper';

function Controlled(props: Omit<StepperProps, 'onChange' | 'value'> & { value: number }) {
  const [v, setV] = useState(props.value);
  return <Stepper {...props} value={v} onChange={setV} />;
}

const meta = {
  title: 'Components/Stepper',
  component: Controlled,
  args: { label: 'Adults', unit: ['adult', 'adults'], hint: 'Age 12 and over (age band to confirm)', value: 1, min: 1, max: 4 },
} satisfies Meta<typeof Controlled>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AtMinimum: Story = { args: { value: 1 } };
export const AtMaximum: Story = { args: { value: 4 } };
export const Children: Story = { args: { label: 'Children', unit: ['child', 'children'], hint: 'Age 3 to 11 (age band to confirm)', value: 0, min: 0 } };
