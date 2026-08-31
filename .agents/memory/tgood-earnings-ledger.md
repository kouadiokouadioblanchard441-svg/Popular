---
name: TGOOD earnings ledger
description: Business rule for separating the deposit balance from the withdrawable earnings balance.
---

All user rewards and gains must credit `totalEarnings`, including product earnings, referral commissions, daily check-in rewards, task rewards, gift-code rewards, spin rewards, and signup bonuses. The `balance` field is reserved for deposits and is consumed before earnings during purchases. Withdrawals use `totalEarnings` only.

**Why:** The user explicitly requires the revenue balance to include every gain, and small check-in rewards were previously invisible when credited or displayed through the deposit-balance path.

**How to apply:** Any new reward or gain transaction must update `totalEarnings` and refresh the authenticated user state after a successful client mutation. Do not credit reward amounts to `balance`.