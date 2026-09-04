# Website / Landing Page Deployment & Quick Guide

Purpose: provide a minimal, repeatable recipe for shipping an event landing page + registration flow quickly. This guide assumes the "static landing + Google Forms embed" pattern (fastest). It also summarizes options (A/B/C) and essential checks (UTM, GA4, QR, file upload policies).

Options recap
- Option A (Recommended, fastest): Static landing (HTML/CSS) + Google Forms embed
  - Pros: fastest to implement and test; zero server maintenance; free on Google Forms
  - Cons: limited file upload and user management
- Option B (Serverless): Static site + Netlify Forms / Formspree + S3/Firebase storage for uploads
  - Pros: supports file uploads and lightweight back-end features
  - Cons: small additional configuration and possible storage costs
- Option C (Custom backend): Node/Django + DB + storage
  - Pros: full control, complex workflows
  - Cons: highest time & cost

Quick deploy (Option A)
1. Prepare Google Form
  - Create form with desired fields; if file uploads are needed, consider Google Drive file upload settings (note: respondents must sign in)
  - From "Send" > "Embed HTML" copy the iframe src or the full iframe snippet
2. Prepare static files
  - Use `templates/landing-template.html` and `templates/styles.css` from the event-planning skill
  - Replace `FORM_EMBED_SRC` in the iframe src with the Google Form embed URL; also set `FORM_URL` to the direct form URL
  - Add OG image (`assets/og-image.png`) and QR (`assets/qr.png`) if desired
3. Host
  - Quick: Push to GitHub and enable GitHub Pages (repo settings -> Pages)
  - Recommended: Deploy to Netlify (connect repo -> automatic deploys). Netlify offers HTTPS by default
4. UTM & short URL
  - Create UTM templates: ?utm_source=instagram&utm_medium=post&utm_campaign=pohang_mice_2026
  - Create a short link (bit.ly) for print and QR usage
5. Analytics
  - Add GA4 Measurement ID or use GTM snippet in `<head>` for event-level tracking. Track form open events and final submission if possible (GTM + GA4 recommended)

Serverless uploads (Option B) notes
- Netlify Forms can capture form submissions, but for file uploads use Netlify Large Media or integrate a small client-side upload to S3/Firebase with presigned URLs
- Firebase: use Firebase Storage + security rules, or Firebase Functions to validate uploads
- Cost considerations: S3/Firebase storage and egress fees for large files

Security & QA checklist
- Test on Chrome/Edge/Firefox and mobile Safari/Chrome
- Test form submission end-to-end (including file uploads if used)
- Validate file type/size limits; provide clear upload guidance on the landing page
- Ensure SSL (HTTPS) and proper CORS settings if using APIs
- Accessibility: labels for inputs, readable contrast, and mobile-friendly layout

Operational notes for event teams
- For attendees who cannot access the form, provide an email fallback (e.g. contact@example.com) and manual registration at the event
- For file submissions by presenters, announce accepted file types and a deadline for upload
- After launch: monitor daily submissions in Google Sheets (Forms -> Responses -> Link to Sheets)

Files included in skill
- templates/landing-template.html (starter landing page with iframe placeholder)
- templates/styles.css

If you want, I can:
- Replace the FORM_EMBED_SRC with your actual Google Forms embed URL and produce a ready-to-deploy ZIP
- Create a Netlify deploy pipeline (Git repo + instructions) or a GitHub Actions workflow to auto-deploy on push
