---
name: sconfig-rule-inventory
description: Audit or repair Oxlint core-rule inventory and base/override parity when Oxlint changes. Use this skill for strictly read-only Oxlint core-rule inventory audits and explicit requests to repair that inventory.
---

# Standard Config Oxlint rule inventory

Use the bundled read-only inventory script as the authoritative detector for Oxlint core-rule coverage and base/override parity. The script discovers and compares deterministically. This skill interprets verified findings under repository policy and repairs them only in the explicit repair workflow.

## Choose the workflow

- A request that asks only for an Oxlint core-rule inventory audit or inspection uses the strictly read-only audit workflow. It may run the detector, inspect evidence, interpret findings, and report them. It must not enter the repair workflow, modify repository files, install dependencies, update snapshots, or run mutating tools. It excludes every untracked path without exception and stops after reporting findings.
- An explicit request to repair, fix, update, or otherwise modify the inventory uses the repair workflow even when the same request also uses words such as `audit`, `review`, or `inspect`.
- In a mixed request such as “audit the rule inventory and repair any findings,” treat auditing as the discovery phase of the explicitly authorized repair workflow.
- Detector findings alone never grant permission to enter the repair workflow.

## Run the inventory

1. Read every applicable `AGENTS.md` file and consult `.agents/PROJECT.md` for relevant project rationale before reviewing other repository content.
2. From the repository root, run the canonical detector in the selected mode.
    - For a standalone audit or inspection, run `node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts --tracked-only --release-notes`.
    - For an explicit repair request, including a mixed audit-and-repair request, run `node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts --release-notes` without `--tracked-only` so task-owned untracked files remain inspectable.
    - Treat `scripts/inventory.ts`, relative to this skill, as the canonical inventory implementation.
    - If the request provides a release URL, append `--release-url <url>` with the literal URL.
    - The installed `oxlint --rules` registry is authoritative. Release notes provide context only.
    - A release-fetch warning does not invalidate an otherwise complete offline audit.
3. Classify the result according to the selected workflow.
    - Exit code `0` with a complete report means the inventory is clean.
    - Exit code `1` with a structured inventory report means findings exist rather than an execution failure. Report them in an audit, or continue into repair in the explicit repair workflow.
    - Output beginning with `Rule inventory failed:` means invocation, parser, or Oxlint-format compatibility failed. In an audit, inspect and report the failure without modifying repository files. In the repair workflow, repair that failure before changing configs.
4. Fetch release notes only on the initial run. During repair, rerun `node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts` without `--tracked-only` or release-note options.

## Interpret findings

- `Stable-rule inventory` reports supported non-`nursery` rules absent from an owning package’s base config. Nursery rules are excluded completely and are not inventory defects.
- `Base/override parity` reports owned core rules used by an override but absent from that package’s base config.
- `Unsupported configured core rules` reports configured rules whose source still exists in the installed registry but whose rule name does not. This commonly indicates a rename or removal.
- `Unrecognized owned core plugins` can indicate an Oxlint source rename, a missing identifier normalization, or a removed plugin.
- Owned core-plugin inference follows [cross-package rule ownership](../../PROJECT.md#cross-package-rule-ownership).
- JavaScript-plugin rules are excluded from stable completeness and core parity.

## Repair verified findings

Enter this section only in the explicit repair workflow. The script detects defects. Use repository policy and verified rule semantics to decide the repair.

1. Distinguish config changes from audit-tool changes before editing.
    - If registry parsing or count validation fails, inspect the current `oxlint --rules` output. When Oxlint changed its output format, update `scripts/inventory.ts` and its parser tests rather than changing configs.
    - If a source identifier changed, update normalization only after confirming the installed registry’s identifier and the config identifier Oxlint accepts.
2. For a missing stable rule, inspect its installed category, release notes, rule semantics, and neighboring policy. Explicitly enable it with appropriate options or disable it. Do not default mechanically to either choice.
3. For parity findings, add the rule to the base config with the intended normal-file behavior, then keep the override’s specialized behavior.
4. For unsupported rules, verify whether Oxlint renamed or removed each rule, then update every affected base config and override. Do not infer a replacement from release-note wording alone.
5. When a newly configured core rule changes a package’s minimum supported Oxlint version, update its peer dependency according to [Oxlint version support](../../PROJECT.md#oxlint-version-support). Update related snapshots and tests with the config change.

Keep repairs limited to verified inventory findings.

## Validate and report

For an audit, report the detector result after inspecting and interpreting the available evidence. Do not run repair validation.

For a repair:

1. Rerun `node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts` without `--tracked-only` until every check has no gaps and the parser accepts the complete registry.
2. If the inventory script changed, run `node --test .agents/skills/sconfig-rule-inventory/scripts/inventory.test.ts`.
3. If configs changed, run their focused tests and update snapshots. If a dependency range changed, update and validate the owning manifest and lockfile.
4. Run `pnpm run typecheck` and the applicable lint checks for every changed scope.

For either workflow, group remaining findings or completed repairs by package and check. Summarize release-note context separately, and state the installed Oxlint version, excluded `nursery` count, edited files (none in an audit), and commands actually validated.
