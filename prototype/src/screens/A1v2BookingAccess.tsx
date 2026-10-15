import { useEffect, useRef, useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { ACCESS_RECORD, BOOKING_REF, OWN_PHONE_LAST2, abdul, helper } from '../data/demo';
import { useT } from '../i18n/lang';

type Phase = 'list' | 'confirm' | 'removed';

export interface A1v2Props {
  initialPhase?: Phase;
  focusHeading?: boolean;
}

/**
 * A1·v2 Who can act on my booking (and A1b·v2 record of the change).
 * The traveller has full access; a helper can only view and pay. The traveller can remove the helper.
 */
export function A1v2BookingAccess({ initialPhase = 'list', focusHeading }: A1v2Props) {
  const { t, num, name } = useT();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const moved = useRef(false);
  const confirmRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const helperName = name(helper);

  useEffect(() => {
    if (!moved.current) return;
    if (phase === 'confirm') confirmRef.current?.focus();
    if (phase === 'removed') doneRef.current?.focus();
    if (phase === 'list') document.getElementById('a1-remove')?.focus();
  }, [phase]);
  const go = (p: Phase) => {
    moved.current = true;
    setPhase(p);
  };

  const removed = phase === 'removed';

  return (
    <ScreenShell
      screenId={removed ? 'A1b·v2' : 'A1·v2'}
      title={t('Who can act on my booking', 'আমার বুকিংয়ে কে কী করতে পারেন')}
      lede={t(`Booking ${BOOKING_REF} · you are the traveller`, `বুকিং ${BOOKING_REF} · আপনি যাত্রী`)}
      focusHeading={focusHeading}
    >
      <section className="card" aria-labelledby="a1-people">
        <h2 id="a1-people" className="section-title">
          {t('People with access', 'যাঁদের অ্যাক্সেস আছে')}
        </h2>
        <ul className="people">
          <li>
            <span className="people__name">
              {name(abdul)} <span className="you-tag">{t('(you)', '(আপনি)')}</span>
            </span>
            <span className="people__meta">{t('Traveller · Booked by', 'যাত্রী · বুক করেছেন')}</span>
            <span>
              <StatusPill tone="accent" srPrefix={t('Access:', 'অ্যাক্সেস:')}>
                {t('Full access', 'পূর্ণ অ্যাক্সেস')}
              </StatusPill>
            </span>
          </li>
          {!removed ? (
            <li>
              <span className="people__name">{helperName}</span>
              <span className="people__meta">{t('Helper · can view the booking and pay. Can’t change travellers, cancel or receive codes.', 'সাহায্যকারী · বুকিং দেখতে ও পরিশোধ করতে পারেন। যাত্রী বদল, বাতিল বা কোড পাওয়া যায় না।')}</span>
              <span>
                <StatusPill tone="neutral" icon="user" srPrefix={t('Access:', 'অ্যাক্সেস:')}>
                  {t('View and pay', 'দেখা ও পরিশোধ')}
                </StatusPill>
              </span>
              {phase === 'list' ? (
                <span>
                  <Button id="a1-remove" variant="secondary" icon="x" onClick={() => go('confirm')}>
                    {t(`Remove ${helper.name}`, `${helperName}-কে সরান`)}
                  </Button>
                </span>
              ) : null}
            </li>
          ) : null}
        </ul>
      </section>

      {phase === 'confirm' ? (
        <div ref={confirmRef} tabIndex={-1} className="focus-target">
          <Notice
            tone="danger"
            title={t(`Remove ${helper.name} as helper?`, `${helperName}-কে সাহায্যকারী থেকে সরাবেন?`)}
            actions={
              <>
                <Button variant="danger" onClick={() => go('removed')}>
                  {t('Remove helper', 'সাহায্যকারী সরান')}
                </Button>
                <Button variant="secondary" onClick={() => go('list')}>
                  {t('Keep helper', 'সাহায্যকারী রাখুন')}
                </Button>
              </>
            }
          >
            {t(
              `${helper.name} will no longer see or pay for this booking. Your tickets stay valid and nothing else changes.`,
              `${helperName} আর এই বুকিং দেখতে বা পরিশোধ করতে পারবেন না। আপনার টিকিট বৈধ থাকে, আর কিছু বদলায় না।`,
            )}
          </Notice>
        </div>
      ) : null}

      {removed ? (
        <div ref={doneRef} tabIndex={-1} className="focus-target">
          <Notice tone="success" title={t(`${helper.name} removed · record ${ACCESS_RECORD}`, `${helperName}-কে সরানো হয়েছে · রেকর্ড ${ACCESS_RECORD}`)}>
            {t(
              `The change is recorded as ${ACCESS_RECORD}. Only you can act on ${BOOKING_REF} now.`,
              `পরিবর্তনটি ${ACCESS_RECORD} হিসেবে রেকর্ড করা হয়েছে। এখন শুধু আপনি ${BOOKING_REF}-এ কিছু করতে পারেন।`,
            )}
          </Notice>
        </div>
      ) : null}

      <Notice tone="info" live="off" title={t('Codes and SMS go to your own phone', 'কোড ও SMS আসে আপনার নিজের ফোনে')}>
        {t(
          `SMS about this booking goes to the traveller’s own phone ending ••${OWN_PHONE_LAST2}, never to a helper. Lost contact with your helper? Recover the booking at any station counter with your own NID.`,
          `এই বুকিংয়ের SMS যায় যাত্রীর নিজের ••${num(OWN_PHONE_LAST2)} নম্বরের ফোনে, কখনো সাহায্যকারীর কাছে নয়। সাহায্যকারীর সাথে যোগাযোগ নেই? নিজের এনআইডি দিয়ে যেকোনো স্টেশন কাউন্টারে বুকিং ফিরিয়ে নিন।`,
        )}
      </Notice>
    </ScreenShell>
  );
}
