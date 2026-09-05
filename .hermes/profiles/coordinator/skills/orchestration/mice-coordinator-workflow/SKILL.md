---
name: mice-coordinator-workflow
title: MICE Coordinator Workflow
description: >-
  Class-level skill for MICE event coordination: kanban creation, task dispatch,
  workspace and artifact conventions, Active Verification, and HITL gates. Encodes
  lessons from project workflows (team R&R, workspace discipline, and verification
  steps) into repeatable procedures and templates.
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, coordinator, workflow, kanban, verification, hitl]
platforms: [Linux]
---

Summary

This umbrella skill captures the coordinator's standard operating procedure for
small-to-medium MICE events (planning, outreach, budget, exhibition, marketing,
registration, onsite ops, postevent analysis, finance settlement). It
formalizes: (1) how to create real kanban tasks (`kanban_create`/`kanban_link`)
and let the dispatcher assign/spawn workers automatically; (2) workspace and
artifact placement rules (project-scoped outputs only); (3) Active Verification
before treating tasks as done; and (4) the 7 mandatory HITL approval gates
(budget final, initial speaker/sponsor contact, crisis agenda, attendee
payment/refund, exhibition contract, paid campaign execution, post-event
settlement/payout), each backed by `kanban_block`/`kanban_unblock`.

When to use

- A planner asks to "do X" and you will dispatch work to proposal, budget,
  outreach, onsite, or postevent agents.
- You must generate files, create kanban cards, or contact external parties.

Key principles (short)

- Workspace discipline: always create artifacts under the user-approved
  workspace path (e.g. /opt/data/workspace/<project_name>). Do NOT create or
  modify files in other project folders unless the user explicitly permits a
  cross-profile write and you pass cross_profile=True.
- Real kanban only: the board is the single source of truth. Never hand-write
  a markdown file as a substitute board — use `kanban_create()`/`kanban_link()`
  and let the dispatcher spawn workers. A hand-written `kanban_cards.md`-style
  file is the exact anti-pattern this skill used to encode; do not reintroduce it.
- Active Verification: never mark a kanban task "done" purely from a worker's
  `kanban_complete()` summary text. Open the returned files or re-query the
  external system yourself and confirm existence and content before treating
  the task as verified.
- HITL gates (7 total, not 3): stop and require the coordinator's explicit
  approval before any of: (1) budget final approval, (2) initial speaker/sponsor
  outbound (first email/DM), (3) applying a crisis/replacement agenda, (4)
  attendee payment/refund processing, (5) exhibition booth contract finalization,
  (6) paid advertising/mass campaign execution, (7) post-event settlement/payout.
  Each is implemented as the worker calling `kanban_block(reason=...)` instead
  of completing; see step 5 below.

Procedures (step-by-step)

1) Establish workspace

- If the user specifies a workspace path, use it exactly. If ambiguous, ask one
  clarifying question: "Which workspace should I use for all files and kanban
  cards?" (Act, do not guess.)
- Default convention: all outputs go to <workspace>/outputs, docs to <workspace>/docs,
  inputs to <workspace>/inputs.
- NEVER write into another team's or archived project (example: /opt/data/workspace/포항_24_7)
  unless the user explicitly authorises cross_profile writes. When authorised,
  set cross_profile=True and log the permission in docs/permissions.md.

2) Create kanban tasks + assign

- Break the request into 3–8 atomic tasks and create them with `kanban_create()`
  — see templates/kanban_create_call_reference.md for the exact field list
  (title, assignee, workspace, parents, tenant, idempotency_key, priority,
  max_retries, skills). Set `workspace: "dir:/opt/data/workspace/<category>/
  <event-slug>"` and `tenant: "<event-slug>"` on every task for that event so
  isolation between events is enforced by the board, not just by convention.
- Preferred assignees: proposal-agent, budget-vendor-agent, outreach-agent,
  exhibition-agent, registration-agent, marketing-agent, onsite-ops-agent,
  postevent-analyst, finance-settlement-agent. Set `priority` (low/med/high)
  and link dependent tasks with `parents`/`kanban_link()` so the dispatcher only
  promotes a task to `ready` once its prerequisites are `done`.
- Do NOT write a markdown "board" file anywhere. The kanban board itself
  (queryable via `kanban_list()`/`hermes kanban list`) is the only record of
  task state — a parallel hand-written file drifts from reality and was the
  root cause of this skill's original design flaw.

3) Dispatch — automatic, not a manual call

- Once a task's `parents` are all `done`, the kanban dispatcher (running inside
  the gateway) automatically spawns the assigned profile as a worker. Do not
  call `terminal(hermes -p <role> chat -q ...)` to dispatch — that bypasses the
  board's dependency tracking and retry/failure handling entirely.
- Each task's `body`/instructions should still list: expected output file
  paths, allowed content (items+links only—no copywriting), and any explicit
  HITL constraint the worker must respect (it will call `kanban_block` itself
  when it hits one — see step 5).
- coordinator does not block waiting for a reply. `auto_subscribe_on_create`
  resumes the coordinator session automatically when a subscribed task reaches
  `done` or `blocked`.

4) Active Verification before treating a task as done

- When a task reaches `done` (worker called `kanban_complete()`), perform these
  checks yourself before relying on it:
  a) read_file the claimed output path(s) and verify content matches the
     expected schema (headers, required sections, presence of >=N links).
  b) for external effects (payments, emails), confirm via system logs or the
     external API/portal (not by reading the worker's summary text only).
  c) only after all checks pass, treat the task as verified and record the
     verifier and timestamp in docs/verification_log.md. If verification
     fails, use `kanban_comment()` to request rework rather than silently
     accepting the result.

5) HITL approvals

- A worker facing an HITL-flagged action calls `kanban_block(reason=...)`
  instead of completing — the reason should restate what/why/impact in full
  (not a summary). coordinator relays that reason via `clarify()`/`messaging`
  to the planner and waits for an explicit, unambiguous approval.
- Only after explicit approval does coordinator call `kanban_unblock(task_id)`
  so the worker can resume — but FIRST leave `kanban_comment(body="approved: ...")`
  stating what was approved. Unblocking with no comment risks the resumed worker
  hitting the same gate condition again immediately and re-calling `kanban_block`,
  which trips the dispatcher's own block-loop protection and demotes the task to
  `triage` (observed in local smoke testing 2026-09-05 — see
  docs/10-usecase-tests.md TC-04). On rejection, use `kanban_comment()` to record
  the rejection reason and requested changes instead of unblocking.
- Record the coordinator's explicit approval/rejection (written) in the
  relevant docs/MEMORY.md as a secondary record — the kanban block/unblock
  timestamps on the task itself are the primary record.

Support files

- templates/kanban_create_call_reference.md — canonical `kanban_create()` field
  reference and a worked example, replacing the old hand-written card template.
- references/session_workspace_convention.md — a short note for this session's
  workspace naming, common pitfalls, and permission rules.

Pitfalls & Notes

- Do not assume project names or reuse old project folders. The user corrected
  this behaviour: when told "do not write to X", treat it as authoritative and
  avoid that folder entirely.
- If a tool fails transiently, re-run once and note the retry in the kanban card
  comments; only capture persistent, reproducible fixes as skill updates.

