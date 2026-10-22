import type { Meta, StoryObj } from '@storybook/react';
import { SmsThread } from './SmsThread';
import { buildState, quickReplies } from '../sms/engine';

const failed = buildState('SM12');
const summary = buildState('SM06');

const meta = {
  title: 'Components/SmsThread',
  component: SmsThread,
  args: { messages: summary.messages, quickReplies: quickReplies(summary), onSend: () => {}, onRetry: () => {} },
  parameters: {
    viewport: { defaultViewport: 'mobile390' },
    docs: { description: { component: 'Phone Messages UI for the SMS simulation. role="log" with aria-live="polite": new messages are announced without moving focus. Sender label, alignment and border tell incoming from outgoing. Outgoing messages show Sent, Sending… or Not sent with Retry.' } },
  },
} satisfies Meta<typeof SmsThread>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = { name: 'Summary with SEND / EDIT / CANCEL' };
export const FailedSend: Story = { name: 'Failed send with Retry', args: { messages: failed.messages, quickReplies: quickReplies(failed) } };
export const BanglaSummary: Story = { name: 'Bangla · Summary', parameters: { lang: 'bn' } };
export const BanglaFailedSend: Story = { name: 'Bangla · Failed send', parameters: { lang: 'bn' }, args: { messages: failed.messages, quickReplies: quickReplies(failed) } };
