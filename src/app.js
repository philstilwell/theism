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

const storageKey = "theism-gradient-profile-v1";

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
  gradientMarker: document.querySelector("#gradient-marker"),
  profileSummary: document.querySelector("#profile-summary"),
  ratedCount: document.querySelector("#rated-count"),
  reset: document.querySelector("#reset"),
  sample: document.querySelector("#seed-balanced"),
  scatter: document.querySelector("#scatter-plot"),
  searchFilter: document.querySelector("#search-filter"),
  theismIndex: document.querySelector("#theism-index"),
  traditionFilter: document.querySelector("#tradition-filter")
};

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

function setResponse(claimId, patch) {
  const current = state.profile.responses[claimId] ?? { confidence: 0, personalSubstantiation: 0, note: "" };
  state.profile.responses[claimId] = { ...current, ...patch };
  saveProfile();
  render();
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

  nodes.scatter.innerHTML = `
    <div class="scatter-axis x-axis">Gradient position</div>
    <div class="scatter-axis y-axis">Confidence</div>
    ${[1, 2, 3, 4, 5].map((x) => `<span class="x-tick" style="left:${((x - 1) / 4) * 100}%">${x}</span>`).join("")}
    ${[0, 25, 50, 75, 100].map((y) => `<span class="y-tick" style="bottom:${y}%">${y}</span>`).join("")}
    ${ratedClaims.map((claim) => {
      const response = responseFor(claim);
      const x = ((claim.gradientPosition - 1) / 4) * 100;
      const y = response.confidence;
      const opacity = 0.3 + (response.personalSubstantiation / 100) * 0.7;
      const size = 9 + claimWeight(response.confidence, response.personalSubstantiation) * 12;
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

function render() {
  renderMetrics();
  renderCategoryBars();
  renderScatter();
  renderAlerts();
  renderClaims();
}

function seedSample() {
  const responses = {};
  for (const claim of state.claims) {
    const base = 78 - (claim.gradientPosition - 1) * 13;
    const traditionPenalty = claim.tradition === "general" ? 0 : 8;
    responses[claim.id] = {
      confidence: Math.max(10, base - traditionPenalty + (claim.id.endsWith("5") ? 8 : 0)),
      personalSubstantiation: Math.max(8, base - 18 - traditionPenalty),
      note: ""
    };
  }
  state.profile = { userId: "local", responses };
  saveProfile();
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
    render();
  });

  nodes.sample.addEventListener("click", seedSample);
}

async function init() {
  const response = await fetch("/public/claims.json");
  state.claims = await response.json();
  loadProfile();
  renderFilters();
  bindEvents();
  render();
}

init();
