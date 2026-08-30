---
name: TGOOD static interface translations
description: English must cover legacy JSX labels as well as typed catalog entries.
---

The typed translation catalog alone does not cover older screens that render literal UI text in JSX. English mode needs an explicit reviewed static-text mapping for those labels and phrases.

**Why:** Several user and admin pages bypassed the catalog and stayed partly French even when the English language was selected.

**How to apply:** When adding or editing a screen, use translation keys for visible UI text; if legacy literals remain, add their complete phrase to the shared static translation map rather than relying only on word-by-word fallback.