# Development plan

Baseline: 8 October 2026, Asia/Dhaka. Owners and target dates are unassigned.

## Delivery sequence

| Phase | Work | Exit evidence |
|---|---|---|
| 1. Discovery | Validate railway booking rules, identity access, alternative documents, inventory channels, payments, refunds, standing entitlement and station operations | Reviewed policy matrix, integration map and pilot constraints |
| 2. UI design | Review ten initial screens; add exception states, Bangla copy, accessibility and counter/reviewer layouts | Screen/state map and recorded design decisions |
| 3. Interactive prototype | Implement mock journeys and run passenger/staff usability sessions | Task-completion observations, revised flows and agreed handoff |
| 4. Core engineering | Implement reservations, entitlement checks, payments, tickets, staff permissions and protected audit | Meaningful concurrency, integration, security and restore checks |
| 5. Supervised pilot | Train staff, run one approved route and evaluate baseline versus pilot outcomes | Measured queues, false refusals, resale reports, refund errors and operational exceptions |

## Initial UI prototype backlog

1. Establish React/TypeScript application structure, design tokens and reusable form components.
2. Build route search and results using fictional timetables.
3. Support self/relative booking and named passenger records.
4. Offer nearby seats for one to four travellers; show split availability clearly.
5. Simulate one fixed seat hold, expiry and return-to-search behavior.
6. Simulate successful, failed and pending payment; prevent misleading duplicate payment prompts.
7. Show individual tickets with a clearly labelled demo QR and print layout.
8. Show cancellation, late voluntary release and original-payer refund tracking.
9. Build staff ticket/person-check states: matched, needs review and unable to check.
10. Build invalid/cancelled/duplicate/offline ticket variants and incident receipts.
11. Build an independent review case with event history and passenger response.
12. Add Bangla copy, keyboard flow, visible focus, error feedback and accessible status updates.

Mock identity match, QR, payments, refund and scanning must be labelled as simulations. An uploaded photo or typed NID must never be labelled verified. Language toggles must work before being presented as functional.

## Important acceptance scenarios

- A nephew can book and print a ticket for an uncle without creating a passenger account.
- A child or adult without NID has an approved alternative or assistance route.
- A family sees the actual offered seats and consents before a split.
- Approved larger groups use one linked request, queue opportunity, expiry and checkout; they do not bypass allocation limits.
- An expired offer cannot complete as an active reservation without revalidation.
- A pending payment can be reconciled safely before another payment attempt.
- Cancellation identifies which passenger ticket is affected and where money returns.
- An offline check is provisional and cannot silently certify current cancellation status.
- Staff cannot change a cancelled ticket to active or approve their own waiver.
- Missing entry/onboard/exit events do not automatically establish guilt or justify resale.
- Open stations and intermediate boarding have a documented operational fallback.
- Checks never cause trains to wait for passenger attendance.

## Architecture proposal

Use a modular API for passenger records, journey/seat inventory, reservations, payments/refunds, ticket issuance, verification events and review cases.

PostgreSQL owns inventory and reservation transitions. Use database transactions, unique constraints and segment-aware locking to prevent double allocation. Payment callbacks and retries need idempotency and reconciliation. QR contains an opaque ticket reference and signed claims, not full identity data. Connected checks query current status; offline validation has documented freshness limits.

Authorized identity-service integration is a dependency, not an assumption. Keep identity-record matching separate from checking the person holding the ticket. Document aliases may be linked only when supported by reliable evidence.

## Restrictions and implementation needs

- Obtain approved identity-service access and data agreements before using real records.
- Confirm cancellation cutoffs, deductions, larger-group limits, safe travel permissions and agent settlement rules.
- Minimize displayed identity data and apply role-based access, retention and appeal procedures.
- Pilot staff need suitable camera devices, power, connectivity and offline procedures; managed existing phones may suffice.
- Gate hardware is optional and depends on a station survey. Software cannot prevent all unobserved physical boarding.
- Protected logs require separate access and independent review. Unrecorded collusion remains a gap.
- Prototype uses mock services; live implementation requires railway, payment and operational integrations.

## Validation and tracking

Target WCAG 2.2 AA. Check keyboard-only journeys, screen-reader feedback, touch targets, readable Bangla/English text and understandable recovery messages. Targets are not a certification claim.

Measure prototype task success and assistance needs. Establish a real baseline before claiming reductions in resale. Pilot measures include queue time, duplicate entitlement attempts, false rejection, refund errors, reported resale and recorded exceptions.

Track work in the project Slack channel. Each update includes task ID, status, owner, dependency, evidence and next action. Lists/Canvas are unavailable in the current workspace, so channel threads hold the checklist and documentation. No background monitoring is configured.
