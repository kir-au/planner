# Agent Brief (Codex / any repo agent)

Rules:
1) Planning changes MUST only modify `state/plan.json` (and optionally append to `state/events.ndjson` if added later).
2) UI/code changes ONLY when explicitly requested.
3) Always work via PRs. Never push directly to `main`.
4) Validate `state/plan.json` against `state/schema.json`. Fail loudly on ambiguity.
5) Calendar UI uses `react-big-calendar` (read-only for v1).
