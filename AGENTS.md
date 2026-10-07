# Agent Instructions

## Overview

- **Repository:** This repository is home to the shareable Oxlint config.
- **Layout:** The config is split into multiple theme-based packages located under `packages/*`.
- **Disclosure:** This project is public and open source.

## Agent Documentation

| Source | Authority and Ownership |
| --- | --- |
| `AGENTS.md` | Defines project instructions, scope, and documentation authority. Applicable project instructions override global defaults. |
| `CLAUDE.md` | Bridges Claude to the canonical project instructions in `AGENTS.md`. It defines no independent policy. |
| `.agents/skills/*/` | Own delegated domain policy, workflows, validation, and reporting exceptions without contradicting applicable `AGENTS.md` instructions. |
| `.agents/PROJECT.md` | Records constraints, durable facts, maintenance decisions, and rationale. It does not override agent instructions. |
| Source and configuration | Define exact current values and implemented behavior. |

## General

- **Navigation:** Read only the section of `.agents/PROJECT.md` that applies, reaching it through an existing link or by locating its heading first, rather than reading the document.
- **Durable knowledge:** Add project knowledge to `.agents/PROJECT.md` only when its absence would likely cause a wrong future decision or substantial repeated investigation. Capture non-obvious constraints and rationale not already clear from canonical configuration, instructions, or source. Do not record optimization recaps, routine implementation details, or workflow summaries. Prefer updating existing material over appending another explanation. When the task does not permit the edit, report deferred documentation work only if it meets this threshold.
