Session-specific workspace conventions and quick rules

- Project workspace: always ask the user to confirm the workspace path before creating files. Standard example: /opt/data/workspace/<project_name>
- Typical folder layout (create if missing):
  - inputs/  (source logs, uploads from user)
  - outputs/ (generated artifacts: proposal_info_1p.md, budget_preview.xlsx)
  - docs/    (kanban_cards.md, verification_log.md, PROJECT_SUMMARY.md)
  - templates/ (local copies of templates used)
- Never write into another project's folder (e.g. "포항_24_7") unless user explicitly permits cross_profile writes and you pass cross_profile=True in write_file. When permitted, record the permission in docs/permissions.md (who authorised, when).
- File naming conventions: include date and agent tag, e.g. proposal_info_1p_20260903_proposal-agent.md
- Active Verification checklist (short):
  1) File exists at claimed path
  2) Required sections present (check headers)
  3) At least N=3 external links for claims requiring evidence
  4) If external action claimed (payment, email), capture external system evidence (status / id)

Common pitfalls
- Creating artifacts in old project folders (user corrected this). When corrected, stop and move all future work to the named workspace.
- Marking tasks done on agent text alone. Always open files and perform checks.

Usage note: copy this file into the project's docs/ when you start a new event so the whole team can see workspace rules.

Kanban tie-in: the workspace path confirmed here is also what you pass as
`workspace: "dir:<path>"` on every `kanban_create()` call for that event, and
the event slug (folder name) doubles as the `tenant` value on those same
calls — see templates/kanban_create_call_reference.md. This is what gives the
"never mix event data" rule above a real technical backing (board-level
tenant isolation), not just a prompt-level rule.