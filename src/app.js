import {
  aggregateGradientPosition,
  averageSubstantiationGap,
  buildDiagnostics,
  categories,
  categoryAverages,
  claimWeight,
  dependencyTension,
  evidentiallyWeightedTheismIndex,
  profileSummary,
  substantiationGap
} from "./scoring.js";

const storageKey = "theism-gradient-profile-v3-christian-action";

const state = {
  claims: [],
  profile: { userId: "local", responses: {} },
  filters: {
    category: "All",
    tradition: "All",
    search: ""
  }
};

const nodes = {
  aggregate: document.querySelector("#aggregate-position"),
  alerts: document.querySelector("#alerts"),
  avgGap: document.querySelector("#avg-gap"),
  categoryBars: document.querySelector("#category-bars"),
  categoryFilter: document.querySelector("#category-filter"),
  claimList: document.querySelector("#claim-list"),
  aiPrompt: document.querySelector("#ai-prompt"),
  copyAiPrompt: document.querySelector("#copy-ai-prompt"),
  copyReport: document.querySelector("#copy-report"),
  copySummary: document.querySelector("#copy-summary"),
  finalReport: document.querySelector("#final-report"),
  gradientMarker: document.querySelector("#gradient-marker"),
  lensButtons: document.querySelector("#lens-buttons"),
  profileSummary: document.querySelector("#profile-summary"),
  ratedCount: document.querySelector("#rated-count"),
  reset: document.querySelector("#reset"),
  sample: document.querySelector("#seed-balanced"),
  scatter: document.querySelector("#scatter-plot"),
  searchFilter: document.querySelector("#search-filter"),
  theismIndex: document.querySelector("#theism-index"),
  traditionFilter: document.querySelector("#tradition-filter")
};

const profilePresets = [
  {
    id: "methodical-skeptic",
    label: "Methodical Skeptic",
    description: "Low-to-moderate ratings unless the claim can be personally defended with clear evidence.",
    confidence: [35, 28, 22, 12, 8],
    personal: [30, 24, 18, 10, 6],
    boosts: {}
  },
  {
    id: "minimal-deist",
    label: "Minimal Deist",
    description: "Strongest on source and explanation claims, cautious about personal and Christian divine-action claims.",
    confidence: [78, 55, 28, 12, 8],
    personal: [66, 42, 20, 8, 5],
    boosts: {}
  },
  {
    id: "cautious-christian",
    label: "Cautious Christian",
    description: "Moderate Christian confidence, with personal substantiation lagging on thicker claims.",
    confidence: [62, 58, 55, 44, 40],
    personal: [50, 46, 42, 30, 26],
    boosts: { scripture: 5, jesus: 5, prayer: 4 }
  },
  {
    id: "experiential-christian",
    label: "Experiential Christian",
    description: "Higher ratings for prayer, healing, guidance, spiritual gifts, and transformation.",
    confidence: [52, 54, 66, 72, 66],
    personal: [42, 44, 58, 64, 56],
    boosts: { prayer: 8, healing: 8, wisdom: 7, guidance: 7, prophecy: 6, "holy spirit": 7, transformation: 8, "spiritual gifts": 8 }
  },
  {
    id: "doctrinal-christian",
    label: "Doctrinal Christian",
    description: "Highest on Christian revelation, Jesus, scripture, Spirit, and salvation, with moderate action claims.",
    confidence: [55, 54, 62, 58, 78],
    personal: [40, 40, 50, 44, 64],
    boosts: { scripture: 8, jesus: 8, revelation: 6, "holy spirit": 6, salvation: 8 }
  }
];

const categoryAnnotations = {
  "Minimal Deism": "This claim tests whether the universe needs an explanation beyond simply describing what happens inside it.",
  "Design Deism": "This claim tests whether the source of reality is plausibly purposive, ordering, or life-directed rather than merely impersonal.",
  "Personal Theism": "This claim tests whether the source can reasonably be treated as aware, intentional, communicative, or responsive.",
  "Interventionist Theism": "This claim tests a general Christian divine-action commitment: whether God acts, guides, heals, warns, responds, or transforms within ordinary human life.",
  "Specific Christian Theism": "This claim tests a thicker Christian commitment about revelation, Jesus, scripture, Spirit, salvation, worship, or Christian transformation."
};

function evidenceFocusFor(claim) {
  const tags = claim.tags.map((tag) => tag.toLowerCase()).join(" ");
  if (tags.includes("prayer")) return "Look for cases where prayer is not merely followed by a desired event, but where timing, pattern, specificity, controls, and alternatives have been weighed.";
  if (tags.includes("healing") || tags.includes("health")) return "Look for medical detail, baseline condition, timing, independent confirmation, alternative explanations, and whether the reported healing is durable.";
  if (tags.includes("foreknowledge") || tags.includes("prophecy") || tags.includes("future")) return "Look for specificity, prior documentation, timing, falsifiability, and whether the claim avoids vague fit-after-the-fact interpretation.";
  if (tags.includes("wisdom") || tags.includes("discernment") || tags.includes("guidance")) return "Look for a track record of better judgment, morally serious outcomes, and reasons to distinguish the guidance from intuition, bias, or social reinforcement.";
  if (tags.includes("dreams") || tags.includes("visions") || tags.includes("religious experience")) return "Look for content, timing, verifiability, psychological alternatives, and whether the experience carries information not otherwise available.";
  if (tags.includes("scripture")) return "Look for arguments about reliability, coherence, transmission, interpretive restraint, and whether scripture is doing more work than the evidence supports.";
  if (tags.includes("jesus") || tags.includes("resurrection")) return "Look for historical argument, explanatory comparison, source quality, and whether the conclusion depends on prior miracle and revelation claims.";
  if (tags.includes("holy spirit") || tags.includes("spiritual gifts")) return "Look for observable effects, consistency with Christian moral aims, safeguards against suggestion, and whether claimed gifts can be responsibly tested.";
  if (tags.includes("transformation") || tags.includes("sanctification")) return "Look for durable character change, costs paid, corroboration by others, and whether ordinary therapeutic or social explanations have been considered.";
  if (tags.includes("evidence")) return "Look for criteria that would distinguish divine action from coincidence, suggestion, social reinforcement, or selective memory.";
  return "Look for the strongest argument you could personally explain, the main alternative explanations, and what evidence would lower your confidence.";
}

function currentReadFor(response, gap, tension) {
  const confidence = Number(response.confidence) || 0;
  const substantiation = Number(response.personalSubstantiation) || 0;
  if (!confidence && !substantiation) return "Not rated yet. Start low if you only find the claim plausible but cannot yet substantiate it.";
  if (gap >= 35) return "Your confidence is running well ahead of personal substantiation here; this is a good candidate for a note or a lower confidence score.";
  if (tension >= 25) return "This claim is currently outrunning its prerequisite bridge claims. Revisit the dependencies before treating it as strongly supported.";
  if (confidence >= 70 && substantiation >= 70) return "You are rating this as both credible and personally defensible.";
  if (confidence >= 60) return "You see some case for the claim, but the personal-substantiation score determines how much it should move the profile.";
  return "This is currently a weak or tentative commitment in your profile.";
}

function dependencyAnnotationFor(claim) {
  if (!claim.dependencyIds.length) {
    return "This is an entry-level claim in the gradient and does not depend on earlier app claims.";
  }

  const labels = claim.dependencyIds
    .map((id) => state.claims.find((candidate) => candidate.id === id))
    .filter(Boolean)
    .map((dependency) => `${dependency.id}: ${dependency.text}`);

  return `Bridge claims to check first: ${labels.join(" | ")}`;
}

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved?.responses) state.profile = saved;
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function saveProfile() {
  localStorage.setItem(storageKey, JSON.stringify(state.profile));
}

function formatNumber(value, digits = 1) {
  return value === null || value === undefined ? "0" : value.toFixed(digits);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function responseFor(claim) {
  return state.profile.responses[claim.id] ?? { confidence: 0, personalSubstantiation: 0, note: "" };
}

function clampPresetScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function presetBoostFor(claim, preset) {
  const tags = claim.tags.map((tag) => tag.toLowerCase());
  return Object.entries(preset.boosts).reduce((sum, [needle, boost]) => {
    return tags.some((tag) => tag.includes(needle)) ? sum + boost : sum;
  }, 0);
}

function setResponse(claimId, patch) {
  const current = state.profile.responses[claimId] ?? { confidence: 0, personalSubstantiation: 0, note: "" };
  state.profile.responses[claimId] = { ...current, ...patch };
  saveProfile();
  render();
}

function ratedClaimRows() {
  return state.claims
    .map((claim) => {
      const response = state.profile.responses[claim.id];
      if (!response || (!response.confidence && !response.personalSubstantiation && !response.note)) return null;
      const gap = substantiationGap(response.confidence, response.personalSubstantiation);
      const tension = dependencyTension(claim, state.profile) ?? 0;
      const weight = claimWeight(response.confidence, response.personalSubstantiation);
      return { claim, response, gap, tension, weight };
    })
    .filter(Boolean);
}

function topLines(rows, sorter, formatter, emptyText = "- None yet.") {
  const lines = [...rows]
    .sort(sorter)
    .slice(0, 8)
    .filter((row) => formatter(row))
    .map(formatter);

  return lines.length ? lines.join("\n") : emptyText;
}

function buildFinalReport() {
  const aggregate = aggregateGradientPosition(state.claims, state.profile);
  const ewti = evidentiallyWeightedTheismIndex(state.claims, state.profile);
  const gap = averageSubstantiationGap(state.claims, state.profile);
  const alerts = buildDiagnostics(state.claims, state.profile);
  const rows = ratedClaimRows();
  const rated = rows.length;

  const categoryLines = categoryAverages(state.claims, state.profile)
    .map((item) => `- ${item.category}: C ${Math.round(item.confidence)}, P ${Math.round(item.personalSubstantiation)} (${item.count} rated)`)
    .join("\n");

  const alertLines = alerts.length
    ? alerts.map((alert) => `- ${alert.message} ${alert.claim.text}`).join("\n")
    : "- No diagnostic alerts.";

  const strongestLines = topLines(
    rows,
    (a, b) => b.weight - a.weight,
    ({ claim, response, weight }) => `- ${claim.id} (${claim.category}): weight ${weight.toFixed(2)}, C ${Math.round(response.confidence)}, P ${Math.round(response.personalSubstantiation)} — ${claim.text}`
  );

  const gapLines = topLines(
    rows,
    (a, b) => b.gap - a.gap,
    ({ claim, gap: rowGap, response }) => rowGap >= 15
      ? `- ${claim.id}: gap ${Math.round(rowGap)} (C ${Math.round(response.confidence)}, P ${Math.round(response.personalSubstantiation)}) — ${claim.text}`
      : null
  );

  const tensionLines = topLines(
    rows,
    (a, b) => b.tension - a.tension,
    ({ claim, tension }) => tension >= 15
      ? `- ${claim.id}: dependency tension ${Math.round(tension)} — ${claim.text}`
      : null
  );

  const noteLines = rows
    .filter(({ response }) => response.note)
    .slice(0, 8)
    .map(({ claim, response }) => `- ${claim.id}: ${response.note}`)
    .join("\n") || "- No notes entered.";

  return [
    "Theism Gradient Final Report",
    "",
    profileSummary(state.claims, state.profile),
    "",
    `Aggregate position: ${aggregate ? aggregate.toFixed(2) : "0.00"}`,
    `Evidentially weighted theism index: ${ewti ? Math.round(ewti) : 0}`,
    `Average substantiation gap: ${gap ? Math.round(gap) : 0}`,
    `Claims rated: ${rated} / ${state.claims.length}`,
    "",
    "Category profile:",
    categoryLines,
    "",
    "Diagnostic alerts:",
    alertLines,
    "",
    "Strongest weighted commitments:",
    strongestLines,
    "",
    "Largest confidence/substantiation gaps:",
    gapLines,
    "",
    "Largest dependency tensions:",
    tensionLines,
    "",
    "User notes:",
    noteLines
  ].join("\n");
}

function claimLine(row) {
  return `${row.claim.id} | ${row.claim.category} | C ${Math.round(row.response.confidence)} | P ${Math.round(row.response.personalSubstantiation)} | weight ${row.weight.toFixed(2)} | gap ${Math.round(row.gap)} | tension ${Math.round(row.tension)} | ${row.claim.text}`;
}

function bridgeLedgerLine(row) {
  const dependencies = row.claim.dependencyIds
    .map((id) => {
      const dependency = state.claims.find((claim) => claim.id === id);
      const response = state.profile.responses[id];
      const confidence = response ? Math.round(response.confidence) : "unrated";
      return `${id} C ${confidence}${dependency ? ` (${dependency.text})` : ""}`;
    })
    .join("; ");

  return [
    `Claim: ${row.claim.id} ${row.claim.text}`,
    `Category: ${row.claim.category}`,
    `Confidence: ${Math.round(row.response.confidence)}/100`,
    `Personal substantiation: ${Math.round(row.response.personalSubstantiation)}/100`,
    `Substantiation gap: ${Math.round(row.gap)}/100`,
    `Dependency tension: ${Math.round(row.tension)}/100`,
    `Prerequisite bridge claims: ${dependencies || "none"}`,
    `User note: ${row.response.note || "none"}`
  ].join("\n");
}

function tensionKind(row) {
  if (row.gap >= 35 && row.tension >= 25) return "substantiation gap plus dependency leap";
  if (row.gap >= 35) return "substantiation gap";
  if (row.tension >= 25) return "dependency leap";
  if (row.claim.gradientPosition >= 4 && row.weight >= 0.5) return "Christian specificity pressure";
  if (row.claim.tags.some((tag) => ["testimony", "religious experience", "dreams", "visions"].includes(tag.toLowerCase()))) return "testimonial or experience-pressure";
  return "ordinary evidential pressure";
}

function evidenceWarning(row) {
  const tags = row.claim.tags.map((tag) => tag.toLowerCase()).join(" ");
  if (tags.includes("healing")) return "Check medical baseline, independent confirmation, durability, and ordinary recovery explanations.";
  if (tags.includes("prayer")) return "Check timing, specificity, comparison cases, unanswered prayers, and selection effects.";
  if (tags.includes("prophecy") || tags.includes("foreknowledge")) return "Check prior documentation, specificity, falsifiability, and fit-after-the-fact risk.";
  if (tags.includes("wisdom") || tags.includes("guidance") || tags.includes("discernment")) return "Check whether the result exceeds ordinary reflection, intuition, community influence, or hindsight.";
  if (tags.includes("scripture")) return "Check whether scripture is being used as evidence, authority, interpretation, or conclusion.";
  if (tags.includes("jesus") || tags.includes("resurrection")) return "Check whether historical evidence and prior miracle/revelation premises are doing distinct work.";
  if (tags.includes("holy spirit") || tags.includes("spiritual gifts")) return "Check testability, safeguards against suggestion, and consistency with Christian moral aims.";
  return "Check rival explanations, scope limits, and what evidence would lower confidence.";
}

function buildFollowUpPrompts(rows) {
  const topGap = [...rows].sort((a, b) => b.gap - a.gap)[0];
  const topTension = [...rows].sort((a, b) => b.tension - a.tension)[0];
  const topWeighted = [...rows].sort((a, b) => b.weight - a.weight)[0];
  const christianRows = rows.filter((row) => row.claim.tradition === "Christianity");
  const topChristian = [...christianRows].sort((a, b) => b.weight - a.weight)[0] ?? topWeighted;
  const actionRows = rows.filter((row) => row.claim.gradientPosition >= 4);
  const topAction = [...actionRows].sort((a, b) => b.gap + b.tension - (a.gap + a.tension))[0] ?? topGap;

  const visualData = rows
    .sort((a, b) => (b.gap + b.tension + b.weight * 25) - (a.gap + a.tension + a.weight * 25))
    .slice(0, 8)
    .map((row) => `${row.claim.id}: C ${Math.round(row.response.confidence)}, P ${Math.round(row.response.personalSubstantiation)}, gap ${Math.round(row.gap)}, tension ${Math.round(row.tension)}, weight ${row.weight.toFixed(2)}, category ${row.claim.category}`)
    .join("; ");

  return [
    `1. Focus only on "${topGap?.claim.id ?? "the largest gap"}". What evidence would narrow the gap between my confidence and my personal substantiation without merely lowering standards?`,
    `2. Focus only on "${topTension?.claim.id ?? "the largest dependency tension"}". Which prerequisite bridge claim is doing the most work, and what would independently support it?`,
    `3. Rewrite my current strongest Christian commitment, "${topChristian?.claim.id ?? "the strongest Christian claim"}", as a more modest claim that preserves only what my current substantiation can support.`,
    `4. Test whether my ratings for "${topAction?.claim.id ?? "the highest-pressure divine-action claim"}" confuse possibility, testimony, and evidential permission. What would count against the claim?`,
    `5. Compare my category averages. Which transition in the gradient most looks like specificity inflation, and what bridge premise would repair it?`,
    `6. Create an image prompt for a quantified visual depiction of this Theism Gradient profile. Use a clean analytical dashboard style, not a cartoon. Show the five gradient categories, aggregate position, theism index, average substantiation gap, strongest weighted commitments, largest gaps, and largest dependency tensions. Include prose insights explaining the two or three strongest tensions and the repair that would most reduce pressure. Data to visualize and interpret: ${visualData || "no rated claims yet"}.`
  ];
}

function buildAiPrompt() {
  const aggregate = aggregateGradientPosition(state.claims, state.profile);
  const ewti = evidentiallyWeightedTheismIndex(state.claims, state.profile);
  const gap = averageSubstantiationGap(state.claims, state.profile);
  const rows = ratedClaimRows();
  const alerts = buildDiagnostics(state.claims, state.profile);
  const categoryLines = categoryAverages(state.claims, state.profile)
    .map((item) => `- ${item.category}: confidence ${Math.round(item.confidence)}, personal substantiation ${Math.round(item.personalSubstantiation)}, rated ${item.count}`)
    .join("\n");

  const strongestRows = [...rows].sort((a, b) => b.weight - a.weight).slice(0, 10);
  const gapRows = [...rows].sort((a, b) => b.gap - a.gap).filter((row) => row.gap >= 10).slice(0, 10);
  const tensionRows = [...rows].sort((a, b) => b.tension - a.tension).filter((row) => row.tension >= 10).slice(0, 10);
  const actionRows = rows.filter((row) => row.claim.gradientPosition >= 4);
  const pressureRows = [...rows]
    .sort((a, b) => (b.gap + b.tension + b.weight * 20) - (a.gap + a.tension + a.weight * 20))
    .slice(0, 12);
  const followUps = buildFollowUpPrompts(rows);

  return [
    "Copy/paste this entire prompt into an AI assistant.",
    "",
    "You are a rigorous but fair Socratic auditor of Christian theism claims.",
    "Help me examine whether my current profile moves from thin deistic claims to thicker Christian divine-action claims with adequate bridge premises. Do not simply reassure me or dunk on the profile. Separate truth, possibility, plausibility, and evidential permission.",
    "",
    "Your tasks:",
    "1. Identify the strongest tensions in my profile.",
    "2. Explain whether each tension is mainly a substantiation gap, dependency leap, scope drift, specificity inflation, testimonial overreach, or rival-explanation problem.",
    "3. Ask targeted follow-up questions that would force the profile to become more consistent.",
    "4. Suggest the most charitable repair that preserves what the evidence can support.",
    "5. State what would need to be true for my stronger Christian conclusion to be licensed.",
    "6. Generate several follow-up prompts I can paste back into an AI assistant to continue the analysis, including one image-generation prompt for a quantified visual depiction of the claim-gradient profile.",
    "",
    "Theory vocabulary to use:",
    "- Claim gradient: claims become more specific as they move from minimal source claims toward Christian divine-action claims.",
    "- Bridge premise: a premise needed to move from a thinner claim to a thicker downstream claim.",
    "- Substantiation gap: confidence exceeds the user's ability to personally substantiate the claim.",
    "- Dependency tension: a downstream claim is rated much higher than its prerequisite bridge claims.",
    "- Scope drift: evidence from one domain is moved into another domain without showing the transfer is licensed.",
    "- Specificity inflation: modest evidence for a broad claim is treated as evidence for a much richer Christian claim.",
    "- Testimonial overreach: testimony is treated as stronger than its independence, specificity, controls, or rival explanations allow.",
    "- Evidential permission: what the evidence licenses, as distinct from what might be true or personally meaningful.",
    "",
    "BEGIN CURRENT USER DATA",
    "",
    "Assessment context:",
    "App: Theism Gradient",
    "Focus: Christianity-focused claims about divine action, prayer, healing, wisdom, foreknowledge, scripture, Jesus, Spirit, salvation, and transformation.",
    `Aggregate gradient position: ${aggregate ? aggregate.toFixed(2) : "0.00"} / 5`,
    `Evidentially weighted theism index: ${ewti ? Math.round(ewti) : 0} / 100`,
    `Average substantiation gap: ${gap ? Math.round(gap) : 0} / 100`,
    `Claims rated: ${rows.length} / ${state.claims.length}`,
    `Profile summary: ${profileSummary(state.claims, state.profile)}`,
    "",
    "Category profile:",
    categoryLines,
    "",
    "Diagnostic flags:",
    alerts.length
      ? alerts.map((alert) => `- ${alert.type}: ${alert.message} Claim: ${alert.claim.text}`).join("\n")
      : "- No diagnostic alerts generated by the app.",
    "",
    "Strongest weighted commitments:",
    strongestRows.length
      ? strongestRows.map((row) => `- ${claimLine(row)}`).join("\n")
      : "- No rated claims yet.",
    "",
    "Largest substantiation gaps:",
    gapRows.length
      ? gapRows.map((row) => `- ${claimLine(row)}`).join("\n")
      : "- No gap above 10 points yet.",
    "",
    "Largest dependency tensions:",
    tensionRows.length
      ? tensionRows.map((row) => `- ${claimLine(row)}`).join("\n")
      : "- No dependency tension above 10 points yet.",
    "",
    "Tension classification ledger:",
    pressureRows.length
      ? pressureRows.map((row) => [
        `Claim: ${row.claim.id} ${row.claim.text}`,
        `Tension type: ${tensionKind(row)}`,
        `Evidence warning: ${evidenceWarning(row)}`,
        `Current numbers: C ${Math.round(row.response.confidence)}, P ${Math.round(row.response.personalSubstantiation)}, gap ${Math.round(row.gap)}, dependency tension ${Math.round(row.tension)}, weight ${row.weight.toFixed(2)}`
      ].join("\n")).join("\n\n")
      : "- No rated claims yet.",
    "",
    "Christian divine-action ledger:",
    actionRows.length
      ? actionRows.map((row) => `\n${bridgeLedgerLine(row)}`).join("\n")
      : "- No interventionist or specific Christian claims rated yet.",
    "",
    "Repair options generated by the audit:",
    "- Modest claim: restrict the profile to the strongest lower-gradient claims that have both high confidence and high personal substantiation.",
    "- Scope control: avoid treating general creator/source claims as support for Christian divine action until communication, agency, and intervention bridge claims are substantiated.",
    "- Bridge premise: identify the missing premise needed to move from personal theism to prayer, healing, foreknowledge, scripture, Jesus, Spirit, or salvation.",
    "- Evidence upgrade: distinguish coincidence, suggestion, testimonial clustering, and social reinforcement from independently checkable evidence and durable patterns.",
    "- Burden shift: if a claim moves from possible to actual Christian divine action, require evidence that can discriminate between Christian agency and rival explanations.",
    "",
    "Suggested subsequent prompts to ask next:",
    followUps.join("\n"),
    "",
    "END CURRENT USER DATA",
    "",
    "Please respond in this format:",
    "1. A concise diagnosis of the profile.",
    "2. The top three tensions, each tied to a specific claim and classified as substantiation gap, dependency leap, scope drift, specificity inflation, testimonial overreach, rival-explanation problem, or some combination.",
    "3. The bridge premise or differentiator that would most improve the profile, stated as a testable or independently defensible premise.",
    "4. Five Socratic questions I should answer before treating the strongest Christian conclusion as licensed.",
    "5. A repaired version of the profile that avoids overclaiming.",
    "6. Six follow-up prompts I can paste next, each focused on a specific unresolved tension in this audit; one must ask for an image prompt that depicts the claim-gradient profile and tensions quantitatively."
  ].join("\n");
}

function buildTextReport() {
  return buildFinalReport();
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

async function copyFromButton(button, value) {
  const original = button.textContent;
  try {
    await copyText(value);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Copy failed";
  }
  window.setTimeout(() => {
    button.textContent = original;
  }, 1400);
}

function filterClaims() {
  const query = state.filters.search.trim().toLowerCase();
  return state.claims.filter((claim) => {
    const categoryMatch = state.filters.category === "All" || claim.category === state.filters.category;
    const traditionMatch = state.filters.tradition === "All" || claim.tradition === state.filters.tradition;
    const searchMatch = !query
      || claim.id.toLowerCase().includes(query)
      || claim.text.toLowerCase().includes(query)
      || claim.tags.some((tag) => tag.toLowerCase().includes(query));
    return categoryMatch && traditionMatch && searchMatch;
  });
}

function renderMetrics() {
  const aggregate = aggregateGradientPosition(state.claims, state.profile);
  const ewti = evidentiallyWeightedTheismIndex(state.claims, state.profile);
  const gap = averageSubstantiationGap(state.claims, state.profile);
  const rated = Object.keys(state.profile.responses).filter((id) => {
    const response = state.profile.responses[id];
    return response.confidence > 0 || response.personalSubstantiation > 0 || response.note;
  }).length;

  nodes.aggregate.textContent = aggregate ? formatNumber(aggregate, 2) : "0.00";
  nodes.theismIndex.textContent = ewti ? `${Math.round(ewti)}` : "0";
  nodes.avgGap.textContent = gap ? `${Math.round(gap)}` : "0";
  nodes.ratedCount.textContent = `${rated} / ${state.claims.length}`;
  nodes.profileSummary.textContent = profileSummary(state.claims, state.profile);

  const marker = aggregate ? ((aggregate - 1) / 4) * 100 : 0;
  nodes.gradientMarker.style.left = `${Math.max(0, Math.min(100, marker))}%`;
}

function renderCategoryBars() {
  nodes.categoryBars.innerHTML = categoryAverages(state.claims, state.profile).map((item) => `
    <div class="category-row">
      <div class="category-row-heading">
        <strong>${escapeHtml(item.category)}</strong>
        <span>${item.count} rated</span>
      </div>
      <div class="bar-pair" aria-label="${item.category} averages">
        <div class="bar confidence" style="width: ${item.confidence}%"></div>
        <div class="bar substantiation" style="width: ${item.personalSubstantiation}%"></div>
      </div>
      <div class="bar-values">
        <span>C ${Math.round(item.confidence)}</span>
        <span>P ${Math.round(item.personalSubstantiation)}</span>
      </div>
    </div>
  `).join("");
}

function renderScatter() {
  const ratedClaims = state.claims.filter((claim) => {
    const response = state.profile.responses[claim.id];
    return response && (response.confidence > 0 || response.personalSubstantiation > 0);
  });
  const claimsByCategory = new Map(categories.map((category) => [
    category,
    state.claims.filter((claim) => claim.category === category).sort((a, b) => a.id.localeCompare(b.id))
  ]));

  nodes.scatter.innerHTML = `
    <div class="scatter-axis x-axis">Category lanes</div>
    <div class="scatter-axis y-axis">Confidence</div>
    ${categories.map((category, index) => `
      <span class="category-lane" style="left:${index * 20}%; width:20%"></span>
      <span class="x-tick" style="left:${index * 20 + 10}%">${index + 1}</span>
    `).join("")}
    ${[0, 25, 50, 75, 100].map((y) => `<span class="y-tick" style="bottom:${y}%">${y}</span>`).join("")}
    ${ratedClaims.map((claim) => {
      const response = responseFor(claim);
      const categoryIndex = categories.indexOf(claim.category);
      const categoryClaims = claimsByCategory.get(claim.category) ?? [];
      const itemIndex = Math.max(0, categoryClaims.findIndex((item) => item.id === claim.id));
      const itemCount = Math.max(1, categoryClaims.length);
      const laneLeft = categoryIndex * 20;
      const x = laneLeft + 2 + ((itemIndex + 0.5) / itemCount) * 16;
      const y = response.confidence;
      const opacity = 0.3 + (response.personalSubstantiation / 100) * 0.7;
      const size = 7 + claimWeight(response.confidence, response.personalSubstantiation) * 9;
      return `<button class="point" style="left:${x}%; bottom:${y}%; opacity:${opacity}; width:${size}px; height:${size}px" title="${escapeHtml(`${claim.id}: ${claim.text}`)}"></button>`;
    }).join("")}
  `;
}

function renderAlerts() {
  const alerts = buildDiagnostics(state.claims, state.profile);
  nodes.alerts.innerHTML = alerts.length
    ? alerts.map((alert) => `
      <article class="alert ${alert.severity}">
        <strong>${alert.type === "gap" ? "Substantiation gap" : "Dependency tension"}</strong>
        <span>${alert.message}</span>
        <small>${escapeHtml(alert.claim.text)}</small>
      </article>
    `).join("")
    : `<p class="empty">No diagnostic alerts yet. Ratings with large confidence gaps or bridge-claim jumps will appear here.</p>`;
}

function renderClaims() {
  const claims = filterClaims();
  nodes.claimList.innerHTML = claims.map((claim) => {
    const response = responseFor(claim);
    const gap = substantiationGap(response.confidence, response.personalSubstantiation);
    const tension = dependencyTension(claim, state.profile) ?? 0;
    const tags = claim.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");

    return `
      <article class="claim" data-claim-id="${claim.id}">
        <div class="claim-main">
          <div class="claim-meta">
            <strong>${escapeHtml(claim.id)}</strong>
            <span>${escapeHtml(claim.category)}</span>
            <span>${escapeHtml(claim.tradition)}</span>
          </div>
          <p>${escapeHtml(claim.text)}</p>
          <div class="tags">${tags}</div>
          <details class="annotation">
            <summary>Annotation</summary>
            <div class="annotation-body">
              <section>
                <strong>What this tests</strong>
                <p>${escapeHtml(categoryAnnotations[claim.category] ?? "This claim tests a distinct commitment in the gradient.")}</p>
              </section>
              <section>
                <strong>Substantiation focus</strong>
                <p>${escapeHtml(evidenceFocusFor(claim))}</p>
              </section>
              <section>
                <strong>Bridge pressure</strong>
                <p>${escapeHtml(dependencyAnnotationFor(claim))}</p>
              </section>
              <section>
                <strong>Current read</strong>
                <p>${escapeHtml(currentReadFor(response, gap, tension))}</p>
              </section>
            </div>
          </details>
        </div>
        <div class="claim-controls">
          <label>
            <span>Confidence <b>${Math.round(response.confidence)}</b></span>
            <input data-field="confidence" type="range" min="0" max="100" value="${response.confidence}">
          </label>
          <label>
            <span>Personal substantiation <b>${Math.round(response.personalSubstantiation)}</b></span>
            <input data-field="personalSubstantiation" type="range" min="0" max="100" value="${response.personalSubstantiation}">
          </label>
            <textarea data-field="note" rows="2" placeholder="Rationale note">${escapeHtml(response.note)}</textarea>
          <div class="claim-diagnostics">
            <span>Weight ${claimWeight(response.confidence, response.personalSubstantiation).toFixed(2)}</span>
            <span>Gap ${Math.round(gap)}</span>
            <span>Tension ${Math.round(tension)}</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderFilters() {
  const traditions = Array.from(new Set(state.claims.map((claim) => claim.tradition)));
  nodes.categoryFilter.innerHTML = ["All", ...categories].map((category) => `
    <option value="${escapeHtml(category)}" ${state.filters.category === category ? "selected" : ""}>${escapeHtml(category)}</option>
  `).join("");
  nodes.traditionFilter.innerHTML = ["All", ...traditions].map((tradition) => `
    <option value="${escapeHtml(tradition)}" ${state.filters.tradition === tradition ? "selected" : ""}>${escapeHtml(tradition)}</option>
  `).join("");
}

function renderExports() {
  nodes.finalReport.value = buildFinalReport();
  nodes.aiPrompt.value = buildAiPrompt();
}

function renderLensButtons() {
  nodes.lensButtons.innerHTML = profilePresets.map((preset) => `
    <button type="button" data-preset-id="${escapeHtml(preset.id)}" class="lens-button">
      <strong>${escapeHtml(preset.label)}</strong>
      <span>${escapeHtml(preset.description)}</span>
    </button>
  `).join("");
}

function render() {
  renderMetrics();
  renderCategoryBars();
  renderScatter();
  renderAlerts();
  renderExports();
  renderClaims();
}

function applyPreset(presetId) {
  const preset = profilePresets.find((item) => item.id === presetId);
  if (!preset) return;

  const responses = {};
  for (const claim of state.claims) {
    const index = claim.gradientPosition - 1;
    const boost = presetBoostFor(claim, preset);
    responses[claim.id] = {
      confidence: clampPresetScore(preset.confidence[index] + boost),
      personalSubstantiation: clampPresetScore(preset.personal[index] + boost * 0.65),
      note: ""
    };
  }

  state.profile = { userId: "local", responses };
  saveProfile();
  document.querySelectorAll(".lens-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.presetId === preset.id);
  });
  render();
}

function bindEvents() {
  nodes.claimList.addEventListener("input", (event) => {
    const target = event.target;
    const claim = target.closest(".claim");
    if (!claim) return;
    const claimId = claim.dataset.claimId;
    const field = target.dataset.field;
    const value = target.type === "range" ? Number(target.value) : target.value;
    setResponse(claimId, { [field]: value });
  });

  nodes.categoryFilter.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    renderClaims();
  });

  nodes.traditionFilter.addEventListener("change", (event) => {
    state.filters.tradition = event.target.value;
    renderClaims();
  });

  nodes.searchFilter.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    renderClaims();
  });

  nodes.reset.addEventListener("click", () => {
    state.profile = { userId: "local", responses: {} };
    saveProfile();
    document.querySelectorAll(".lens-button").forEach((button) => button.classList.remove("active"));
    render();
  });

  nodes.sample.addEventListener("click", () => applyPreset("cautious-christian"));

  nodes.lensButtons.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset-id]");
    if (!button) return;
    applyPreset(button.dataset.presetId);
  });

  nodes.copySummary.addEventListener("click", async () => {
    await copyFromButton(nodes.copySummary, buildTextReport());
  });

  nodes.copyReport.addEventListener("click", async () => {
    await copyFromButton(nodes.copyReport, nodes.finalReport.value);
  });

  nodes.copyAiPrompt.addEventListener("click", async () => {
    await copyFromButton(nodes.copyAiPrompt, nodes.aiPrompt.value);
  });
}

async function init() {
  const response = await fetch("./public/claims.json");
  state.claims = await response.json();
  loadProfile();
  renderFilters();
  renderLensButtons();
  bindEvents();
  render();
}

init();
