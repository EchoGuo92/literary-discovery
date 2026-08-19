# Literary Discovery

**A portfolio-first web product that expands a reader's literary map — not just the next-book queue.**

> Familiar entry. Deliberate expansion.

Literary Discovery starts from one writer the reader already has in mind and returns **exactly three books**, each with a different job:

1. **Bridge** — a natural continuation with a strong personal or literary connection.
2. **Expansion** — keeps one meaningful affinity while deliberately changing important variables such as geography, period, form, social world, or narrative method.
3. **Explore** — only needs one credible handrail; the book's own intrinsic pull and expansion value do most of the work.

The user never sees these labels. They experience the logic through the choices and the **“与你的联系 / Your Connection”** copy.

## Live-product scope

This repository is deliberately a **curated, deterministic public demo** rather than a runtime LLM wrapper.

- 5 Cold Start writers
- 3 recommendations per entry point
- Canonical Home book presentation
- Informational Writer Snapshots on Home (no Writer page)
- Local Library
- Open Reflection for retained books
- Browser-local state only
- No account, backend, database, analytics, or runtime AI API

## The product problem

Search works when readers already know what they want. Recommendation feeds often optimize similarity or popularity. The harder problem is:

> How do I reliably leave the literary map I already know without turning reading into a syllabus?

The design therefore optimizes **controlled taste expansion**, not maximum hit rate.

## Recommendation system

A candidate is evaluated through three forces:

- **Personal Bridge** — why this makes sense from the reader's current anchor.
- **Intrinsic Pull** — whether the book is compelling even without the anchor.
- **Expansion Value** — whether it meaningfully widens the reader's map.

The set is then evaluated as a composition. The three books cannot simply repeat the same attraction axis.

See [`evals/recommendation-rubric.json`](./evals/recommendation-rubric.json).

## Why the MVP does not generate Home copy at runtime

During product development, a major risk became visible: even with stable principles, long AI-assisted content workflows can drift. Wording becomes less clear, modules begin to repeat one another, relationship claims can be overstated, and a model may optimize a beautiful local case at the expense of the global product architecture.

For this MVP, **generation and serving are separated**:

```text
AI-assisted research / candidate generation / drafting
                  ↓
source check + editorial review + recommendation-set eval
                  ↓
          versioned content objects
                  ↓
       deterministic frontend render
```

The browser never asks an LLM to invent recommendation copy.

This is not a rejection of AI. It is a reliability architecture.

A future runtime-AI version should keep the same separation where possible: use AI to interpret input, retrieve or rank verified candidates, propose drafts, and run evaluation — but do not let unconstrained model output become the final Home surface without gates, versioning, and deterministic fallbacks.

See [`docs/content-stability.md`](./docs/content-stability.md).

## Content architecture

- `data/books.json` — canonical book presentation. No recommendation-specific copy.
- `data/writers.json` — simple Writer Signal + Context.
- `data/recommendation_paths.json` — anchor → book edges, including “与你的联系”.
- `data/sources.json` — research/source registry.
- `evals/recommendation-rubric.json` — candidate and set-level recommendation criteria.
- `scripts/validate_content.py` — structural content validation.

The key modeling decision is that **“与你的联系” belongs to the recommendation edge, not the book object**. The same book can therefore be reached from different anchors for genuinely different reasons.

## Product principles

See [`docs/product-principles.md`](./docs/product-principles.md).

Highlights:

- Expansion > hit-rate maximization.
- The book must glow independently.
- Recommendation reason ≠ book value.
- Concrete situations before abstract interpretation.
- No spoiler-dependent persuasion.
- A beautiful exceptional case must not become a mandatory product module.
- Home is the core surface: Encounter + Decision.
- Writer is supporting information, not a connection graph.
- Reflection is user-led and open-ended.
- Frontend graph / “literary constellation” visualization is intentionally absent.

## Reliability

Literary facts and historical relationships are not filler UI content.

The demo separates:

- `HISTORICAL_CONNECTION` — requires a source.
- `EDITORIAL_BRIDGE` — a recommendation judgment, never presented as a historical fact.

See [`docs/content-reliability.md`](./docs/content-reliability.md) and [`data/sources.json`](./data/sources.json).

## Run locally

Because the app loads local JSON with `fetch`, serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publish on GitHub Pages

This is a no-build static site. After pushing the repository:

1. Open the repository **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch (usually `main`) and `/(root)`.
5. Save.

No custom domain is required.

## Cost

Current required incremental cost: **$0**.

No OpenAI API, database, paid hosting, or custom domain is required for this version.

---

## 中文说明

Literary Discovery 不是一个“猜你喜欢”的书单工具。它从一个你已经想到的作家出发，用 **Bridge / Expansion / Explore** 三种不同力量组成三本书的推荐组：既保留足够的个人联系，又主动把阅读地图推向新的地域、时代、形式、声音和文学传统。

公开 Demo 采用经过人工审核与来源校验的静态内容，不让运行时 AI 直接生成 Home 文案。这个限制本身也是项目的一部分：**AI 产品的价值不仅在于生成能力，也在于如何设计可靠的生成边界。**


## Content lock

The current Home copy is frozen from the reader-approved integrated review (`home-content-v0.5-reader-approved`). `data/content-lock.json` stores SHA-256 hashes for the reader-facing content files. Visual implementation must not silently rewrite copy; any content change requires an explicit content-version bump and review.



## Writer portrait system

- 14 unique recommendation writers now use reader-approved local portrait assets.
- Production portraits are normalized to 640×640 WebP for fast GitHub Pages delivery.
- No external portrait hotlinks and no initials fallback.
- Writer Snapshot is informational only; there is no Writer page and no Save Writer state.
- The 14 portrait assets are version-locked in `data/writer-portrait-manifest.json`.
- Book hero art remains local and deterministic.
- Frozen Home copy is unchanged from `home-content-v0.5-reader-approved`.

This release deliberately treats identity fidelity as more important than perfect stylistic sameness. The frontend normalizes crop, scale, border, and presentation rather than re-generating approved likenesses merely to chase visual uniformity.


## Home hero visual system

The provisional symbolic SVG hero art has been replaced by 14 production editorial illustrations.

- Each recommendation book has one local 1600×900 WebP hero.
- Visual direction: immersive literary editorial illustration, low-key painterly texture, mood-led rather than plot-led.
- Scene selection was audited against the frozen Premise / Special / Reading Mood copy.
- The illustrations avoid endings, hidden identities, decisive later reversals, and other spoiler-bearing information.
- `data/hero-visual-manifest.json` records the intended visual relationship to each book.
- No external runtime image dependency.

This is the locked hero-art direction for v1.0.
