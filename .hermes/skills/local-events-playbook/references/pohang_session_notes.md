Pohang_24_7 session notes (concise)

Summary of practical items created during session:
- Project workspace used: /opt/data/pohang_24_7 (source)
- Canonical agent workspace mirror created: /opt/data/.hermes/workspace/포항_24_7
- Marketing assets created and canonical filenames:
  - poster_A3.svg
  - insta_1080.svg
  - story_1080x1920.svg
  - canva_prompt.txt
- Consent template: templates/consent_copyright.md
- Google Apps Script sample: templates/google_apps_script_ko.js

Folder-normalization recipe (safe mv)
1. For each nested path like X/X under project:
   - for f in "$project/$X/$X"/*; do
       target="$project/$X/$(basename "$f")"
       if [ -e "$target" ]; then
         echo "SKIP: $f -> $target exists" >> normalization_report.csv
       else
         mv "$f" "$project/$X/"
         echo "MOVED: $f -> $target" >> normalization_report.csv
       fi
     done
   - rmdir "$project/$X/$X"  # only if empty
2. Produce normalization_report.csv and attach to outputs/ for review.

Windows sync checklist
- Ensure /mnt/e is mounted and writable. If not, ask the user.
- Use: cp -a /opt/data/.hermes/workspace/<project-slug> /mnt/e/work/Hermes/TriAgent_MICE/.hermes/workspace/
- After copy, provide index (outputs/manifest.md) with filenames and sizes.

Canva prompt (short) - reuse templates/canva_prompt.txt
- Style: modern, blue palette (#0066CC/#00A3E0), large header, QR on right, 3mm bleed for print.

Notes for agent implementers
- When moving files, DO NOT overwrite existing files. Record skipped items and surface them to the user.
- After workspace changes, run 'ls -laR <project>' and return an indexed markdown list to the user with paths and 1-line descriptions.
