import { useEffect, useRef, useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { useActionFocus } from '../components/useActionFocus';
import { TRAVELLER_PHONE_LAST2 } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'start' | 'sending' | 'sent' | 'counters';

export interface P25v2Props {
  initialPhase?: Phase;
  focusHeading?: boolean;
}

/**
 * P25·v2 Recover a ticket without the helper. At any counter with the traveller's own ID (the
 * accompanying adult for a child); the helper's phone is not needed. Or a code to the traveller's own phone.
 */
export function P25v2Recover({ initialPhase = 'start', focusHeading }: P25v2Props) {
  const { t, masked } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const { ref, acted } = useActionFocus([phase === 'sending' ? 'start' : phase]);
  const phone = `••${TRAVELLER_PHONE_LAST2}`;
  const phoneBn = masked(TRAVELLER_PHONE_LAST2);

  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => {
    acted();
    setPhase('sending');
    timer.current = setTimeout(() => setPhase('sent'), 600);
  };

  return (
    <ScreenShell
      screenId="P25·v2"
      title={t('Recover a ticket', 'টিকিট পুনরুদ্ধার')}
      lede={t('At any counter · no phone needed', 'যেকোনো কাউন্টারে · ফোন লাগবে না')}
      focusHeading={focusHeading}
      footer={
        <div className="footer-stack">
          <Button block icon="send" onClick={send} loading={phase === 'sending'} loadingLabel={t('Sending…', 'পাঠানো হচ্ছে…')}>
            {t('Send code to my phone', 'আমার ফোনে কোড পাঠান')}
          </Button>
          <Button
            block
            variant="secondary"
            onClick={() => {
              acted();
              setPhase('counters');
            }}
          >
            {t('Find a counter', 'কাউন্টার খুঁজুন')}
          </Button>
        </div>
      }
    >
      <div ref={ref} tabIndex={-1} className="focus-target">
        {phase === 'sent' ? (
          <Notice tone="success" title={t(`Code sent to the traveller’s own phone ${phone}`, `যাত্রীর নিজের ফোন ${phoneBn}-এ কোড পাঠানো হয়েছে`)}>
            {t('Enter it in the app to get the ticket back. The helper doesn’t get this code.', 'টিকিট ফিরে পেতে অ্যাপে কোডটি দিন। সাহায্যকারী এই কোড পান না।')}
          </Notice>
        ) : null}
        {phase === 'counters' ? (
          <Notice tone="info" title={t('Any station counter can help', 'যেকোনো স্টেশন কাউন্টার সাহায্য করতে পারে')}>
            {t('The counter list isn’t part of this prototype (demo).', 'কাউন্টারের তালিকা এই প্রোটোটাইপে নেই (ডেমো)।')}
          </Notice>
        ) : null}
      </div>

      <section className="card" aria-labelledby="p25-counter">
        <h2 id="p25-counter" className="section-title">
          {t('At any counter', 'যেকোনো কাউন্টারে')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Who can recover', 'কে পুনরুদ্ধার করতে পারেন')}</dt>
            <dd>{t('The traveller · accompanying adult for a child', 'যাত্রী নিজে · শিশুর ক্ষেত্রে সঙ্গী প্রাপ্তবয়স্ক')}</dd>
          </div>
          <div>
            <dt>{t('Bring', 'সাথে আনুন')}</dt>
            <dd>{t('NID, passport or birth registration', 'এনআইডি, পাসপোর্ট বা জন্মনিবন্ধন')}</dd>
          </div>
          <div>
            <dt>{t('Helper’s phone', 'সাহায্যকারীর ফোন')}</dt>
            <dd>
              <strong>{t('Not needed', 'লাগবে না')}</strong>
            </dd>
          </div>
        </dl>
        <p className="small-note">
          {t('Staff reissue the ticket to your own phone or paper. The old copy stops working.', 'কর্মী আপনার নিজের ফোনে বা কাগজে টিকিট পুনরায় ইস্যু করবেন। পুরনো কপি আর কাজ করবে না।')}
        </p>
      </section>

      <section className="card" aria-labelledby="p25-phone">
        <h2 id="p25-phone" className="section-title">
          {t('On your own phone', 'আপনার নিজের ফোনে')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Code sent to', 'কোড যাবে')}</dt>
            <dd>{t(`The traveller’s own phone ${phone}`, `যাত্রীর নিজের ফোন ${phoneBn}`)}</dd>
          </div>
        </dl>
        <p className="small-note">{t('Codes go to the traveller, not only to the phone that booked.', 'কোড যায় যাত্রীর কাছে, শুধু বুকিংয়ের ফোনে নয়।')}</p>
      </section>

      <Notice tone="info" live="off" title={t('Helper not reachable?', 'সাহায্যকারীকে পাওয়া যাচ্ছে না?')}>
        {t('You don’t need them. At the counter you can also remove their access.', 'তাঁকে লাগবে না। কাউন্টারে তাঁর প্রবেশাধিকারও সরাতে পারেন।')}
      </Notice>
    </ScreenShell>
  );
}
