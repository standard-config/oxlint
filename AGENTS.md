# Agent instructions

## Overview

- **Repository:** This repository is home to the shareable Oxlint config.
- **Layout:** The config is split into multiple theme-based packages located under `packages/*`.
- **Disclosure:** This project is public and open source.

## Agent documentation

| Source | Authority and ownership |
| --- | --- |
| `AGENTS.md` | Defines project instructions, scope, documentation authority, and skill routing. Applicable project instructions override global defaults. |
| `.agents/skills/*/` | Own delegated domain policy, workflows, validation, and reporting exceptions without contradicting applicable `AGENTS.md` instructions. `SKILL.md` is the entrypoint and may route to same-directory references. `sconfig-*` skills are repository-scoped. |
| `.agents/PROJECT.md` | Records durable facts, rationale, constraints, and maintenance decisions. It does not override agent instructions. |
| Source and configuration | Define exact current values and implemented behavior. |

## General

- **Project knowledge:** Consult `.agents/PROJECT.md` for non-obvious project rationale, compatibility constraints, and maintenance decisions.
- **Durable knowledge:** Document newly discovered durable project knowledge there when the task permits that documentation edit. Otherwise report it as deferred follow-up work.
- **Ordering:** Keep entries alphabetized when their order is irrelevant.

## Skills

- **Routing:** Load each applicable `sconfig-*` skill immediately before the task pass whose resolved scope intersects its declared file scope. Do not preload domain skills for later passes.
- **Maintenance:** Treat every maintained `sconfig-*` skill as a living document. After using one, suggest a concrete edit only when execution reveals missing guidance, ambiguity, an outdated assumption, or avoidable friction.
