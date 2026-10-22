import { ScreenShell } from '../components/ScreenShell';
import { Notice } from '../components/Notice';
import { StatusPill } from '../components/StatusPill';
import { AYESHA_AGE, BOOKING_REF, PAYMENT, abdul, ayesha, helper } from '../data/demo';
import { useT } from '../i18n/lang';

export interface F05v2Props {
  focusHeading?: boolean;
}

/**
 * F05·v2 Who does what. Separate roles on one booking: the traveller (a child), the accompanying adult,
 * the helper who booked, and the payer. The helper can book, pay and see the ticket, but only the
 * traveller or accompanying adult can cancel or change. A refund goes back to the account that paid.
 */
export function F05v2Roles({ focusHeading }: F05v2Props) {
  const { t, num, masked, name } = useT();
  const helperName = name(helper);
  const paidWith = `${t(PAYMENT.method, PAYMENT.methodBn)} ${masked(PAYMENT.last4)}`;
  const yes = (
    <StatusPill tone="success" icon="check" srPrefix={t('Helper:', 'সাহায্যকারী:')}>
      {t('Yes', 'হ্যাঁ')}
    </StatusPill>
  );

  return (
    <ScreenShell
      screenId="F05·v2"
      title={t('Who does what', 'কে কী করবেন')}
      lede={t(`For ${ayesha.name} (child), booked by a helper. Booking ${BOOKING_REF}.`, `${name(ayesha)}-এর (শিশু) জন্য, বুক করেছেন একজন সাহায্যকারী। বুকিং ${BOOKING_REF}।`)}
      focusHeading={focusHeading}
      footer={
        <a className="btn btn--primary btn--block" href="#/a1v2">
          {t('Continue', 'এগিয়ে যান')}
        </a>
      }
    >
      <section className="card" aria-labelledby="f05-roles">
        <h2 id="f05-roles" className="section-title">
          {t('Roles on this booking', 'এই বুকিংয়ে ভূমিকা')}
        </h2>
        <dl className="kv">
          <div>
            <dt>{t('Traveller', 'যাত্রী')}</dt>
            <dd>{t(`${ayesha.name} · child, ${AYESHA_AGE}`, `${name(ayesha)} · শিশু, ${num(AYESHA_AGE)}`)}</dd>
          </div>
          <div>
            <dt>{t('Accompanying adult', 'সঙ্গী প্রাপ্তবয়স্ক')}</dt>
            <dd>{name(abdul)}</dd>
          </div>
          <div>
            <dt>{t('Booked by (helper)', 'বুক করেছেন (সাহায্যকারী)')}</dt>
            <dd>{helperName}</dd>
          </div>
          <div>
            <dt>{t('Paid by', 'পরিশোধ করেছেন')}</dt>
            <dd>
              {helperName} · {paidWith}
            </dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="f05-can">
        <h2 id="f05-can" className="section-title">
          {t('What the helper can do', 'সাহায্যকারী যা করতে পারেন')}
        </h2>
        <table className="rights">
          <caption className="visually-hidden">{t(`What ${helper.name} can do on this booking`, `এই বুকিংয়ে ${helperName} যা করতে পারেন`)}</caption>
          <tbody>
            <tr>
              <th scope="row">{t('Book and pay', 'বুক ও পরিশোধ')}</th>
              <td>{yes}</td>
            </tr>
            <tr>
              <th scope="row">{t('See the ticket', 'টিকিট দেখা')}</th>
              <td>{yes}</td>
            </tr>
            <tr>
              <th scope="row">{t('Cancel or change', 'বাতিল বা পরিবর্তন')}</th>
              <td>
                <StatusPill tone="danger" icon="x" srPrefix={t('Helper:', 'সাহায্যকারী:')}>
                  {t('No — traveller or accompanying adult only', 'না — শুধু যাত্রী বা সঙ্গী প্রাপ্তবয়স্ক')}
                </StatusPill>
              </td>
            </tr>
            <tr>
              <th scope="row">{t('Refund goes to', 'ফেরতের টাকা যাবে')}</th>
              <td>{t('The account that paid', 'যে অ্যাকাউন্ট থেকে পরিশোধ হয়েছে')}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <Notice tone="info" live="off" title={t('The ticket stays the traveller’s', 'টিকিট যাত্রীরই থাকে')}>
        {t(
          'A helper can’t change the traveller, take over the ticket or move a refund to another account. The traveller can remove the helper at any time, in the app or at any counter.',
          'সাহায্যকারী যাত্রী বদলাতে, টিকিট নিজের করে নিতে বা ফেরতের টাকা অন্য অ্যাকাউন্টে সরাতে পারেন না। যাত্রী যেকোনো সময় অ্যাপে বা যেকোনো কাউন্টারে সাহায্যকারীকে সরাতে পারেন।',
        )}
      </Notice>
    </ScreenShell>
  );
}
