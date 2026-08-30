---
name: Global country selection
description: Country selection behavior, default phone country and currency rule.
---

Treat the country picker as global: it must expose worldwide country names and calling codes, while US/+1 remains the default selection for new forms. Monetary labels use USDT regardless of the selected country.

**Why:** the user requested a worldwide searchable country selector and then specified that the +1 country should be the default.

**How to apply:** use the worldwide country list for selection and registration, default auth forms to US/+1, and retain USDT for all visible monetary labels.