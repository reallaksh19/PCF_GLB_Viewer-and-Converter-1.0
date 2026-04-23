# A2 — Interchange, XML Import, Canonical Model Completion

## Mission

Finish the import-side professionalization of the XML / interchange path and make the canonical model the reliable center of truth for imported engineering data.

## Why this is separate

The XML transition is already visible in:

- `viewer/interchange/source/xml/CaesarXmlImportAdapter.js`
- `viewer/interchange/builders/xml/*`
- `viewer/interchange/canonical/*`
- `viewer/interchange/state/model-exchange-actions.js`

But the transition is still incomplete, and this work must stay isolated from viewer tool behavior.

## Owned files

- `viewer/interchange/source/*`
- `viewer/interchange/builders/*`
- `viewer/interchange/canonical/*`
- `viewer/interchange/validation/*`
- `viewer/interchange/state/model-exchange-actions.js`
- `viewer/interchange/state/model-exchange-store.js`
- `viewer/tests/unit/interchange/*`
- `viewer/tests/integration/xml-import/*`

## Forbidden files

- `viewer/tabs/viewer3d-tab.js`
- `viewer/debug/dev-debug-window.js`
- `viewer/tabs/model-exchange-tab.js`

## Main deliverables

1. Adapter registry with confidence ordering.
2. Stronger canonical diagnostics.
3. Stable XML-to-canonical conversion.
4. Clear loss reporting for partial sources.
5. Test fixtures for XML, PCF, PCFX, GLB.

## Technical requirements

### 1) Formal adapter registry
Reasoning: current `pickAdapter()` is workable but static and fragile. The app will grow more formats.

Current file:
- `viewer/interchange/state/model-exchange-actions.js`

Required outcome:
- move detection into a registry
- return:
  - adapter
  - confidence
  - why it was chosen

### 2) Canonical diagnostics first-class
Reasoning: `SourceFileRecord` and project diagnostics exist, but they should be structured enough for UI and tests.

Required outcome:
- every import returns:
  - source diagnostics
  - canonical diagnostics
  - fidelity summary
  - loss summary
  - warnings with stable codes

### 3) XML import completeness
Reasoning: `CaesarXmlImportAdapter.js` already extracts elements, bends, and restraints. That is a good base, but the professional app needs deterministic mapping and validation for missing or ambiguous data.

### 4) Support / annotation validation
Reasoning: support and annotation loss is where engineering confidence drops fastest.

## Critical code snippets

### Snippet A — adapter registry

```js
// viewer/interchange/source/adapter-registry.js
const ADAPTERS = [
  CaesarXmlImportAdapter,
  NeutralXmlImportAdapter,
  PcfImportAdapter,
  PcfxImportAdapter,
  GlbImportAdapter,
  CaesarAccdbImportAdapter,
  CaesarPdfImportAdapter,
];

export function pickImportAdapter(input) {
  const ranked = ADAPTERS
    .map((Adapter) => ({
      Adapter,
      score: Adapter.detectConfidence ? Adapter.detectConfidence(input) : (Adapter.detect?.(input.text || '') ? 0.7 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) throw new Error('No import adapter matched');
  return ranked[0];
}
```

### Snippet B — stable import result envelope

```js
export function buildImportResult({ sourceRecord, parsed, project, diagnostics }) {
  return {
    sourceRecord,
    parsed,
    project,
    diagnostics: {
      source: diagnostics.source || [],
      canonical: diagnostics.canonical || [],
      fidelity: diagnostics.fidelity || null,
      losses: diagnostics.losses || [],
    },
  };
}
```

### Snippet C — diagnostic code pattern

```js
sourceRecord.addMessage('WARN', 'XML restraint missing support block', {
  code: 'XML_SUPPORT_BLOCK_MISSING',
  node: restraint.node,
  rawType: restraint.rawType,
});
```

## Work breakdown

1. Build registry.
2. Refactor import actions to use registry result object.
3. Add structured diagnostic codes.
4. Strengthen XML parsing edge cases.
5. Expand canonical validators.
6. Add fixture-based tests.

## Pass tests

### Unit
- adapter registry picks XML fixture as `CaesarXmlImportAdapter`
- neutral XML is not misclassified as CAESAR XML
- canonical project builds nodes, segments, supports, annotations deterministically

### Integration
- importing `viewer/opt/mock-xml.xml` yields:
  - no uncaught exception
  - source preview populated
  - canonical preview populated
  - fidelity summary present
- validation issues are machine-readable, not free-text only

### Quantitative thresholds
- import of the mock XML completes with zero fatal errors
- canonical assembly count > 0
- canonical node count > 0
- support validation report is generated every run

## Evidence required

- `artifacts/A2/pass/unit.txt`
- `artifacts/A2/pass/integration.txt`
- `artifacts/A2/diagnostics/xml-import-diagnostics.json`
- `artifacts/A2/reports/adapter-selection-matrix.md`

## Merge gate

A2 cannot touch routed UI. It merges only when its public import result contract is stable and signed off by A1.
