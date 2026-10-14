import type { Meta, StoryObj } from '@storybook/react';
import { F04aAddTraveller } from './F04aAddTraveller';
import { bangla, screenParams } from './Screens.stories.helpers';

const meta = { title: 'Screens/F04a Add traveller · NID', component: F04aAddTraveller, parameters: screenParams } satisfies Meta<typeof F04aAddTraveller>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const ValidationErrors: Story = { args: { initial: { name: '', dob: '', nid: '48211' }, showErrors: true } };
export const NidMasked: Story = { args: { initial: { name: 'Abdul Karim', dob: '1984-03-12', nid: '19840000000004821' }, nidMasked: true } };
export const Checking: Story = { args: { initial: { name: 'Abdul Karim', dob: '1984-03-12', nid: '0000004821' }, nidMasked: true, initialPhase: 'checking' } };
export const RecordMatched: Story = { args: { initial: { name: 'Abdul Karim', dob: '1984-03-12', nid: '0000004821' }, nidMasked: true, initialPhase: 'matched' } };

// Bangla versions of every state (axe runs on these too).
export const BanglaEmpty: Story = { ...Empty, ...bangla, name: 'বাংলা · Empty' };
export const BanglaValidationErrors: Story = { ...ValidationErrors, ...bangla, name: 'বাংলা · Validation Errors' };
export const BanglaNidMasked: Story = { ...NidMasked, ...bangla, name: 'বাংলা · Nid Masked' };
export const BanglaChecking: Story = { ...Checking, ...bangla, name: 'বাংলা · Checking' };
export const BanglaRecordMatched: Story = { ...RecordMatched, ...bangla, name: 'বাংলা · Record Matched' };
