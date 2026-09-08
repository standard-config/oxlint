# Agent Instructions

## Overview

- **Repository:** This repository is home to the shareable Oxlint config.
- **Layout:** The config is split into multiple theme-based packages located under `packages/*`.
- **Disclosure:** This project is public and open source.

## Agent Documentation

| Source | Authority and ownership |
| --- | --- |
| `AGENTS.md` | Defines project instructions, scope, and documentation authority. Applicable project instructions override global defaults. |
| `CLAUDE.md` | Bridges Claude to the canonical project instructions in `AGENTS.md`. It defines no independent policy. |
| `.agents/skills/*/` | Own delegated domain policy, workflows, validation, and reporting exceptions without contradicting applicable `AGENTS.md` instructions. `SKILL.md` is the entrypoint and may route to references within its own skill directory and to sibling skills. `sconfig-*` skills are repository-scoped. |
| `.agents/PROJECT.md` | Records durable facts, rationale, constraints, and maintenance decisions. It does not override agent instructions. |
| Source and configuration | Define exact current values and implemented behavior. |

## General

- **Navigation:** Read only the section of `.agents/PROJECT.md` that applies, reaching it through an existing link or by locating its heading first, rather than reading the document.
- **Durable knowledge:** Document newly discovered durable project knowledge in `.agents/PROJECT.md` when the task permits that documentation edit. Otherwise report the update as deferred follow-up work.

## Skills

- **Maintenance:** Treat every maintained `sconfig-*` skill as a living document. After using one, suggest a concrete edit only when execution reveals missing guidance, ambiguity, an outdated assumption, or avoidable friction.
