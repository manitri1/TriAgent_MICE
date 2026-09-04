---
name: event-planning
description: "Class-level skill for planning small-to-medium events (workshops, contests, meetups) with templates, checklists, and reproducible outputs (programs, registration guides, slides)."
version: 1.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
---

# Event Planning (Hermes skill)

This skill collects proven workflows, templates, and pitfalls for running local events such as idea contests, workshops, and meetups. It is intended to be used by the agent when the user requests planning, document generation (programs, registration guides), or slide/Canva prompt creation.

Core capabilities
- Produce a program (식순) draft in Markdown with timings and roles.
- Produce a registration/participant guide in Markdown suited for copy-paste into forms or emails.
- Produce slide content + designer prompts (Canva/GDocs) and optionally generate PPTX if environment allows.
- Provide budget allocation examples and a short risk-response playbook.

When to use
- User requests an event plan, program/agenda, registration materials, slide deck content, or Canva prompts.
- Agent must produce reproducible files (Markdown, PPTX, templates) and save them in the workspace.

Principles and conventions
- Save artifacts under `/opt/data/workspace/<project-slug>/proposals/` by default. Example: `/opt/data/workspace/포항_24_7/proposals/`.

File & workspace conventions (agent-added guidance):
- Preferred workspace root: `/opt/data/workspace/<project-slug>/`. This is a live bind mount of the host's `E:\work\Hermes\TriAgent_MICE\.hermes` folder, so files written here already appear at `E:\work\Hermes\TriAgent_MICE\.hermes\workspace\<project-slug>\` on Windows — no extra sync step. Create this subtree for every active project: `docs/`, `website/`, `marketing/`, `roles/`, `outputs/`, `archive/`, `inputs/`.
- Naming: include a date suffix YYYYMMDD on every generated deliverable filename so teams can pick the latest file by name. Example: `outputs/Marketing_Park_Youngbok_execution_plan_20260807.md`.
- Non-destructive moves: when reorganizing user files, copy originals into `inputs/` and write dated outputs into `outputs/`; only move (delete/overwrite) with explicit user approval.
- Website assets: put `index.html`, `styles.css`, and `assets/` under `website/`. Put the registration embed URL (Google Forms) in `website/README_deploy.md` as FORM_URL and include short-link (bit.ly) + QR image in `assets/`.
- Metadata: generated documents should include a small header block with `author`, `role`, `date` and `path` (absolute) so reviewers can quickly confirm provenance.
- Automation template: agent SHOULD offer a one-shot `templates/prepare_workspace.sh` (or a cross-platform README) that bootstraps folders and archives legacy files into `inputs/` with date suffixes; use it when the user requests file reorganization.

Rationale: consistent folders + dated filenames reduce confusion in multi-person event teams and make automated deployment, archiving, and handover straightforward. Patching this skill ensures the agent follows the user's explicit preference discovered in the session.

- Every generated program and registration guide includes: header (행사명/일시/장소/목적), detailed timeline, presenter instructions, submission rules, judging criteria, and contact info.
- Prefer bite-sized tasks and explicit next actions (who does what by when).
- When asked to create slides, produce (1) slide text for each slide, (2) short presenter notes, and (3) a Canva prompt. If PPTX generation is requested, attempt python-pptx; if unavailable, fallback to Markdown + user-conversion guidance.

Pitfalls and fixes (learned from sessions)
- python-pptx may not be installed in the runtime. Avoid assuming availability. Preferred fallback sequence:
  1. Try to generate PPTX programmatically (python-pptx). If import fails, catch the exception and inform the user the package is missing.
  2. Offer a quick install command the user can run locally: `pip install python-pptx` (or `pipx install python-pptx` / use venv). Provide a small script that converts existing Markdown to PPTX using `python-pptx` for users who can run it locally.
  3. If package install is not desired, supply a ready-to-use Markdown slide pack and a Canva prompt so the user or designer can recreate the deck quickly.

- Save paths and filenames explicitly in responses. Use absolute workspace paths when writing files: `/opt/data/workspace/<project-slug>/...` (agent's working dir is /opt/data, which is a live bind mount of the host's `.hermes/` folder — no sync step needed for the file to appear on Windows).

Templates & support files
- This skill includes references and templates under `references/` and `templates/` (see linked files). After creation the agent may add session-specific items to `references/.`
- Session recipe: `references/pohang-mice-case.md` — WSL/Windows path handling, workspace recipes, serve & archive commands (practical notes from a Pohang MICE Academy planning session).
- Added (2026-08) quick web/landing support: small static landing + Google Forms embed is the recommended rapid pattern for registration. See `templates/landing-template.html` and `templates/styles.css` for a ready-to-use starter, and `references/website-deploy-guide.md` for deploy/UTM/GA4/QR guidance. Agents should copy these files into the project workspace and replace the FORM_EMBED_SRC placeholder with the project's Google Form embed URL.
- Website & registration guidance (new): when a registration site is needed prefer the following decision flow and document the chosen option in `references/registration-website.md`:
  • Option A (fastest, RECOMMENDED): Static landing page + Google Forms embed. Ship time: a few hours. Use when file uploads are minimal and you need a public shareable page with OG/QR support. Save files to `/opt/data/workspace/<slug>/proposals/website/` and include `README_deploy.md` with FORM_URL and short-link.
  • Option B (serverless forms): Static site + Netlify Forms / Formspree + S3/Firebase storage for file uploads. Ship time: 1-3 days. Use when applicants must upload materials. Document storage quotas and signed-upload flow in `references/registration-website.md`.
  • Option C (custom backend): Node/Django + DB + storage. Ship time: weeks. Use only when you require approval workflows, user accounts, or admin dashboards. Document API endpoints and deployment notes in `references/registration-website.md`.

  Required checklist for any chosen option:
  - OG meta + og:image and Twitter Card configured
  - Short link (bit.ly) & QR image generated and saved in `assets/` under the project folder
  - UTM convention agreed (example: ?utm_source=instagram&utm_medium=post&utm_campaign=<campaign>) and tracked in a campaign sheet
  - GA4 + Google Tag Manager snippet and basic events (form_submit) documented in `references/` for the project
  - Mobile responsive and basic accessibility checks (contrast, form labels)

  Quick QA tests (documented and repeatable):
  - Submit a test registration including optional file upload (if supported). Confirm CSV/Drive or storage entry and notification email delivery.
  - Test on Chrome/Firefox/Safari and iOS/Android for layout and input behavior.
  - Test short-link & QR to ensure landing page and form open correctly.
  - Confirm backup contact channel (email) and rate-limit/spam protection (reCAPTCHA or one-response-per-account) are in place.

  Where to save things (convention):
  - `/opt/data/workspace/<slug>/proposals/website/` — index.html, styles.css, assets/(og-image.png, qr.png, logo.png)
  - `/opt/data/workspace/<slug>/proposals/website/README_deploy.md` — deployment instructions, FORM_URL, GA4 ID, short-link
  - `/opt/data/workspace/<slug>/proposals/references/registration-website.md` — session-specific decision record (option chosen, storage details, UTM mapping)

  When to patch this skill: if a provider exhibits a repeated quota/limit behaviour (Netlify Forms upload limit, Google Forms quotas), add a short “provider quirks” note to `references/registration-website.md` rather than changing the main skill text.


- references/marketing-checklist.md: marketing week-by-week TODO template, promo copy & Canva prompts, and Google Forms field list (session reference).
- references/pohang-mice-guidance.md: session-specific canonical event copy (title/date/venue/purpose) and sponsor outreach templates created during the 2026-08 workflow. Use this file as the canonical text source for all generated marketing and role documents.
- references/project-structure-guidelines.md: recommended workspace layout and file-naming conventions (inputs/, outputs/, website/, marketing/, roles/, docs/, archive/) plus dated-filename policy (YYYYMMDD) to avoid ambiguity.
- references/registration-website.md: step-by-step decision flow for registration options (A: static + Google Forms, B: Netlify Forms/Firebase, C: custom backend), checklist, and provider quirks to consult before choosing an option.

Templates:
- templates/landing-template.html: small static landing template with FORM_EMBED_SRC placeholder and OG meta section; copy into `/opt/data/workspace/<slug>/proposals/website/` and replace placeholders.
- templates/marketing-readme-template.md: a README template for marketing folders, prefilled with canonical event copy and asset naming examples.

New scripts:
- scripts/convert_instructions.sh: a local helper script (written to project proposals/sponsorship/) that guides conversion of Markdown sponsor docs to DOCX/PDF via pandoc. Include instruction that pandoc/LaTeX must be installed on the runner.

Usage note (2026-08 update): when the user asks to prepare sponsorship materials, the agent will now (1) generate sponsor_onepager.md and sponsor_proposal.md under `proposals/<slug>/sponsorship/`, (2) create sponsor_tiers CSV, (3) create outreach_list template CSV and a convert_instructions.sh script, and (4) add references/pohang-mice-guidance.md to the skill's references so the canonical copy is always used. This makes upcoming sessions reproducible and avoids inconsistent event copy being generated.

Example quick workflow
1. Gather core facts (title, date, place, targets, budget). If any missing, ask only the minimal question.
2. Produce program draft markdown and registration guide markdown and save to `/opt/data/workspace/<slug>/proposals/`.
3. Produce slide content + Canva prompt and save to the same folder.
4. Offer to generate PPTX; attempt python-pptx if allowed. If it fails, offer the install script and an alternative deliverable (PDF via external tool or manual conversion instructions).

Files created by this skill should be small, copy-paste friendly, and explicitly reference the container path where they were saved.
