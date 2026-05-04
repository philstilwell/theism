# Theism Gradient

A local, dependency-free dashboard for assessing Christianity-focused God-related claims on a five-part deism-to-Christian-theism gradient.

The app rates 50 auditable claims using confidence and personal-substantiation sliders, stores responses in `localStorage`, and computes:

- aggregate gradient position
- evidentially weighted theism index
- substantiation gaps
- dependency tensions
- category summaries
- plain-English profile summaries

## Run

```bash
node server.mjs
```

Then open [http://localhost:4173](http://localhost:4173).

## Structure

- `public/claims.json`: the 50-claim bank and metadata
- `src/scoring.ts`: TypeScript scoring model from the project seed
- `src/scoring.js`: browser module used by the static app
- `src/app.js`: dashboard state, rendering, persistence, and interactions
- `src/styles.css`: dashboard styling
- `docs/deism_theism_gradient_app_brief.md`: original app brief
