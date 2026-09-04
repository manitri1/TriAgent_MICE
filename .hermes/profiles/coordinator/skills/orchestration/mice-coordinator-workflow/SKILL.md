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
small-to-medium MICE events (planning, outreach, budget, onsite ops, postevent
analysis). It formalizes: (1) how to create kanban tasks and assign roles; (2)
workspace and artifact placement rules (project-scoped outputs only); (3)
Active Verification before marking tasks done; and (4) the three mandatory HITL
approval gates (budget final, initial speaker/sponsor contact, crisis agenda).

When to use

- A planner asks to "do X" and you will dispatch work to proposal, budget,
  outreach, onsite, or postevent agents.
- You must generate files, create kanban cards, or contact external parties.

Key principles (short)

- Workspace discipline: always create artifacts under the user-approved
  workspace path (e.g. /opt/data/workspace/<project_name>). Do NOT create or
  modify files in other project folders unless the user explicitly permits a
  cross-profile write and you pass cross_profile=True.
- Active Verification: never mark a kanban card "done" purely from an agent's
  text response. Open the returned files or re-query the external system yourself
  and confirm existence and content before final approval.
- HITL gates: stop and request the coordinator's explicit approval before any
  of these three actions: (1) budget final approval, (2) initial speaker/sponsor
  outbound (first email/DM), (3) applying a crisis / replacement agenda.

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

2) Create kanban card + assign

- Break the request into 3–8 atomic tasks and create kanban entries. Use the
  templates/kanban_card_template.md to ensure consistent fields: title, owner,
  due date, priority, outputs (paths), verification steps, HITL flags.
- Preferred owners: proposal-agent, budget-vendor-agent, outreach-agent,
  onsite-ops-agent, postevent-analyst. Mark priority (low/med/high).
- Save a master kanban file at <workspace>/docs/kanban_cards.md and update it
  atomically.

3) Dispatch work (synchronous calls)

- Use the terminal call for a synchronous handoff:
  /opt/hermes/bin/hermes -p <role> chat -q "<instruction: explicit outputs +
  exact paths + format: itemized lists + HITL flags>"
- Each call must list: expected output file paths, allowed content (items+links
  only—no copywriting), deadline, and explicit HITL constraints.

4) Active Verification before done

- When an agent reports a task complete, perform these checks yourself:
  a) read_file the claimed output path(s) and verify content matches the
     expected schema (headers, required sections, presence of >=N links).
  b) for external effects (payments, emails), confirm via system logs or the
     external API/portal (not by reading the agent's text only).
  c) only after all checks pass, move the kanban card to done and record the
     verifier and timestamp in docs/verification_log.md.

5) HITL approvals

- For any action flagged HITL: pause and post a clarify() or messaging note to
  the coordinator summarizing the decision required and the recommended
  options. Record the coordinator's explicit approval (written) in the
  relevant docs before proceeding.

Support files

- templates/kanban_card_template.md — canonical kanban card template for
  assignments.
- references/session_workspace_convention.md — a short note for this session's
  workspace naming, common pitfalls, and permission rules.

Pitfalls & Notes

- Do not assume project names or reuse old project folders. The user corrected
  this behaviour: when told "do not write to X", treat it as authoritative and
  avoid that folder entirely.
- If a tool fails transiently, re-run once and note the retry in the kanban card
  comments; only capture persistent, reproducible fixes as skill updates.

