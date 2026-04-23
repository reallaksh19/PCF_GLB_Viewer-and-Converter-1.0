# A7 — Data, Calculations, Reports, Benchmarking

## Mission

Professionalize the engineering-data and calculation side so that debug, reports, and benchmarks become reliable evidence, not just developer aids.

## Owned files

- `viewer/calc/*`
- `viewer/data/*`
- `viewer/tabs/debug-tab.js`
- `viewer/tabs/misc-calc-tab.js`
- `viewer/tabs/misc-calc-console.js`
- `viewer/tabs/misc-calc-layout.js`
- `viewer/data/report-data.js`
- `viewer/tests/unit/calc/*`
- `viewer/tests/integration/reporting/*`

## Forbidden files

- `viewer/debug/dev-debug-window.js`
- `viewer/tabs/viewer3d-tab.js`
- interchange source/builders

## Current source observations

- `viewer/tabs/debug-tab.js` is already rich and unusually valuable.
- `viewer/calc/*` already contains formulas, units, resolvers, benchmark helpers, and SVG outputs.
- This is a real strength of the repo and should be turned into a controlled professional subsystem.

## Main deliverables

1. Standardize calculation result envelopes.
2. Tie calculation history into diagnostics.
3. Create benchmark baselines for key calculators.
4. Make debug-tab data exportable and reproducible.

## Technical requirements

### 1) Standard calc envelope
Reasoning: every calculator should expose the same structure for UI, tests, and reports.

### 2) Benchmark baselines
Reasoning: engineering apps need quantitative protection, not just visual confidence.

### 3) Source snapshot discipline
Reasoning: a benchmark without the exact source snapshot is hard to trust.

## Critical code snippets

### Snippet A — calc result envelope

```js
export function buildCalcResult({ name, inputs, outputs, warnings, steps, benchmark }) {
  return {
    ok: true,
    metadata: { name, unitMode: inputs.unitMode || 'unknown' },
    inputs,
    outputs,
    warnings: warnings || [],
    steps: steps || [],
    benchmark: benchmark || null,
    ts: new Date(),
  };
}
```

### Snippet B — benchmark assertion

```js
expect(result.outputs.reactionForce).toBeCloseTo(expected.reactionForce, 6);
expect(result.benchmark.durationMs).toBeLessThan(50);
```

### Snippet C — debug-tab export

```js
export function exportDebugSnapshot() {
  return {
    parsed: state.parsed,
    errors: state.errors,
    calcHistory,
    reportData: buildCurrentReportData(state),
  };
}
```

## Work breakdown

1. Normalize calculator envelopes.
2. Add benchmark fixtures.
3. Link calc history with diagnostics codes.
4. Add debug snapshot export.
5. Add quantitative tests.

## Pass tests

### Unit
- each formula returns a normalized calc result
- unit conversions are deterministic
- SVG builders render with fixture inputs

### Integration
- debug tab renders calculation history without exceptions
- exporting a debug snapshot includes calc history and parsed source
- benchmark reporter generates machine-readable output

### Quantitative thresholds
- benchmark variance within agreed tolerance across 5 local runs
- zero calculator throws for shipped fixtures
- all calc runs include warnings array even if empty

## Evidence required

- `artifacts/A7/pass/unit.txt`
- `artifacts/A7/pass/integration.txt`
- `artifacts/A7/diagnostics/calc-benchmark.json`
- `artifacts/A7/reports/calc-baseline.md`

## Merge gate

No merge without quantitative benchmark artifacts.
