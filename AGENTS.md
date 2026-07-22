# Agent Instructions

## Overview

- This repository is home to the shareable Oxlint config.
- The config is split into multiple theme-based packages located under `packages/*`.
- This project is public and open source.

## Shorthand Commands

- Shorthand commands are high-level task macros that define complete, self-contained procedures.
- Always execute shorthand commands exactly as defined below.
- Report findings only when supported by concrete repository evidence.
    - Do not report speculative findings or preference-only alternatives.
    - Assign a unique number to each finding when it is first reported.
    - Preserve finding numbers in all subsequent reports.

### Dependencies

- Review all `package.json` files in the repository for missing, redundant, or misassigned dependencies.
    - Include `pnpm-workspace.yaml` in this review.
    - Report any installed `@types/*` packages that are not utilized.
    - Ensure all installed `@types/*` packages are always referenced in `compilerOptions.types` in the corresponding `tsconfig.json`.
- Ensure all `catalog:` dependencies are referenced by more than one package.
    - Account for `overrides` in `pnpm-workspace.yaml`.
- Perform this task without making edits.

### Inventory

- For all core `plugins` used in each config, ensure every supported Oxlint rule is explicitly configured (enabled or disabled).
    - List each missing rule on a separate line in a code block.
    - Exclude `nursery` rules from this audit.
    - For additional context, fetch the release notes from the provided URL. If no URL is provided, attempt to fetch the release notes for the installed Oxlint version from `https://github.com/oxc-project/oxc/releases`.
- Ensure each base config explicitly configures every core rule used by override configs within the same config package.
    - Ignore rules from core plugins not declared by the base config.
- Perform this task without making edits.

### Review

- Review the commit matching the provided hash.
    - If no hash is given, review the most recent commit on the current branch.
- Report any regressions the changes may introduce.
- Report any cases where new code reimplements behavior already available in the language, standard library, or existing shared utilities in this repository.
- Ensure all changes align with the latest version of `AGENTS.md`.
- Perform this task without making edits.

### Verify

- Re-read `AGENTS.md` and all reported files to confirm whether reported issues remain relevant.
    - Ensure that all findings align with the latest version of `AGENTS.md`.
- Classify each previously reported finding as resolved, intentional, or unresolved.
    - Exclude resolved findings from future reports.
    - Exclude intentional findings from future reports unless the relevant code or `AGENTS.md` changes.
- Report only unresolved findings that still apply.
