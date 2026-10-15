import { ScreenShell } from '../components/ScreenShell';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { Route, useTrip } from '../components/Route';
import { HOLD_PAUSE } from '../data/demo';
import { useT } from '../i18n/lang';

export interface H1v2Props {
  focusHeading?: boolean;
}

/**
 * H1·v2 Hold paused (proposed rule, values to confirm). After 3 holds on one train end unpaid on
 * the same day, new holds pause for 30 minutes. The waiting list is not affected.
 */
export function H1v2HoldPaused({ focusHeading }: H1v2Props) {
  const { t, num } = useT();
  const tr = useTrip();
  const { unpaidHolds, minutes, resumes } = HOLD_PAUSE;

  return (
    <ScreenShell
      screenId="H1·v2"
      title={t('Hold paused', 'হোল্ড সাময়িক বন্ধ')}
      lede={
        <>
          {t('Seat hold', 'আসন হোল্ড')} · <Route /> · {tr.train} · {tr.date}
        </>
      }
      focusHeading={focusHeading}
      footer={
        <div className="footer-stack">
          <a className="btn btn--primary btn--block" href="#/p24v2">
            {t('Join the waiting list', 'অপেক্ষমাণ তালিকায় যোগ দিন')}
          </a>
          <a className="btn btn--ghost btn--block" href="#/f01b">
            {t('Find another train', 'অন্য ট্রেন খুঁজুন')}
          </a>
        </div>
      }
    >
      <p>
        <StatusPill tone="warning" icon="info" srPrefix={t('Status:', 'অবস্থা:')}>
          {t('Proposed rule', 'প্রস্তাবিত নিয়ম')}
        </StatusPill>
      </p>

      <Notice tone="warning" live="off" title={t(`You can hold seats again at ${resumes}`, `${num(resumes)}-এ আবার আসন হোল্ড করতে পারবেন`)}>
        {t(
          `${unpaidHolds} holds on this train ended without payment today. To stop seats being blocked, new holds pause for ${minutes} minutes (rule to confirm).`,
          `আজ এই ট্রেনে ${num(unpaidHolds)}টি হোল্ড পরিশোধ ছাড়াই শেষ হয়েছে। আসন আটকে থাকা ঠেকাতে নতুন হোল্ড ${num(minutes)} মিনিট বন্ধ থাকবে (নিয়ম নিশ্চিত হবে)।`,
        )}
      </Notice>

      <section className="card" aria-labelledby="h1v2-why">
        <h2 id="h1v2-why" className="section-title">
          {t('Why', 'কেন')}
        </h2>
        <p>
          {t(
            'Holds that expire again and again keep seats away from other passengers. Each hold has a fixed end time, expired holds are recorded, and repeated patterns can be reviewed.',
            'বারবার মেয়াদ শেষ হওয়া হোল্ড অন্য যাত্রীদের থেকে আসন দূরে রাখে। প্রতিটি হোল্ডের নির্দিষ্ট শেষ সময় আছে, মেয়াদোত্তীর্ণ হোল্ড রেকর্ড হয়, এবং বারবার ঘটা ধরন পর্যালোচনা করা যায়।',
          )}
        </p>
        <p>
          <strong>{t('The waiting list is not affected.', 'অপেক্ষমাণ তালিকায় এর প্রভাব নেই।')}</strong>
        </p>
      </section>
    </ScreenShell>
  );
}
