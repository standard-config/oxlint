# Agent instructions

## Overview

- This repository is home to the shareable Oxlint config.
- The config is split into multiple theme-based packages located under `packages/*`.
- This project is public and open source.

## Agent documentation

| Source | Authority and ownership |
| --- | --- |
| `AGENTS.md` | Defines repository-wide instructions, scope, documentation authority, and skill routing, overriding global instructions when present. |
| `.agents/skills/*/` | Each skill directory defines delegated domain policy, workflows, validation, and reporting exceptions without contradicting applicable `AGENTS.md` instructions. `SKILL.md` is its entrypoint and may route to canonical references in the same directory. `sconfig-*` skills are repository-scoped. |
| `.agents/PROJECT.md` | Records durable facts, rationale, constraints, and maintenance decisions. It does not override agent instructions. |
| Source and configuration | Define exact current values and implemented behavior. |

## General

- Consult `.agents/PROJECT.md` for non-obvious project rationale, compatibility constraints, and maintenance decisions.
    - Document newly discovered durable project knowledge there when the task permits that documentation edit. Otherwise report it as deferred follow-up work.
    - Keep entries alphabetized when their order is irrelevant.

## Skills

- Load each applicable `sconfig-*` skill immediately before the task pass whose resolved scope intersects its declared file scope. Do not preload domain skills for later passes.
- Treat every `sconfig-*` skill maintained in this repository as a living document.
    - After executing a task using a skill, suggest a concrete edit only when the execution reveals missing guidance, ambiguity, an outdated assumption, or avoidable friction.
