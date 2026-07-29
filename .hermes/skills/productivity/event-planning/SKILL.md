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
- Save artifacts under `./proposals/<project-slug>/` by default. Example: `./proposals/pohang-mice-academy-2026/`.
- Every generated program and registration guide includes: header (행사명/일시/장소/목적), detailed timeline, presenter instructions, submission rules, judging criteria, and contact info.
- Prefer bite-sized tasks and explicit next actions (who does what by when).
- When asked to create slides, produce (1) slide text for each slide, (2) short presenter notes, and (3) a Canva prompt. If PPTX generation is requested, attempt python-pptx; if unavailable, fallback to Markdown + user-conversion guidance.

Pitfalls and fixes (learned from sessions)
- python-pptx may not be installed in the runtime. Avoid assuming availability. Preferred fallback sequence:
  1. Try to generate PPTX programmatically (python-pptx). If import fails, catch the exception and inform the user the package is missing.
  2. Offer a quick install command the user can run locally: `pip install python-pptx` (or `pipx install python-pptx` / use venv). Provide a small script that converts existing Markdown to PPTX using `python-pptx` for users who can run it locally.
  3. If package install is not desired, supply a ready-to-use Markdown slide pack and a Canva prompt so the user or designer can recreate the deck quickly.

- Save paths and filenames explicitly in responses. Use absolute workspace paths when writing files (agent's working dir: /opt/data).

Templates & support files
- This skill includes references and templates under `references/` and `templates/` (see linked files).
- Session recipe: `references/pohang-mice-case.md` — WSL/Windows path handling, workspace recipes, serve & archive commands (practical notes from a Pohang MICE Academy planning session). After creation the agent may add session-specific items to `references/`.

Example quick workflow
1. Gather core facts (title, date, place, targets, budget). If any missing, ask only the minimal question.
2. Produce program draft markdown and registration guide markdown and save to `./proposals/<slug>/`.
3. Produce slide content + Canva prompt and save to the same folder.
4. Offer to generate PPTX; attempt python-pptx if allowed. If it fails, offer the install script and an alternative deliverable (PDF via external tool or manual conversion instructions).

Files created by this skill should be small, copy-paste friendly, and explicitly reference the container path where they were saved.
