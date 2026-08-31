---
name: TGOOD random gift codes
description: Gift-code reward intervals and compatibility behavior.
---

Gift codes support either a fixed USDT amount or an interval with a minimum and maximum. For interval codes, the server chooses a cent-precise reward independently at each successful claim, inclusive of both endpoints.

**Why:** The owner wants one bonus code to distribute varied rewards, such as 25 or 26, while guaranteeing every reward remains inside the configured interval.

**How to apply:** Keep existing fixed codes compatible. Validate that random-code minimum and maximum are positive, that minimum is not greater than maximum, and keep all values in USDT with two-decimal precision.