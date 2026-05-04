# Christianity-Focused Theism Gradient App Brief

Author: Phil Stilwell

Purpose: Convert a philosophical assessment framework into a buildable app that evaluates Christianity-focused God-related claims on a gradient.

## Core Direction

The app should not treat "Christianity" as a single yes/no package. It should help users distinguish thinner background commitments from stronger Christian claims about divine action, revelation, prayer, healing, wisdom, foreknowledge, guidance, and transformation.

The current claim bank lives in `public/claims.json`. That file is the source of truth for the app.

## Gradient Structure

The app keeps a five-part progression:

| Position | Category | Role |
|---:|---|---|
| 1 | Minimal Deism | Thin source, contingency, and explanation claims. |
| 2 | Design Deism | Purpose, order, design, and life-permitting claims. |
| 3 | Personal Theism | Mind, agency, awareness, communication, and response capacities. |
| 4 | Interventionist Theism | General Christian divine-action claims. |
| 5 | Specific Christian Theism | Core Christian claims about revelation, Jesus, Spirit, salvation, and transformation. |

## Current Emphasis

Claims should stay as general and auditable as possible. Avoid narrow tradition-comparison items and avoid claims whose diagnostic value depends on one specific ancient-history episode. The app should instead ask whether the user thinks claims such as these can be substantiated:

- The Christian God answers petitionary prayer.
- The Christian God miraculously heals.
- The Christian God gives wisdom, discernment, or moral correction.
- The Christian God provides foreknowledge, warnings, or prophetic insight.
- The Christian God communicates through dreams, impressions, visions, or other experiences.
- The Christian God protects, delivers, redirects, or providentially guides.
- The Christian God transforms character in ways not fully explained by social or psychological factors.
- Christian scripture reliably conveys core truths God wants humans to know.
- The Holy Spirit guides, teaches, empowers, and comforts believers.
- God acts through Christ and the Spirit to save, guide, heal, and transform human beings.

## Inputs Per Claim

Each claim receives:

| Input | Scale | Meaning |
|---|---:|---|
| Confidence | 0-100 | How strongly the user thinks the claim can be substantiated. |
| Personal substantiation | 0-100 | How strongly the user thinks they can personally substantiate the claim. |
| Note | free text | Optional rationale, source, objection, or uncertainty. |

## Scoring

The app uses a geometric weight:

```text
W_i = sqrt((C_i / 100) * (P_i / 100))
```

This keeps high confidence with low personal substantiation from counting as strongly as high confidence with high substantiation.

The aggregate gradient position is:

```text
sum(G_i * W_i) / sum(W_i)
```

The evidentially weighted theism index is:

```text
100 * (sum((G_i - 1) / 4 * W_i) / ratedClaims)
```

## Diagnostics

The app should continue surfacing:

- substantiation gaps, where confidence outruns personal substantiation
- dependency tensions, where downstream claims outrun prerequisite bridge claims
- category summaries, showing where confidence concentrates or drops
- a plain-English profile summary

## Current Claim IDs

Claims `C001-C030` build the general philosophical runway. Claims `C031-C050` now focus on general Christian divine-action and Christian-core claims rather than comparative Abrahamic claims.
