---
name: publish-project-docs
description: Write or update the standard project documentation set (PRD, TDD, Test Plan, Test Cases — TDD, Test Cases — BDD, Test Run Report) and keep it in sync in both the git repo (docs/) and a Google Drive folder as native Google Docs. Use when asked to create or update project documentation.
---

# Publish Project Documentation

Produces the standard doc set for a build and keeps it synchronized in two places:
the git repo and Google Drive. The two must never be allowed to drift apart.

## Documents to produce

1. **Product Requirements Document (PRD)** — overview, goals, non-goals, user
   stories, functional/non-functional requirements, success metrics, open questions
2. **Technical Design Document (TDD)** — architecture, tech stack + rationale,
   project structure, data model, state management, routing, key component
   behaviors, testing strategy, build/deploy, known limitations
3. **Test Plan** — objective, scope (in/out), test levels & approach, environment,
   entry/exit criteria, deliverables, risks, schedule
4. **Test Cases — always two separate documents, never merged into one file**
   (standing rule, applies to every project):
   - **`TestCases-TDD.md`** — one table per page/area, automated unit/component AND
     end-to-end cases mapped to their test files, plus manual/exploratory cases for
     what automation doesn't practically cover
   - **`TestCases-BDD.md`** — Given/When/Then Gherkin scenarios quoted verbatim from
     the `.feature` files, grouped by feature file, with a parallels column back to
     the TDD/E2E case IDs. If there is no BDD suite yet, still name the file
     `TestCases-TDD.md` rather than `TestCases.md`, so adding BDD later needs no rename.
5. **Test Run Report** — actual results: automated suite output (verbatim), build
   output, manual smoke test results (mark anything **NOT VERIFIED** honestly, with
   why), defects found (or none), coverage gaps/follow-ups, conclusion
6. **Defect reports** (as needed) — status, severity, repro steps, root cause,
   impact, suggested fix, evidence (linked failing test + captured log) — see
   `demo-failing-test` for how these get produced

**Every document's "Author" (or "Found by") field must use the user's actual name**,
never "Claude" or similar — confirm the correct name once and reuse it.

## Steps

1. Write/update each doc as plain Markdown in the repo's `docs/` folder first —
   **never write enriched content only to Drive**; the local file is the source of
   truth and must be updated at the same time or before the Drive copy.
2. Commit and push the `docs/` changes to GitHub.
3. Sync to Google Drive:
   - `search_files` the target Drive folder for an existing doc with the matching
     title (convention: `<AppName> - <Document Name>`).
   - There is no "replace content" tool for Drive docs. If one exists, `trash_file`
     it (recoverable, not permanent) and create a fresh one with the current content.
   - Use `create_file` with `contentMimeType: 'text/plain'` and `parentId` set to the
     Drive folder ID — Google auto-converts plain text/Markdown into a native Doc.
4. Do this resync for **every** doc whose source content changed, every time — not
   just the one doc that prompted the update. A change to the tech stack (e.g. adding
   Playwright) touches the TDD, Test Plan, both Test Cases docs, and Test Run Report
   at once.

## Notes / lessons learned

- On one occasion in this project, enriched content was written directly into a Drive
  doc's `create_file` call without first updating the matching local `.md` file —
  the two silently diverged until caught by chance. Always write local-first.
- If the user gives a standing instruction like "always credit me, not Claude" or
  "highlight X in documentation," apply it retroactively to every existing doc in
  both locations, not just new ones going forward.

See `docs/PRD.md`, `docs/TDD.md`, `docs/TestPlan.md`, `docs/TestCases-TDD.md`,
`docs/TestCases-BDD.md`, and `docs/TestRunReport.md` in this repo for a complete
worked example.
