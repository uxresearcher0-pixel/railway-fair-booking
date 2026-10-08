# Railway decisions brief

The UI v0.2 design and the coded prototype rely on rules that only the railway can confirm. Every screen that depends on one labels it **proposed** or **rule to confirm**. This brief is for the T08 review. For each decision it gives the project's recommendation, the screens affected, and what changes if the answer differs.

All examples use fictional data. This is an independent concept, not a Bangladesh Railway document.

## Purchase limits and anti-resale

| # | Decision | Recommendation | Screens | If the answer differs |
|---|---|---|---|---|
| 1 | Daily buyer limit | Max 4 tickets per buyer per day | F03, R0, G1, G2b, G5, L1 | Change the number in the allowance pill and L1 copy |
| 2 | Is the limit per account or per NID? | **Per NID**; one NID = one account | L1, G2a | Per account lets one person with several accounts multiply the limit |
| 3 | Do counter purchases count? | Yes, against the same NID | L1, D01 | Counters become the bypass route |
| 4 | Does cancelling restore the allowance? | No | L1 | Cancel-and-rebuy becomes a way to hand seats to a customer |
| 5 | Who may buy Package B of a linked group? | Only an adult travelling in Package B | G2, G2a, G2c | Paid strangers can buy for groups; the 4-per-day limit stops working for groups |
| 6 | Maximum group size | 8 (two packages of 4) | G1 | Larger groups win a bigger share per fair-queue draw |
| 7 | How long does a group invite stay open? | 24 hours or until the sale closes | G2a | Shorter means more declined groups; longer delays the queue |
| 8 | Unpaid Package B in a hold | Seats return to the fair queue, never to the other buyer | G5 | Seats could be "parked" for a chosen person |
| 9 | One wallet paying for many accounts | Flag for review, don't block | Back office only | Blocking hurts families who share a wallet |
| 10 | "Book for someone else" outside groups | Keep it, counted against the buyer's 4 | P03, R0 | Removing it excludes older people and people not online |
| 11 | Name or ID change after issue | Never; cancel and release instead | P16, P17 | Transfers make resale easy again |

## Booking, payment and cancellation

| # | Decision | Recommendation | Screens |
|---|---|---|---|
| 12 | Can a ticket be bound to a named passenger other than the account holder? | Yes, with that passenger's ID | P05, F04a, R1 |
| 13 | Hold length, and does one hold cover seats through payment? | One fixed hold through payment (10 min proposed) | P08, G5, P11–P13 |
| 14 | Service charge per booking or per ticket; refundable? | ৳20 per ticket, not refundable (as shown today) | P10, F06, G4 |
| 15 | The 24-hour cancellation boundary and conditional recovery after official resale | Over 24 h: standard refund; under 24 h: release without standard refund | P16, P17 |
| 16 | Fair-queue trial: eligibility, window, group fairness, counter participation | One application per group, published draw, audit reference | P04, P21, P22 |

## Identity and travel

| # | Decision | Recommendation | Screens |
|---|---|---|---|
| 17 | Child seating with an adult; when proof of relationship is needed | Child always in the same package as an accompanying adult; proof only at assisted counter checks | P07, F04b, G2 |
| 18 | Age bands (adult 12+, child 3–11, under 3 on a lap) | Confirm against the current tariff | F03 |
| 19 | Accepted IDs: NID, birth registration, passport, assisted check | All four, with assisted check at counters | F04a, F04b, P06 |
| 20 | Charge tariff and wrong-train rules | Amount from the approved tariff only; official receipt | S08, S10 |

## How to use this brief

1. Walk through the table with the railway in the T08 review and record each answer here, with the date and who confirmed it.
2. For each changed answer, update the screens listed and remove the "proposed" or "rule to confirm" label once it is confirmed.
3. Post the outcome in the project Slack tracker thread.
