Session notes: MICE Networking Day (2026-09-03)

Purpose: capture operational lessons from recent "마이스_네트워킹데이" session and provide bite-sized reference for future runs.

Key decisions and conventions to reuse
- Canonical workspace: /opt/data/workspace/<project_key> (must be used for all new projects)
- Always create artifacts under project/inputs, project/outputs, project/docs, project/roles
- Active Verification: qualify a task as 'done' only after one of the following is verified:
  - the file exists at the stated outputs path and opens without error
  - an external system (vendor page / contract / email) confirms the action
  - at least one independent evidence item (invoice, screenshot, vendor link) is stored in outputs/
- HITL gates (must be explicitly checked by PM): final budget approval; first sponsor/speaker outbound; crisis agenda/major scope change

Practical tips
- When asking vendors for quotes, request: unit price, VAT, installation, delivery date, payment terms (electronic invoice required)
- Prefer small-template kanban cards with fields: title | assignee | due | priority | outputs (paths) | acceptance-criteria | HITL-required(true/false)

References
- /opt/data/workspace/마이스_네트워킹데이/outputs/proposal_draft.md
- /opt/data/workspace/마이스_네트워킹데이/roles/role_assignments.md

If this file is present, task-dispatch agents should copy its checklist into the new project's references/ folder and use the templates/kanban-card.md template.
