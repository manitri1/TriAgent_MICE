Pohang MICE Academy 2026 — session recipes

Purpose: practical notes, commands, and pitfalls captured while the agent planned and produced deliverables for the Pohang regional content contest.

-- Environment notes
- Agent working root: /opt/data. Canonical project copies live under /opt/data/workspace/<project-slug>/.
- WSL/Windows: prefer /mnt/c/Users/<WindowsUser>/Downloads when copying to Windows; /mnt/e may be unwritable in some runtimes.

-- Commands
Create workspace and copy sources:
mkdir -p /opt/data/workspace/pohang-mice-academy-2026/{docs,marketing,assets,proposals,templates}
cp -u /opt/data/proposals/pohang-mice-academy-2026/* /opt/data/workspace/pohang-mice-academy-2026/proposals/

Archive materials for transfer:
tar -czf /opt/data/pohang_mice_materials.tar.gz -C /opt/data workspace/pohang-mice-academy-2026

Serve static prototype:
cd /opt/data/workspace/pohang-mice-academy-2026/web
python3 -m http.server 8000

SVG to PDF (local):
inkscape layout_no_booth.svg --export-type=pdf --export-filename=layout_no_booth.pdf

-- Pitfalls
- Permission denied on /mnt/e: fallback to copying via \\wsl$\<distro>\opt\data or use /mnt/c path.
- Missing python-pptx/pandoc: provide install command and fallback deliverables (Markdown slides + Canva prompts).

-- Session trace (summary)
1. Generated program/registration drafts, saved to proposals/.
2. Created a workspace under workspace/pohang-mice-academy-2026 and copied marketing/docs there.
3. Built static prototype under web/ and provided serve instructions.
4. Packaged materials into /opt/data/pohang_mice_materials.tar.gz when direct copy to E: failed.

-- Guidance for future agents
- Always return absolute saved paths. Use /opt/data/workspace/<slug>/ as canonical storage.
- When asked to move to Windows ask for exact destination and prefer /mnt/c; warn and offer the tar/zip fallback.
