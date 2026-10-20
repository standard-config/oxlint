# Agent Instructions

## Overview

- **Repository:** Contains the shareable Oxlint config.
- **Layout:** The config is split into multiple theme-based packages located under `packages/*`.
- **Disclosure:** The repository is public and open source.

## Agent Documentation

| Source | Authority and Ownership |
| --- | --- |
| `AGENTS.md` | Defines project instructions, scope, and documentation authority. Applicable project instructions override global defaults. |
| Project-authored skill directories under `.agents/skills/` | Own delegated domain policy, workflows, validation, and reporting exceptions without contradicting applicable `AGENTS.md` instructions. |
| `.agents/PROJECT.md` | Records constraints, durable facts, maintenance decisions, and rationale. It doesn’t override agent instructions. |

## General

- **Navigation:** Read only the applicable section of `.agents/PROJECT.md`. Follow an existing link or locate its heading first, rather than reading the whole document.
- **Durable knowledge:** Add project knowledge to `.agents/PROJECT.md` only when its absence would likely cause a wrong future decision or substantial repeated investigation. Capture non-obvious constraints and rationale not already clear from canonical configuration, instructions, or source. Don’t record optimization recaps, routine implementation details, or workflow summaries. Prefer updating existing material over adding another explanation. If the task doesn’t permit the edit, report deferred documentation work only if it meets this threshold.

## Rule Configuration

- **Plugin declarations:** Represent each package’s owned core plugins as direct string entries in its base config’s `plugins` array. Reserve spread entries for supplemental plugin declarations. See the [cross-package ownership rationale](.agents/PROJECT.md#cross-package-rule-ownership).
- **Oxlint compatibility:** Maintain each package’s `oxlint` peer dependency range at the earliest Oxlint version containing every core rule the package defines, including enabled and disabled rules. For a package that defines no core rules, maintain the compatibility baseline at `^1.53.0`. See the [version support rationale](.agents/PROJECT.md#oxlint-version-support).
