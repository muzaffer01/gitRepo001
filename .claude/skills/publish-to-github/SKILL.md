---
name: publish-to-github
description: Initialize a local git repo, authenticate the GitHub CLI (handing the final OAuth click to the user), and push to a GitHub repo. Use when asked to store code on GitHub or integrate with the user's GitHub account.
---

# Publish to GitHub

Gets a local project committed and pushed to GitHub, including the parts of GitHub
auth that genuinely require a human click.

## Steps

1. Init and commit locally:
   ```powershell
   Set-Location "<local-repo-path>"
   git init
   git add -A
   git commit -m "Initial commit: <app name> with <pages/features>"
   git remote add origin https://github.com/<user>/<repo>.git
   ```
2. Check auth:
   ```powershell
   gh auth status
   ```
3. **If not authenticated — this cannot be fully automated.** GitHub's OAuth
   device-authorization page rejects scripted clicks on the final "Authorize" button
   (`access_denied`) if you try to click it yourself via browser automation. Instead:
   ```powershell
   gh auth login --hostname github.com --git-protocol https --web
   ```
   Read the background output for the one-time code (e.g. `XXXX-XXXX`). Using
   `claude-in-chrome`:
   - Navigate to `https://github.com/login/device`
   - Click "Continue" on the account-selection screen (safe to automate)
   - Type the one-time code into the boxes, click "Continue" (safe to automate)
   - **Stop there.** Tell the user the code is entered and ask them to personally
     click the final "Authorize github" button.
   - Poll `gh auth status` (e.g. via `ScheduleWakeup` at 60–120s) or wait for the
     background task-notification that `gh auth login` exited, to detect success.
4. Once authenticated:
   ```powershell
   gh auth setup-git
   git push -u origin main
   ```
5. Verify:
   ```powershell
   gh repo view <owner>/<repo> --json name,url,pushedAt
   ```
   or take a browser screenshot of the repo page.

## Notes

- If a terminal window was opened before Node/Git/GitHub CLI were installed, `npm`/
  `git`/`gh` may not resolve there — tell the user to open a fresh terminal window, or
  refresh PATH in the current one (see `check-dev-environment`).
- The Claude Code `!<command>` prefix only works inside the Claude Code chat prompt
  itself, not in a separate raw terminal — if a user pastes `! gh auth login` into
  PowerShell directly it will error; just have them run `gh auth login` there.
