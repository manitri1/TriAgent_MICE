---
name: community-events-organizing
title: Community events organizing (local contests, meetups, exhibitions)
description: "Class-level guide for planning and running small-to-medium local events (contests, showcases, meetups). Includes checklists, templates, layout guidance, marketing copy, and common pitfalls discovered while running the 'Pohang regional content discovery contest'."
version: 1.1.0
author: Hermes Agent
license: MIT
tags: [events, planning, marketing, operations, templates]
---

# Community events organizing

This skill covers repeatable best-practices for planning and operating small-to-medium local events: idea contests, showcases, community meetups, and single-room in-person events (audience 20–200). It encodes checklists, folder/layout conventions, marketing templates, venue/AV guidance, and operational playbooks derived from recent sessions (notably: "Pohang regional content discovery contest").

Use this skill when: you need a ready project skeleton, marketing copy, seating/layout advice, registration templates, or runbooks for rehearsal and day-of operations.

Core outputs
- Project folder skeleton and README
- Master task list + kanban template
- Registration form template
- Poster / Canva prompt template
- Venue layout guidance and small-showcase vs full-booth decision logic
- Day-of runbook (timing, roles, AV checklist)

Quick principles (short)
- Prioritize audience flow and presentation visibility over exhibitor density in single-room events.
- For <>50 people indoors prefer "Showcase Corner" or digital showcase rather than full commercial booths.
- Keep files organized under workspace/<project-name>/ with folders: docs, marketing, assets, operations, templates.
- Provide one-line owner and backup for every action item; document decisions in docs/decisions.md.

Pitfalls and fixes (learned)
- "Try to copy files directly to Windows E: and hit permission denied": avoid writing to /mnt/e from automated scripts; instead create archives or copy to /mnt/c/Users/<User>/Downloads/ or instruct user to use \\wsl$ share. Document this as a known platform quirk.
- Missing print-ready assets: always export poster as PDF/X-1a with 3mm bleed and provide PNG social variants.
- AV failures: require AV dry-run (30 min) and at least one backup microphone + spare laptop.

Project templates (pointers)
- registration_form.md (templates/) — field list for online form
- poster_copy.md (templates/) — A3 poster headline + body copy
- canva_prompt.txt (references/) — ready-to-paste Canva prompt
- layout_no_booth.svg (assets reference) — default seating layout SVG
- strategy_plan_template.md (templates/) — team strategy planning template (structure + prompts)
- google_form_strategy_based.csv (templates/) — field list CSV for a strategy-focused intake form
- google_form_strategy_based_copy.txt (references/) — copy-paste admin text for Google Form creation
- pohang-session-best-practices.md (references/) — condensed operational lessons learned from the Pohang session

References and session notes (short)
- The Pohang session recommended *no full exhibitor line-up* for a 50-person single-room contest; instead use 2–4 small demo tables (Showcase Corner) and QR-based digital galleries.
- Keep marketing cadence: Save-the-date (D-30), Launch (D-21), Reminder (D-14), Final reminders (D-7/D-3/D-1).

How to use
1. Run: create project folder under workspace/ and copy core SKILL templates into it.
2. Edit templates/registration_form.md and poster_copy.md to include event-specific fields and contacts.
3. Use layout_no_booth.svg as baseline; adapt to venue dimensions if available.
4. Run a rehearsal (AV + flow) at D-1; document issues in docs/decisions.md.

Want me to scaffold a project now? I can create the folder skeleton, inject templates, and open tasks.md with initial owners.
