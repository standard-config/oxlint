# Audit Path Selection

Resolve explicit audit scope in two steps: select candidate paths, then apply the exclusions that remain.

## Select Candidate Paths

Classify a path as **tracked** if Git tracks it or it’s a directory containing tracked files. Otherwise, classify it as **ignored** if Git ignores it, or **untracked** if it doesn’t.

- **Named paths:** Select each named path. For a directory, also select descendants with the same classification.
- **Path categories:** Select tracked and untracked repository paths in an expressly requested group within the requested scope. A language or configuration category also selects ignored paths that applicable `AGENTS.md` scope rules include. Other ignored matches require an expressly requested category of ignored paths, such as dependency installation directories or generated output. Audit modes and issue categories don’t select path categories.

A request for untracked content alone doesn’t select ignored paths.

## Apply Remaining Exclusions

Explicit selection overrides the corresponding Git status defaults. Retain every other non-secret default exclusion unless the user names the excluded path itself or expressly selects its path category. Naming an ancestor directory alone doesn’t lift an exclusion on a descendant.

Preserve access controls, credential protection, and scope rules required by higher-priority instructions. Path selection doesn’t waive required approvals or authorize changes.

Selecting a symbolic link doesn’t select its target. Dereference it only when the request or applicable policy requires the target.
