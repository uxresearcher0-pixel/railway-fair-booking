# Pilot validation plan: throughput and effectiveness

Design work can't prove that three checks (entry, onboard, exit) fit peak crowds, or that the controls reduce black marketing without refusing honest travellers. This plan defines how a supervised pilot would measure both. No prevention percentage is claimed until these numbers exist.

## Questions

1. Can the entry gate handle peak boarding without trains leaving with travellers still queuing?
2. Can a TT check a full coach before the next major stop?
3. Can the exit gate clear an arriving train without unsafe crowding?
4. Do the controls reduce resold and misused tickets?
5. How many honest travellers are wrongly refused or delayed?

## Pilot setup

- **Stations:** one large (e.g. Kamalapur) and one medium station. Choose one route with high demand and one ordinary route.
- **Comparison:** similar trains on the same days without the new checks.
- **Duration:** at least 4 weeks, including one peak period (weekend or holiday).
- **Independence:** an inspection team that doesn't work at the pilot stations collects the measures below.

## Throughput measures

| Measure | How | Target to discuss |
|---|---|---|
| Time per entry check | Timestamp from scan to saved decision (EG02 → EG04) | Median under 12 s; 95th percentile under 30 s |
| Gate capacity | Checks per guard per hour at peak | Enough for the busiest train: e.g. 900 people over 30 min boarding needs about 3–4 guards at 12 s |
| Queue length and wait | Count people in the queue every 2 min; sample individual waits | Nobody misses a train because of the queue |
| TT coach coverage | Share of passengers checked before the first major stop | 90% or more |
| Exit clearance | Minutes to clear an arriving train; how often exception EX04 is used | Exception rare and always recorded |
| Offline share | Share of checks made offline or provisional | Tracked; high values trigger a connectivity fix |
| Desk wait | Time from referral to decision (DK01) | Under 15 min; departing travellers seen in time |

## Effectiveness measures

Counts of alerts or detections alone don't show the true fraud rate. Use independent samples.

| Measure | How |
|---|---|
| Verified misuse per 10,000 tickets | Independent inspectors re-check a random sample of travellers (ticket + ID) on pilot and comparison trains |
| Resale price signal | Observed prices in known resale channels for pilot vs comparison trains |
| Duplicate incompatible use | Confirmed cases from review (RV) |
| Identity-misuse complaints | P20 reports and outcomes |
| Unexplained allocation changes | Reconciliation of quota and seat changes (ops) |
| Staff overrides and exceptions | Rates per staff member and station; sampled in the accountability loop |

## Harm measures (false refusals)

| Measure | How |
|---|---|
| Wrong refusals | Desk and review cases decided in the traveller's favour |
| Missed trains caused by checks | Traveller survey + desk records |
| Appeals and outcomes | RV decisions, time to decision |
| Groups affected | Children, older travellers, people without smartphones, shared-phone families |
| Refund completion | Share of refunds received, time to receive |

## Decision rules after the pilot

- **Expand** only if throughput targets are met at peak, verified misuse falls compared with control trains, and wrong refusals stay low.
- **Adjust** if one checkpoint causes most delay (e.g. make exit sampling-based at some stations by an approved rule), then re-test.
- **Stop** a control if it causes harm without measurable benefit.

Publish the results, including what didn't work.
