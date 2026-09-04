Summary of marketing assets and Canva workflow created during the “포항_24_7” session

Purpose
- Document session-specific marketing templates, SVG filenames, and the recommended Canva-first workflow so future runs can reproduce or adapt the assets quickly.

Files created (workspace paths)
- /opt/data/.hermes/workspace/포항_24_7/marketing/poster_A3.svg — A3 print-ready vector poster (header, info block, QR placeholder, decorative wave)
- /opt/data/.hermes/workspace/포항_24_7/marketing/insta_1080.svg — Instagram feed 1080×1080 SVG
- /opt/data/.hermes/workspace/포항_24_7/marketing/story_1080x1920.svg — Story/Reels 1080×1920 SVG
- /opt/data/.hermes/workspace/포항_24_7/marketing/canva_prompt.txt — Canva prompt and usage notes
- /opt/data/.hermes/workspace/포항_24_7/marketing/sns_posts.md — Ready-to-use SNS copy (3 variants)

Canva-first workflow (recommended)
1. Upload the SVG templates into Canva (Upload → Files) so designers can edit text, swap logos, and add QR codes interactively.
2. Add QR code using Canva's built-in QR generator (Apps → QR Code) and point it to the registration form URL.
3. Adjust safe areas: keep critical text 10 mm inside the artboard for A3 print; request 3 mm bleed on export.
4. Export formats:
   - Print: PDF Print (PDF/X if available) with 3 mm bleed.
   - SNS: PNG at full pixel dimensions (1080×1080 for feed, 1080×1920 for story).

Notes and pitfalls learned in-session
- Do not rasterize the main poster before designer edits; keep the vector SVG in Canva so layout/spacing remains editable.
- Many environments lack SVG→PDF conversion tools; prefer exporting to PDF from Canva rather than local command-line conversions unless a verified toolchain is available.
- Keep QR placeholder areas intentionally empty in the SVG (rectangle + label) so the designer places a live QR in Canva rather than embedding a static image that might need updating.

How to reuse
- Copy the SVGs into a new project folder (workspace/<project-slug>/marketing/).
- Update header text, date, and venue in the SVG or within Canva after upload.
- Use the included canva_prompt.txt as the starting brief when asking a designer or a marketing intern to produce final assets.
