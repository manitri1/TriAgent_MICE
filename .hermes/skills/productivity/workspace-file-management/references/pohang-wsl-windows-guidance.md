Title: WSL <-> Windows delivery patterns — notes from Pohang MICE Academy session (2026-07-27)

Purpose
- Short, practical reference for agents about how to deliver files created in a Linux/WSL backend to Windows users reliably (lessons from the Pohang session).

Key principles
- Canonical project workspace: create and write to /opt/data/workspace/<slug>/ inside the agent environment. Point users to \wsl$ for direct access.
- Do not assume /mnt/e (E:) is writable. Many environments restrict external mounted drives. Prefer /mnt/c (C:) or \wsl$ for delivery.
- Always produce an archive (/opt/data/<slug>_materials.tar.gz) as a reliable handoff artifact; archive creation with tar is commonly available even when zip isn't.

Recommended delivery flows
1) GUI fallback (recommended for non-technical users)
   - Tell user: open Windows File Explorer → enter: \\wsl$\<distro>\opt\data\workspace\<slug> and drag files to E:/ or any Windows folder.
   - Pros: simple, no permissions required. Cons: user must know \wsl$ or be guided with screenshots.

2) Agent-initiated copy to C:\Users\<User>\Downloads (if Windows username provided)
   - Use WSL path: cp /opt/data/... "/mnt/c/Users/<WindowsUser>/Downloads/"
   - Before copying, check /mnt/c is writable. If not, revert to GUI fallback.

3) Create tar.gz in /opt/data and instruct user to retrieve via \wsl$ or download
   - tar -czf /opt/data/<slug>_materials.tar.gz -C /opt/data workspace/<slug>
   - This avoids per-file permission errors and keeps relative paths intact.

4) If user insists on E: (\mnt/e), warn and test: create a small test file in /mnt/e. If that fails, suggest C: or \wsl$.

Commands and checks (safe snippets)
- Check mount availability and writability:
  - ls /mnt | grep -E 'c|d|e'  # list mounts
  - test -w /mnt/e && echo writable || echo not-writable
- Create archive (portable):
  - tar -czf /opt/data/<slug>_materials.tar.gz -C /opt/data workspace/<slug>
- Copy to Windows Downloads (replace User):
  - cp /opt/data/<slug>_materials.tar.gz "/mnt/c/Users/<WindowsUser>/Downloads/"

Fallbacks to document in user replies
- If cp to /mnt/e fails: give the \wsl$ GUI copy instructions and the tar.gz fallback command.
- If zip is missing: prefer tar.gz; if user requests zip, provide the zip command and explain installation might be required.

Documentation pointers for agents
- Always echo the absolute path of created files to the user.
- Offer 2 retrieval options (GUI via \\wsl$, or copy to C:\Downloads) and recommend GUI for non-technical users.
- When asked to write to a Windows drive, explicitly check mount writability first and inform the user if it will fail.

Example agent message (copy-paste to user)
- "I saved the files to /opt/data/workspace/pohang-mice-academy-2026/. You can open them in Windows Explorer via \\wsl$\Ubuntu\opt\data\workspace\pohang-mice-academy-2026 and drag the files to E:\\work\\Hermes\\TriAgent_MICE. If you'd rather I copy them to your Downloads folder, tell me your Windows username and I'll copy the archive there."

