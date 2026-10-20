# Project Documentation

This document records constraints, durable facts, maintenance decisions, and rationale that are not obvious from source and configuration. `AGENTS.md` remains authoritative for agent instructions.

## Architecture

### Cross-Package Rule Ownership

Core plugins and rules that a supplemental config conditionally includes only when the core config is available remain owned by the core config. The supplemental config may declare a plugin solely to make a cross-package override valid while remaining independently usable.

These conditional supplemental declarations don’t represent ownership of the plugin’s complete rule set when auditing rule completeness or base and override parity. The inventory derives ownership from the [**Plugin declarations**](../AGENTS.md#rule-configuration) convention, so it can distinguish owned plugins from supplemental declarations.

### Utilities Dependency Direction

`@standard-config/utilities` is a private build dependency whose code is bundled into the config packages. Its `includesCoreConfig` helper probes for `@standard-config/oxlint` without requiring it. The positive unit test relies on the root’s core config installation. When a test executes the utility source, resolution starts from the helper’s location, so moving the test to another workspace package doesn’t remove that reliance. A reverse dependency from utilities to the core package is intentionally absent because it would create a workspace dependency cycle.

## Compatibility

### Node.js Engine Range

The root `engines.node` range intentionally declares the minimum supported Node.js major without mirroring narrower patch-level constraints from individual tools. pnpm and the invoked tools are expected to report when the installed Node.js release does not satisfy a tool’s more specific engine range.

Code that runs only in this repository assumes the latest Node.js 24 release or newer. Published packages declare their own `engines.node` ranges.

### Oxlint Version Support

The [**Oxlint compatibility**](../AGENTS.md#rule-configuration) requirement accounts for enabled and disabled core rules because Oxlint must recognize every configured rule name. Its `^1.53.0` baseline for packages without core rules marks the release where `jsPlugins` support advanced from experimental to alpha.

### React Compiler Rule Coverage

In the Oxlint 1.79.0 evaluation, `react/preserve-manual-memoization` was upstream-recommended but produced no diagnostics on its documented incomplete `useMemo` dependency example, which `react/exhaustive-deps` covered. Its `off` setting reflects that result rather than disagreement with the rule’s intent.
