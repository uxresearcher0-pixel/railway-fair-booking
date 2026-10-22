import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { INVITE_CODE, PACKAGE_A_SIZE, abdul, packageB } from '../data/demo';
import { useT } from '../i18n/lang';

export type InviteStatus = 'draft' | 'sent' | 'joined' | 'declined';

export interface G2aProps {
  initialStatus?: InviteStatus;
  initialBuyerId?: string;
  focusHeading?: boolean;
  onNext?: () => void;
}

export function G2aInvite({ initialStatus = 'draft', initialBuyerId, focusHeading, onNext }: G2aProps) {
  const { bn, t, num, masked, name } = useT();
  const [buyerId, setBuyerId] = useState<string | undefined>(initialBuyerId);
  const [status, setStatus] = useState<InviteStatus>(initialStatus);
  const [error, setError] = useState(false);
  const buyer = packageB.find((tr) => tr.id === buyerId);
  const locked = status === 'sent' || status === 'joined';
  const sr = t('Invite status:', 'আমন্ত্রণের অবস্থা:');
  const statusPill: Record<Exclude<InviteStatus, 'draft'>, JSX.Element> = {
    sent: (
      <StatusPill tone="info" icon="send" srPrefix={sr}>
        {t('Sent', 'পাঠানো হয়েছে')}
      </StatusPill>
    ),
    joined: (
      <StatusPill tone="success" srPrefix={sr}>
        {t('Joined', 'যোগ দিয়েছেন')}
      </StatusPill>
    ),
    declined: (
      <StatusPill tone="danger" srPrefix={sr}>
        {t('Declined', 'প্রত্যাখ্যান করেছেন')}
      </StatusPill>
    ),
  };

  const send = () => {
    if (!buyer) {
      setError(true);
      document.getElementById('g2a-buyer-0')?.focus();
      return;
    }
    setError(false);
    setStatus('sent');
  };

  const buyerName = buyer ? name(buyer) : '';

  return (
    <ScreenShell
      screenId="G2a"
      title={t('Invite Package B buyer', 'প্যাকেজ B-এর ক্রেতাকে আমন্ত্রণ')}
      lede={
        bn
          ? `৭ জনের দল = প্যাকেজ A (${num(PACKAGE_A_SIZE)} জন, বুক করেছেন ${name(abdul)}) + প্যাকেজ B (${num(packageB.length)} জন)। একই ট্রেনে দ্বিতীয় বুকিং করা যায় না, তাই প্যাকেজ B-তে যাতায়াতকারী একজন প্রাপ্তবয়স্ক সেটি অ্যাপে কিনবেন, অথবা যেকোনো স্টেশন কাউন্টারে এনআইডি ও কোড ${INVITE_CODE} দিয়ে যোগ দেবেন।`
          : `A group of 7 is Package A (${PACKAGE_A_SIZE}, booked by ${abdul.name}) + Package B (${packageB.length}). A second booking on the same train isn't allowed, so an adult travelling in Package B buys it in the app, or joins at any station counter with their NID and code ${INVITE_CODE}.`
      }
      backLabel={t('Back to group travellers', 'দলের যাত্রীদের তালিকায় ফিরে যান')}
      focusHeading={focusHeading}
      footer={
        status === 'draft' || status === 'declined' ? (
          <Button block icon="send" onClick={send}>
            {status === 'declined' ? t('Send new invite', 'নতুন আমন্ত্রণ পাঠান') : t('Send invite', 'আমন্ত্রণ পাঠান')}
          </Button>
        ) : onNext ? (
          <Button block variant="secondary" iconAfter="arrow-right" onClick={onNext}>
            {bn ? `${buyer ? buyerName : 'ক্রেতা'}-এর ফোনে খুলুন (ডেমো)` : `Open on ${buyer?.name ?? 'buyer'}'s phone (demo)`}
          </Button>
        ) : undefined
      }
    >
      <fieldset className="card radio-list" aria-describedby={error ? 'g2a-error' : 'g2a-help'} disabled={locked}>
        <legend className="section-title">{t('Who buys Package B?', 'প্যাকেজ B কে কিনবেন?')}</legend>
        <p className="small-note" id="g2a-help">
          {t('Only a Package B traveller can buy Package B. The buyer must be an adult.', 'শুধু প্যাকেজ B-এর একজন যাত্রী প্যাকেজ B কিনতে পারেন। ক্রেতাকে প্রাপ্তবয়স্ক হতে হবে।')}
        </p>
        {error ? (
          <p className="field__error" id="g2a-error">
            <Icon name="danger" size={18} />
            <span className="visually-hidden">{t('Error: ', 'ত্রুটি: ')}</span>
            {t('Choose who will buy Package B.', 'প্যাকেজ B কে কিনবেন তা বেছে নিন।')}
          </p>
        ) : null}
        {packageB.map((tr, i) => {
          const isChild = tr.kind === 'child';
          const reasonId = `g2a-reason-${tr.id}`;
          return (
            <label key={tr.id} className={`radio-card ${buyerId === tr.id ? 'is-checked' : ''} ${isChild ? 'is-disabled' : ''}`}>
              <input
                type="radio"
                name="buyer"
                id={`g2a-buyer-${i}`}
                value={tr.id}
                checked={buyerId === tr.id}
                disabled={isChild}
                aria-describedby={reasonId}
                aria-invalid={error ? true : undefined}
                onChange={() => {
                  setBuyerId(tr.id);
                  setError(false);
                }}
              />
              <span className="radio-card__main">
                <span className="radio-card__title">{name(tr)}</span>
                <span className="radio-card__meta" id={reasonId}>
                  {isChild
                    ? t(`Child traveller · ${tr.idType} ${masked(tr.idLast4)} · can't buy: buyers must be adults`, `শিশু যাত্রী · জন্মনিবন্ধন ${masked(tr.idLast4)} · কিনতে পারবে না: ক্রেতাকে প্রাপ্তবয়স্ক হতে হবে`)
                    : t(`Traveller · NID ${masked(tr.idLast4)} · NID-linked account`, `যাত্রী · এনআইডি ${masked(tr.idLast4)} · এনআইডি-যুক্ত অ্যাকাউন্ট`)}
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
              {t('Invite', 'আমন্ত্রণ')}
            </h2>
            {status !== 'draft' ? statusPill[status] : null}
          </div>
          <dl className="kv">
            <div>
              <dt>{t('Bound to', 'যার সাথে যুক্ত')}</dt>
              <dd>
                {t(`${buyer.name}'s NID-linked account (NID ${masked(buyer.idLast4)}). It can't be used by anyone else.`, `${buyerName}-এর এনআইডি-যুক্ত অ্যাকাউন্ট (এনআইডি ${masked(buyer.idLast4)})। অন্য কেউ এটি ব্যবহার করতে পারবেন না।`)}
              </dd>
            </div>
            <div>
              <dt>{t('Single-use code', 'একবার ব্যবহারের কোড')}</dt>
              <dd>
                <span className="code-chip mono">{INVITE_CODE}</span>
              </dd>
            </div>
            <div>
              <dt>{t('Sent by', 'যেভাবে পাঠানো হয়')}</dt>
              <dd>
                {t(`In-app notification and SMS. The SMS has no payment link — ${buyer.name.split(' ')[0]} pays in the app.`, `অ্যাপের নোটিফিকেশন ও SMS। SMS-এ কোনো পরিশোধের লিংক থাকে না — ${buyerName.split(' ')[0]} অ্যাপে পরিশোধ করবেন।`)}
              </dd>
            </div>
          </dl>
          {status === 'sent' ? (
            <Notice tone="info" title={t(`Waiting for ${buyer.name} to join`, `${buyerName}-এর যোগ দেওয়ার অপেক্ষায়`)}>
              {t('No seats are held yet. Seats for both packages are held together once Package B has a buyer.', 'এখনও কোনো আসন হোল্ড হয়নি। প্যাকেজ B-এর ক্রেতা পাওয়া গেলে দুই প্যাকেজের আসন একসাথে হোল্ড হবে।')}
            </Notice>
          ) : null}
          {status === 'joined' ? (
            <Notice tone="success" title={t(`${buyer.name} joined as Package B buyer`, `${buyerName} প্যাকেজ B-এর ক্রেতা হিসেবে যোগ দিয়েছেন`)}>
              {t(`Package B will be paid by ${buyer.name}.`, `প্যাকেজ B-এর টাকা দেবেন ${buyerName}।`)}
            </Notice>
          ) : null}
          {status === 'declined' ? (
            <Notice tone="warning" title={t(`${buyer.name} declined`, `${buyerName} প্রত্যাখ্যান করেছেন`)}>
              {t('Choose another adult Package B traveller, or reduce the group to 4.', 'প্যাকেজ B-এর অন্য একজন প্রাপ্তবয়স্ক যাত্রী বেছে নিন, অথবা দল ৪ জনে কমিয়ে আনুন।')}
            </Notice>
          ) : null}
        </section>
      ) : null}
    </ScreenShell>
  );
}
