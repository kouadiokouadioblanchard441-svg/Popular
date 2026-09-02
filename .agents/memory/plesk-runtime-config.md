---
name: Plesk runtime configuration
description: Production public URLs and payment callbacks are configured by Plesk, not by repository defaults.
---

The rule is that production public URLs, including payment callback origins, must be read from Plesk environment variables. The repository must not contain a project-domain fallback, and local development configuration must not inject a production domain.

**Why:** The application is deployed behind Plesk, and a stale or missing repository domain can send payment callbacks to the wrong host or make the payment flow fail before the provider is contacted.

**How to apply:** Keep `APP_URL` as the sole source for NOWPayments callback URLs in production. If Plesk has not defined it or it is not a valid HTTPS URL, fail clearly and configure the value in Plesk rather than adding a code fallback.