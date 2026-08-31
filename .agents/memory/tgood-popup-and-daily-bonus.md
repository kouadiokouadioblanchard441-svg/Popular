---
name: TGOOD popup and daily bonus removal
description: Current homepage announcement content and the retired daily login bonus feature.
---

The homepage announcement uses the launch date 03/09/2026, an 18 USDT minimum deposit, a 1 USDT minimum withdrawal via USDT BEP20 with no fee, a 2 USDT registration bonus, referral commissions, and 09:00–17:00 withdrawal/support hours.

The daily login/check-in bonus is retired. Its admin controls, user route, API endpoints, settings, claim timestamp field, and translation/content entries must stay removed. Existing financial transaction history is retained.

**Why:** The owner explicitly requested removal of the 24-hour login bonus while keeping other rewards and updating the public announcement to the current operating rules.

**How to apply:** Do not re-add daily-bonus controls or routes when editing rewards. Update popup copy in both the component fallback and seeded platform settings when operating rules change.