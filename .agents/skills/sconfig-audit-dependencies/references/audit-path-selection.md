# Audit Path Selection

Resolve explicit audit scope in two steps: select candidate paths, then apply the exclusions that remain. Without an explicit selection, use the audit workflow’s default scope.

## Select Candidate Paths

Classify a path as **tracked** if Git tracks it or it is a directory containing tracked files. Otherwise, classify it as **ignored** if Git ignores it, or **untracked** if it does not.

- **Named paths:** Select each named path. For a directory, also select descendants with the same classification.
- **Path categories:** Select repository paths in an expressly requested group, such as dependency installation directories or generated output, within the requested scope. Include ignored matches. Audit modes and issue categories do not select path categories.

A request for untracked content alone does not select ignored paths.

## Apply Remaining Exclusions

Explicit selection overrides the corresponding Git status defaults. Retain every other non-secret default exclusion unless the user names the excluded path itself or expressly selects its path category. Naming an ancestor directory alone does not lift an exclusion on a descendant.

Preserve access controls, credential protection, and scope rules required by higher-priority instructions. Path selection does not waive required approvals or authorize changes.

Selecting a symbolic link does not select its target. Dereference it only when the request or applicable policy requires the target.
