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

- For an audit or inspection without an explicit change request, [resolve the audit scope](#resolve-audit-scope), run the read-only detector, inspect the evidence, interpret findings, and report them. Don’t enter repair, install dependencies, modify repository files, run mutating tools, or update snapshots. Stop after reporting findings.
- An explicit request to repair, fix, update, or otherwise modify the inventory uses the [repair workflow](references/repair-workflow.md), even when described as an audit, review, or inspection. Treat auditing in a mixed audit-and-repair request as the discovery phase of that workflow.

Detector findings alone never grant permission to enter repair.

## Resolve Audit Scope

For standalone audits and inspections, exclude ignored and untracked paths by default. Resolve explicit scope requests through [Audit Path Selection](../audit-dependencies/references/audit-path-selection.md).

## Run Inventory Checks

1. Read every applicable `AGENTS.md` file before reviewing any other repository content.
2. From the repository root, run the canonical detector in the selected mode.
    - For a standalone audit or inspection with default scope, run `NODE_USE_ENV_PROXY=1 node .agents/skills/audit-rules/scripts/inventory.ts --tracked-only --release-notes`.
    - For explicitly scoped audits, use a detector mode only when its complete input set is authorized. The detector has no path selector. Omitting `--tracked-only` includes matching ignored and untracked files under `packages`. If neither mode fits the authorized scope and security exclusions, report the limitation and stop rather than widening the audit or entering repair.
    - For repairs, use the [repair inventory invocation](references/repair-workflow.md#run-repair-inventory).
    - Add `--json` to any invocation for machine-readable output on stdout. The JSON object contains `report` and, when release notes are requested, either `releaseNotes` or `releaseNotesError`. Exit codes are unchanged.
3. Classify the result according to the selected workflow.
    - Exit code `0` with a complete report means the inventory is clean.
    - Exit code `1` with a complete report means the inventory completed with findings. Report them in an audit, or continue into repair in the explicit repair workflow.
    - Exit code `2`, with a `Rule inventory failed:` diagnostic on standard error, means the invocation failed, the Oxlint output format was incompatible, or parsing failed. In an audit, inspect and report the failure without modifying repository files. An explicitly authorized repair follows [Repair Verified Findings](references/repair-workflow.md#repair-verified-findings) before changing configs.

The installed Oxlint rule registry is authoritative. Release notes provide context only. Request them only on the initial run through `--release-notes`, which makes the detector query the unauthenticated GitHub API at `api.github.com`. A release fetch warning doesn’t invalidate an otherwise complete offline audit.

## Interpret Findings

- `Stable-rule inventory` reports supported non-`nursery` rules absent from an owning package’s base config. Nursery rules are excluded completely and aren’t inventory defects.
- `Base/override parity` reports owned core rules used by an override but absent from that package’s base config.
- `Unsupported configured core rules` reports configured rules whose source still exists in the installed registry but whose rule name doesn’t. This commonly indicates a rename or removal.
- `Unrecognized owned core plugins` can indicate an Oxlint source rename, a missing identifier normalization, or a removed plugin.
- Owned core plugin inference follows [cross-package rule ownership](../../../.agents/PROJECT.md#cross-package-rule-ownership).
- JavaScript plugin rules are excluded from stable completeness and core parity.

## Validate and Report

Before reporting a finding, check `.agents/PROJECT.md` for project rationale that explains or settles it.

For an audit, report only findings after inspecting and interpreting the available evidence. If there are no findings, state that the inventory is clean. Don’t list checks without findings, add a separate audit details section, or run repair validation.

For a repair, group remaining findings or completed repairs by package and check. Summarize release note context separately, and state the installed Oxlint version, excluded `nursery` count, edited files, and commands actually validated.
