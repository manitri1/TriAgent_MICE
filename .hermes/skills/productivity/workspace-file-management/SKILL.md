---
name: workspace-file-management
description: "Guidelines and templates for where agents write files, how to deliver artifacts to users across WSL/Windows mounts, and fallback delivery patterns (ZIP/HTTP)."
version: 1.0.0
author: Hermes Agent
license: MIT
---

# Workspace File Management (Class-level Skill)

Purpose
- Standardize how agents choose, create, and deliver files in multi-OS environments (WSL, Linux, macOS, Windows). Ensure files appear where the human expects them (project workspace on host) and give clear fallbacks when direct writes fail.

When to use
- Any task that creates files the user needs to open locally (presentations, PDFs, ZIPs, images, reports).
- When the user asks to save outputs into a specific host path (Windows drive, network share, cloud folder).

Principles
- Prefer writing into the *active workspace* (/opt/data) to avoid permission surprises, then deliver (copy/export) into the user-specified host path.
- If the user requests a particular host path (Windows E:\..., C:\), ask whether they want future outputs written there by default; if yes, use that path for subsequent writes and record the preference in the session memory (not the skill).
- Use guarded copies: attempt to copy to the host mount (/mnt/c or /mnt/e). If copy fails due to permission or missing mount, do not retry blindly — provide clear, actionable error and a fallback (zip archive + download instructions or \wsl$ path).
- Provide one-line copy commands the user can run locally (PowerShell) if remote writes fail.

Recipes (step-by-step)
1) Default write behavior
   - Write artifacts into the local agent workspace: /opt/data/<project>/. This is reliable for the agent environment.
   - After write, attempt to copy to user-requested host path (if provided) using /mnt/<drive> mapping.

2) Best-effort copy to Windows mount (one-liner)
   - Linux/WSL path -> Windows path:
     cp -r /opt/data/<project> "/mnt/c/Users/<WinUser>/Downloads/<project>"
   - If permission denied, do not escalate. Instead bundle and offer download.

3) Fallback: create an archive for download
   - Create compressed TAR.GZ in /opt/data and provide its path to the user:
     tar -czf /opt/data/<project>_materials.tar.gz -C /opt/data <project>
   - Tell the user how to fetch it from WSL: open `\wsl$\<distro>\opt\data\<project>_materials.tar.gz` in Windows Explorer or use `wsl -e bash -lc 'cp /opt/data/<file> /mnt/c/Users/<WinUser>/Downloads/'`.

4) Quick Windows copy (PowerShell)
   - From Windows PowerShell, copy from WSL to Downloads:
     wsl -e bash -lc "cp /opt/data/<project>_materials.tar.gz /mnt/c/Users/<WinUser>/Downloads/"

5) Verification
   - After copy, verify presence and size:
     ls -lh "/mnt/c/Users/<WinUser>/Downloads/<project>_materials.tar.gz"
   - Report success to the user with absolute host path.

Pitfalls & guidance
- Do NOT assume /mnt/<drive> is writable. If /mnt/e or /mnt/d is missing or permission denied, stop and offer the fallback archive + instructions.
- Avoid writing directly into Windows paths unless the user explicitly asked and you confirmed the path. (Accidental writes to user files are harmful.)
- Do not store persistent environment-specific paths in the skill text. Store per-user preference in memory only after explicit consent.

Templates & quick snippets (copy-pasteable)
- Create ZIP of project:
  - tar -czf /opt/data/<project>_materials.tar.gz -C /opt/data <project>
- Copy to Windows Downloads (example):
  - cp -r /opt/data/<project> "/mnt/c/Users/<WinUser>/Downloads/<project>"
- Windows one-liner (PowerShell):
  - wsl -e bash -lc "cp -r /opt/data/<project> /mnt/c/Users/<WinUser>/Downloads/"

References
- references/windows-paths.md (mapping and quick checks)
- templates/copy-to-windows.sh (portable shell template)

Change log
- v1.0.0 — initial skill created to capture WSL↔Windows file delivery patterns and fail-safe recipes.
