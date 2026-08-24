---
name: sconfig-audit-dependencies
description: Perform a read-only audit of dependency ownership across the complete Standard Config Oxlint repository. Use this skill whenever the user requests `Audit dependencies` or another repository-wide dependency ownership audit. Do not use it for dependency updates, ordinary code review, debugging, or implementation tasks.
metadata:
    internal: true
---

# Standard Config dependency audit

## Resolve the dependency surface

1. Read every applicable `AGENTS.md` file and consult `.agents/PROJECT.md` for relevant project rationale before reviewing other repository content.
2. Resolve the audit surface from Git-tracked paths only. Exclude all untracked paths. Explicit user scope cannot override this exclusion.
3. Exclude generated output, dependency installation directories, and symbolic links as applicable.
4. Inspect every Git-tracked `package.json` in the repository and `pnpm-workspace.yaml`.
5. Inspect the corresponding source, tests, scripts, configuration, and TypeScript configuration needed to establish whether each dependency is used and which manifest owns it.

## Audit dependency ownership

- Report dependencies that are missing, redundant, or assigned to the wrong dependency field or workspace package.
- Account for runtime imports, type-only imports, test and build tooling, package scripts, configuration files, peer dependency relationships, workspace packages, and bundled internal code before classifying a dependency.
- Report every installed `@types/*` package that is not utilized.
- Ensure every installed `@types/*` package is referenced in `compilerOptions.types` in the corresponding `tsconfig.json`, including inherited TypeScript configuration when applicable.
- Ensure every dependency referenced through `catalog:` is referenced by more than one package.
    - Account for `overrides` in `pnpm-workspace.yaml` when evaluating catalog ownership and shared use.

## Preserve the read-only process

- Do not modify repository files, install dependencies, update the lockfile, or run mutating package-manager commands.
- Do not remove or reclassify a dependency based only on naming or convention. Establish its actual repository use first.
- Continue through the complete dependency surface before reporting results.

## Report the result

- Lead with evidence-backed dependency findings. If there are none, state that the audit found no reportable dependency issues.
- Reference the owning manifest and the concrete import, script, configuration, or TypeScript evidence for each finding.
- State that every package manifest and `pnpm-workspace.yaml` were included, and identify anything that could not be verified.
