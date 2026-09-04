---
name: pohang-24-7-playbook
title: POHANG 24/7 playbook (local events)
description: "Playbook for organizing local events and marketing assets for POHANG 24/7. Includes canonical file locations, Windows/WSL sync patterns, Google Form template pointer, poster and landing templates, and user preferences (Korean-first)."
summary: "Local events playbook: templates, sync steps, pitfalls, and quick actions for POHANG 24/7."
author: Hermes Agent
created: 2026-08-10
tags: [events, local, marketing, templates, wsl]
---

# POHANG 24/7 playbook  guidelines

Purpose
- Provide a repeatable, team-facing playbook for the POHANG 24/7 local-events project: canonical file locations, marketing templates, Google Form spec, and robust WSL-to-Windows sync steps. Embed user preferences (Korean-first wording, canonical event title "포항 24/7").

When to use
- Use this skill whenever you: create marketing assets, build landing pages, prepare forms, or sync files for POHANG 24/7. It is a reference for consistent naming, formats, and deployment-ready artefacts.

Core conventions
- Canonical event title (display): "포항 24/7" (Korean-first). Use this text in headings, banners, and metadata.
- Canonical workspace: /opt/data/workspace/포항_24_7/ with subfolders: inputs/, marketing/, website/, roles/, outputs/.
- Marketing canonical files live under marketing/; inputs/ holds source PDFs and templates. Update marketing/* from inputs/* — do not edit inputs/ copy.
- Language: default outputs and templates are Korean. If a non-Korean language is requested, mark it explicitly in the artifact header.

WSL  Windows sync pattern (robust)
- Preferred flow when moving files to Windows:
  1. Prepare assets in WSL path: /opt/data/workspace/포항_24_7/marketing/
  2. Create a compressed archive (tar.gz) in /opt/data (portable across Windows):
     tar -czf /opt/data/pohang_24_7_marketing.tar.gz -C /opt/data/workspace/포항_24_7 marketing
  3. In Windows, fetch via File Explorer: \\wsl$\default\opt\data\pohang_24_7_marketing.tar.gz then extract to desired Windows folder.
- Fallback copy targets:
  - /mnt/c/Users/<WindowsUser>/Downloads (generally writable)
  - /mnt/e may be disallowed depending on OS policy — do not assume write access.
- Pitfall: do not hardcode /mnt/e in scripts. Prefer user-specified targets or \wsl$ method.

Google Form & registration
- Keep an editable CSV spec in inputs/google_form_fields.csv and a plain-text copy inputs/google_form_copy.txt for one-click admin copy-and-paste.
- Required form fields: name, email, contact, affiliation, work title, description, attachments, rights/consent checkbox.
- When Forms URL exists, generate a QR and insert into marketing/poster_copy.md and landing HTML.

Templates and references (bundled)
- templates/poster_A3.svg — A3 poster skeleton (header, hero, QR placeholder)
- references/google_form_fields.csv — form field CSV spec for importer
- references/google_form_copy.txt — admin copy text for manual paste

User preferences captured
- Use Korean by default for all deliverables and templates.
- Display title exactly as: "포항 24/7" (no underscores) in user-facing headers and banners.
- Deliverables should live under marketing/ and include creation date in filenames when exported for distribution.

Quick actions (how-tos)
- To update marketing copy and sync to Windows quickly:
  1. Edit /opt/data/workspace/포항_24_7/marketing/poster_copy.md and sns_posts.md
  2. Run: tar -czf /opt/data/pohang_24_7_marketing.tar.gz -C /opt/data/workspace/포항_24_7 marketing
  3. Use Windows Explorer to open \\wsl$\default\opt\data\pohang_24_7_marketing.tar.gz and extract.

Notes & pitfalls
- Do not encode environment-specific commands (eg. direct /mnt/e copies) into templates; they often fail in other machines. Record both methods (\wsl$ copy and /mnt/c target) and ask the user for preferred Windows target.
- Server-side document conversions (pandoc, soffice) may not be available in this environment. Recommend local conversion or Google Drive conversion as a documented fallback in templates.

References and templates included with this skill
- references/google_form_fields.csv (Form spec)
- references/google_form_copy.txt (Admin copy/paste text)
- templates/poster_A3.svg (Poster skeleton)

