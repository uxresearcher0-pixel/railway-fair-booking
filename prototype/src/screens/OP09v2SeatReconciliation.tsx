import { useState } from 'react';
import { ScreenShell } from '../components/ScreenShell';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { OpsContext } from '../components/OpsContext';
import { useActionFocus } from '../components/useActionFocus';
import { SEAT_PLAN, SEAT_STATES, UNEXPLAINED_SEAT, evening } from '../data/demo';
import { useT } from '../i18n/lang';

type Done = 'none' | 'case' | 'export';

export interface OP09v2Props {
  initialDone?: Done;
  focusHeading?: boolean;
}

/** Seats in all states together. Must equal the coach plan. */
export const seatsInStates = () => SEAT_STATES.reduce((sum, s) => sum + s.count, 0);

/**
 * OP09·v2 Every seat accounted for (operations, desktop-first). Each seat is in exactly one state and
 * every change has a record. A seat blocked just before the draw snapshot with no approval is flagged.
 */
export function OP09v2SeatReconciliation({ initialDone = 'none', focusHeading }: OP09v2Props) {
  const { t, num } = useT();
  const [done, setDone] = useState<Done>(initialDone);
  const { ref, acted } = useActionFocus([done]);
  const u = UNEXPLAINED_SEAT;
  const seat = t(`${u.coach}-${u.seat}`, `${u.coachBn}-${num(u.seat)}`);
  const unexplained = SEAT_STATES.find((s) => s.id === 'unexplained')!.count;
  const total = seatsInStates();
  const act = (d: Done) => {
    acted();
    setDone(d);
  };

  return (
    <ScreenShell
      screenId="OP09·v2"
      title={t('Every seat accounted for', 'প্রতিটি আসনের হিসাব')}
      lede={t(
        `Train ${evening.number} · ${evening.date} · ${evening.classCode}. Each seat must be in exactly one state, and every change has a record.`,
        `ট্রেন ${num(evening.number)} · ${evening.dateBn} · ${evening.classBn}। প্রতিটি আসন ঠিক একটি অবস্থায় থাকতে হবে, আর প্রতিটি পরিবর্তনের রেকর্ড থাকে।`,
      )}
      focusHeading={focusHeading}
      footer={
        <div className="footer-stack">
          <Button block icon="shield" onClick={() => act('case')} disabled={done === 'case'}>
            {t(`Open case for ${u.coach}-${u.seat}`, `${seat}-এর জন্য কেস খুলুন`)}
          </Button>
          <Button block variant="secondary" onClick={() => act('export')}>
            {t('Export reconciliation', 'হিসাব মেলানো এক্সপোর্ট করুন')}
          </Button>
        </div>
      }
    >
      <OpsContext code="OP09" />
      <p>
        <StatusPill tone="warning" icon="warning" srPrefix={t('Reconciliation:', 'হিসাব মেলানো:')}>
          {t(`${unexplained} seat to explain`, `${num(unexplained)}টি আসনের ব্যাখ্যা বাকি`)}
        </StatusPill>
      </p>

      <div ref={ref} tabIndex={-1} className="focus-target">
        {done === 'case' ? (
          <Notice tone="success" title={t(`Case opened for seat ${u.coach}-${u.seat}`, `আসন ${seat}-এর জন্য কেস খোলা হয়েছে`)}>
            {t(
              `It goes to the integrity team, independent of station management. Account ${u.by} is asked for the approval record.`,
              `কেসটি সততা দলের কাছে যাবে, যারা স্টেশন ব্যবস্থাপনা থেকে স্বাধীন। অ্যাকাউন্ট ${u.by}-এর কাছে অনুমোদনের রেকর্ড চাওয়া হবে।`,
            )}
          </Notice>
        ) : null}
        {done === 'export' ? (
          <Notice tone="success" title={t('Reconciliation exported (demo)', 'হিসাব মেলানো এক্সপোর্ট হয়েছে (ডেমো)')}>
            {t(`All ${SEAT_PLAN} seats with their state and the record behind each change.`, `${num(SEAT_PLAN)}টি আসনের অবস্থা ও প্রতিটি পরিবর্তনের রেকর্ড।`)}
          </Notice>
        ) : null}
      </div>

      <section className="card" aria-labelledby="op09-states">
        <h2 id="op09-states" className="section-title">
          {t('Seats by state', 'অবস্থা অনুযায়ী আসন')}
        </h2>
        <table className="cost">
          <caption className="visually-hidden">{t('Seats by state, adding up to the coach plan', 'অবস্থা অনুযায়ী আসন, যোগফল বগির পরিকল্পনার সমান')}</caption>
          <tbody>
            <tr className="is-plan">
              <th scope="row">{t('Coach plan', 'বগির পরিকল্পনা')}</th>
              <td className="mono">{num(SEAT_PLAN)}</td>
            </tr>
            {SEAT_STATES.map((s) => (
              <tr key={s.id} className={s.id === 'unexplained' ? 'is-flagged' : undefined}>
                <th scope="row">
                  {t(s.en, s.bn)}
                  {s.id === 'unexplained' ? <span className="cost__note">{t('Needs a record', 'রেকর্ড দরকার')}</span> : null}
                </th>
                <td className="mono">{num(s.count)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">
                {t('In all states', 'সব অবস্থায় মোট')}
                <span className="cost__note">
                  {total === SEAT_PLAN ? t('Matches the coach plan', 'বগির পরিকল্পনার সাথে মিলেছে') : t('Does not match the coach plan', 'বগির পরিকল্পনার সাথে মেলেনি')}
                </span>
              </th>
              <td className="mono">{num(total)}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      <section className="card panel--system" aria-labelledby="op09-explain">
        <div className="card__head">
          <h2 id="op09-explain" className="section-title">
            {t('To explain', 'ব্যাখ্যা বাকি')}
          </h2>
          <StatusPill tone="danger" icon="warning" srPrefix={t('Seat:', 'আসন:')}>
            {t('Unexplained', 'ব্যাখ্যাহীন')}
          </StatusPill>
        </div>
        <p className="big-answer mono">{seat}</p>
        <p>
          {t(`Blocked ${u.blockedAt} · no approval record · by account ${u.by}`, `আটকানো ${num(u.blockedAt)} · অনুমোদনের রেকর্ড নেই · অ্যাকাউন্ট ${u.by}`)}
        </p>
        <p className="small-note">{t('Seats removed just before the draw snapshot are flagged automatically.', 'ড্র-এর স্ন্যাপশটের ঠিক আগে সরানো আসন স্বয়ংক্রিয়ভাবে চিহ্নিত হয়।')}</p>
      </section>

      <section className="card" aria-labelledby="op09-checked">
        <h2 id="op09-checked" className="section-title">
          {t('Checked by', 'যাচাই করেছেন')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Integrity team', 'সততা দল')}</dt>
            <dd>{t('Independent of station management', 'স্টেশন ব্যবস্থাপনা থেকে স্বাধীন')}</dd>
          </div>
          <div>
            <dt>{t('Last run', 'শেষ রান')}</dt>
            <dd>{t(`${u.lastRun} · automatic`, `${num(u.lastRun)} · স্বয়ংক্রিয়`)}</dd>
          </div>
        </dl>
      </section>
    </ScreenShell>
  );
}
