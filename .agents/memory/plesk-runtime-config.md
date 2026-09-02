---
name: Plesk runtime configuration
description: Production public URLs and payment callbacks prefer Plesk variables with a verified repository fallback.
---

The rule is that production public URLs, including payment callback origins, prefer Plesk environment variables. `APP_URL` is preferred and `PUBLIC_URL` is the fallback; if Passenger receives neither valid value, use the verified production URL `https://zoksilll.online`.

**Why:** The application is deployed behind Plesk, but Passenger can omit custom variables from the Node process. A verified fallback keeps payment callbacks working when that happens, while environment overrides still support future domain changes.

**How to apply:** Keep `APP_URL` and `PUBLIC_URL` first in the selection order, reject explicit HTTP values, and retain the verified production fallback. Update the fallback if the canonical production domain changes.