---
name: NOWPayments payout integrity
description: Financial-safety rules for provider payout creation and IPN status handling.
---

When a payout request may have reached NOWPayments but the local app lacks a conclusive response, retain the withdrawal for reconciliation using its durable external reference. Do not automatically refund the user. Treat provider server/gateway failures and duplicate-reference conflicts as ambiguous.

**Why:** A provider can accept a payout before a network timeout or a 5xx response reaches the app. Refunding locally in that situation can leave both an external payout and restored user funds.

**How to apply:** Persist the provider-facing external ID before sending a payout. Only refund after a definitive provider rejection or signed terminal failure. Make completed, failed, and rejected payout states absorbing, and use conditional database transitions so delayed/concurrent IPNs cannot reverse them.