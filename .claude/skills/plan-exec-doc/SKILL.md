---
name: plan-exec-doc
description: Plan a requested change (asking clarifying questions before finalizing), implement it, document it in changelog.md, then output a one-liner commit message in "[TYPE][FEATURE] message" format.
---

# Plan, Execute, Document

Runs the full loop for a single request: plan it, clarify anything ambiguous, implement it, record it in `changelog.md`, then hand back a commit message. The request being planned is whatever the user passed as arguments to this skill (or, if none were given, the most recent request in the conversation).

Follow these steps in order. Do not skip the clarification step and do not skip straight to editing files before a plan has been approved.

## 1. Plan the request

Treat the user's request the way `/plan`-style planning works in this repo:

1. Call `EnterPlanMode` before reading files or editing anything.
2. Investigate the codebase as needed (read files, grep, check configs) to understand what the change actually requires and where it touches.
3. **Whenever there is a genuine decision only the user can make** — an ambiguous requirement, a choice between materially different approaches, a missing detail that changes the design — stop and call `AskUserQuestion` before writing the plan. Do not guess on things that matter and do not proceed to `ExitPlanMode` with open questions still unresolved. It's fine to ask more than once if the answer to one question raises another.
4. Once the approach is fully resolved, write the plan and call `ExitPlanMode` to get it approved. Do not begin implementation before this approval.

## 2. Implement

Once the plan is approved, implement it:

- Make the edits the plan describes.
- Verify the change the way this repo's other work has been verified (type-check / build / run the relevant dev server / smoke-test the affected route or feature) — don't just claim it works, check it.
- Keep the implementation scoped to what the approved plan covers; if you discover mid-implementation that the plan needs to change materially, surface that to the user rather than silently going off-plan.

## 3. Document in changelog.md

After the implementation is verified:

- Open `changelog.md` at the repo root (create it if it does not exist yet, following the structure already established there — a `# Changelog` heading with dated `## YYYY-MM-DD` sections, each containing a `### Changed` (or `### Added` / `### Fixed`, whichever fits) bullet list).
- Add an entry for today's date (reuse today's existing date heading if one is already present from earlier in the session rather than duplicating it).
- Describe what changed and, briefly, why — enough for someone reading the file later to understand the change without re-reading the diff. Keep it as tight as the existing entries.

## 4. Give a one-liner commit message

Finish by outputting a single commit message line in this exact format:

```
[<TYPE>][<FEATURE>] <one-liner on what changed>
```

- `<TYPE>` is a short all-caps tag for the kind of change, e.g. `SSG`, `DEPS`, `FEATURE`, `FIX`, `REFACTOR`, `ENV`, `ANALYTICS`, `UPDATE` — pick (or coin) whatever tag best fits this change.
- `<FEATURE>` is a short all-caps name for the area touched, e.g. `BLOG`, `PORTFOLIO`, `HOME`.
- The message itself should be a concise, present-tense summary of the change (matching the style of this repo's existing commit history — see `git log`).

Only output this line — do not run `git commit` yourself. Creating the actual commit still requires the user to explicitly ask for it, per this repo's normal git workflow.
