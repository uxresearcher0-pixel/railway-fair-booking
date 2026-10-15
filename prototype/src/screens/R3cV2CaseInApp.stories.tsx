import type { Meta, StoryObj } from '@storybook/react';
import { R3cV2CaseInApp } from './R3cV2CaseInApp';
import { bangla, desktop, screenParams } from './Screens.stories.helpers';

const meta = {
  title: 'Screens v2/R3c·v2 Report OC-2207 in the app',
  component: R3cV2CaseInApp,
  parameters: {
    ...screenParams,
    docs: { description: { component: 'Fair access v2 (proposed). The same case OC-2207 the SMS demo created, source SMS: reported total ৳2,500, official total ৳1,520, reported excess ৳980. Status timeline (timing proposed), optional evidence, ticket stays valid. SMS and app never create duplicate cases.' } },
  },
} satisfies Meta<typeof R3cV2CaseInApp>;
export default meta;
type Story = StoryObj<typeof meta>;

export const UnderReview: Story = { name: 'Under review' };
export const MoreInfo: Story = { name: 'More information requested', args: { stage: 'info' } };
export const Resolved: Story = { name: 'Resolved', args: { stage: 'resolved' } };
export const Evidence: Story = { name: 'Add evidence (demo message)', args: { initialEvidence: true } };
export const Desktop: Story = { ...desktop, tags: ['desktop'], name: 'Desktop · Under review' };

export const BanglaUnderReview: Story = { ...bangla, name: 'বাংলা · Under review' };
export const BanglaMoreInfo: Story = { ...bangla, name: 'বাংলা · More information requested', args: { stage: 'info' } };
export const BanglaResolved: Story = { ...bangla, name: 'বাংলা · Resolved', args: { stage: 'resolved' } };
export const BanglaEvidence: Story = { ...bangla, name: 'বাংলা · Add evidence', args: { initialEvidence: true } };
