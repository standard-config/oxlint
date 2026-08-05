# Project documentation

This document records durable architecture, tooling decisions, compatibility constraints, and maintenance procedures that are not obvious from the source alone. `AGENTS.md` remains authoritative for agent instructions; use this file for project rationale and operational context.

Organize future entries under broad second-level sections so this document can grow without becoming a flat list of unrelated notes.

## Architecture

### Cross-package rule ownership

Core plugins and rules that a supplemental config conditionally includes only when the core config is available remain owned by the core config. The supplemental config may declare a plugin solely to make a cross-package override valid while remaining independently usable.

Do not treat these conditional declarations as ownership of the plugin’s complete rule set when auditing rule completeness or base and override parity.

Represent each package’s owned core plugins as direct string entries in its base config’s `plugins` array. Reserve spread entries for supplemental plugin declarations. The inventory derives ownership from this source distinction.

## Compatibility

### Oxlint version support

Set each package’s `oxlint` peer dependency range to the earliest Oxlint version that contains every core rule defined by that package. This requirement applies whether a rule is enabled or disabled because Oxlint must recognize every configured rule name.

When a package defines no core rules, use `^1.53.0`; this is the release where `jsPlugins` support advanced from experimental to alpha.
