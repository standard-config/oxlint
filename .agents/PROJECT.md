# Project documentation

This document records durable facts, rationale, constraints, and maintenance decisions that are not obvious from source and configuration. `AGENTS.md` remains authoritative for agent instructions.

## Architecture

### Cross-package rule ownership

Core plugins and rules that a supplemental config conditionally includes only when the core config is available remain owned by the core config. The supplemental config may declare a plugin solely to make a cross-package override valid while remaining independently usable.

These conditional supplemental declarations do not represent ownership of the plugin’s complete rule set when auditing rule completeness or base and override parity.

Each package’s owned core plugins are represented as direct string entries in its base config’s `plugins` array. Spread entries are reserved for supplemental plugin declarations. The inventory derives ownership from this source distinction.

## Compatibility

### Oxlint version support

Each package’s `oxlint` peer dependency range is maintained at the earliest Oxlint version that contains every core rule defined by that package. This compatibility baseline includes enabled and disabled rules because Oxlint must recognize every configured rule name.

For a package that defines no core rules, the maintained compatibility baseline is `^1.53.0`. This is the release where `jsPlugins` support advanced from experimental to alpha.

## Agent integration

### Claude Agent integration

The tracked [`CLAUDE.md`](../CLAUDE.md) bridge is described in the [agent documentation table](../AGENTS.md#agent-documentation). The tracked [`.claude/skills`](../.claude/skills) symlink exposes repository-internal skills from `.agents/skills`. Claude therefore uses its native instruction and skill discovery locations without duplicating canonical content.
