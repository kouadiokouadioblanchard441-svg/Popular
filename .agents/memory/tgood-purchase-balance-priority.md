---
name: TGOOD purchase balance priority
description: Financial rule for normal product purchases and withdrawals.
---

Normal product purchases may combine both available balances. The deposit balance is consumed first, and the earnings balance covers only the remaining amount. Withdrawals remain restricted to the earnings balance.

**Why:** The user explicitly defined this priority so deposited funds are used before earned funds for product purchases, while earned funds remain the only withdrawable balance.

**How to apply:** Enforce the rule on the server purchase path and mirror the exact split in the confirmation interface. Do not allow the deposit balance to satisfy a withdrawal.