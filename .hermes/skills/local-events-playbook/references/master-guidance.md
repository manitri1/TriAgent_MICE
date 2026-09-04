Master-document canonicalization guide (session-agnostic)

Purpose
- Provide a small, repeatable recipe to (A) archive all project files older than a single master document, (B) produce an archive report, and (C) collect the short canonical fields to drive template regeneration.

When to use
- The project owner supplies a single definitive master file (PDF or Word) that should be treated as the source of truth for title, dates, venue, submission deadlines, KPIs, and other short authoritative strings.

Steps (safe, non-destructive)
1) Confirm master path with the user and record it. Example:
   /opt/data/workspace/<project-slug>/inputs/2026_포항MICE_행사계획서_몽쉘야호_제출본.pdf

2) Ask user for permission to archive older files. Explain archive location and that files are moved (not deleted):
   /opt/data/workspace/<project-slug>/archive/before_master_<YYYYMMDDHHMMSS>/

3) Archive command (safe shell snippet, admin privileges not required for move as long as user files are writable):

   # archive files older-or-equal to master into timestamped archive dir
   MASTER="/opt/data/workspace/<project-slug>/inputs/master.pdf"
   ROOT="/opt/data/workspace/<project-slug>"
   TS=$(date +%Y%m%d%H%M%S)
   ARCHIVE="$ROOT/archive/before_master_$TS"
   mkdir -p "$ARCHIVE"
   # find files not newer than master, excluding archive dir itself
   find "$ROOT" -type d -name archive -prune -o -type f ! -newer "$MASTER" -print | while read -r f; do
     rel=${f#"$ROOT"/}
     dest="$ARCHIVE/$rel"
     mkdir -p "$(dirname "$dest")"
     mv "$f" "$dest"
     echo "MOVED: $f -> $dest"
   done > "$ARCHIVE/archive_report.txt"

4) Produce a short archive report (CSV/MD) listing moved files and skipped/conflicts (if any). Example header:
   moved_path, archived_path, moved_at

5) Extract canonical short fields (preferred order):
   - Official event title (one line)  
   - Event date/time (formatted exact string)  
   - Venue (formal name)  
   - Submission deadline (exact string)  
   - Organizer/host (exact phrasing to be used in footers)  
   - KPI targets (numbers with labels)

   If automation is desired, run `pdftotext -layout master.pdf master.txt` and parse `master.txt` for these strings, but ALWAYS ask the user to confirm the extracted strings.

6) Regenerate standard templates using the canonical fields and write them to the review workspace:
   /opt/data/.hermes/workspace/<project-slug>/{program.md,registration-guide.md,marketing/*}

7) Present the index (outputs/manifest.md) and ask for user approval before copying to the production workspace:
   /opt/data/workspace/<project-slug>/

Notes & caveats
- poppler/pdftotext is the recommended tool for extracting text from PDFs. Installation requires admin rights on many systems. If install is impossible, ask the user to run extraction locally and upload the text file.
- PDF extraction may break layout and encoding. For short authoritative fields prefer manual confirmation or user-supplied copy.
- The agent must never overwrite existing production files without explicit user approval. On name collisions, create a conflict report and keep both versions (e.g., append .orig or timestamp).

Example small checklist to show the user before archiving
- Confirm master path: ______
- Archive destination: /archive/before_master_<timestamp>/ OK? [yes/no]
- I will then extract these fields from the master for template regeneration: title / date / venue / submission_deadline / organizer / KPIs. Please confirm.

