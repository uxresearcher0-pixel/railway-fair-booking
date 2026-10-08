import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { INVITE_CODE, PACKAGE_A_SIZE, abdul, masked, packageB } from '../data/demo';

export type InviteStatus = 'draft' | 'sent' | 'joined' | 'declined';

export interface G2aProps {
  initialStatus?: InviteStatus;
  initialBuyerId?: string;
  focusHeading?: boolean;
  onNext?: () => void;
}

const statusPill: Record<Exclude<InviteStatus, 'draft'>, JSX.Element> = {
  sent: (
    <StatusPill tone="info" icon="send" srPrefix="Invite status:">
      Sent
    </StatusPill>
  ),
  joined: (
    <StatusPill tone="success" srPrefix="Invite status:">
      Joined
    </StatusPill>
  ),
  declined: (
    <StatusPill tone="danger" srPrefix="Invite status:">
      Declined
    </StatusPill>
  ),
};

export function G2aInvite({ initialStatus = 'draft', initialBuyerId, focusHeading, onNext }: G2aProps) {
  const [buyerId, setBuyerId] = useState<string | undefined>(initialBuyerId);
  const [status, setStatus] = useState<InviteStatus>(initialStatus);
  const [error, setError] = useState('');
  const buyer = packageB.find((t) => t.id === buyerId);
  const locked = status === 'sent' || status === 'joined';

  const send = () => {
    if (!buyer) {
      setError('Choose who will buy Package B.');
      document.getElementById('g2a-buyer-0')?.focus();
      return;
    }
    setError('');
    setStatus('sent');
  };

  return (
    <ScreenShell
      screenId="G2a"
      title="Invite Package B buyer"
      lede={`Group of 7: Package A (${PACKAGE_A_SIZE}) booked by ${abdul.name} + Package B (3). Each buyer can buy up to 4 tickets a day (rule to confirm).`}
      backLabel="Back to group travellers"
      focusHeading={focusHeading}
      footer={
        status === 'draft' || status === 'declined' ? (
          <Button block icon="send" onClick={send}>
            {status === 'declined' ? 'Send new invite' : 'Send invite'}
          </Button>
        ) : onNext ? (
          <Button block variant="secondary" iconAfter="arrow-right" onClick={onNext}>
            Open on {buyer?.name ?? 'buyer'}'s phone (demo)
          </Button>
        ) : undefined
      }
    >
      <fieldset className="card radio-list" aria-describedby={error ? 'g2a-error' : 'g2a-help'} disabled={locked}>
        <legend className="section-title">Who buys Package B?</legend>
        <p className="small-note" id="g2a-help">
          Only a Package B traveller can buy Package B. The buyer must be an adult.
        </p>
        {error ? (
          <p className="field__error" id="g2a-error">
            <Icon name="danger" size={18} />
            <span className="visually-hidden">Error: </span>
            {error}
          </p>
        ) : null}
        {packageB.map((t, i) => {
          const isChild = t.kind === 'child';
          const reasonId = `g2a-reason-${t.id}`;
          return (
            <label key={t.id} className={`radio-card ${buyerId === t.id ? 'is-checked' : ''} ${isChild ? 'is-disabled' : ''}`}>
              <input
                type="radio"
                name="buyer"
                id={`g2a-buyer-${i}`}
                value={t.id}
                checked={buyerId === t.id}
                disabled={isChild}
                aria-describedby={reasonId}
                aria-invalid={error ? true : undefined}
                onChange={() => {
                  setBuyerId(t.id);
                  setError('');
                }}
              />
              <span className="radio-card__main">
                <span className="radio-card__title">{t.name}</span>
                <span className="radio-card__meta" id={reasonId}>
                  {isChild
                    ? `Child traveller · ${t.idType} ${masked(t.idLast4)} · can't buy: buyers must be adults`
                    : `Traveller · NID ${masked(t.idLast4)} · NID-linked account`}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {buyer ? (
        <section className="card" aria-labelledby="g2a-invite">
          <div className="card__head">
            <h2 id="g2a-invite" className="section-title">
              Invite
            </h2>
            {status !== 'draft' ? statusPill[status] : null}
          </div>
          <dl className="kv">
            <div>
              <dt>Bound to</dt>
              <dd>
                {buyer.name}'s NID-linked account (NID {masked(buyer.idLast4)}). It can't be used by anyone else.
              </dd>
            </div>
            <div>
              <dt>Single-use code</dt>
              <dd>
                <span className="code-chip mono">
                  {INVITE_CODE}
                </span>
              </dd>
            </div>
            <div>
              <dt>Sent by</dt>
              <dd>In-app notification and SMS. The SMS has no payment link — {buyer.name.split(' ')[0]} pays in the app.</dd>
            </div>
          </dl>
          {status === 'sent' ? (
            <Notice tone="info" title={`Waiting for ${buyer.name} to join`}>
              No seats are held yet. Seats for both packages are held together once Package B has a buyer.
            </Notice>
          ) : null}
          {status === 'joined' ? (
            <Notice tone="success" title={`${buyer.name} joined as Package B buyer`}>
              Package B will be paid by {buyer.name}.
            </Notice>
          ) : null}
          {status === 'declined' ? (
            <Notice tone="warning" title={`${buyer.name} declined`}>
              Choose another adult Package B traveller, or reduce the group to 4.
            </Notice>
          ) : null}
        </section>
      ) : null}
    </ScreenShell>
  );
}
