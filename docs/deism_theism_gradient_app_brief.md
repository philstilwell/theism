# Deism-Theism Gradient App: Project Brief for Codex

Author: Phil Stilwell  
Purpose: Convert a philosophical assessment framework into a buildable app specification.

## 1. Core Purpose

The app should assess God-related claims on a gradient rather than treating theism as a single yes/no position. The central idea is that broad deistic claims and thick tradition-specific claims carry very different levels of specificity, dependency, and evidential burden.

The user should not be asked only whether they believe in God. The app should ask:

- Which God-related claims does the user think can be substantiated?
- How specific are those claims?
- How confident is the user that each claim can be substantiated?
- How confident is the user that they can personally substantiate each claim?
- Do downstream claims outrun the user's confidence in prerequisite bridge claims?

The app should expose cases in which a user moves from a thin claim, such as "the universe requires some explanation beyond itself," to a thick claim, such as "God heals the sick freely," without sufficient bridge claims.

## 2. Central Insight

God-claims should be treated as a graded stack of increasingly specific commitments.

A thin deistic claim may assert only that reality has some explanatory ground or source. A strong theistic claim may assert that a particular God acts in history, reveals specific doctrines, answers prayers, performs miracles, validates a sacred text, or commissions a prophet.

The farther right the claim is on the gradient, the more it depends on subordinate claims and the more evidential burden it carries.

The app's diagnostic value comes from showing where a user's confidence is concentrated, where it declines, and where confidence exceeds personal substantiation ability.

## 3. Five-Part Claim Gradient

The app should organize claims into five major categories from left to right.

| Gradient Position | Category | Description |
|---:|---|---|
| 1 | Minimal Deism / Metaphysical Source Claims | Thin claims about explanation, contingency, source, or cause. |
| 2 | Design-Oriented / Purposive Deism | Claims that the source is intentional, purposive, or design-like. |
| 3 | Personal Theism / Divine Agency | Claims that the creator has mind, awareness, intention, and agency. |
| 4 | Interventionist / Revelatory Theism | Claims that God acts in the world, answers prayer, performs miracles, or reveals information. |
| 5 | Specific Abrahamic Theism | Claims tied to Judaism, Christianity, Islam, or another concrete tradition. |

## 4. Claim Bank: 50 Auditable Claims

The app should avoid vague package-claims such as "the Christian God exists." Instead, it should use clearer sub-claims that can be independently rated.

### Category 1: Minimal Deistic / Metaphysical Claims

| # | Claim |
|---:|---|
| 1 | The physical universe has some explanation beyond merely describing its internal events. |
| 2 | The universe is not ultimately self-explanatory. |
| 3 | The universe depends on something that is not identical to the universe. |
| 4 | The existence of physical reality is not a brute fact. |
| 5 | The beginning or finite past of the universe points to a cause beyond ordinary physical events. |
| 6 | The totality of physical reality requires an explanation not contained within that totality. |
| 7 | The regularity of nature requires an explanation beyond simply naming physical laws. |
| 8 | The initial conditions of the universe were not merely accidental or unexplained. |
| 9 | The existence of contingent things points to some non-contingent explanatory ground. |
| 10 | A minimal creator or source of the universe exists, even if nothing else is known about it. |

### Category 2: Stronger Deistic / Design-Oriented Claims

| # | Claim |
|---:|---|
| 11 | The universe was intentionally caused rather than accidentally caused. |
| 12 | The universe was caused by something with goal-directed features. |
| 13 | The structure of the universe is better explained by design than by chance, necessity, or unknown impersonal processes. |
| 14 | The apparent fine-tuning of physical constants is evidence of purposeful calibration. |
| 15 | The universe was created for the emergence of life. |
| 16 | The universe was created for the emergence of conscious beings. |
| 17 | The creator had some preference for order over chaos. |
| 18 | The creator had some preference for life-permitting conditions over non-life-permitting conditions. |
| 19 | The creator is more like an intelligent agent than an impersonal force. |
| 20 | The creator intentionally set the universe in motion but does not clearly intervene after creation. |

### Category 3: Personal Theism / Divine Agency Claims

| # | Claim |
|---:|---|
| 21 | The creator has something analogous to mind, intention, or awareness. |
| 22 | The creator is aware of the universe after creating it. |
| 23 | The creator is aware of conscious creatures within the universe. |
| 24 | The creator is capable of choosing between alternative possible actions. |
| 25 | The creator has purposes related to human beings. |
| 26 | The creator cares about whether humans understand reality accurately. |
| 27 | The creator can act within the universe after its initial creation. |
| 28 | The creator can communicate information to human beings. |
| 29 | The creator can respond differently to different human actions, prayers, or requests. |
| 30 | The creator is not merely the source of the universe but an ongoing personal agent. |

### Category 4: Interventionist / Revelatory Theism Claims

| # | Claim |
|---:|---|
| 31 | God has intervened in the physical world after the universe began. |
| 32 | God has performed detectable miracles. |
| 33 | God has answered some prayers in ways that differ from chance or ordinary causation. |
| 34 | God has healed some sick people through divine action rather than ordinary medical or biological processes. |
| 35 | God has communicated specific messages to selected human beings. |
| 36 | Some human religious experiences are caused by God rather than by ordinary psychological or social processes. |
| 37 | Some prophetic claims are genuinely caused by divine revelation. |
| 38 | Some sacred texts contain information that came from God. |
| 39 | God has intentionally guided human history toward specific outcomes. |
| 40 | God has made enough evidence available for humans to identify at least one true revealed religion. |

### Category 5: Specific Abrahamic Theism Claims

| # | Claim |
|---:|---|
| 41 | The God who exists is the God identified in the Hebrew Bible as YHWH. |
| 42 | The covenantal claims made in the Torah reflect actual divine communication rather than merely human religious tradition. |
| 43 | The Exodus and Sinai traditions preserve real divine action in Israel's history. |
| 44 | The prophetic literature of ancient Israel contains genuine messages from God. |
| 45 | Jesus of Nazareth was bodily resurrected after death. |
| 46 | Jesus was not merely a prophet or teacher but uniquely divine in the sense affirmed by historic Christianity. |
| 47 | The crucifixion of Jesus had a divinely intended salvific function. |
| 48 | The New Testament reliably preserves the central divine claims about Jesus. |
| 49 | The Qur'an is a revelation from God rather than a merely human religious text. |
| 50 | Muhammad was genuinely commissioned by God as a prophet. |

## 5. User Inputs Per Claim

Each claim should ask for at least two user ratings.

| Input | Label | Scale | Meaning |
|---|---|---:|---|
| Confidence | C | 0-100 | How strongly the user thinks the claim can be substantiated. |
| Personal Substantiation | P | 0-100 | How strongly the user thinks they can personally substantiate the claim. |

A third optional field can be used for notes:

| Input | Label | Meaning |
|---|---|---|
| Rationale Note | note | The user's short explanation, source, objection, or uncertainty. |

## 6. Claim Metadata

Each claim should have app-level metadata independent of the user's answers.

| Metadata | Description |
|---|---|
| id | Unique claim identifier. |
| text | The claim being rated. |
| category | One of the five gradient categories. |
| gradientPosition | Numeric position from 1 to 5. |
| specificityWeight | How specific the claim is. Usually 1 to 5. |
| dependencyIds | Prior claims that should normally support this claim. |
| tradition | General, Jewish, Christian, Islamic, or other. |
| tags | Optional tags such as cosmology, fine-tuning, prayer, miracle, scripture, resurrection. |

## 7. Scoring Variables

Use these variables in the scoring model:

| Symbol | Meaning |
|---|---|
| G_i | Gradient position of claim i, from 1 to 5. |
| C_i | User confidence that claim i can be substantiated, from 0 to 100. |
| P_i | User confidence that they can personally substantiate claim i, from 0 to 100. |
| W_i | Claim weight derived from C_i and P_i. |

## 8. Recommended Claim Weight Formula

Use the geometric mean of confidence and personal substantiation ability:

```text
W_i = sqrt((C_i / 100) * (P_i / 100))
```

This penalizes imbalance. A user who gives 90 confidence but only 10 personal substantiation receives a much lower weight than a user who gives 90 and 90.

Examples:

| C | P | Geometric Weight |
|---:|---:|---:|
| 90 | 90 | 0.90 |
| 90 | 10 | 0.30 |
| 70 | 40 | 0.53 |
| 50 | 50 | 0.50 |

## 9. Aggregate Gradient Position

The aggregate position should show the user's weighted center of gravity on the 1-5 gradient.

```text
Aggregate Position = sum(G_i * W_i) / sum(W_i)
```

This gives a single summary marker on the Deism-to-Strong-Theism axis.

Interpretation examples:

| Aggregate Position | Interpretation |
|---:|---|
| 1.0-1.7 | Primarily minimal deistic. |
| 1.8-2.5 | Deistic with design-oriented leanings. |
| 2.6-3.3 | Personal-theistic leaning. |
| 3.4-4.2 | Interventionist/revelatory leaning. |
| 4.3-5.0 | Strong tradition-specific theistic profile. |

## 10. Evidentially Weighted Theism Index

The headline score should not merely measure how far right the user goes. It should weight rightward claims by both confidence and personal substantiation.

One simple normalized formula:

```text
EWTS = 100 * (sum((G_i - 1) / 4 * W_i) / numberOfClaims)
```

Alternative stronger version:

```text
EWTS = 100 * (sum((G_i - 1) / 4 * W_i) / sum(maxPossibleWeight_i))
```

The exact denominator can be adjusted depending on whether unanswered claims are treated as missing data or zero commitment.

Recommended rule:

- If a user has not rated a claim, treat it as missing rather than zero.
- If a user explicitly rates confidence or personal substantiation as 0, treat it as zero.

## 11. Substantiation Gap

The app should compute the gap between confidence and personal substantiation.

```text
Gap_i = C_i - P_i
```

A positive gap means the user's confidence exceeds their perceived ability to substantiate the claim. A large positive gap should be diagnostically important.

Example:

| Claim | C | P | Gap |
|---|---:|---:|---:|
| God answers prayer detectably. | 84 | 32 | 52 |
| Jesus was bodily resurrected. | 77 | 35 | 42 |
| The Bible contains divine revelation. | 80 | 41 | 39 |

## 12. Dependency Coherence

Each rightward claim may depend on earlier bridge claims. The app should compare a claim's confidence to the average confidence in its prerequisites.

```text
PrereqAvg_i = average(C_j for each j in dependencyIds_i)
DependencyTension_i = max(0, C_i - PrereqAvg_i)
```

High dependency tension means the user rates a downstream claim more strongly than the claims that would normally support it.

Example:

A user rates "God answers prayers in detectable ways" at 82, but rates its prerequisites at an average of 49. The app should flag this as a rightward leap.

## 13. Recommended Dashboard Structure

The dashboard should use both a summary marker and a scatter graph.

The single X-axis marker is useful but should not be used alone. A single score compresses too much. Two users can land at the same aggregate position for radically different reasons. The scatter graph preserves the distribution and clustering of the user's commitments.

### Top Row: High-Level Summary

Panels:

1. Aggregate Gradient Position
2. Core Summary Score Cards

The aggregate gradient position should be a horizontal axis:

```text
Minimal Deism -> Design Deism -> Personal Theism -> Interventionist Theism -> Tradition-Specific Theism
```

Place a vertical marker at the weighted aggregate position.

Add a faint spread band around the marker to show profile dispersion. A narrow band indicates tight clustering; a wide band indicates a mixed or internally diverse profile.

Recommended score cards:

| Score Card | Meaning |
|---|---|
| Evidentially Weighted Theism Index | Overall weighted rightward commitment. |
| Personal Substantiation Strength | Average personal ability to substantiate accepted claims. |
| Average Substantiation Gap | Average difference between confidence and personal substantiation. |
| Dependency Coherence | Degree to which downstream claims are supported by prerequisites. |
| Tradition Specificity | Degree of commitment to Judaism, Christianity, Islam, or another tradition. |

### Middle Row: Main Scatter Graph

The scatter plot should be the main visualization.

| Visual Encoding | Meaning |
|---|---|
| X-axis | Claim position on the gradient, 1 to 5. |
| Y-axis | User confidence that the claim can be substantiated, 0 to 100. |
| Dot size | User's perceived ability to personally substantiate the claim. |
| Dot color | Claim category. |
| Dot shape | Optional tradition marker for Jewish, Christian, Islamic, or general claims. |

Recommended overlays:

- Vertical bands for the five categories.
- Trend line showing average confidence as claims become more specific.
- Warning markers on claims with severe substantiation gaps or dependency tensions.
- Center-of-gravity marker showing the aggregate score inside the scatter plot.

### Middle/Side Panel: Category Profile Bars

Show category-level summaries:

| Category | Confidence | Personal Substantiation | Coherence |
|---|---:|---:|---:|
| Minimal Deism | 81 | 74 | 88 |
| Design Deism | 68 | 61 | 75 |
| Personal Theism | 56 | 43 | 63 |
| Interventionist Theism | 37 | 24 | 41 |
| Tradition-Specific Theism | 19 | 12 | 28 |

### Bottom Row: Diagnostics

Panels:

1. Largest Substantiation Gaps
2. Dependency Tension Alerts
3. Tradition-Specific Breakdown
4. Plain-English Profile Summary

## 14. Main App Screens

### Screen 1: Overview Dashboard

Purpose: Give the user an immediate, visual summary of the whole profile.

Include:

- Aggregate gradient position marker.
- Core score cards.
- Scatter plot.
- Category bars.
- Top diagnostic alerts.
- Plain-English interpretation.

### Screen 2: Claim Explorer

Purpose: Let the user inspect and revise each claim.

For each claim, show:

- Claim text.
- Category.
- Gradient position.
- Confidence slider.
- Personal substantiation slider.
- Dependency map.
- Notes field.
- Comparison to category average.

### Screen 3: Diagnostic Tensions

Purpose: Show internal structure and potential overextensions.

Include:

- Largest confidence-support gaps.
- Strongest unsupported rightward leaps.
- Weakest dependency chains.
- Claims accepted despite weak prerequisites.
- Strongest coherent clusters.

### Screen 4: Comparative Views

Purpose: Allow comparison against prior profiles or archetypes.

Possible comparisons:

- Current profile vs. previous profile.
- Current profile vs. strict deist profile.
- Current profile vs. strong Christian theist profile.
- Current profile vs. skeptical naturalist profile.
- Current profile vs. average user profile if aggregate data becomes available.

## 15. Diagnostic Output Examples

The app should produce compact explanations rather than merely numbers.

Example 1:

```text
Your profile clusters around broad deistic and moderate personal-theistic claims. Confidence declines as claims become more interventionist and tradition-specific. The strongest substantiation gaps appear in prayer, miracle, and revelation claims.
```

Example 2:

```text
You rate divine prayer-answering at 82/100, but the prerequisite claims for personal divine awareness, divine intervention, and detectable causal difference average only 49/100. This creates a dependency tension.
```

Example 3:

```text
Your aggregate position is 2.9/5, but your scatter plot shows a wide spread. This means your profile is not a simple midpoint; it contains strong deistic commitments and several isolated rightward claims.
```

## 16. Suggested JSON Data Shape

Use a structured claim file such as `claims.json`.

```json
[
  {
    "id": "C001",
    "text": "The physical universe has some explanation beyond merely describing its internal events.",
    "category": "Minimal Deism",
    "gradientPosition": 1,
    "specificityWeight": 1,
    "tradition": "general",
    "tags": ["cosmology", "explanation"],
    "dependencyIds": []
  },
  {
    "id": "C033",
    "text": "God has answered some prayers in ways that differ from chance or ordinary causation.",
    "category": "Interventionist Theism",
    "gradientPosition": 4,
    "specificityWeight": 4,
    "tradition": "general",
    "tags": ["prayer", "intervention", "causation"],
    "dependencyIds": ["C021", "C022", "C027", "C029"]
  },
  {
    "id": "C045",
    "text": "Jesus of Nazareth was bodily resurrected after death.",
    "category": "Specific Abrahamic Theism",
    "gradientPosition": 5,
    "specificityWeight": 5,
    "tradition": "Christianity",
    "tags": ["Jesus", "resurrection", "history"],
    "dependencyIds": ["C027", "C031", "C032", "C035"]
  }
]
```

Use a separate user response object:

```json
{
  "userId": "local-user",
  "responses": {
    "C001": { "confidence": 70, "personalSubstantiation": 65, "note": "General explanatory intuition." },
    "C033": { "confidence": 82, "personalSubstantiation": 32, "note": "Based mostly on testimony." },
    "C045": { "confidence": 77, "personalSubstantiation": 35, "note": "Historical argument needs review." }
  }
}
```

## 17. Suggested TypeScript Types

```ts
export type Tradition = 'general' | 'Judaism' | 'Christianity' | 'Islam' | 'other';

export type ClaimCategory =
  | 'Minimal Deism'
  | 'Design Deism'
  | 'Personal Theism'
  | 'Interventionist Theism'
  | 'Specific Abrahamic Theism';

export interface Claim {
  id: string;
  text: string;
  category: ClaimCategory;
  gradientPosition: 1 | 2 | 3 | 4 | 5;
  specificityWeight: number;
  tradition: Tradition;
  tags: string[];
  dependencyIds: string[];
}

export interface UserClaimResponse {
  confidence: number;
  personalSubstantiation: number;
  note?: string;
}

export interface UserProfile {
  userId: string;
  responses: Record<string, UserClaimResponse>;
}
```

## 18. Suggested Scoring Functions

```ts
export function claimWeight(confidence: number, personalSubstantiation: number): number {
  return Math.sqrt((confidence / 100) * (personalSubstantiation / 100));
}

export function substantiationGap(confidence: number, personalSubstantiation: number): number {
  return confidence - personalSubstantiation;
}

export function aggregateGradientPosition(claims: Claim[], profile: UserProfile): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const claim of claims) {
    const response = profile.responses[claim.id];
    if (!response) continue;

    const w = claimWeight(response.confidence, response.personalSubstantiation);
    weightedSum += claim.gradientPosition * w;
    totalWeight += w;
  }

  return totalWeight === 0 ? null : weightedSum / totalWeight;
}

export function dependencyTension(claim: Claim, claims: Claim[], profile: UserProfile): number | null {
  const response = profile.responses[claim.id];
  if (!response || claim.dependencyIds.length === 0) return null;

  const prereqResponses = claim.dependencyIds
    .map(id => profile.responses[id])
    .filter(Boolean);

  if (prereqResponses.length === 0) return null;

  const prereqAvg = prereqResponses.reduce((sum, r) => sum + r.confidence, 0) / prereqResponses.length;
  return Math.max(0, response.confidence - prereqAvg);
}
```

## 19. UI Implementation Recommendations

A practical first version could be built as a React or Next.js app.

Recommended libraries:

- React or Next.js for the UI.
- Recharts, Plotly, or Nivo for scatter plots and bar charts.
- LocalStorage for first-pass persistence.
- JSON files for the initial claim bank.
- Later: Supabase, Firebase, or a simple backend if user accounts and profile history are needed.

Recommended components:

```text
/src/data/claims.json
/src/types/claims.ts
/src/lib/scoring.ts
/src/components/GradientSummaryBar.tsx
/src/components/ClaimScatterPlot.tsx
/src/components/CategoryProfileBars.tsx
/src/components/DiagnosticAlerts.tsx
/src/components/ClaimExplorer.tsx
/src/components/ProfileSummary.tsx
/src/pages or /app routes
```

## 20. Visual Encoding Rules

Use stable encodings across the app.

| Encoding | Meaning |
|---|---|
| X-position | Claim location on the deism-theism gradient. |
| Y-position | Confidence that the claim can be substantiated. |
| Dot size | Personal substantiation ability. |
| Dot color | Claim category. |
| Dot shape | Tradition or claim family. |
| Warning icon | Large gap or dependency tension. |

Suggested category colors:

- Minimal Deism: blue.
- Design Deism: teal.
- Personal Theism: orange.
- Interventionist Theism: red.
- Tradition-Specific Theism: purple.

## 21. First Build Scope

Version 1 should focus on local, private assessment.

Minimum viable version:

1. Display 50 claims grouped by category.
2. Allow users to rate each claim on two sliders: confidence and personal substantiation.
3. Store ratings locally.
4. Compute aggregate position, EWTS, substantiation gaps, and dependency tensions.
5. Render a scatter plot.
6. Render a summary gradient marker.
7. Render category bars.
8. Render diagnostic alerts.
9. Provide a plain-English profile summary.

Avoid building user accounts, social comparison, or cloud storage until the scoring model and UX are stable.

## 22. Codex Build Prompt

Use this as the initial Codex instruction after importing the project brief:

```text
Build a React or Next.js app based on this project brief. The app should assess user responses to God-related claims on a five-part Deism-to-Theism gradient. Implement a 50-claim assessment using sliders for confidence and personal substantiation. Store responses locally. Compute aggregate gradient position, evidentially weighted theism index, substantiation gaps, dependency tensions, category summaries, and a plain-English profile summary. Create a dashboard with a top gradient summary bar, score cards, a scatter plot of claims, category profile bars, diagnostic alerts, and a claim explorer. Use clean, analytical dashboard styling. Keep the data model modular by storing claims in a JSON file and scoring logic in a separate TypeScript utility module.
```

## 23. Product Principle

The app should make the user visually aware of the difference between a thin claim and a thick claim.

It should not merely ask whether the user is a deist, theist, Christian, Muslim, Jew, skeptic, or naturalist. It should show exactly which claims the user thinks can be substantiated, how far right those claims are on the specificity gradient, and whether their confidence is proportionate to their own perceived ability to substantiate the claims.

The deepest value of the app is that it exposes the shape of the user's credence profile rather than forcing it into a single label.
