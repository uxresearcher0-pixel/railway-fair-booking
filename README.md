# Railway Fair Booking

A design-first proposal for simpler railway booking, passenger-bound tickets and accountable verification.

**Stage:** planning and initial UI design. This repository does not yet contain a working application. This is an independent concept, not an official Bangladesh Railway service.

## Project links

- [Figma UI v0.1](https://www.figma.com/design/3Jb4jMo27Pi6N4gncIPPJK)
- [Development roadmap](docs/development-plan.md)
- Project activity, detailed documentation and task tracking are maintained in the private Slack channel `railway-fair-booking`.

## Passenger experience

Buy for yourself or someone else, request nearby family seats, pay, and save or print a named ticket. Buyer, passenger and payer are separate roles. Passengers do not need a new rail card or their own app account.

The initial design covers Search, Results, Passengers, Seat Offer, Payment, Ticket, Cancellation, Verification, Incident and Review Inbox.

## Proposed controls

- Atomic seat-segment reservations with fixed expiry.
- One active entitlement per passenger for overlapping travel on the same train, subject to reliable identity resolution.
- Safe payment retries and refunds to the original payment source.
- Signed QR tickets checked against current ticket status.
- Separate identity-record matching, person checking and travel-event statuses.
- Restricted staff actions, official receipts, recorded exceptions and independent review.

A QR does not prove the holder's identity. Missing scans do not prove misconduct. Fines do not automatically create a seat or permission to travel. Train departures must not wait for verification.

## First implementation milestone

Build an accessible responsive UI prototype with fictional data and simulated booking states. Government identity access, real payments and operational verification are later integration gates.

Proposed stack: React + TypeScript for the UI, Django REST for the API, PostgreSQL for authoritative reservations. Redis may support cache and jobs; it is not the seat authority. Confirm integration constraints before committing to the production stack.

## Boundaries

No effectiveness percentage or elimination of resale is promised. Approved identity alternatives, refund rules, larger-group limits, privacy controls and pilot operations require validation. Blockchain, compulsory biometrics and nationwide entry/exit gates are outside the initial scope.

Use fictional data during design and prototyping. Never commit real identity records, passenger photos, payment details, credentials or production exports.
