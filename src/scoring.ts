export type Tradition = 'general' | 'Christianity' | 'other';

export type ClaimCategory =
  | 'Minimal Deism'
  | 'Design Deism'
  | 'Personal Theism'
  | 'Interventionist Theism'
  | 'Specific Christian Theism';

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

export interface DiagnosticAlert {
  type: 'gap' | 'dependency';
  severity: 'medium' | 'high';
  claim: Claim;
  value: number;
  message: string;
}

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function claimWeight(confidence: number, personalSubstantiation: number): number {
  const c = clampScore(confidence) / 100;
  const p = clampScore(personalSubstantiation) / 100;
  return Math.sqrt(c * p);
}

export function substantiationGap(confidence: number, personalSubstantiation: number): number {
  return clampScore(confidence) - clampScore(personalSubstantiation);
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

export function evidentiallyWeightedTheismIndex(claims: Claim[], profile: UserProfile): number | null {
  let weightedRightwardCommitment = 0;
  let ratedClaims = 0;

  for (const claim of claims) {
    const response = profile.responses[claim.id];
    if (!response) continue;

    const rightwardPosition = (claim.gradientPosition - 1) / 4;
    const w = claimWeight(response.confidence, response.personalSubstantiation);
    weightedRightwardCommitment += rightwardPosition * w;
    ratedClaims += 1;
  }

  return ratedClaims === 0 ? null : 100 * (weightedRightwardCommitment / ratedClaims);
}

export function dependencyTension(claim: Claim, claims: Claim[], profile: UserProfile): number | null {
  const response = profile.responses[claim.id];
  if (!response || claim.dependencyIds.length === 0) return null;

  const prereqResponses = claim.dependencyIds
    .map(id => profile.responses[id])
    .filter((r): r is UserClaimResponse => Boolean(r));

  if (prereqResponses.length === 0) return null;

  const prereqAvg = prereqResponses.reduce((sum, r) => sum + clampScore(r.confidence), 0) / prereqResponses.length;
  return Math.max(0, clampScore(response.confidence) - prereqAvg);
}

export function averageSubstantiationGap(claims: Claim[], profile: UserProfile): number | null {
  const gaps: number[] = [];

  for (const claim of claims) {
    const response = profile.responses[claim.id];
    if (!response) continue;
    gaps.push(substantiationGap(response.confidence, response.personalSubstantiation));
  }

  return gaps.length === 0 ? null : gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
}

export function categoryAverages(claims: Claim[], profile: UserProfile) {
  const buckets = new Map<ClaimCategory, { confidence: number; personalSubstantiation: number; count: number }>();

  for (const claim of claims) {
    const response = profile.responses[claim.id];
    if (!response) continue;

    const current = buckets.get(claim.category) ?? { confidence: 0, personalSubstantiation: 0, count: 0 };
    current.confidence += clampScore(response.confidence);
    current.personalSubstantiation += clampScore(response.personalSubstantiation);
    current.count += 1;
    buckets.set(claim.category, current);
  }

  return Array.from(buckets.entries()).map(([category, values]) => ({
    category,
    confidence: values.confidence / values.count,
    personalSubstantiation: values.personalSubstantiation / values.count,
    count: values.count,
  }));
}

export function buildDiagnostics(claims: Claim[], profile: UserProfile): DiagnosticAlert[] {
  const alerts: DiagnosticAlert[] = [];

  for (const claim of claims) {
    const response = profile.responses[claim.id];
    if (!response) continue;

    const gap = substantiationGap(response.confidence, response.personalSubstantiation);
    if (gap >= 35 && response.confidence >= 55) {
      alerts.push({
        type: 'gap',
        severity: gap >= 55 ? 'high' : 'medium',
        claim,
        value: gap,
        message: `${claim.id} has ${Math.round(gap)} points more confidence than personal substantiation.`,
      });
    }

    const tension = dependencyTension(claim, claims, profile);
    if (tension !== null && tension >= 25 && response.confidence >= 55) {
      alerts.push({
        type: 'dependency',
        severity: tension >= 45 ? 'high' : 'medium',
        claim,
        value: tension,
        message: `${claim.id} is ${Math.round(tension)} points above its rated prerequisite claims.`,
      });
    }
  }

  return alerts.sort((a, b) => b.value - a.value).slice(0, 8);
}

export function profileSummary(claims: Claim[], profile: UserProfile): string {
  const aggregate = aggregateGradientPosition(claims, profile);
  const ewti = evidentiallyWeightedTheismIndex(claims, profile);
  const gap = averageSubstantiationGap(claims, profile);
  const rated = Object.keys(profile.responses).length;

  if (!rated || aggregate === null) {
    return 'No claims have been rated yet. Start with the claims that feel most central, then use the diagnostics to find unsupported leaps.';
  }

  const positionText = aggregate < 1.8
    ? 'primarily minimal-deistic'
    : aggregate < 2.6
      ? 'deistic with design-oriented leanings'
      : aggregate < 3.4
        ? 'personal-theistic leaning'
        : aggregate < 4.3
          ? 'interventionist or revelatory'
          : 'strongly Christian-theistic';

  const gapText = (gap ?? 0) >= 30
    ? 'with a noticeable gap between confidence and personal substantiation'
    : (gap ?? 0) >= 15
      ? 'with some substantiation pressure points'
      : 'with confidence and personal substantiation fairly aligned';

  return `Your current profile is ${positionText}, ${gapText}. The evidentially weighted theism index is ${Math.round(ewti ?? 0)} across ${rated} rated claims.`;
}
