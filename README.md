
### Design Principles

- Core logic is completely independent from Express.
- Repository pattern used for persistence abstraction.
- Evaluation logic is isolated and unit-testable.
- Clear precedence handling for overrides.

---

## Data Model

### Features

| Field | Description |
|--------|------------|
| key | Unique feature identifier |
| default_enabled | Default boolean state |
| description | Feature description |

### Overrides

| Field | Description |
|--------|------------|
| feature_key | Associated feature |
| level | USER or GROUP |
| reference_id | userId or groupId |
| enabled | Override state |

---

## Evaluation Logic

When evaluating a feature:

1. Check for User-level override
2. If not present, check for Group-level override
3. If none found, return default feature state

This logic is implemented in:

