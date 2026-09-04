---
name: local-events-playbook
title: Local Events Playbook (single-room contests)
description: "Reusable playbook, templates, and checklists for organizing small local contests and showcases (single-room, ~30-80 attendees)."
version: 1.0.0
author: Hermes Agent / user-collab
license: MIT
---

# Local Events Playbook

This skill collects class-level guidance, templates, and references for small single-room events such as local content contests, pitch nights, and community showcases. It is intended to be re-used across projects and updated when new good practices emerge.

## Goals
- Provide a repeatable checklist and timeline for running small contests (venue, AV, seating, program, judging, media).
- Standardize file paths, naming conventions, and deliverable formats for easy handoff and reproducibility.
- Include templates for program, registration, SNS copy, layout, and postmortem.

## When to use
- Running a community contest, pitch night, or small conference in a single indoor space.
- Preparing program/agenda, recruiting participants, setting up AV and seating, and producing marketing assets.

## Core content
- Timeline (81 weeks pre-event → day-of → post-event report)
- Roles & RACI matrix for small teams (5 members)
- AV & layout guidance (theater seating, Showcase Corner alternative)
- Marketing starter pack (SNS copy, poster copy, Canva prompt)
- Budget priorities and contingency planning

## Deliverables (copy-paste paths)
- /opt/data/workspace/<project-slug>/program.md
- /opt/data/workspace/<project-slug>/registration-guide.md
- /opt/data/workspace/<project-slug>/layout.svg
- /opt/data/workspace/<project-slug>/sns_posts.md
- /opt/data/workspace/<project-slug>/canva_prompt.txt
- /opt/data/workspace/<project-slug>/postmortem.md

# Session-derived support (added from recent POHANG_24_7 run)
The POHANG_24_7 session produced several repeatable artifacts and a canonical workflow that should be available to future projects:

References (session notes & recipes)
- references/pohang_247_session_notes.md — concise session notes, archival recipe, and step checklist for POHANG_24_7
- templates/google_apps_script_ko.js — Korean Google Apps Script template to auto-create registration forms (copy & run in script.google.com)
- templates/canva_prompt_pohang.txt — Canva prompt template and export notes for POHANG-style posters

- references/pohang_247_session_notes.md  — concise session notes and choices made in POHANG_24_7 (useful checklist and decisions)
- references/master-guidance.md          — safe recipe for "archive older files then regenerate from master.pdf" including archive-report template and shell snippet
- references/pohang_24_7_marketing_templates.md — examples of marketing copy, filenames and export recommendations used in the session

Templates (starter files)
- templates/canva_master_prompt.txt      — 22-page Canva master prompt (multi-page submission package template)
- templates/google_apps_script_ko.js     — Google Apps Script (Korean form generator) with run instructions in header
- templates/role_RnR_template.md         — role R&R template (D-90→D-Day, deliverables, checklists)
- templates/workspace_structure.md       — canonical project workspace layout and mkdir scaffold

Why these belong here
- The "master-driven canonicalization" pattern used in POHANG_24_7 (choose a single source-of-truth PDF/Plan, archive any older drafts, then regenerate standardized templates from short metadata) is now a recommended practice for this skill. See references/master-guidance.md for the safe commands and the policy for archiving.

User preferences baked in (from session)
- Default outputs: Korean language, concise, editable formats (Markdown/DOCX/PPTX), and Canva prompts for visual assets.
- Default storage: write every deliverable directly under /opt/data/workspace/<project-slug>/. This path is a live bind mount of the host's `.hermes/` folder (see "Windows visibility" below) — there is no separate draft tier and no copy/mirror step needed before the file is real.

Small automation hints
- Use the google_apps_script_ko.js template to create a Korean registration form and set destination spreadsheet; include the generated spreadsheet URL in the project's outputs/manifest.md.
- If `pdftotext` (poppler) is available, the skill recommends `pdftotext -layout master.pdf master.txt` as the first step for master text extraction. If not available, provide the short metadata (title/date/venue/KPIs) manually.

(End patch)

# Added guidance: workspace layout and marketing assets
- Canonical project workspace (single source of truth): /opt/data/workspace/<project-slug>/
  - templates/
  - marketing/
  - program/
  - outputs/
  - roles/
  - media/
- When onboarding a project, create this workspace directly (no separate mirror/staging copy) — it is already the handoff location for the desktop app and designers.

# Marketing assets: canonical filenames and locations
- Place editable/vector originals in: /opt/data/workspace/<project-slug>/marketing/
  - poster_A3.svg            (A3 print vector)
  - insta_1080.svg           (1080×1080 feed)
  - story_1080x1920.svg      (1080×1920 story/reel)
  - canva_prompt.txt         (Canva prompt & design notes)
  - sns_posts.md             (3× post copy variants)
- Exported output naming convention (versioned): poster_A3_print_v1.pdf, instagram_feed_v1.png, instagram_story_v1.png

# Folder-normalization rule (pitfall & fix)
- Pitfall: some contributors create nested folders like marketing/marketing, docs/docs, website/website. This complicates sync and designer handoff.
- Fix (apply automatically when onboarding): if a child folder has the same name as its parent (e.g., marketing/marketing), move the child contents up one level and remove the empty child folder. Preserve existing files — on name collision, do NOT overwrite; instead create a conflict report for manual review.
  - Script hint: use a safe mv loop that skips existing targets and writes a CSV of moved and skipped files.

# Windows visibility (no sync step needed)
- `/opt/data` inside the container is a live bind mount of the host's `E:\work\Hermes\TriAgent_MICE\.hermes` folder (docker-compose.yml: `./.hermes:/opt/data`). Anything written to `/opt/data/workspace/<project-slug>/...` already IS `E:\work\Hermes\TriAgent_MICE\.hermes\workspace\<project-slug>\...` on the Windows host, instantly — no cp, rsync, or "mirror" step exists or is needed.
- When telling the user where a deliverable landed, just give them the Windows path directly (translate `/opt/data/...` → `E:\work\Hermes\TriAgent_MICE\.hermes\...`), and include a one-line manifest (`outputs/manifest.md`) listing exported files and versions.

# Canva workflow (short)
- Keep editable SVGs + canva_prompt.txt in marketing/. Designers open SVG in Canva, insert QR via Canva's QR app, polish, and export PDFs/PNGs.
- For print: export PDF (Print) with 3mm bleed and 10mm safe margin; name output as poster_A3_print_v1.pdf.

# References pointer
- See references/pohang_session_notes.md for a concise session-specific checklist, example filenames, and a sample shell snippet for normalizing nested folders.

## Templates (examples)
- templates/event-program.md  — agenda template with timings
- templates/registration-guide.md — applicant-facing instructions
- templates/sns-pack.md — 3 feed posts + 3 story frames
- templates/layout-guideline.svg — editable vector layout blueprint
- templates/canva_prompt.txt — Canva prompt & export instructions (session: 포항_24_7)

Pointers: session-specific marketing files and SVG assets were added under references/ and templates/ for the 포항_24_7 run. See references/pohang_24_7_marketing_templates.md and templates/canva_prompt.txt for example assets, file paths, and a Canva-first workflow.
## Quick checklist (runbook)
- Confirm venue & capacity
- Open registration form + test submissions
- Secure AV quote + reserve tech support
- Draft and approve program & speakers
- Design posters & QR link; distribute to campus and local hubs
- Collect presentation files 1 week before; schedule rehearsal
- Day-of: staff briefing, registration desk, AV test, timeline enforcement
- Post-event: gather photos, send survey, compile postmortem

## Operational pitfalls & mitigations
- AV failure: Reserve venue AV + backup portable mic and HDMI adapter
- Low registration: University outreach, partner organizations, extend deadline
- Running late: Keep strict session timing & a timekeeper role

## References (local)
- references/local-event-playbook.md — session-specific playbook (copy into project folder path above)

## How to extend
- Add session-specific references under `references/<project-slug>/`
- Improve templates in `templates/` when a better workflow is proven

## Usage notes
- Default language: Korean for community/local events unless specified otherwise. When a user requests a different language, the agent should ask once and confirm before producing the final deliverable.
- Deliverable formats: prefer editable files (Markdown, DOCX, PPTX) and always include Canva prompts for any visual assets. Default exports and working copies should live under the project workspace: `/opt/data/workspace/<project-slug>/`.

### Master-document-driven canonicalization
When a project provides a master planning document (PDF or Word) that is the single source of truth, follow this process before editing or publishing derived deliverables:

1. Identify master file and record exact path (e.g. `/opt/data/workspace/<project-slug>/inputs/2026_master.pdf`). Treat that file as authoritative for short canonical strings (title, venue, dates, submission deadlines, KPIs).
2. Archive any existing project files older than the master into `archive/before_master_<timestamp>/` (preserve relative paths). This prevents stale drafts from conflicting with the canonical document and makes rollback straightforward.
3. Generate standardized templates (program, registration guide, consent, marketing prompts) from a small metadata set pulled from the master: {title, date/time, venue, submission_deadline, organizer, KPIs}. For short fields prefer exact master strings; for body text use template language and request user verification.
4. If verbatim extraction from the master PDF is required, use `pdftotext -layout master.pdf master.txt` (poppler). If poppler is not available in the environment, ask the user to run the extraction locally and upload the resulting text file, or paste the exact strings to be used.
5. Generate the derived deliverables directly into `/opt/data/workspace/<project-slug>/` and present an index of changed files for user approval; record the action in `outputs/manifest.md`. There is no separate staging copy — the workspace path is already the production path.

Pitfalls & mitigations
- Do NOT delete archived files; keep them under `archive/before_master_<timestamp>` for audit and rollback.
- System installs (poppler/pdftotext) require admin privileges and cannot be assumed. If extraction is necessary and install is not possible, prefer option: user-run extraction (3) or manual copy of canonical strings (1).
- PDF text-extraction is error-prone (encoding, layout); rely on human verification for short canonical fields.

Templates & scripts
- Add `references/master-guidance.md` to this skill with a small recipe and safe shell snippet for archiving older files and producing an archive report; keep it session-agnostic and runnable where admins permit.

Behavioral rule (agent)
- When asked to canonicalize content against a master doc: (A) propose the archive-and-generate plan to the user, (B) run archiving only after user OK, (C) either request extracted text or use a short metadata list supplied by the user.

(See references/master-guidance.md for the sample commands and example archive-report template.)
- Project workspace policy (MANDATORY practice):
  - Create and maintain exactly one canonical project workspace at `/opt/data/workspace/<project-slug>/` for every event. This is the only path — do not create a second copy under `.hermes/workspace` or any other root.
  - Before creating a new project folder, check whether `/opt/data/workspace/<project-slug>/.project_config.json` already exists for this event under any similarly-named slug (e.g. an English vs. Korean name for the same event). If an existing folder looks like it covers the same event, ask the user whether to reuse it instead of starting a new slug — this prevents the same project's output splitting across multiple folders.
  - On first bootstrap of a project, create `/opt/data/workspace/<project-slug>/.project_config.json` recording `{ "project": "<project-slug>", "root": "/opt/data/workspace/<project-slug>" }` so future sessions can detect and reuse the same slug instead of guessing a new one.
  - Required subfolders (create these on project bootstrap): `templates/`, `marketing/`, `program/`, `outputs/`, `roles/`, `media/`. Optional: `website/`, `proposals/`.
  - Example layout:
    - /opt/data/workspace/<project-slug>/templates/
    - /opt/data/workspace/<project-slug>/marketing/
    - /opt/data/workspace/<project-slug>/program/
    - /opt/data/workspace/<project-slug>/outputs/
    - /opt/data/workspace/<project-slug>/roles/
    - /opt/data/workspace/<project-slug>/media/
  - After creating or copying files the agent must verify contents with a directory listing and return a short indexed summary (path + one-line description) to the user.

- Windows visibility (no sync step, no consent gate needed):
  - `/opt/data` is a live bind mount of `E:\work\Hermes\TriAgent_MICE\.hermes` (WSL mount: `/mnt/e/work/Hermes/TriAgent_MICE/.hermes`). `/opt/data/workspace/<project-slug>/...` and `E:\work\Hermes\TriAgent_MICE\.hermes\workspace\<project-slug>\...` are the same files on disk — writing one is writing the other, instantly. No `cp`/`rsync` step exists or should ever be run for this purpose.

- Deliverable defaults & required support files:
  - Deliverable formats: prefer editable files (Markdown, DOCX, PPTX, XLSX) and produce PDFs only as exports.
  - Always save a Canva prompt for visual assets in `marketing/canva_prompt.txt`.
  - Always include a consent template in `templates/consent_copyright.md` and offer to convert to DOCX/PDF for signing.
  - Provide `templates/google_apps_script_ko.js` as a ready-to-run Google Apps Script for registration forms, and a one-line run instruction comment at the top.
  - Place any session-specific notes or proof artifacts under `references/<short-name>.md` in the skill repo when appropriate.

- Workflow & behavior rules (agent must follow):
  - When asked to create event assets, (1) produce editable sources into `/opt/data/workspace/<project-slug>/`, (2) produce an outputs/ index CSV or Markdown with file paths and short descriptions, (3) offer conversion to DOCX/PDF as an opt-in follow-up (Windows visibility is automatic — nothing to offer there).
  - When providing Google Apps Script templates, include a short step-by-step run guide and the target spreadsheet name in the comment header.
  - When producing consent or legal-adjacent templates, remind the user to request legal review and offer conversion for signature-ready copies.

- DOCX/export notes: many small deployments lack server-side converters (pandoc/libreoffice). Prefer producing Markdown first and instruct users to convert locally (pandoc or Word) or use browser "Print to PDF" from the HTML summary. A minimal markdown→docx helper is allowed in `templates/` for convenience.

- Roles & R&R practice: create role R&R files early. Use the role template `templates/role_RnR_template.md` and place completed files under `roles/`. Each role doc should include D-90→D-Day milestones, daily/weekly routine, deliverables, dependencies, and a D-Day checklist.

- Scheduling conventions: use D-90/D-60/D-30/D-14/D-7/D-Day/D+14 milestones. Push per-role checklists into `tasks.md` and export CSV for import to external trackers. Keep a single source-of-truth in `/opt/data/workspace/<project-slug>/`.

- User preferences: default outputs should be concise, in Korean, and deliverables editable. Embed these defaults into generated templates and checklists.

# References file pointer
Place session details, checklists, and examples under `references/` in skill dir for quick access. Examples saved in workspace path `/opt/data/workspace/포항_24_7/proposals/` are good models to copy into new projects.


<!-- ADDED: pointers to new support files -->

Note: This skill now includes (under `templates/` and `references/`) helper files created during the Pohang MICE Academy session: `templates/role_RnR_template.md`, `templates/google_apps_script_ko.js`, and `references/pohang_session_notes.md`. Use them as starting points and copy into project workspaces.

## POHANG_24_7 — session-driven updates (actionable rules & templates)
The recent POHANG_24_7 run clarified several repeatable practices and added small tools/templates you should prefer when organizing similar single-room contests. These are now part of the skill and should be the agent's default behavior for new projects.

1) Inputs-as-canonical-source (MANDATORY when present)
- If the project provides a single master planning file under `inputs/` (PDF or DOCX), treat it as the canonical source for short canonical fields (title, date/time, venue, submission deadline, KPIs) and for metadata-driven template generation.
- Practical steps the agent should follow when an inputs master exists:
  a) Confirm path and checksum of the master file; report it to the user (path + sha256). Use it as the only source for short canonical strings.
  b) Archive older workspace content to `archive/before_master_<timestamp>/` before regenerating derived assets. Produce `archive/report.csv` listing moved files.
  c) Generate derived templates (program.md, poster copy, registration guide, manifest) from a small metadata extraction step — ask the user to confirm any ambiguous strings before publishing.

2) Marketing folder canonicalization
- Rule: marketing/ should contain final editable sources and exports; when the user supplies an inputs master PDF in `inputs/`, the agent SHOULD copy the master into marketing/ as `marketing/<master_filename>.pdf` and then regenerate poster copy / canva_prompt entries referencing that master. The agent must report the copy action and the resulting marketing paths.
- Example (applied in POHANG_24_7): the inputs PDF `2026_포항MICE_행사계획서_몽쉘야호_제출본.pdf` was copied to `marketing/` and marketing files (poster_copy.md, canva_prompt.txt) were updated to reference it as canonical — this is the pattern agents should follow automatically when a master is supplied and the user asks to "sync marketing." Do not overwrite marketing originals without user confirmation; always create a dated backup.

3) Google Forms automation
- Use `templates/google_apps_script_ko.js` as the default Apps Script template for Korean-language registration forms. The template MUST include a short header with:
  - target spreadsheet name
  - form title and description
  - one-line run instructions for the user to paste into script.google.com and run `createStrategyFormKR()`
- After form creation, the agent should insert the live form URL into `marketing/` and the responses sheet URL into `outputs/manifest.md`.

4) DOCX export & style defaults
- Produce editable Markdown first, then offer DOCX with light styling (Title/Heading/Normal) and event header. The skill now ships a minimal DOCX helper template in `templates/` that the agent can use to create styled DOCX files quickly. The agent should:
  - write Markdown under `roles/` or `outputs/` as source
  - create a styled DOCX `*_styled.docx` and place it beside the source
  - if the environment lacks server-side converters, instruct the user on local conversion and offer to generate DOCX via the helper when allowed.

5) Calendar exports
- The agent should generate a `calendar/calendar_events.csv` alongside the Markdown calendar summary and supply import instructions for Google Calendar/Outlook. CSV column conventions are included in `templates/` and the agent should update `marketing/README.md` with the CSV path when calendars change.

6) User preferences (persist to skill behavior)
- Default language: Korean. Default deliverables: concise, editable, and include Canva prompts for any visual asset.
- Default storage: `/opt/data/workspace/<project-slug>/` (translate to Windows path for user-facing messages: `E:\work\Hermes\TriAgent_MICE\.hermes\workspace\<project-slug>`).
- When user explicitly requests Windows target path, offer guidance and attempt copy only with permission and after checking mount permissions.

7) Pitfalls learned & mitigations (do not harden environment errors)
- Conversion tools (pandoc/libreoffice) may be unavailable; prefer browser-based PDF export or local conversion instructions. The agent records this as a mitigation, not as a refusal.
- If a marketing folder already contains a file with the same name as the master, do not overwrite; create `marketing/<name>_from_inputs_<timestamp>.pdf` and log the action.

Support files added (references/templates)
- references/pohang_247_session_notes.md — session notes, decision log, sample manifest
- templates/google_apps_script_ko.js — Korean Apps Script form generator (with header run instructions)
- templates/role_RnR_template.md — role R&R template (milestones, deliverables, D-Day checklist)
- templates/calendar_csv_template.csv — CSV template for calendar import

Behavioral rule (agent)
- When the user asks "sync marketing to inputs" or similar, propose the exact copy name and the archive plan, then execute only after explicit confirmation.

(End session-driven patch)
