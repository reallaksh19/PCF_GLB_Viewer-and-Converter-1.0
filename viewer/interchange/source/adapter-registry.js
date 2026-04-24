import { CaesarXmlImportAdapter } from './xml/CaesarXmlImportAdapter.js';
import { NeutralXmlImportAdapter } from './xml/NeutralXmlImportAdapter.js';
import { PcfImportAdapter } from './pcf/PcfImportAdapter.js';
import { PcfxImportAdapter } from './pcfx/PcfxImportAdapter.js';
import { GlbImportAdapter } from './glb/GlbImportAdapter.js';
import { CaesarAccdbImportAdapter } from './accdb/CaesarAccdbImportAdapter.js';
import { CaesarPdfImportAdapter } from './pdf/CaesarPdfImportAdapter.js';

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

export function buildImportResult({ sourceRecord, parsed, project, diagnostics }) {
  return {
    sourceRecord,
    parsed,
    project,
    diagnostics: {
      source: diagnostics?.source || [],
      canonical: diagnostics?.canonical || [],
      fidelity: diagnostics?.fidelity || null,
      losses: diagnostics?.losses || [],
    },
  };
}
