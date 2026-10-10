# Gap response and revised requirements

Revision: 11 October 2026, Asia/Dhaka.
Status: requirements specified; implementation and validation pending.
This revision supersedes conflicting assumptions in the initial design and project documentation. It does not establish vulnerabilities in Bangladesh Railway's backend.

## Evidence boundary

The public review observed booking-window and published policy text. Multiple-identity use, identity misuse and insider information were described in public reporting; historical reports do not prove current exploitability. Bots, hold abuse and backend authorization weaknesses remain audit hypotheses. No penetration testing was performed.

Sources:
- https://eticket.railway.gov.bd/terms-and-conditions
- https://bdnews24.com/bangladesh/cdee20f486c6
- https://www.jugantor.com/tp-bangla-face/1004764
- https://bdnews24.com/bangladesh/13mv71uohc
- https://api-security.owasp.org/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/

## Work register

| ID | Priority | Deliverable | Current status | Dependency |
|---|---|---|---|---|
| G01 | P0 | Versioned booking/refund policy matrix | Specified; approval pending | Railway policy owner |
| G02 | P0 | Identity misuse, assisted consent and account recovery | Specified; integration blocked | Authorized identity service and trained reviewers |
| G03 | P0 | Official released-seat allocation and access controls | Specified; algorithm validation pending | Approved allocation/group policy |
| G04 | P1 | Cross-channel entitlement and proportionate abuse review | Specified; implementation pending | Unified inventory and identity resolution |
| G05 | P1 | Staff permission/exception matrix and independent review | Specified; operational approval pending | Independent reviewer and pilot sponsor |
| G06 | P1 | Assisted purchase, receipts and agent settlement | Specified; operating model pending | Authorized assistance/payment partners |
| G07 | P1 | Updated UI states and usability evidence | Backlog | G01-G06 review |
| G08 | P1 | Authorized audit and pilot measurement | Blocked | Staging/test authorization and pilot access |

P0 means a prerequisite for truthful policy/identity/allocation design, not a claim of a critical live vulnerability. Owners and dates remain unassigned.

## G01 — Current policy and configuration

The public terms inspected on 11 October state four seats per transaction and up to two transactions/eight seats per day, subject to different trains, origins and destinations. Eid-specific rules differ and have dated applicability.

Ordinary domestic refund bands describe BDT 40 or the stated percentage, whichever is greater:
- 48+ hours: 10%.
- Below 48 and above 24 hours: 25%.
- Below 24 and above 12 hours: 50%.
- Below 12 and above 6 hours: 75%.
- Below 6 hours: no refund.
Online service charges are non-refundable. Boundary times, charges, eligible services and exceptions require authoritative clarification. Never infer a exact-boundary rule from ambiguous wording.

The original proposed no-refund-below-24-hours design is withdrawn as the default baseline. It can only return as a clearly approved alternative policy. Larger linked groups are not an entitlement to bypass current limits.

Store a policy version with effective start/end, applicable train/service/journey dates, timezone, purchase caps, group rules, refund bands, fees and special exceptions. Compute cutoffs using the relevant scheduled departure and a server clock. Preserve the policy version and quote applied to a booking; subsequent policy changes follow approved transition rules. Show payer destination, deductions, expected timing and cancellation confirmation before action. Refund failure must not silently reactivate a cancelled ticket.

Acceptance:
- Applicable dated Eid rules do not apply outside their approved period.
- All cutoff boundaries and grace/exception cases have approved expected outcomes.
- Counter and online enforce the same approved cap.
- Four plus three requests cannot bypass a cap through linked checkout.
- A refund quote is traceable to the policy version and original payer.

## G02 — Identity misuse, consent and recovery

Keep buyer, passenger and payer separate. Ordinary assistance never requires giving a helper the passenger's password or OTP. Government-record match, consent evidence and person check have separate statuses.

Assisted booking flow:
1. Buyer selects "Book for someone else" and enters/reuses minimum passenger information.
2. Approved service returns record-match status; absent service means pending/assisted review, never verified.
3. Apply the approved consent route. A reachable passenger may confirm by a suitable channel; passengers without phones have a trained-counter alternative. Minors use approved guardian documentation. Do not mandate passenger OTP for everyone.
4. Record who assisted, verification method, scope and time without retaining unnecessary documents.
5. Person verification at travel remains separate.

Misuse/recovery flow:
1. Passenger reports "My identity was used" using an accessible public assistance route.
2. System returns a case reference without exposing account details or confirming account existence to an unverified claimant.
3. Independent reviewer verifies ownership using authorized evidence and assisted alternatives. A copied NID or newly supplied mobile alone cannot transfer ownership.
4. If justified, secure the affected account, revoke compromised sessions and correct contact access. Keep an audited decision and notify appropriate verified contacts.
5. Review affected bookings individually; a complaint alone does not cancel all tickets or block a passenger's journey.
6. Provide appeal, receipt, status and assistance. Deadlines require an agreed service standard.

Do not merge NID and birth-registration identities merely because names match. Link only proven document aliases. Unresolved identity uniqueness remains a gap. Encrypt necessary identifiers, restrict access and log evidence views. Mask identity information in operational screens.

Acceptance:
- A nephew can assist an uncle without the uncle using an app account.
- A person without a phone has a documented assisted route.
- A false claimant cannot take over an account with only an NID number.
- A child/no-NID case is not silently labelled verified.
- Recovery preserves legitimate bookings unless a separate authorized decision affects them.
- Reviewer access and contact changes are logged and appealable.

## G03 — Released-seat allocation

Proposed default for selected high-demand services: a published official waitlist rather than a private opportunity for an informed buyer. Initial ticket release and later cancellation allocation are separate policy decisions.

Waitlist states: waiting -> offered -> accepted/payment pending -> confirmed, or declined/expired/withdrawn. Allocation repeats only after the previous offer is safely released.

1. Cancel/release through a transaction that invalidates the entitlement and creates an allocatable seat-segment record.
2. Use the approved waitlist order and eligibility/group-fit policy.
3. Atomically offer compatible seat segments to one eligible request; attach a fixed expiry.
4. Notify using supported channels. Passenger assistance remains available.
5. On payment confirmation, verify offer validity and payment state before finalizing.
6. On expiry, reconcile any in-flight payment according to a defined grace rule before offering to another passenger.
7. If no eligible request accepts, release through a published general-sale rule.

No search or waitlist registration holds seats. One request gets one allocation opportunity per approved passenger/group scope. A larger group must not create multiple queue chances.

Family-fit scoring can prioritize approved guardian pairing, then same coach and short physical distance. The priority between queue position, group size and efficient seat use must be published and simulated: "first compatible group" can repeatedly skip large families. Do not adopt it without evaluating starvation and bounded-skip rules. Any random selection needs a defined eligibility window, auditable ordering and seed governance that prevents advance manipulation; do not publish future allocation secrets.

Staff may see information needed for operations, but detailed pre-release scheduling access is restricted and logged. Quota releases have published rules and provenance. Allocation exceptions require separate approval; all seats share authoritative inventory.

Acceptance:
- A released seat cannot be simultaneously promised to two requests.
- Cancelled QR remains invalid after its seat is reassigned.
- Payment/expiry races cannot create two active entitlements.
- Group fairness, skip limits and no-acceptance fallback are tested.
- A staff action cannot secretly jump the allocation order without a recorded authorized exception.

## G04 — Entitlement and abuse controls

Atomically check overlapping same-train passenger entitlement across all integrated channels. Store proven identity aliases only. Centralize reservation state in PostgreSQL. Add unique constraints/transactional rules, server-side hold expiry, idempotency keys and payment reconciliation.

Use combinations of account activity, hold-to-payment ratio, repeated coordinated requests, device/payment relationships and suspicious identity patterns for risk review. Shared IP, phone, payment or device alone is not guilt. Device data collection needs proportionality, retention limits and review.

Responses are graduated: allow, slow repeated abusive requests, accessible step-up assistance or independent review. Document appeal and fallback. Avoid immediate mass cancellation based on an automated score. Anti-bot and accessibility tests must include assistive technologies and counters.

Acceptance:
- Concurrent cross-channel attempts cannot create prohibited overlapping entitlements.
- Retrying a request does not create another hold or payment.
- Legitimate family/counter shared-device use succeeds.
- Repeated unpaid accumulation is measurable and constrained.
- False-positive review has a documented resolution and appeal.

## G05 — Staff and operational accountability

| Role | Allowed | Restricted |
|---|---|---|
| Guard/TT | View minimum journey/identity data; record matched, needs review or unable to check; issue approved receipt | Cannot reactivate cancelled ticket or secretly allocate a seat |
| Counter/approved helper | Assisted booking and policy-eligible cancellation | No allocation-order bypass or unrestricted identity export |
| Reviewer | Resolve assigned cases with evidence and reason | Cannot approve their own incident/waiver |
| Inventory administrator | Manage approved quotas/configuration with change review | No unlogged personal allocation |
| Independent auditor | Review protected events and sample checks | No ordinary ticket issuance or payment modification |

Add managed staff sign-in, bounded sessions, device accountability, least privilege and separate approvals for sensitive changes. Logs are append-oriented with protected copies and access separate from ordinary operators; "append-only" does not make dishonest input truthful.

Offline scans show signature/freshness assurance separately from current ticket status. Missing scans never establish guilt or absence. Receipts distinguish fare/penalty from travel permission and coach capacity. Staff training and safe operating rules are mandatory. Independent surprise checks and reconciled official payments are required to investigate unrecorded bypass.

Acceptance:
- TT cannot approve their own waiver or change cancelled to active.
- Receipt and payment totals reconcile to documented incidents.
- Missing entry or exit does not automatically penalize passengers/staff.
- Offline exceptions sync with conflict handling.
- Trains never wait for all scans or attendance.

## G06 — Official assistance and refund settlement

Provide clearly identifiable authorized counters/helpers with an itemized receipt: passenger(s), booking reference, base fare, approved fees, payer source, cancellation eligibility and assistance/dispute contact. Never include full NID in receipts or ticket QR.

Refund goes to the original payment source. A cash-paying passenger assisted by an agent has a separate repayment obligation: give a receipt/reference, refund status access after suitable verification, documented settlement deadline and dispute route. Agent fees and authority require approval. Family repayment is private unless an approved service explicitly handles it.

Consent to cancel, payer authorization and passenger rights must be agreed; possession of the QR alone does not authorize cancellation or refund redirection.

Acceptance:
- Passenger can locate an approved affordable assistance route.
- Receipt makes payer and refund destination understandable.
- Agent cannot silently redirect gateway refund or conceal settlement status.
- Partial cancellation clearly identifies remaining valid passenger tickets.
- Dispute routing is available without a smartphone.

## G07 — Next UI module and prototype tests

Add/update:
1. Policy-aware cancellation estimate, original payer and refund tracking.
2. Booking-limit explanation and larger-group assistance.
3. Passenger consent/assisted confirmation and identity pending alternatives.
4. Identity misuse report, recovery status and appeal.
5. Waitlist status, offer expiry, acceptance and decline.
6. Payment pending during expiry/reconciliation.
7. Risk-review/step-up support and appeal.
8. Counter assisted booking and itemized receipt.
9. Staff offline/unable-to-check states.
10. Independent case review and protected allocation history.

Initial Figma UI v0.1 and earlier 24-hour examples are not the approved implementation baseline. Mark revised screens as mock/proposed where rules remain undecided. Preserve simple ordinary flow: search -> passengers -> seat offer -> pay -> ticket. Rare cases use progressive disclosure, not mandatory extra steps for everyone.

Acceptance includes keyboard navigation, screen-reader errors/status, WCAG 2.2 AA target, Bangla comprehension and older-passenger assistance needs. A target is not certification.

## G08 — Evidence gate and remaining gaps

Obtain permission for controlled staging tests, staff-access review, payment fixtures, concurrency checks, offline synchronization, restore testing and independent operational pilot. No stress testing of the live railway site is authorized by this project.

Measure baseline versus pilot: completed bookings, waitlist acceptance, cancelled-seat reassignment, queue times, refund failures, identity disputes, false refusals, coordinated-abuse cases and independently substantiated resale. Collect only proportionate data. Detection counts alone do not establish the true resale rate.

Remaining gaps: prearranged broker premium, unlinked identities, unrecorded boarding/bribery, senior collusion, limited network/staff capacity and insufficient official assistance. No zero-resale promise or invented effectiveness percentage. Blockchain, mandatory biometrics and nationwide gates remain deferred.

## Next work order

G01 policy decisions -> G02/G03 flow review -> G07 Figma exception module -> mock interactive prototype -> G04/G05 engineering checks -> G08 pilot.
G06 operating-model work proceeds alongside identity/allocation review.
Requirements documentation is completed in this revision; screens, code, agreements and pilot evidence are not.
