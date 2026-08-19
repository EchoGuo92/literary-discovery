# Content Stability and Future Runtime AI

## The risk

A language model can follow a frozen principle and still produce unstable product output over time.

Typical drift modes observed during development:

- a clear sentence becomes more abstract;
- a book premise is repeated inside recommendation rationale;
- an unknown character name appears without identity context;
- a historical relationship is used as a substitute for actual recommendation value;
- three supposedly different recommendations converge on the same attraction axis;
- an unusually rich local case inspires a new permanent module;
- long context increases inconsistency even when rules are unchanged.

The problem is not solved by a better prompt alone.

## MVP architecture

The public demo separates **content production** from **content serving**.

### Production

AI may help:

- retrieve candidate works;
- compare recommendation directions;
- draft copy;
- identify possible literary relationships;
- critique redundancy.

Then humans / deterministic checks:

- verify factual claims;
- distinguish historical facts from editorial bridges;
- evaluate the three-book set as a composition;
- test copy in the complete Home context;
- freeze approved objects.

### Serving

The public product renders frozen JSON.

No runtime LLM decides:

- which three books appear;
- what the Home premise says;
- what “与你的联系” says;
- which historical relationship is true.

## Recommended future runtime architecture

If runtime AI is introduced, use it in progressively riskier layers:

### Layer 1 — safer
Interpret user input into a structured reader state.

### Layer 2
Retrieve / rank from a verified candidate library.

### Layer 3
Select a three-book composition under deterministic set constraints.

### Layer 4
Generate a draft explanation from verified facts and structured recommendation edges.

### Layer 5 — gated
Run factual, redundancy, spoiler, cognitive-load, and set-differentiation evaluation before release.

### Layer 6
Cache / version the accepted output so the same state does not produce arbitrary copy changes on every render.

## Required fallbacks

A production version should always be able to fall back to:

- a verified book object;
- a verified relationship edge;
- a preapproved recommendation explanation;
- a deterministic set.

The model should be able to fail without making the user-facing literary claim unreliable.

## Product lesson

The reliability question is not:

> “Can the model write good recommendation copy?”

It is:

> “What parts of the recommendation system are allowed to remain probabilistic?”
