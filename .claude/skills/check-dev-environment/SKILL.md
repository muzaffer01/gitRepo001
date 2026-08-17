---
name: check-dev-environment
description: Verify Node.js, npm, Git, and GitHub CLI are installed (installing via winget if missing) and refresh PATH for the session. Use before scaffolding or publishing a project on a fresh Windows machine.
---

# Check / Install Dev Environment

Verifies the tools needed to build, test, and publish a project on Windows, installing
anything missing via winget rather than just reporting it as a blocker.

## Steps

1. Check what's already installed:
   ```powershell
   node -v; npm -v; git --version; gh --version
   ```
2. For anything missing, install via winget (silent, accepts agreements):
   ```powershell
   winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --silent
   winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements --silent
   winget install -e --id GitHub.cli --accept-package-agreements --accept-source-agreements --silent
   ```
3. **PowerShell PATH quirk:** each PowerShell tool call in this harness can be a fresh
   process that doesn't see a PATH updated by an install in a prior call. Prepend this
   line to every subsequent command in the session that needs node/npm/git/gh:
   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   ```
4. Set git identity once if unset:
   ```powershell
   git config --global user.name "<github-username>"
   git config --global user.email "<user-email>"
   git config --global init.defaultBranch main
   ```

## Notes

- Confirm with the user before installing software the first time in a session (per
  standard risk-awareness for system-level changes) — after that, treat it as routine
  for the rest of the session.
- This project's `docs/RUNBOOK.md` documents the actual run of this on a machine that
  had none of these tools installed.
