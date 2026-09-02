---
name: Plesk runtime configuration
description: Production public URLs and payment callbacks are configured by Plesk, not by repository defaults.
---

The rule is that production public URLs, including payment callback origins, must be read from Plesk environment variables. `APP_URL` is preferred and `PUBLIC_URL` is the fallback. The repository must not contain a project-domain fallback, and local development configuration must not inject a production domain.

**Why:** The application is deployed behind Plesk, and a stale or missing repository domain can send payment callbacks to the wrong host or make the payment flow fail before the provider is contacted.

**How to apply:** Keep `APP_URL` and `PUBLIC_URL` as the only sources for NOWPayments callback URLs in production, using `APP_URL` first. If neither is valid, fail clearly and configure one in Plesk rather than adding a code fallback.