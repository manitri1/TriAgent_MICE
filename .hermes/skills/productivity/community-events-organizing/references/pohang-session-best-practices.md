Pohang session (2026-07-27): session-specific best practices for single-room idea-contests and small showcases

Purpose
- Capture operational patterns, file templates, and role-card structure used during the Pohang regional content discovery contest so future events reuse them.

Project layout (recommended)
- /opt/data/workspace/<slug>/
  - README.md (project summary + contacts)
  - docs/ (final assembled docs, press release, 1p summary)
  - proposals/ (program draft, registration guide, booth-assessment)
  - marketing/ (SNS copy, poster copy, canva prompt)
  - assets/ (SVG floorplans, photos)
  - roles/ (role-cards per team member)
  - templates/ (program-template.md, registration fields, email templates)
  - tasks.md (master task list)
  - kanban.md (simple board)

Role-cards (one-page) structure
- Title: Role name
- Responsibility: short list
- Deliverables: specific files to produce
- Authority: what they may approve
- Backup: who fills in
- First-week actions: 3 immediate tasks
- Success metrics: 2-3 measurable KPIs

File templates created in-session (pointers)
- templates/program-template.md — minute-by-minute program layout
- templates/registration-form.md — canonical registration fields
- templates/role-card-template.md — the role-card structure above
- templates/email_invite.md — outreach email for partners/judges

Operational lessons
- Use small Showcase Corner rather than full vendor booths for single-room contests to save space and budget.
- Produce a small SVG floorplan and also a simple HTML 1-pager summary for quick printing and PDF export.
- Budget: show a recommended split for small events (audio/photography/judges/refreshments/contingency) and encourage early vendor quotes.

Communication cadence
- Weekly 30-minute standup; increase to twice-weekly at D-30 and then daily checks in the final week.
- Use tasks.md as the single source of truth for assignments; export to CSV for sharing.

Deliverables agent should make by default
- Program draft (MD)
- Registration guide (MD)
- One-page strategy summary (MD + HTML slide)
- Floorplan SVG
- Marketing copy and Canva prompt
- Role-cards (MD)

Session templates & quick commands
- Create project structure:
  mkdir -p /opt/data/workspace/<slug>/{docs,proposals,marketing,assets,templates,roles}
- Archive for handoff:
  tar -czf /opt/data/<slug>_materials.tar.gz -C /opt/data/workspace <slug>

Caveats
- Avoid hardcoding Windows paths in templates; provide guidance to users for pulling files via \\wsl$ or copying to /mnt/c.
- Keep files small and text-first; images and video are large and should be packaged as assets/ with README index.

Add this file as a session reference so future event-planning tasks can re-use the project layout and templates quickly.
