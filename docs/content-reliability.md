# Content Reliability

## Core distinction

### HISTORICAL_CONNECTION

A claim about actual literary history: relationship, reading, influence, introduction/foreword, correspondence, chronology, or documented admiration.

Requirement: source-backed.

### EDITORIAL_BRIDGE

A curated judgment about why one reading experience may lead productively to another.

It can compare:

- narrative method;
- social scale;
- mood;
- character position;
- form;
- place;
- voice;
- moral or psychological tension.

It must never be written as if it proves historical influence.

## Rendering rule

The frontend does not expose these internal labels.

The labels exist to prevent the content pipeline from confusing:

> “These writers were connected.”

with:

> “This is a useful way for a reader to move from one work to another.”

## Spoiler rule

Do not use final fates, hidden identities, endings, major late reversals, or later relationship outcomes as recommendation hooks.

## Naming rule

When an unfamiliar fictional name first appears, identify who that person is immediately.

## Source registry

See `data/sources.json`.

Sources in this demo prioritize publishers, author institutions, university presses, Nobel Prize material, and archival/academic resources.
