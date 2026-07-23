---
description: Update .claude/progress.md and .claude/tabs.md with this tab's current status
argument-hint: [tab number or area, e.g. "Tab 3"]
---

Update the progress tracking to reflect the true current state of work in this session.

Area/tab: $ARGUMENTS

Steps:
1. Determine what actually changed this session: run `git status` / `git diff --stat` in `portfolio-v2/`
   (or list created files) — do not claim work that isn't on disk.
2. Read `.claude/progress.md`. Update the relevant tab's section: set Status (⬜/🟨/✅/⛔), fill
   **Delivered** (files shipped), **Left** (remaining), and **Blockers**.
3. Add one dated line to the `## Changelog` (newest first): `YYYY-MM-DD · Tab N · what shipped`.
4. Update the Status column for that row in `.claude/tabs.md` to match.

Be honest and specific. If blocked, name the blocker and which tab/contract item it depends on.
Confirm the new status in one line.
