# A3 — Export, Round-Trip, PCFX, Loss Contracts

## Mission

Turn export and round-trip into a professional subsystem with explicit loss accounting. The app should be honest about what survives and what does not.

## Owned files

- `viewer/export/*`
- `viewer/interchange/export/*`
- `viewer/pcfx/*`
- `viewer/pcf-builder/*`
- `viewer/tests/unit/export/*`
- `viewer/tests/integration/roundtrip/*`
- `viewer/docs/LOSS_CONTRACT.md`
- `viewer/interchange/docs/LOSS_CONTRACT.md`

## Forbidden files

- `viewer/tabs/viewer3d-tab.js`
- `viewer/debug/dev-debug-window.js`
- shell files owned by A1

## Why this matters

Current adapters under `viewer/export/*` and `viewer/interchange/export/*` exist but are still light. Professional users need deterministic exports, round-trip expectations, and explicit loss summaries.

## Main deliverables

1. Real export adapters for XML, PCF, PCFX, GLB.
2. Loss contract report generated on every export.
3. Round-trip fixtures and parity reports.
4. PCFX as first-class interchange artifact.

## Technical requirements

### 1) Loss-aware export
Reasoning: “export succeeded” is not enough. The user must know what was preserved, degraded, or dropped.

### 2) Stable artifact metadata
Reasoning: PCFX and exported GLB should record provenance, producer version, source format, and diagnostic summary.

### 3) Round-trip benchmark pack
Reasoning: regressions often hide in import-export-import loops.

## Critical code snippets

### Snippet A — export result envelope

```js
export function buildExportResult({ text, blob, losses, warnings, meta }) {
  return {
    ok: true,
    text: text || null,
    blob: blob || null,
    losses: losses || [],
    warnings: warnings || [],
    meta: {
      producedAt: new Date().toISOString(),
      ...meta,
    },
  };
}
```

### Snippet B — loss contract row

```js
const loss = {
  code: 'ANNOTATION_GEOMETRY_DEGRADED',
  severity: 'warning',
  sourceObjectId: ann.id,
  sourceKind: 'annotation',
  targetFormat: 'GLB',
  preserved: ['text', 'anchorRef'],
  dropped: ['leaderCurve'],
};
```

### Snippet C — round-trip runner

```js
const import1 = await importAdapter.import(input);
const export1 = await exportAdapter.export(import1.project);
const import2 = await importAdapter.import({ text: export1.text, name: 'roundtrip.pcfx' });

expect(compareProjectShape(import1.project, import2.project).segmentDelta).toBeLessThanOrEqual(0);
```

## Work breakdown

1. Inventory every export adapter.
2. Replace placeholder returns with real result envelopes.
3. Implement loss report generation.
4. Add PCFX provenance metadata.
5. Add round-trip tests.

## Pass tests

### Unit
- each export adapter returns a structured result
- each export result includes `losses`, `warnings`, and `meta`

### Integration
- XML -> canonical -> PCFX -> canonical preserves counts within agreed thresholds
- PCF -> canonical -> PCFX -> canonical preserves segment count and metadata keys
- GLB export includes project provenance metadata

### Quantitative thresholds
- round-trip segment count delta = 0 for fixture class “simple”
- support count delta <= 0 where target format cannot represent richer support data
- every export emits a non-empty loss report, even if it says “no losses”

## Evidence required

- `artifacts/A3/pass/roundtrip.txt`
- `artifacts/A3/diagnostics/loss-report-simple.json`
- `artifacts/A3/diagnostics/loss-report-xml.json`
- `artifacts/A3/reports/roundtrip-matrix.md`

## Merge gate

No export merge without round-trip evidence.
