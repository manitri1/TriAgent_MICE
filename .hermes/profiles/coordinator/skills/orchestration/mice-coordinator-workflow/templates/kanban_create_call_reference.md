# `kanban_create()` field reference

This replaces the old hand-written `kanban-card.md`/`kanban_card_template.md`
templates. Do not write a markdown "board" file — call the real tool. The
board itself (`kanban_list()` / `hermes kanban list`) is the only record of
task state.

## Fields

- `title` (required) — short task name.
- `assignee` (required) — profile name (e.g. `proposal-agent`). Unknown
  profiles fall back to `kanban.default_assignee` (set to `coordinator` in
  this project's root config, so a bad assignee lands with coordinator for
  re-triage rather than vanishing).
- `body` — full instructions: expected output file paths, allowed content
  (items/links only — no copywriting unless the task explicitly asks for it),
  deadline, and any explicit HITL constraint the worker must respect (it will
  self-block via `kanban_block` when it hits one, see the parent skill's step
  5).
- `workspace` — `"dir:/opt/data/workspace/<category>/<event-slug>"` for this
  project (matches the existing `workspace/{proposals,budget,outreach,
  registration,exhibition,marketing,reports,finance}/<event>/` convention —
  do NOT use `"scratch"` or `"worktree"`, those are for ephemeral/git-based
  work this project doesn't do).
- `tenant` — `"<event-slug>"`. Reuse the same slug across every task for one
  event; this is what gives "don't mix data between events" a real technical
  backing instead of relying only on SOUL.md prompt discipline.
- `parents` — list of task ids this task depends on. The task is promoted to
  `ready` only once every parent reaches `done`. Use this to express the
  Pre-Event DAG (e.g. `exhibition-agent`'s task needs both the budget and
  outreach tasks as parents).
- `idempotency_key` — `"<event-slug>-<task-name>"`. Prevents duplicate task
  creation if the same planner request is processed twice.
- `priority` — set higher for incident-response-type tasks created mid-event.
- `max_retries` — for HITL-gated tasks, set to `1` (a `blocked` task is
  awaiting approval, not failing — it should not be auto-retried by the
  dispatcher's failure-limit machinery).
- `skills` — the specific skill name the worker should use for this task type
  (e.g. `vendor_quote_comparison`), so the worker doesn't have to guess from
  the title alone.

## Worked example

Proposal-agent info card, translated from the old static-example card into a
real call:

```python
kanban_create(
    title="proposal: 인포(요약1p + 체크리스트)",
    assignee="proposal-agent",
    body=(
        "outputs/proposal_info_1p.md, outputs/proposal_links.md, "
        "outputs/proposal_checklist.md 를 만들어줘. 형식: 항목형 리스트 + "
        "근거 링크만(문장형 제안서·카피 작성 금지). 필수 섹션: 목적/대상/"
        "프로그램 일정/근거링크. 연사·스폰서 최초 발송 금지(HITL)."
    ),
    workspace="dir:/opt/data/workspace/proposals/mice-networking-day-2026",
    tenant="mice-networking-day-2026",
    idempotency_key="mice-networking-day-2026-proposal_info",
    priority=1,
    skills=["rfp_analysis"],
)
```

coordinator then verifies (Active Verification — reads the actual files) once
the task reaches `done`; it never treats the worker's `kanban_complete()`
summary text alone as proof.
