# A8 — QA, Integration Branch, Release Hardening, Behavior Parity Audit

## Mission

Own the final integration branch and ensure the upgraded app is behavior-safe, not just code-complete.

## Owned files

- `viewer/tests/*`
- CI scripts and repo automation
- `artifacts/*`
- release checklist docs
- parity matrix docs

A8 may patch small non-functional integration fixes across modules only after owner approval.

## Forbidden behavior

- no feature development
- no speculative refactors
- no silent conflict resolution in high-conflict files

## Main deliverables

1. Integration branch workflow.
2. CI with compile + contract + behavior gates.
3. Behavior parity audit.
4. Pre-merge artifact review.
5. Release signoff pack.

## Technical requirements

### 1) Merge waves only
Reasoning: this repo is not safe for free-for-all branch merging.

### 2) Behavior gates, not compile gates only
Reasoning: your prior regression lesson is exactly about behavior loss under merge.

### 3) Contract violation scans
Reasoning: branch authors should fail before code review if they bypass the architecture.

### 4) Final parity audit
Reasoning: compare expected runtime behavior vs actual runtime, not just changed lines.

## Critical code snippets

### Snippet A — contract-violation scan

```js
// pseudo CI script
if (grepForForbiddenPatterns([
  "emit('",
  'alert(',
  'placeholder',
], allowlist)) {
  process.exit(1);
}
```

### Snippet B — behavior matrix test declaration

```js
const criticalScenarios = [
  'boot-app',
  'switch-tab',
  'import-xml',
  'import-pcf',
  'open-debug-drawer',
  'fit-all',
  'select-object',
  'open-model-exchange',
  'export-diagnostics',
];
```

### Snippet C — evidence gate

```js
for (const agent of requiredAgents) {
  assertFileExists(`artifacts/${agent}/pass/e2e.txt`);
  assertFileExists(`artifacts/${agent}/reports/feature-matrix.md`);
}
```

## Work breakdown

1. Create integration branch.
2. Define branch merge order.
3. Add CI jobs:
   - contract
   - unit
   - integration
   - e2e
   - placeholder scan
   - alert scan
   - artifact presence check
4. Run final parity audit.
5. Approve release candidate.

## Pass tests

### CI must fail on
- unregistered runtime events
- new blocking `alert()` in production code
- placeholder/stub copy in active routed surfaces
- missing agent evidence artifacts
- dead critical toolbar behavior
- model exchange route crash
- diagnostics bundle export failure

### Final parity audit checklist
- single runtime entry confirmed
- XML import path stable
- canonical preview stable
- 3D viewer toolbar stable
- debug collapsible window stable
- log panel stable
- model exchange no longer placeholder
- export/loss reports present

### Quantitative release thresholds
- zero fatal console errors in critical flows
- zero blocking alerts in production flows
- 100% critical scenario pass rate
- all agent evidence packs present

## Evidence required

- `artifacts/A8/pass/ci-summary.txt`
- `artifacts/A8/reports/final-parity-audit.md`
- `artifacts/A8/reports/release-readiness.md`

## Merge gate

A8 is the only agent allowed to approve merge to main.
