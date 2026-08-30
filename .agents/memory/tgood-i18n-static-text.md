---
name: TGOOD static interface translations
description: English must cover legacy JSX labels as well as typed catalog entries.
---

The typed translation catalog alone does not cover older screens that render literal UI text in JSX. English mode needs an explicit reviewed static-text mapping for those labels and phrases.

**Why:** Several user and admin pages bypassed the catalog and stayed partly French even when the English language was selected.

**How to apply:** When adding or editing a screen, use translation keys for visible UI text; if legacy literals remain, add their complete phrase to the shared static translation map rather than relying only on word-by-word fallback.

New browser sessions intentionally start in English after the interface cleanup, while the language picker remains available for users who explicitly choose another language.

**Why:** Existing saved language preferences could reopen the refreshed site in French even after English became the reviewed default.

**How to apply:** Preserve the versioned language-storage key when changing the default-language migration so old preferences do not silently override the English starting state.

Every supported locale must provide a complete catalog; Arabic and Chinese must never be built by spreading the French catalog and overriding only a few labels.

**Why:** Partial locale objects caused large portions of the interface to remain French after users selected Arabic or Chinese.

**How to apply:** When adding a translation key, add it to all four locale catalogs and run the catalog completeness and placeholder checks before shipping.