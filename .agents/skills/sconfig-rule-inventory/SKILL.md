---
name: sconfig-rule-inventory
description: Audit and repair Oxlint core-rule inventory and base/override parity when Oxlint changes.
---

# Standard Config Oxlint rule inventory

Use the bundled read-only inventory script as the authoritative detector for Oxlint core-rule coverage and base/override parity. The script discovers and compares; this skill diagnoses verified findings, applies policy, repairs affected files unless the user requests a report-only audit, and reports the result.

## Run the inventory

1. Read every applicable `AGENTS.md` file and `.agents/PROJECT.md`.
2. From the repository root, run `node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts --release-notes`.
    - Treat `scripts/inventory.ts`, relative to this skill, as the canonical inventory implementation.
    - If the request provides a release URL, append `--release-url <url>` with the literal URL.
    - The installed `oxlint --rules` registry is authoritative. Release notes provide context only.
    - A release-fetch warning does not invalidate an otherwise complete offline audit.
3. Classify the result before editing.
    - Exit code `0` with a complete report means the inventory is clean.
    - Exit code `1` with a structured inventory report means findings exist; continue into the repair workflow rather than treating the command as an execution failure.
    - Output beginning with `Rule inventory failed:` means invocation, parser, or Oxlint-format compatibility failed; repair that failure before changing configs.
4. Fetch release notes only on the initial run. During repair, rerun `node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts` without network output.

## Interpret findings

- `Stable-rule inventory` reports supported non-`nursery` rules absent from an owning package’s base config. Nursery rules are excluded completely and are not inventory defects.
- `Base/override parity` reports owned core rules used by an override but absent from that package’s base config.
- `Unsupported configured core rules` reports configured rules whose source still exists in the installed registry but whose rule name does not. This commonly indicates a rename or removal.
- `Unrecognized owned core plugins` can indicate an Oxlint source rename, a missing identifier normalization, or a removed plugin.
- Owned core-plugin inference follows [cross-package rule ownership](../../PROJECT.md#cross-package-rule-ownership).
- JavaScript-plugin rules are excluded from stable completeness and core parity.

## Repair verified findings

The script detects defects; use repository policy and verified rule semantics to decide the repair.

1. Distinguish config changes from audit-tool changes before editing.
    - If registry parsing or count validation fails, inspect the current `oxlint --rules` output. When Oxlint changed its output format, update `scripts/inventory.ts` and its parser tests rather than changing configs.
    - If a source identifier changed, update normalization only after confirming the installed registry’s identifier and the config identifier Oxlint accepts.
2. For a missing stable rule, inspect its installed category, release notes, rule semantics, and neighboring policy. Explicitly enable it with appropriate options or disable it; do not default mechanically to either choice.
3. For parity findings, add the rule to the base config with the intended normal-file behavior, then keep the override’s specialized behavior.
4. For unsupported rules, verify whether Oxlint renamed or removed each rule, then update every affected base config and override. Do not infer a replacement from release-note wording alone.
5. When a newly configured core rule changes a package’s minimum supported Oxlint version, update its peer dependency according to `.agents/PROJECT.md`. Update related snapshots and tests with the config change.

Keep repairs limited to verified inventory findings. If the user requests report-only behavior, do not edit files.

## Validate and report

1. Rerun `node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts` until every check has no gaps and the parser accepts the complete registry.
2. If the inventory script changed, run `node --test .agents/skills/sconfig-rule-inventory/scripts/inventory.test.ts`.
3. If configs changed, run their focused tests and update snapshots. If a dependency range changed, update and validate the owning manifest and lockfile.
4. Run `pnpm run typecheck` and the applicable lint checks for every changed scope.
5. Group remaining findings or completed repairs by package and check. Summarize release-note context separately, and state the installed Oxlint version, excluded `nursery` count, edited files, and commands actually validated.
