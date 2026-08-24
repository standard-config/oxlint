# Repair workflow

The detector identifies findings. Use repository policy and verified rule semantics to decide the repair.

## Repair verified findings

1. Distinguish config changes from detector changes before editing.
    - If registry parsing or count validation fails, inspect the current `oxlint --rules --format=default` output. When Oxlint changed its output format, update [`inventory.ts`](../scripts/inventory.ts) and [its parser tests](../scripts/inventory.test.ts) rather than changing configs.
    - If a source identifier changed, update normalization only after confirming the installed registry’s identifier and the config identifier Oxlint accepts.
2. For a missing stable rule, inspect its installed category, release notes, rule semantics, and neighboring policy. Explicitly enable it with appropriate options or disable it. Do not default mechanically to either choice.
3. For parity findings, add the rule to the base config with the intended normal-file behavior, then keep the override’s specialized behavior.
4. For unsupported rules, verify whether Oxlint renamed or removed each rule, then update every affected base config and override. Do not infer a replacement from release-note wording alone.
5. When a newly configured core rule changes a package’s minimum supported Oxlint version, update its peer dependency according to [Oxlint version support](../../../PROJECT.md#oxlint-version-support). Update related snapshots and tests with the config change.

Keep repairs limited to verified inventory findings.

## Validate the repair

1. Rerun `node .agents/skills/sconfig-rule-inventory/scripts/inventory.ts` without `--tracked-only` until every check has no gaps and the parser accepts the complete registry.
2. If the inventory script changed, run `node --test .agents/skills/sconfig-rule-inventory/scripts/inventory.test.ts`.
3. If configs changed, run their focused tests and update snapshots. If a dependency range changed, update and validate the owning manifest and lockfile.
4. Run `pnpm run typecheck` and the applicable lint checks for every changed scope.

After validation, return to [common final reporting](../SKILL.md#validate-and-report).
