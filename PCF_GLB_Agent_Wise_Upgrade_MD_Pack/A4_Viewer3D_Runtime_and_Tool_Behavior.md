# A4 — Viewer3D Runtime, Commands, Tool Behavior

## Mission

Make the 3D viewer runtime behave like a professional tool surface rather than a collection of attached controls.

## Owned files

- `viewer/tabs/viewer3d-tab.js`
- `viewer/viewer-3d.js`
- `viewer/viewer-actions.js`
- `viewer/js/pcf2glb/advanced/*`
- `viewer/js/pcf2glb/pro-editor/core/*`
- `viewer/tests/integration/viewer3d/*`
- `viewer/tests/e2e/viewer3d/*`

## Forbidden files

- `viewer/core/state.js`
- `viewer/core/event-bus.js`
- `viewer/debug/dev-debug-window.js`
- `viewer/tabs/model-exchange-tab.js`

## Why this is high-conflict

This is the equivalent of your earlier A4/A5 overwrite risk. `viewer/tabs/viewer3d-tab.js` is large, central, and behavior-dense. It must have single-owner protection.

## Current source observations

- `viewer/tabs/viewer3d-tab.js` wires many UI actions directly.
- It still uses blocking `alert()` in import and mock-loading paths.
- Placeholder and disable-all panel states exist.
- Action wiring is not yet standardized through a frozen command contract.

## Main deliverables

1. Move toolbar and action wiring onto dispatcher contracts from A1.
2. Remove dead buttons and orphan modes.
3. Replace blocking alerts with notification + diagnostics.
4. Add behavior tests for core tool actions.
5. Ensure all visible icons do real work or are hidden.

## Technical requirements

### 1) Dispatcher-only tool actions
Reasoning: viewer buttons should not call runtime internals ad hoc.

### 2) Behavioral parity matrix
Reasoning: visual controls can look fine while being logically broken.

### 3) Professional status and feedback
Reasoning: imports, fit, selection, section, heatmap, overlays, and config changes should produce status events and diagnostics.

## Critical code snippets

### Snippet A — route toolbar through dispatcher

```js
container.querySelectorAll('[data-viewer-action]').forEach((btn) => {
  btn.addEventListener('click', () => {
    dispatchViewerCommand(
      { viewer: _viewer, state, container },
      { type: btn.getAttribute('data-viewer-action') }
    );
  });
});
```

### Snippet B — replace alert with notify

```js
try {
  const result = await importFromRawFile(file, state, log);
  if (!result.ok) {
    notify({
      level: 'error',
      title: 'Import failed',
      message: result.message || 'Import failed',
      details: log,
    });
  }
} catch (err) {
  notify({
    level: 'error',
    title: 'Import error',
    message: String(err?.message || err),
  });
}
```

### Snippet C — behavior assertion hook

```js
addTraceEvent({
  category: 'viewer3d',
  type: 'FIT_ALL_EXECUTED',
  payload: {
    modelLoaded: !!_viewer?.scene,
    selectionCount: _viewer?.selection?.size || 0,
  },
});
```

## Work breakdown

1. Inventory visible controls and icons.
2. Remove or hide dead surfaces.
3. Route actions through dispatcher.
4. Replace alerts.
5. Add trace points for every major behavior.
6. Add behavior tests.

## Pass tests

### Integration
- import raw XML/PCF/GLB from the viewer path does not use blocking `alert()`
- fit all works when model is loaded
- fit selection works when an object is selected
- heatmap toggle changes viewer state and emits diagnostic trace
- vertical axis change updates status and trace

### E2E behavior gates
- load fixture -> model appears
- click fit all -> camera changes
- select object -> component/properties panel updates
- section box toggle -> section state changes
- marquee or selection tool emits trace
- no visible button is dead

### Quantitative thresholds
- zero blocking `alert()` calls remain in `viewer/tabs/viewer3d-tab.js`
- 100% of `[data-viewer-action]` buttons have a dispatcher mapping
- top 10 toolbar actions have trace coverage

## Evidence required

- `artifacts/A4/pass/integration.txt`
- `artifacts/A4/pass/e2e.txt`
- `artifacts/A4/screenshots/viewer-toolbar-smoke.png`
- `artifacts/A4/diagnostics/viewer-action-trace.json`

## Merge gate

No merge if any visible viewer icon still routes to placeholder behavior or no-op.
