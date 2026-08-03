---
name: sconfig-rule-inventory
description: Audit the completeness of Oxlint core-rule configuration across Standard Config packages without editing files. Use this skill whenever the user invokes `Inventory`, provides an Oxlint release URL with that command, asks to inventory supported Oxlint rules, or requests base/override core-rule parity. Do not use it for general file, package, export, or dependency inventories.
---

# Standard Config Oxlint rule inventory

Audit every declared Oxlint core plugin against the installed Oxlint rule registry and verify core-rule parity between each package’s base and override configs. Keep the task read-only.

## Resolve the inventory

1. Read every applicable `AGENTS.md` file.
2. Determine the installed Oxlint version and discover every config package and core `plugins` declaration from the repository rather than assuming a fixed package or plugin list.
3. Fetch the release notes from a URL provided with the request.
    - If no URL is provided, attempt to fetch the release notes for the installed Oxlint version from `https://github.com/oxc-project/oxc/releases`.
    - Use release notes as additional context; use the installed Oxlint rule registry as the authoritative supported-rule inventory.
4. Enumerate the installed rules with `pnpm exec oxlint --rules` or equivalent installed metadata that preserves each rule’s plugin and category.

## Audit stable core rules

- For every core plugin declared by a config, ensure every supported non-`nursery` rule is explicitly configured as enabled or disabled.
- Exclude `nursery` rules completely. Do not report them as missing or as inventory defects.
- Treat Oxlint source identifiers and config plugin identifiers as equivalent where Oxlint renders them differently, such as `jsx_a11y` and `jsx-a11y`.
- Audit only Oxlint core plugins for completeness; do not require JavaScript plugins to configure every rule they expose.

## Audit base and override parity

- Discover every override config within each config package.
- Ensure the package’s base config explicitly configures every core rule used by its override configs.
- Ignore rules from core plugins not declared by that package’s base config.
- Ignore JavaScript-plugin rules for this parity check.

## Preserve the read-only workflow

- Do not edit or format files.
- Do not infer supported rules solely from release-note wording or upstream plugin documentation when installed Oxlint metadata is available.
- Complete both the stable-rule inventory and the base/override parity check before reporting.

## Report the result

- Group missing rules by package and check.
- List each missing rule on a separate line in a code block.
- If a check has no missing rules, state that it has no gaps rather than emitting an empty code block.
- Summarize relevant release-note context separately from the inventory result.
- State the installed Oxlint version, the excluded `nursery` rule count when available, and that no files were edited.
