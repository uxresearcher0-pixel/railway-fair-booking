# Two-way SMS: receipt, HELP, EXTRA, STATUS (simulation, proposed)

Source: UI handoff posted in Slack #railway-fair-booking on 15 Oct (21:16). It adds to the v2 receipt, report and recovery flows. It does not replace the booking journey.

**This is a simulation.** No real SMS, payment, NID or live number. The two-way SMS number, telecom support, delivery and Unicode segmentation, and reply charges are dependencies to confirm. An alphanumeric, notification-only sender must never be shown as able to receive replies.

## Keywords

Keywords stay the same in English and Bangla. Bangla messages explain them in Bangla.

| Keyword | What it does |
|---|---|
| `HELP` | Menu: 1 Ticket access · 2 Cancellation/refund · 3 Booking without my permission · 4 Callback/other help |
| `EXTRA` | Report paying more than the official total |
| `STATUS` | Status of your report or help request |
| `SEND` / `EDIT` / `CANCEL` | Confirm, change or drop a report before it is sent |
| `STOP` | Turn off optional follow-up messages (approved policy). Open cases are still handled |

## Screens (Figma 02c section v2-5, Bangla on 02d, demo IDs SM01–SM13)

| ID | State | Key content |
|---|---|---|
| SM01 | Receipt SMS | "railfair: RF-7Q2K-48 confirmed. Fare Tk 1,400; service Tk 80; assistance Tk 40. Official total Tk 1,520 for this booking (4 travellers). Reply HELP for assistance or EXTRA to report paying more." It is the booking total, not each traveller's share |
| SM02 | HELP menu | Passenger sends HELP. The reply lists options 1–4 |
| SM03 | HELP answered | Example: option 3. The reply acknowledges it and gives support reference SR-4410. SMS can't change a booking. Hand-off to the app ("Who can act on my booking") or any counter with ID, with a return path |
| SM04 | EXTRA start | Confirms the booking and the official total Tk 1,520. Asks for the TOTAL amount actually paid |
| SM05 | Amount and excess | Passenger replies 2500. "Reported total Tk 2,500; official total Tk 1,520; reported excess Tk 980." Asks who collected it (optional, SKIP) |
| SM06 | Method and summary | Cash or digital. Summary with SEND / EDIT / CANCEL |
| SM07 | Report received | Case OC-2207. Ticket stays valid. Evidence is optional: secure upload in the app or show it at a counter (SMS can't attach images). STATUS instructions |
| SM08 | STATUS | Received → under review → more information requested → resolved, with outcome and appeal route. Timing is proposed, not guaranteed |
| SM09 | Invalid keyword or amount | Clear retry message. No case is created |
| SM10 | Shared phone, several bookings | Choose by reference and date only. No other passengers' names |
| SM11 | Unknown sender | No booking is revealed. Offer a code to the traveller's own phone, or counter help with ID |
| SM12 | Send failed or pending | Safe retry. "Already received as OC-2207, no new case" |
| SM13 | STOP | Optional follow-ups off. Open case still handled |

App and counter tie-ins:
- **P14·v2:** adds "View SMS demo".
- **R3c·v2:** the same case OC-2207 in the app, source "SMS". SMS and app never create duplicate cases.
- **CT05·v2:** no phone or lost access. The counter prints an itemised receipt and files the report for the passenger.
- **OP10·v2:** shows the case channel (SMS, app or counter).

Desktop:
- **DW06 and DW08:** offer the same help and report access. The SMS demo opens as a phone demonstration.

## Rules

- Reports are leads, not proof. There is no automatic fine, agent suspension or passenger penalty, and no promise of money back before a decision.
- Reporting never cancels a valid ticket. Other ticket rules still apply.
- Never ask for a full NID, PIN, password or payment OTP by SMS.
- An SMS reply is not blanket authorisation. Cancelling, reissuing, changing identity or contact details, or seeing private data needs the right check in the app or at a counter.
- Callback hours and cost are shown only once confirmed.
- Complaints stay off public TV and routine guard and TT screens. Only people who need to know see them (passenger, counter for an assisted report, reviewer). There is no promise of absolute anonymity.

## Flow (page 03) and IA (page 04)

- **Flow:** an optional branch after a ticket is issued, and from support. Receipt → HELP or EXTRA → confirmation → case → independent review → status, outcome, appeal. It adds no new station checkpoint.
- **IA:** new objects are SMS support channel, support request, conversation (message delivery state), booking-context selection, and a link to the existing receipt and overcharge case. Visibility: passenger, counter (assisted only), reviewer.
