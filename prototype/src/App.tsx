import { useEffect, useRef, useState, type ComponentType } from 'react';
import { F03Travellers } from './screens/F03Travellers';
import { F04aAddTraveller } from './screens/F04aAddTraveller';
import { G2aInvite } from './screens/G2aInvite';
import { G2bJoin } from './screens/G2bJoin';
import { G5PayPackageB } from './screens/G5PayPackageB';
import { L1DailyLimit } from './screens/L1DailyLimit';
import { S02StaffCheck } from './screens/S02StaffCheck';
import { AppFlow } from './screens/AppFlow';
import { F01bStationTo } from './screens/F01bStationTo';
import { G3aChooseCoach } from './screens/G3aChooseCoach';
import { G3bWhereInCoach } from './screens/G3bWhereInCoach';
import { G3CustomiseSeats } from './screens/G3CustomiseSeats';
import { Home } from './screens/Home';
import { ApplyFlowV2 } from './screens/ApplyFlowV2';
import { P21v2ApplyDraw } from './screens/P21v2ApplyDraw';
import { P22v2Offer } from './screens/P22v2Offer';
import { P10v2OfficialTotal } from './screens/P10v2OfficialTotal';
import { R3v2ReportCharge } from './screens/R3v2ReportCharge';
import { A1v2BookingAccess } from './screens/A1v2BookingAccess';
import { LangProvider, useT } from './i18n/lang';

export const screens: { id: string; label: string; C: ComponentType }[] = [
  { id: 'home', label: 'Home · journeys by role', C: Home },
  { id: 'flow', label: 'App flow · G2a → G2b → G3a → G3b → G5', C: AppFlow },
  { id: 'f01b', label: 'F01b Station picker · to', C: F01bStationTo },
  { id: 'f03', label: 'F03 Travellers & class', C: F03Travellers },
  { id: 'f04a', label: 'F04a Add traveller · NID', C: F04aAddTraveller },
  { id: 'g2a', label: 'G2a Invite Package B buyer', C: G2aInvite },
  { id: 'g2b', label: 'G2b Join Package B', C: G2bJoin },
  { id: 'g3a', label: 'G3a Choose a coach · 7 together', C: G3aChooseCoach },
  { id: 'g3b', label: 'G3b Where in the coach · 7 together', C: G3bWhereInCoach },
  { id: 'g3', label: 'G3 Customise seats · 7 together', C: G3CustomiseSeats },
  { id: 'g5', label: 'G5 Pay for Package B', C: G5PayPackageB },
  { id: 'l1', label: 'L1 Daily limit reached', C: L1DailyLimit },
  { id: 's02', label: 'S02 Staff check a ticket', C: S02StaffCheck },
  { id: 'apply-v2', label: 'v2 flow · P21 → P22 → P10 (→ R3)', C: ApplyFlowV2 },
  { id: 'p21v2', label: 'P21·v2 Apply for the draw', C: P21v2ApplyDraw },
  { id: 'p22v2', label: 'P22·v2 Picked · pay by 11:00', C: P22v2Offer },
  { id: 'p10v2', label: 'P10·v2 Official total', C: P10v2OfficialTotal },
  { id: 'r3v2', label: 'R3·v2 Report an extra charge', C: R3v2ReportCharge },
  { id: 'a1v2', label: 'A1·v2 Who can act on my booking', C: A1v2BookingAccess },
];

const fromHash = () => {
  const id = window.location.hash.replace('#/', '');
  return screens.some((s) => s.id === id) ? id : 'home';
};

export function App() {
  const [id, setId] = useState(fromHash);
  useEffect(() => {
    const on = () => setId(fromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const Screen = screens.find((s) => s.id === id)!.C;
  // After a route change, move focus to the new screen's h1 (not on first load).
  const shown = useRef(id);
  useEffect(() => {
    if (shown.current === id) return;
    shown.current = id;
    document.querySelector<HTMLElement>('main h1')?.focus();
  }, [id]);

  return (
    <LangProvider syncDocument>
      <ProtoIndex id={id} />
      <Screen key={id} />
    </LangProvider>
  );
}

/** App-level nav (outside the screens, so stories are unaffected): Home link and the screen picker. */
function ProtoIndex({ id }: { id: string }) {
  const { t, lang } = useT();
  return (
    <nav className="proto-index" aria-label={t('Prototype screens', 'প্রোটোটাইপের স্ক্রিন')} lang={lang}>
      {id !== 'home' ? (
        <a className="proto-index__home" href="#/home">
          {t('Home', 'হোম')}
        </a>
      ) : null}
      <label htmlFor="screen-picker">{t('Screen', 'স্ক্রিন')}</label>
      <select
        id="screen-picker"
        lang="en"
        value={id}
        onChange={(e) => {
          window.location.hash = `/${e.target.value}`;
        }}
      >
        {screens.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </nav>
  );
}
