---
name: TGOOD product earnings collection
description: Product earnings accrue into a pending per-product amount and enter the withdrawable ledger only after manual collection.
---

Product earnings must become available after each completed 24-hour cycle without automatically increasing the user's withdrawable balance. Users collect pending earnings per product; collection credits `totalEarnings` and creates the earning transaction, while the deposit balance is never used for this payout.

**Why:** The product revenue flow was changed from automatic daily crediting to an explicit collection action, and the ledger rule keeps product gains in `totalEarnings`.

**How to apply:** Preserve the pending-versus-collected split, accumulate missed full cycles, make collection idempotent, and keep completed products collectible when they still have pending earnings.