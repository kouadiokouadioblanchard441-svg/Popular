---
name: PowerAdd GitHub remote recovery
description: Safe recovery rule for a GitHub remote with missing objects or no visible branches.
---

When a GitHub remote has no visible branch and rejects otherwise valid pushes with a missing-object or remote-unpack error, do not force-push the existing local history blindly. Check `.git/shallow`: a shallow boundary can reference an unavailable parent that an empty remote requires. Preserve the local history on a separate branch, get explicit approval to recreate the remote root, and publish a clean snapshot only if that history reset is acceptable.

**Why:** A server-side object error is not a code or TypeScript problem. A clean local `git fsck` can still hide unavailable parents at a shallow boundary, and retrying normal or non-thin packs cannot supply objects the clone never received. Recreating the root restores connectivity but changes the history visible on GitHub.

**How to apply:** Verify the remote URL and repository identity, confirm write access, inspect shallow boundaries and available backups, preserve the old local tip on an archive branch, and only then create and publish a clean root commit with user approval.