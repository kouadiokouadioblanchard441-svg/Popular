---
name: TGOOD admin password seeding
description: Boundary between first-install admin creation and ongoing administrator credential management
---

The seed may use a fallback or environment-provided password only when creating the initial administrator. Once the account exists, password changes must be explicit and the startup seed must preserve the stored password.

**Why:** Resetting the credential during every startup silently undoes administrator password changes and can make the account unexpectedly revert after a workflow restart.

**How to apply:** Keep administrator password changes in the database or an explicit credential-management flow; do not add unconditional password hashing to the existing-admin seed branch.