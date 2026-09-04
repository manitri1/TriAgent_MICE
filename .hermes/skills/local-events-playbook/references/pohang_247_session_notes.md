Session notes: POHANG 24/7 (summary of reproducible operational steps & lessons)

Context
- Master canonical file: /opt/data/workspace/포항_24_7/inputs/2026_포항MICE_행사계획서_몽쉘야호_제출본.pdf
- Goal: make workspace documents conform verbatim to the master where appropriate (title, dates, venue, deadlines, KPI, budget summary).

Archival pattern (safe idempotent recipe)
- When a master PDF is the source-of-truth, move any files older than that PDF into an "archive/before_master_<ts>/" folder before regenerating/updating derived docs.
- Example (POSIX):
  find <project_root> -type d -name archive -prune -o -type f ! -newer /path/to/master.pdf -print
  For each path returned: mkdir -p <project_root>/archive/before_master_<ts>/$(dirname <relpath>) && mv <file> <that_dest>
- Rationale: keep a reversible snapshot and avoid overwriting any earlier material.

PDF→text extraction notes (tooling options)
- Preferred extractor: pdftotext (poppler-utils) with -layout for preserving line-breaks.
- If pdftotext is not available, user/host can produce master.txt locally and upload it.
- DO NOT try to grep inside raw PDF bytes in the repo — use a true PDF text extractor.

Canva & marketing assets (practical)
- Produce vector SVG templates (A3, 1080x1080, 1080x1920) and place them under project/marketing/.
- Keep a short canva_prompt.txt adjacent to SVGs describing colors, fonts, and exact strings that must match the master (title, date/time, venue, CTA).
- Add a QR placeholder rectangle in the SVG; generate QR inside Canva (app → QR code tool) so the final link is never baked in the template file.

Google Forms automation
- Provide a reusable Apps Script snippet: templates/google_apps_script_ko.js that creates a Korean-language registration form and links responses to a new spreadsheet.
- Keep the script under skill templates and copy into project templates when creating a new event.

Workspace structure & Windows sync
- Canonical project workspaces used here:
  - /opt/data/workspace/<project-slug>/  (team-shared production)
  - /opt/data/.hermes/workspace/<project-slug>/  (agent work / drafts)
- Windows mirror (user preference): E:\work\Hermes\TriAgent_MICE\.hermes\workspace  (WSL mount: /mnt/e/…)
- When producing final deliverables, mirror the files to the Windows path for user handoff.

Pitfalls & fixes observed in this session
- No sudo/apt in agent environment: cannot install poppler. Mitigation: user runs pdftotext locally and uploads plain text; or admin installs poppler on host.
- Avoid writing files into paths containing embedded nulls (agent filesystem writes failed in some transient attempts). Use normal ASCII/UTF-8 path names.

Quick checklist to do the 1:1 sync workflow
1) Confirm master PDF path and timestamp.
2) Archive older files (find ! -newer master -> mv to archive/...).
3) Extract master text (pdftotext -layout) or request user upload of master.txt.
4) Parse master.txt for exact strings (title, date, venue, deadlines, KPIs, budget lines).
5) Regenerate templates and write to .hermes workspace for review.
6) After review, copy approved files to production workspace and optionally to Windows mirror.

