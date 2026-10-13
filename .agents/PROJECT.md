# Project Documentation

This document records constraints, durable facts, maintenance decisions, and rationale that are not obvious from source and configuration. `AGENTS.md` remains authoritative for agent instructions.

## Architecture

### Cross-Package Rule Ownership

Core plugins and rules that a supplemental config conditionally includes only when the core config is available remain owned by the core config. The supplemental config may declare a plugin solely to make a cross-package override valid while remaining independently usable.

These conditional supplemental declarations do not represent ownership of the plugin’s complete rule set when auditing rule completeness or base and override parity.

Each package’s owned core plugins are represented as direct string entries in its base config’s `plugins` array. Spread entries are reserved for supplemental plugin declarations. The inventory derives ownership from this source distinction.

### Utilities Dependency Direction

`@standard-config/utilities` is a private build dependency whose code is bundled into the config packages. Its `includesCoreConfig` helper probes for `@standard-config/oxlint` without requiring it, and the positive unit test relies on the root’s core config installation. For tests that execute the utility source, resolution starts from the helper’s own location, so relocating a test to another workspace package does not remove its reliance on the root installation. A reverse dependency from utilities to the core package is intentionally absent because it would create a workspace dependency cycle.

## Compatibility

### Oxlint Version Support

Each package’s `oxlint` peer dependency range is maintained at the earliest Oxlint version that contains every core rule defined by that package. This compatibility baseline includes enabled and disabled rules because Oxlint must recognize every configured rule name.

For a package that defines no core rules, the maintained compatibility baseline is `^1.53.0`. This is the release where `jsPlugins` support advanced from experimental to alpha.

### React Compiler Rule Coverage

In the Oxlint 1.79.0 evaluation, `react/preserve-manual-memoization` was upstream-recommended but produced no diagnostics on its documented incomplete `useMemo` dependency example, which `react/exhaustive-deps` covered. Its `off` setting reflects that result rather than disagreement with the rule’s intent.
