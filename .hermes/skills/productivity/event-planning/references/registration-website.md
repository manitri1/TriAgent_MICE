Registration & website quick reference (session template)

Purpose
- Decision record and checklist for event registration landing pages. Use this file per-project: copy into `./proposals/<slug>/references/registration-website.md` and fill the fields.

Required inputs
- FORM_URL or FORM_EMBED_SRC (Google Forms embed URL)
- Preferred option: A / B / C
- File upload needed? (yes/no) + max file size
- GA4 Measurement ID (if available)
- Short-link desired? (bit.ly / custom)

Decision matrix
- Option A: Static landing + Google Forms embed
  - When: need fastest ship, limited uploads, simple workflow
  - Deploy: GitHub Pages / Netlify; include FORM_EMBED_SRC in index.html iframe
  - Storage: Google Drive (via Forms) or small-size attachments not recommended
- Option B: Static site + Netlify Forms/Formspree + S3/Firebase
  - When: file uploads required, want serverless backend
  - Deploy: Netlify (enable Netlify Forms) + configure storage bucket + CORS/signed uploads
  - Note: Document storage quotas and retention policy
- Option C: Custom backend
  - When: approval flows, admin UI, accounts required
  - Deploy: provide API docs, DB migration steps, and deployment playbook

UTM & tracking
- Standard UTM template (copy to marketing sheet):
  utm_source={channel}&utm_medium={format}&utm_campaign={campaign}
- Example: ?utm_source=instagram&utm_medium=post&utm_campaign=pohang_mice_2026
- GA4 events: form_submit, file_upload_success, page_view

Short-link & QR
- Create a short link (bit.ly suggested) and save mapping in the campaign sheet
- Generate QR PNG (300x300+) and place in `assets/qr.png` and `assets/qr-small.png`

GA4 / GTM snippet (place in <head>)
- GA4: paste measurement ID snippet; document the ID here
- GTM: paste container snippet if used; list basic tags/trigger names in this file

Deployment checklist
- [ ] index.html with FORM_EMBED_SRC set
- [ ] OG image at assets/og-image.png and meta tags present
- [ ] short-link created and QR generated
- [ ] GA4 Measurement ID recorded and snippet added
- [ ] Mobile/responsive check (Chrome device simulator)
- [ ] Form test: submit test entry and confirm receipt/CSV
- [ ] If file uploads: test storage write and retrieval

Provider quirks (live notes)
- Google Forms: quotas may limit automated export frequency; if many submissions expected, set periodic export to Sheets and backup.
- Netlify Forms: upload limits apply; use signed direct S3/Firebase uploads for large files.

Where to save in project
- `./proposals/<slug>/website/index.html`
- `./proposals/<slug>/website/styles.css`
- `./proposals/<slug>/website/assets/og-image.png, qr.png, logo.png`
- `./proposals/<slug>/website/README_deploy.md` (FORM_URL, GA4, short-link)
- `./proposals/<slug>/references/registration-website.md` (this file, filled)

Notes for the agent
- Default to Option A unless file uploads or approval workflows are required. Confirm requirements with user first.
- Always save files under the project folder and return absolute paths in responses.
