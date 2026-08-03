# Project documentation

This document records durable architecture, tooling decisions, compatibility constraints, and maintenance procedures that are not obvious from the source alone. `AGENTS.md` remains authoritative for agent instructions; use this file for project rationale and operational context.

Organize future entries under broad second-level sections so this document can grow without becoming a flat list of unrelated notes.

## Compatibility

### Oxlint version support

Set each package’s `oxlint` peer dependency range to the earliest Oxlint version that contains every core rule defined by that package. This requirement applies whether a rule is enabled or disabled because Oxlint must recognize every configured rule name.

When a package defines no core rules, use `^1.53.0`; this is the release where `jsPlugins` support advanced from experimental to alpha.
