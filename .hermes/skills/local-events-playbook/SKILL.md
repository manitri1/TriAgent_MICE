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
- /opt/data/<project-slug>/program.md
- /opt/data/<project-slug>/registration-guide.md
- /opt/data/<project-slug>/layout.svg
- /opt/data/<project-slug>/sns_posts.md
- /opt/data/<project-slug>/canva_prompt.txt
- /opt/data/<project-slug>/postmortem.md

## Templates (examples)
- templates/event-program.md  — agenda template with timings
- templates/registration-guide.md — applicant-facing instructions
- templates/sns-pack.md — 3 feed posts + 3 story frames
- templates/layout-guideline.svg — editable vector layout blueprint

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
- Default language: Korean for community/local events unless specified otherwise
- Save all deliverables to /opt/data for run reproducibility


# References file pointer
Place session details, checklists, and examples under `references/` in skill dir for quick access. Examples saved in workspace path `/opt/data/proposals/pohang-mice-academy-2026/` are good models to copy into new projects.
