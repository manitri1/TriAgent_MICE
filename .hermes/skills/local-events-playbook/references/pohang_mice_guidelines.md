Pohang MICE Academy  Agent reference: project-specific guidelines

Purpose
- Short guidance for agents producing strategy docs, forms, sponsor proposals, and marketing assets for local events (case: Pohang 콘텐츠 발굴 콘테스트).

User preferences (persisted here)
- Language: Korean by default for all deliverables (documents, form fields, messages). Ask before switching to English.
- Primary deliverable format: Markdown. Provide Canva prompts for design assets alongside copy.
- Preferred storage path: /opt/data/workspace/pohang-mice-academy-2026/ (WSL). When user asks to sync to Windows E: warn about /mnt/e permission issues and suggest /mnt/c alternatives or \wsl$.
- Budget canonical values: 600,000원 (60만원) and 1,200,000원 (120만원). Use these exact figures in scenario docs.
- Team canonical size: unified team = 8명. Splits often into two teams of 4; sponsor scenario assumes team-of-4 funding.

Templates & automation
- Strategy template: use plan-level structure (header, exec summary, why, brand, objectives, target, positioning, impact, how, KPI, roadmap, budget, risks, stakeholders, deliverables, submission notes).
- Google Form: prefer Apps Script createStrategyFormKR() to generate a Korean form. Add help text about file-upload requiring Google sign-in and a public-link fallback.
- Conversion: avoid server-side PDF/PPTX conversion; provide HTML + browser-print instructions. Note Environment may not have pandoc/libreoffice.

Pitfalls & fixes
- Never default to English forms or templates. If an English artifact is produced accidentally, fix by regenerating in Korean or ask the user.
- Do not attempt to copy to /mnt/e without checking permissions; if permission denied, offer copying to /mnt/c/Users/<name>/Downloads or instruct the user to retrieve via \wsl$.
- If Apps Script fails, provide exact step-by-step: script.google.com → New project → paste code → select createStrategyFormKR → Run → Authorize scopes → Check Logger for form/edit URLs.

Quick checklists
- When asked for strategy variants, always produce three Markdown files: integrated_120k.md, split_60k.md, split4_sponsored_120k.md and include risk matrix + mitigation.
- When producing Google Form, include both CSV template and human-readable copy text, and mention file-upload caveat.

Paths and artifacts to use
- Workspace: /opt/data/workspace/pohang-mice-academy-2026/
- Templates folder: /opt/data/workspace/pohang-mice-academy-2026/templates/
- Apps Script: /opt/data/workspace/pohang-mice-academy-2026/templates/google_apps_script_ko.js

Maintain: concise, actionable guidance only. This is a session-specific reference for agents working on Pohang MICE Academy tasks.