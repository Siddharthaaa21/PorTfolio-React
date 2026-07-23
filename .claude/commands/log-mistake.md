---
description: Append a structured entry to .claude/mistakes.md
argument-hint: [short description of the mistake or bug]
---

Append a new entry to `.claude/mistakes.md` documenting a mistake, bug, or contract gap encountered,
so it isn't repeated across the other tabs.

What the user reported: $ARGUMENTS

Steps:
1. Read `.claude/mistakes.md` to get the template and the existing entries.
2. Gather the details — if any are unclear, briefly inspect the relevant files (don't guess at root cause).
3. Append an entry under the `## Log` section (newest first) using the template:
   date, tab/area, what happened, root cause, fix, and a concrete **prevention rule**.
4. If the prevention rule is broadly useful, also add it to `.claude/conventions.md`.
5. If the issue is actually a contract *ambiguity* (not just a violation), add a short entry to
   `.claude/decisions.md` resolving it.

Keep it factual and concise. Confirm what you wrote in one line.
