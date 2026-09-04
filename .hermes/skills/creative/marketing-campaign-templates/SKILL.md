---
name: marketing-campaign-templates
title: Marketing campaign templates (events & local campaigns)
description: Reusable playbook and templates for event marketing assets (Canva prompts, SVG shells, ultra-short video briefs, SRTs) focused on local MICE and community-driven promotions.
summary: |
  Reusable, production-ready playbook for creating event marketing assets (posters, social tiles, short promo videos, Canva prompts, and submission packages) with special guidance for local MICE-style contests and community-driven campaigns.
  Focus: fast-turn multi-channel deliverables, designer handoff assets, and creator-friendly video briefs.
tags:
  - marketing
  - events
  - canva
  - video
  - templates
---

# Marketing campaign templates 7 Event & Local Campaigns

This skill collects best-practice steps, templates, and pitfalls for producing marketing deliverables for events (posters, social assets, short promo videos) with an emphasis on rapid iteration using Canva and short-form video briefs for creators.

When to use
- Building posters/Canva prompts for events (A3 print + social variants)
- Preparing ultra-short promo videos (10s) briefs for production studios
- Generating SRT subtitles, file naming rules, and submission checklists
- Handoff to designers, video studios, or community creators

Core steps (copy these verbatim into task ticket or runbook)
1. Gather authoritative event facts (title, date/time, venue, CTA, submission deadline, contact email) and confirm exact strings with owner before drafting any public asset.
2. Produce a short, language-accurate content spec first ("written copy only") and get approval. The user prefers Korean copy and Markdown or Canva-ready prompts.
3. Draft Canva master prompt: include common design tokens (colors, fonts, bleed, assets path), page-by-page text blocks, and export instructions. Save as `templates/canva_master_prompt.txt` in the skill.
4. Create SVG layout shells for A3/1080/Story sizes; place them under `templates/` for designers to import into Canva or Inkscape.
5. Produce ultra-short video briefs (60s) with: one-line concept, exact Korean dialogue lines, time-coded shotlist, ST/EN SRT output. Put briefs under `references/` for session context.
6. Create SRT subtitle files (Korean) named using project convention and save in inputs folder for the project workspace.
7. Verify assets: open SVG in a viewer, test QR scan if included, run a quick mobile preview for social crops, and confirm print bleed settings with vendor.
8. Archive all versions and a short change-log in `references/` for future audits.

Deliverables
- canva_master_prompt.txt (page-by-page instructions)
- poster_A3_layout.svg, insta_1080.svg, story_1080x1920.svg (templates)
- promo_short_{A,B,C}.md (production briefs for studios)
- subs/KR.srt and subs/EN.srt
- README with file locations and export guidance

User preferences (persisted rule)
- Default language for visible copy: Korean. Always confirm before producing English copy. Put Korean copy in Markdown first.
- Deliverables preference: Markdown + Canva prompts and editable SVGs over final PDFs. Provide Canva prompts to the user in a single text file when asked.

Pitfalls & checks
- Do not hardcode contact emails; leave placeholders like [CONTACT_EMAIL] until user confirms.
- Avoid assuming file upload sizes: include a recommended upload-size guidance line (e.g. "Recommend <100MB per video; use Drive/YouTube links for larger files").
- When generating SRTs, always output both burned-in (for immediate preview) and separate SRT files for platform uploads.
- If server-side PDF generation is suggested, warn that the environment may lack ImageMagick/inkscape; propose using Canva or the user's local machine instead.

References & templates
- templates/canva_master_prompt.txt  full-page prompt skeleton for Canva
- templates/poster_A3_layout.svg  simple A3 shell (placeholder layers)
- references/pohang-session-notes.md  session-specific notes, file paths, and final strings used

Example quick-check (pre-release)
- Open poster_A3_layout.svg in viewer  check 3mm bleed visible
- Scan QR in phone from exported PNG  verify redirect to live form
- Upload SRT to CapCut/CapCut-compatible editor and verify alignment against 10s cut

Maintenance
- Update templates/canva_master_prompt.txt whenever a new size or brand token is requested by the user.
- Add new `references/` entries for each event session to collect decisions and final approved copy.

