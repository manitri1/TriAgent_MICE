Windows path mapping & quick checks (for agents)

When the user asks for files to be placed on Windows drives from a WSL-hosted agent, follow these steps and checks:

1) Preferred host paths
- Windows path examples:
  - Downloads: C:\Users\<WinUser>\Downloads\
  - Desktop: C:\Users\<WinUser>\Desktop\
  - Project workspace: E:\work\Hermes\TriAgent_MICE\.hermes\workspace\
- Convert to WSL mount path: /mnt/c/Users/<WinUser>/Downloads/

2) Quick mount check (WSL)
- Test if mounted and writable:
  - [ -d /mnt/c ] && touch /mnt/c/Users/<WinUser>/Downloads/.hermes_write_test && rm /mnt/c/Users/<WinUser>/Downloads/.hermes_write_test && echo OK || echo NO
- If NO: do not attempt mass copy. Offer fallback archive.

3) Windows Explorer via network share
- If user prefers GUI, tell them to open Windows Explorer to:
  - \\wsl$\<DistroName>\opt\data\<project>
- They can then drag-and-drop files to any Windows folder.

4) PowerShell one-liner for users to copy from WSL to Windows
- Example (run in Windows PowerShell):
  wsl -e bash -lc "cp -r /opt/data/<project> /mnt/c/Users/<WinUser>/Downloads/"

5) When to archive instead
- If mount is missing OR permission denied OR user prefers single file delivery, create /opt/data/<project>_materials.tar.gz and give instructions to copy or download.

6) Security & privacy
- Avoid writing into arbitrary Windows user folders without explicit confirmation.
- Inform users about what will be overwritten if paths exist.

7) Common errors & messages
- Permission denied on /mnt/c: "Permission denied — please copy via Windows Explorer (\\wsl$) or grant WSL write permission to the mount." Suggest the PowerShell one-liner as alternative.
- Mount not found: "Mount '/mnt/<drive>' not present. Use explorer \\wsl$\<Distro> or ask for a different destination."

8) Example flow the agent should follow
- Ask user: "Confirm destination path on your Windows machine (e.g. C:\\Users\\<name>\\Downloads)".
- Attempt quick mount check.
- If OK: run cp and verify size.
- If not OK: create archive and give download instructions (\\wsl$ or PowerShell one-liner).

