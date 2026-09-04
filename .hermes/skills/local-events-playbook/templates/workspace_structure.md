Recommended project workspace structure (class-level template)

Root: <project-slug>/
- inputs/            # master resources (PDFs, intake forms, raw vendor quotes)
- program/           # program, agenda, session descriptions
- templates/         # reusable templates: registration, consent, email copy
- marketing/         # SVG/PNG poster templates, canva_prompt.txt, sns copy
- roles/             # R&R docs per person/role
- outputs/           # final deliverables (reports, slide decks, PDFs)
- media/             # photos, videos (finalized, with metadata)
- archive/           # automated archive snapshots (timestamped)

Naming conventions
- program: program.md
- consent template: templates/consent_copyright.md
- posters: marketing/poster_A3.svg, marketing/insta_1080.svg, marketing/story_1080x1920.svg
- submissions: media/submissions/<team>_title_YYYYMMDD.ext

Sync target (Windows mirror)
- Windows mirror path (example): E:\work\Hermes\TriAgent_MICE\.hermes\workspace\<project-slug>\
- WSL mount: /mnt/e/work/Hermes/TriAgent_MICE/.hermes/workspace/<project-slug>/

Automation notes
- Add a single script or CI job that runs these steps when the master PDF is updated:
  1) archive older files to archive/before_master_<ts>/
  2) run pdftotext (or accept user-uploaded master.txt)
  3) run parser to fill templates
  4) write outputs to .hermes workspace for review

