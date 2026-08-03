# Agent instructions

## Overview

- This repository is home to the shareable Oxlint config.
- The config is split into multiple theme-based packages located under `packages/*`.
- This project is public and open source.

## General

- Consult `.agents/PROJECT.md` for non-obvious project rationale, compatibility constraints, and maintenance decisions.
    - Document newly discovered durable project knowledge there.
    - Keep entries alphabetized when their order is irrelevant.

## Skills

- Load every applicable `sconfig-*` skill whose declared file scope intersects the resolved task scope, even when those files were not named explicitly by the user.
- Treat every `sconfig-*` skill maintained in this repository as a living document.
    - After executing a task using a skill, suggest a concrete edit only when the execution reveals missing guidance, ambiguity, an outdated assumption, or avoidable friction.
