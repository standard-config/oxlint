---
name: sconfig-audit-dependencies
description: Audit dependency declarations across the Standard Config Oxlint workspace without editing files. Use this skill whenever the user explicitly asks to audit dependencies, including the exact `Audit dependencies` command, or asks for missing, redundant, misassigned, or unused dependency analysis. Do not treat the bare `Dependencies` command as an invocation, and do not use this skill for installing or updating dependencies.
---

# Standard Config dependency audit

Audit dependency ownership across the entire repository without modifying it. Treat the exact `Audit dependencies` command as a complete repository-wide audit.

## Resolve the dependency surface

1. Read every applicable `AGENTS.md` file.
2. Inspect every Git-tracked `package.json` in the repository and `pnpm-workspace.yaml`.
3. Inspect the corresponding source, tests, scripts, configuration, and TypeScript configuration needed to establish whether each dependency is used and which manifest owns it.
4. Exclude generated output, dependency installation directories, and untracked task files unless the user explicitly includes them.

## Audit dependency ownership

- Report dependencies that are missing, redundant, or assigned to the wrong dependency field or workspace package.
- Account for runtime imports, type-only imports, test and build tooling, package scripts, configuration files, peer dependency relationships, workspace packages, and bundled internal code before classifying a dependency.
- Report every installed `@types/*` package that is not utilized.
- Ensure every installed `@types/*` package is referenced in `compilerOptions.types` in the corresponding `tsconfig.json`, including inherited TypeScript configuration when applicable.
- Ensure every dependency referenced through `catalog:` is referenced by more than one package.
    - Account for `overrides` in `pnpm-workspace.yaml` when evaluating catalog ownership and shared use.

## Preserve the read-only workflow

- Do not edit files, install dependencies, update the lockfile, or run mutating package-manager commands.
- Do not remove or reclassify a dependency based only on naming or convention; establish its actual repository use first.
- Continue through the complete dependency surface before reporting results.

## Report the result

- Lead with evidence-backed dependency findings. If there are none, state that the audit found no reportable dependency issues.
- Reference the owning manifest and the concrete import, script, configuration, or TypeScript evidence for each finding.
- State that every package manifest and `pnpm-workspace.yaml` were included, and identify anything that could not be verified.
