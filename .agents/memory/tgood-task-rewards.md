---
name: TGOOD task rewards
description: Rules for the task reward catalog and administrator-configured amounts.
---

The task catalog is seeded additively: startup may add missing reward levels to reach the supported eight-level catalog, but it must preserve existing task values and ordering that an administrator may have changed. Reward amounts support two decimal places in USDT so the admin panel can use values such as fractional rewards.

**Why:** The task page is admin-configurable, and a startup seed must not silently replace live reward settings or previously claimed task definitions.

**How to apply:** When changing default task levels, add only missing sort orders or use an explicit, intentional migration. Keep the admin form and API on decimal parsing and validation.