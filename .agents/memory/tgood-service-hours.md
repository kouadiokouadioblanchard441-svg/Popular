---
name: TGOOD customer service hours
description: Customer-support availability is derived from the configured service-hour window.
---

The customer-service screen uses the configured start and end hours as its availability window: it shows the current online/offline state, refreshes it every minute, and disables support links outside the window.

**Why:** Showing support as available 24/7 contradicted the hours displayed to users and allowed links to be opened while the service was marked closed.

**How to apply:** Keep the displayed hours and the online/offline calculation driven by the same settings. Preserve overnight-window handling when changing the schedule logic.