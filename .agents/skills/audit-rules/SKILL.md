---
name: audit-rules
description: |-
    Audit Oxlint core rule inventory and base/override parity, or repair verified findings on explicit request.

disable-model-invocation: true
metadata:
    internal: true
---

# Standard Config Oxlint Rule Inventory

Use the bundled read-only [`scripts/inventory.ts`](scripts/inventory.ts) as the authoritative detector for Oxlint core rule coverage and base/override parity. The script discovers and compares deterministically. This skill interprets verified findings under repository policy and routes explicitly authorized repairs.

## Select Inventory Workflow

- For an audit or inspection without an explicit change request, [resolve the audit scope](#resolve-audit-scope), run the read-only detector, inspect the evidence, interpret findings, and report them. Do not enter repair, install dependencies, modify repository files, run mutating tools, or update snapshots. Stop after reporting findings.
- An explicit request to repair, fix, update, or otherwise modify the inventory uses the [repair workflow](references/repair-workflow.md) even when the same request also uses words such as `audit`, `review`, or `inspect`.
- In a mixed request such as “audit the rule inventory and repair any findings,” treat auditing as the discovery phase of the explicitly authorized repair workflow.
- Detector findings alone never grant permission to enter the repair workflow.

## Resolve Audit Scope

For standalone audits and inspections, exclude ignored and untracked paths by default. Resolve explicit scope requests through [Audit Path Selection](../audit-dependencies/references/audit-path-selection.md).

## Run Inventory Checks

1. Read every applicable `AGENTS.md` file and consult `.agents/PROJECT.md` for relevant project rationale before reviewing other repository content.
2. From the repository root, run the canonical detector in the selected mode. Release-note requests use the unauthenticated GitHub API at `api.github.com`.
    - A release fetch warning does not invalidate an otherwise complete offline audit.
    - Add `--json` to any invocation for machine-readable output on stdout. The JSON object contains `report` and, when release notes are requested, either `releaseNotes` or `releaseNotesError`. Exit codes are unchanged.
    - For a standalone audit or inspection with default scope, run `NODE_USE_ENV_PROXY=1 node .agents/skills/audit-rules/scripts/inventory.ts --tracked-only --release-notes`.
    - For explicitly scoped audits, use a detector mode only when its complete input set is authorized. The detector has no path selector. Omitting `--tracked-only` includes matching ignored and untracked files under `packages`. If neither mode fits the authorized scope and security exclusions, report the limitation and stop rather than widening the audit or entering repair.
    - For an explicit repair request, including a mixed audit-and-repair request, run `NODE_USE_ENV_PROXY=1 node .agents/skills/audit-rules/scripts/inventory.ts --release-notes` without `--tracked-only` so task-owned untracked files remain inspectable.
    - The installed Oxlint rule registry is authoritative. Release notes provide context only.
3. Classify the result according to the selected workflow.
    - Exit code `0` with a complete report means the inventory is clean.
    - Exit code `1` with a structured inventory report means findings exist rather than an execution failure. Report them in an audit, or continue into repair in the explicit repair workflow.
    - Output beginning with `Rule inventory failed:` means invocation, Oxlint format compatibility, or parser failed. In an audit, inspect and report the failure without modifying repository files. An explicitly authorized repair follows the [repair workflow](references/repair-workflow.md) before changing configs.
4. Fetch release notes only on the initial run. During repair, rerun `NODE_USE_ENV_PROXY=1 node .agents/skills/audit-rules/scripts/inventory.ts` without `--tracked-only` or release note options.

## Interpret Findings

- `Stable-rule inventory` reports supported non-`nursery` rules absent from an owning package’s base config. Nursery rules are excluded completely and are not inventory defects.
- `Base/override parity` reports owned core rules used by an override but absent from that package’s base config.
- `Unsupported configured core rules` reports configured rules whose source still exists in the installed registry but whose rule name does not. This commonly indicates a rename or removal.
- `Unrecognized owned core plugins` can indicate an Oxlint source rename, a missing identifier normalization, or a removed plugin.
- Owned core plugin inference follows [cross-package rule ownership](../../PROJECT.md#cross-package-rule-ownership).
- JavaScript plugin rules are excluded from stable completeness and core parity.

## Validate and Report

For an audit, report only findings after inspecting and interpreting the available evidence. If there are no findings, state that the inventory is clean. Do not list checks without findings, add a separate audit details section, or run repair validation.

For a repair, group remaining findings or completed repairs by package and check. Summarize release note context separately, and state the installed Oxlint version, excluded `nursery` count, edited files, and commands actually validated.
