How to preview the static prototype:

1) Open files in a browser directly (file://) — index.html is the entry.
   Example path: /opt/data/workspace/pohang-mice-academy-2026/web/index.html

2) Serve with Python http.server (recommended to preserve relative paths):
   cd /opt/data/workspace/pohang-mice-academy-2026/web
   python3 -m http.server 8000
   Then open http://localhost:8000 in your browser (on the host machine: http://localhost:8000 or via WSL mapping).

Files in this directory:
- index.html         - home/landing
- register.html      - registration form (static demo)
- submission_guide.html - submission instructions (fill content as needed)
- contact.html       - contact info
- styles.css         - simple styles

Note: register form is static (action="#"). Integrate with backend endpoint when available.
