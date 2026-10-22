import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { GroupSteps } from '../components/GroupSteps';
import { useActionFocus } from '../components/useActionFocus';
import { GROUP_SIZE, GROUP_V2, evening } from '../data/demo';
import { packageTotal } from './G5v2EachPackagePays';
import { useT } from '../i18n/lang';

export interface G4v2Props {
  focusHeading?: boolean;
}

/**
 * G4·v2 Group tickets (DW12). Seven named tickets in coach GHA 1–7: Package A RF-7Q2K-48 and Package B
 * RF-7Q2K-49. Tickets keep the traveller's English name, as on their ID (lang="en"). Each package can be
 * managed only by its own travellers and payer.
 */
export function G4v2GroupTickets({ focusHeading }: G4v2Props) {
  const { t, num, taka } = useT();
  const [pdf, setPdf] = useState(false);
  const { ref, acted } = useActionFocus([pdf]);
  const coach = t(GROUP_V2.coach, GROUP_V2.coachBn);
  const a = packageTotal(GROUP_V2.packageA.length);
  const b = packageTotal(GROUP_V2.packageB.length);
  const tickets = [
    ...GROUP_V2.packageA.map((p) => ({ p, pkg: 'A' })),
    ...GROUP_V2.packageB.map((p) => ({ p, pkg: 'B' })),
  ];
  const when = `${num(evening.number)} · ${t(evening.date, evening.dateBn)} · ${num(GROUP_V2.departs)}`;

  return (
    <ScreenShell
      screenId="G4·v2"
      wide
      eyebrow={
        <>
          {t('Tickets issued', 'টিকিট ইস্যু হয়েছে')} · <span lang="en">{GROUP_V2.refA}</span> · <span lang="en">{GROUP_V2.refB}</span>
        </>
      }
      title={t('Group tickets', 'দলের টিকিট')}
      lede={t(
        `${GROUP_SIZE} named tickets. Each adult gets their own SMS receipt; each package can be managed only by its own travellers and payer.`,
        `নামসহ ${num(GROUP_SIZE)}টি টিকিট। প্রত্যেক প্রাপ্তবয়স্ক নিজের SMS রসিদ পান; প্রতিটি প্যাকেজ শুধু তার নিজের যাত্রী ও পরিশোধকারী পরিচালনা করতে পারেন।`,
      )}
      focusHeading={focusHeading}
    >
      <GroupSteps current="tickets" />
      <div className="split">
        <div className="split__main">
          <section aria-labelledby="g4v2-tickets" className="split__main">
            <h2 id="g4v2-tickets" className="visually-hidden">
              {t(`${GROUP_SIZE} named tickets`, `নামসহ ${num(GROUP_SIZE)}টি টিকিট`)}
            </h2>
            <ul className="tickets">
              {tickets.map(({ p, pkg }) => (
                <li key={p.id} className="ticket">
                  <span className="card__eyebrow">
                    {t(`Package ${pkg}`, `প্যাকেজ ${pkg}`)} · {coach}-{num(p.seat ?? '')}
                  </span>
                  <span className="ticket__name" lang="en">
                    {p.name}
                    {p.kind === 'child' ? ' (child)' : ''}
                  </span>
                  <span className="ticket__meta">{when}</span>
                </li>
              ))}
            </ul>
          </section>
          <Notice tone="success" live="off" title={t('Both packages paid', 'দুই প্যাকেজই পরিশোধিত')}>
            {t(
              `Package A ${taka(a.total)} · Package B ${taka(b.total)}. SMS receipts sent to each adult traveller.`,
              `প্যাকেজ A ${taka(a.total)} · প্যাকেজ B ${taka(b.total)}। প্রত্যেক প্রাপ্তবয়স্ক যাত্রীকে SMS রসিদ পাঠানো হয়েছে।`,
            )}
          </Notice>
        </div>

        <div className="split__side">
          <section className="card" aria-labelledby="g4v2-group">
            <h2 id="g4v2-group" className="card__eyebrow">
              {t('Group', 'দল')}
            </h2>
            <dl className="rows">
              <div>
                <dt>{t('Seats', 'আসন')}</dt>
                <dd>{t(`${GROUP_V2.coach} 1–${GROUP_SIZE}, together`, `${coach} ${num(1)}–${num(GROUP_SIZE)}, একসাথে`)}</dd>
              </div>
              <div>
                <dt>{t('Package A', 'প্যাকেজ A')}</dt>
                <dd className="mono" lang="en">
                  {GROUP_V2.refA}
                </dd>
              </div>
              <div>
                <dt>{t('Package B', 'প্যাকেজ B')}</dt>
                <dd className="mono" lang="en">
                  {GROUP_V2.refB}
                </dd>
              </div>
            </dl>
          </section>
          <div className="side-actions">
            <Button
              block
              icon="ticket"
              onClick={() => {
                acted();
                setPdf(true);
              }}
            >
              {t('Download all tickets (PDF)', 'সব টিকিট ডাউনলোড করুন (PDF)')}
            </Button>
            <a className="btn btn--secondary btn--block" href="#/a1v2">
              {t('Manage booking', 'বুকিং পরিচালনা করুন')}
            </a>
          </div>
          <div ref={ref} tabIndex={-1} className="focus-target">
            {pdf ? (
              <Notice tone="info" title={t('PDF download isn’t part of this prototype (demo)', 'PDF ডাউনলোড এই প্রোটোটাইপে নেই (ডেমো)')}>
                {t(`It would hold the ${GROUP_SIZE} tickets with each traveller’s English name, as on their ID.`, `এতে ${num(GROUP_SIZE)}টি টিকিট থাকবে, প্রত্যেক যাত্রীর ইংরেজি নামসহ, পরিচয়পত্রের মতো।`)}
              </Notice>
            ) : null}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
