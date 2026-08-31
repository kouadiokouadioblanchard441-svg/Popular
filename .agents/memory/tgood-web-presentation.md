---
name: TGOOD web presentation
description: The approved presentation mode for the TGOOD site.
---

Keep TGOOD presented as a conventional website in a normal browser, while allowing the app-like mobile shell in the installed standalone PWA.

**Why:** The user explicitly asked for the classic presentation in the browser and the app presentation only after a person installs the PWA.

**How to apply:** Keep app-shell spacing, safe-area handling, standalone metadata, service-worker behavior, and mobile-only interaction styling scoped to the PWA. Do not apply those visual changes to ordinary browser visits.