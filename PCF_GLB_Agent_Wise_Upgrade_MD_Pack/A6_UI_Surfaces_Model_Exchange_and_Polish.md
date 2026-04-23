# A6 — UI Surfaces, Model Exchange, Professional Polish

## Mission

Make the visible product surfaces coherent, production-safe, and free of obvious placeholders in active routes.

## Owned files

- `viewer/tabs/model-exchange-tab.js`
- `tabs/model-exchange-tab.js`
- `styles/model-exchange-tab.css`
- `viewer/tabs/config-tab.js`
- `viewer/tabs/input-tab.js`
- `viewer/tabs/linelist-tab.js`
- `viewer/tabs/summary-tab.js`
- `viewer/styles/*`
- `viewer/tests/e2e/ui-surfaces/*`

## Forbidden files

- `viewer/core/state.js`
- `viewer/debug/dev-debug-window.js`
- `viewer/tabs/viewer3d-tab.js`
- interchange source/builders owned by A2

## Current source observations

- `viewer/tabs/model-exchange-tab.js` still shows “Rendered Preview (data-driven placeholder)”.
- Active UI still includes raw alert flows in config/linelist tabs.
- Surface quality varies because not all tabs share the same productization standard.

## Main deliverables

1. Remove placeholders from routed UI.
2. Upgrade model exchange from JSON dump to professional inspector.
3. Apply unified notification UX from A5.
4. Standardize empty states, loading states, and error states.
5. Apply consistent visual treatment.

## Technical requirements

### 1) No placeholder text in shipped UI
Reasoning: stubs are acceptable in dev-only surfaces, not in production routes.

### 2) Model Exchange as inspector
Reasoning: it should become a real visual inspection surface for source, canonical, rendered, fidelity, and validation.

### 3) Consistent surface grammar
Reasoning: a professional app needs predictable:
- section headings
- status badges
- validation summaries
- empty states
- action placement

## Critical code snippets

### Snippet A — richer model exchange center panel

```js
function renderCenterPanel() {
  const rendered = store.renderedPreview;
  return `
    <div class="model-exchange-panel model-exchange-center">
      <div class="model-exchange-toolbar">...</div>
      ${rendered ? `
        <div class="mx-summary-grid">
          <div class="mx-card"><strong>Assemblies</strong><span>${rendered.assemblies.length}</span></div>
          <div class="mx-card"><strong>Nodes</strong><span>${rendered.nodes.length}</span></div>
          <div class="mx-card"><strong>Supports</strong><span>${rendered.supportRenderItems.length}</span></div>
          <div class="mx-card"><strong>Annotations</strong><span>${rendered.annotationRenderItems.length}</span></div>
        </div>
      ` : `<div class="mx-empty">No rendered preview available for current source.</div>`}
    </div>
  `;
}
```

### Snippet B — replace alert in config tab

```js
try {
  // parse config
} catch (e) {
  notify({
    level: 'error',
    title: 'Invalid configuration JSON',
    message: e.message,
  });
}
```

### Snippet C — placeholder gate

```js
if (/placeholder|coming soon|stub/i.test(container.textContent || '')) {
  throw new Error('Production surface contains placeholder text');
}
```

## Work breakdown

1. Inventory routed surfaces.
2. Remove placeholder production copy.
3. Upgrade Model Exchange inspector.
4. Standardize status and empty states.
5. Replace alerts in owned tabs.
6. Add UI smoke tests.

## Pass tests

### E2E
- open each routed tab with and without loaded data
- no placeholder/stub text visible in production tabs
- errors render as notifications, not alerts
- model exchange shows source + canonical + validation summaries

### Quantitative thresholds
- zero “placeholder”, “stub”, or “coming soon” strings in active routed surfaces
- all empty states have action guidance
- all owned tabs have smoke screenshots

## Evidence required

- `artifacts/A6/pass/e2e.txt`
- `artifacts/A6/screenshots/model-exchange.png`
- `artifacts/A6/screenshots/tab-empty-states.png`
- `artifacts/A6/reports/placeholder-scan.md`

## Merge gate

No merge if shipped UI still contains known placeholder copy.
