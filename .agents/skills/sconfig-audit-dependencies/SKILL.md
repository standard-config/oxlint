---
name: sconfig-audit-dependencies
description: |-
    Audit dependency ownership and report misplaced, missing, or redundant declarations without changing files.

disable-model-invocation: true
metadata:
    internal: true
---

# Standard Config Dependency Audit

Do not use this workflow for debugging, dependency updates, implementation tasks, or ordinary code review.

## Resolve Dependency Scope

1. Read every applicable `AGENTS.md` file and consult `.agents/PROJECT.md` for relevant project rationale before reviewing other repository content.
2. By default, audit Git-tracked paths other than dependency installation directories, generated output, and symbolic links.
3. Resolve explicit scope requests through [Audit Path Selection](references/audit-path-selection.md).
4. Inspect every `package.json` and `pnpm-workspace.yaml` in the resolved audit scope.
5. Inspect the corresponding source, tests, scripts, configuration, and TypeScript configuration needed to establish whether each dependency is used and which manifest owns it.

## Audit Dependency Ownership

- Report dependencies that are missing, redundant, or assigned to the wrong dependency field or workspace package.
- Account for runtime imports, type-only imports, test and build tooling, package scripts, configuration files, peer dependency relationships, workspace packages, and bundled internal code before classifying a dependency.
- Report every installed `@types/*` package that is not utilized.
- Ensure every installed `@types/*` package is referenced in `compilerOptions.types` in the corresponding `tsconfig.json`, including inherited TypeScript configuration when applicable.
- Ensure every dependency referenced through `catalog:` is referenced by more than one package.
    - Account for `overrides` in `pnpm-workspace.yaml` when evaluating catalog ownership and shared use.

## Keep Audits Read-Only

- Do not modify repository files, install dependencies, update the lockfile, or run mutating package manager commands.
- Do not remove or reclassify a dependency based only on naming or convention. Establish its actual repository use first.
- Continue through the complete resolved audit scope before reporting results.

## Report Audit Results

- Lead with the findings. If there are none, state that the audit found no reportable issues.
- Reference the owning manifest and the concrete import, script, configuration, or TypeScript evidence for each finding.
- State the resolved audit scope and identify anything that could not be verified.
