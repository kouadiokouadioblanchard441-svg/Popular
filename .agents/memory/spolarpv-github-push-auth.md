---
name: PowerAdd GitHub push authentication
description: GitHub integration access can work while the local GITHUB_TOKEN used by git push is invalid.
---

The Replit GitHub connection and the shell's GITHUB_TOKEN are separate authentication paths. A successful GitHub integration API request does not prove that `git push` over HTTPS can authenticate.

**Why:** The repository remote was reachable and writable through the connected GitHub integration, while the shell token returned GitHub's invalid-credentials error.

**How to apply:** Diagnose the exact push error first. Prefer the connected GitHub integration for repository writes when the shell token is invalid; do not print or copy token values into remotes, logs, or chat.