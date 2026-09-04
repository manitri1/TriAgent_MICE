Project structure guidelines (recommended for local events)

Purpose: short, actionable rules for where agents write and how they name files.

Root (per project): /opt/data/workspace/<project-slug>/
Default subfolders:
- docs/: long-form plans, proposals, legal, meeting minutes
- website/: landing page code (index.html, styles.css), assets/
- marketing/: posters (print), SNS assets, canva prompts
- roles/: R&R and handbooks for people
- outputs/: generated deliverables (dated filenames)
- inputs/: raw inputs (PDFs, vendor quotes)
- archive/: previous versions if the agent rotates them

File naming rules:
- Add YYYYMMDD date suffix and optional vN: <name>_YYYYMMDD_v1.ext
- Example: strategy_pohang_247_draft_20260807.md

Process notes:
- When producing a deliverable, save it into outputs/ and update outputs/README.md with a one-line summary + author + date.
- If moving files from other project folders, create an archive entry with the previous path and timestamp.

When to use which web variant:
- A: Static + Google Forms -> fastest; use for <= small file uploads and when time is limited
- B: Static + Netlify Forms/Firebase -> use when you need serverless storage or moderate uploads
- C: Custom backend -> only for workflows needing accounts, approvals, or complex data processing

Contact: Add the responsible agent/owner in the README of the folder when created.