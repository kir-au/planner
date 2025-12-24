# Personal 2026 Dashboard (Kirill)

Goal: a private, authenticated dashboard that renders Kirill’s 2026 plan from a single canonical state file.

Source of truth:
- `state/plan.json` (planning updates must only change this file)

UX constraints:
- One weekly direction, stable for ~7 days
- One daily default action (no daily planning)
- Timezone: Australia/Sydney
- Dashboard is read-only (v1)

Views:
- Today: default action + timebox
- This Week: theme + default
- Calendar: read-only blocks generated from `state/plan.json` (react-big-calendar)
