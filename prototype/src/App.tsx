import { useEffect, useState, type ComponentType } from 'react';
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
import { LangProvider } from './i18n/lang';

const screens: { id: string; label: string; C: ComponentType }[] = [
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
];

const fromHash = () => {
  const id = window.location.hash.replace('#/', '');
  return screens.some((s) => s.id === id) ? id : 'flow';
};

export function App() {
  const [id, setId] = useState(fromHash);
  useEffect(() => {
    const on = () => setId(fromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const Screen = screens.find((s) => s.id === id)!.C;

  return (
    <LangProvider syncDocument>
      <nav className="proto-index" aria-label="Prototype screens">
        <label htmlFor="screen-picker">Screen</label>
        <select
          id="screen-picker"
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
      <Screen key={id} />
    </LangProvider>
  );
}
