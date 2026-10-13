import { ScreenShell } from '../components/ScreenShell';
import { AllowancePill } from '../components/AllowancePill';
import { Notice } from '../components/Notice';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { BOOKINGS_PER_DAY } from '../data/demo';

export function L1DailyLimit() {
  return (
    <ScreenShell
      screenId="L1"
      title="Daily limit reached"
      lede="You've used 2 of 2 bookings today (8 seats). Published terms: max 4 seats per booking and up to 2 bookings a day, the second for a different train or route. Eid rules can be stricter."
      backLabel="Back to search"
    >
      <AllowancePill used={BOOKINGS_PER_DAY} />

      <section className="card" aria-labelledby="l1-options">
        <h2 id="l1-options" className="section-title">
          What you can do
        </h2>
        <ol className="options">
          <li>
            <span className="options__icon">
              <Icon name="user" />
            </span>
            <div>
              <h3>Ask another traveller to buy</h3>
              <p>An adult traveller on the trip can buy from their own account, within their own daily allowance.</p>
              <Button variant="secondary">Invite a traveller</Button>
            </div>
          </li>
          <li>
            <span className="options__icon">
              <Icon name="clock" />
            </span>
            <div>
              <h3>Book tomorrow</h3>
              <p>Your allowance resets at midnight (time to confirm), if seats are still on sale.</p>
              <Button variant="secondary">Remind me tomorrow</Button>
            </div>
          </li>
          <li>
            <span className="options__icon">
              <Icon name="ticket" />
            </span>
            <div>
              <h3>Buy at a station counter</h3>
              <p>
                Staff check ID at the counter. Whether counter bookings count towards this limit is a rule to confirm.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <Notice tone="info" title="Cancelling doesn't give bookings back (proposed)" live="off">
        Cancelled or refunded bookings don't restore today's allowance. This stops the limit being reset by buying and
        cancelling.
      </Notice>
    </ScreenShell>
  );
}
