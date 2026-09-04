Website folder — landing & deployment notes

Location: /opt/data/workspace/포항_24_7/website/

Contents
- index.html — landing page (placeholder for Google Forms embed)
- styles.css — simple responsive styles
- assets/ — images (og-image.png, qr.png, poster images)
- README_deploy.md — deployment and QA instructions

Quick actions
1) To embed the live Google Form: replace `FORM_URL` in index.html with the actual form URL or set the iframe src to the Google Form embed URL.
2) For staging: push this folder to a Git repo and connect to Netlify (recommended) or use GitHub Pages.
3) For analytics: add GA4 measurement ID to the head in index.html and create GTM container for tag management.

If you want, I can:
- Insert the form URL now (provide the form link),
- Generate a bit.ly short link and QR PNG for the campaign, or
- Push & deploy to Netlify (requires account access).