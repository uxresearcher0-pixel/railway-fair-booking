import { OPS_ACCOUNT } from '../data/demo';
import { useT } from '../i18n/lang';

/** Context line for the operations back office (OP08–OP10): section code, signed-in account, session end. */
export function OpsContext({ code }: { code: string }) {
  const { t, num } = useT();
  return (
    <p className="staff-context">
      <span>
        {t('Operations & admin · back office, restricted', 'পরিচালনা ও প্রশাসন · ব্যাক অফিস, সীমিত প্রবেশ')} · <span lang="en" className="mono">{code}</span>
      </span>
      <span>
        {t('Signed in', 'সাইন ইন')} <span className="mono">{OPS_ACCOUNT.id}</span> · {t('2-step', `${num(2)}-ধাপ`)} ·{' '}
        {t(`session ends ${OPS_ACCOUNT.sessionEnds}`, `সেশন শেষ ${num(OPS_ACCOUNT.sessionEnds)}`)}
      </span>
    </p>
  );
}
