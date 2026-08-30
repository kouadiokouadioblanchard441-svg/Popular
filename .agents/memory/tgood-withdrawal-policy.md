---
name: TGOOD withdrawal policy
description: User-facing deposit and withdrawal thresholds and the no-fee payout rule
---

TGOOD accepts deposits from 18 USDT and withdrawals from 1 USDT. Withdrawals are paid in full: no withdrawal fee is deducted, and a new withdrawal must store the requested amount as both gross and net with zero fees.

**Why:** The platform policy was explicitly changed from the older high thresholds and percentage-based deductions; leaving any old fallback or multiple-of-100 rule would make the displayed policy differ from actual behavior.

**How to apply:** Keep the database values, seed/migration defaults, server validation, payout amount, rules, instructions, and withdrawal screens aligned whenever withdrawal behavior changes.