import { buildSourcePreview } from '../view/SourcePreviewBuilder.js';
import { buildCanonicalPreview } from '../view/CanonicalPreviewBuilder.js';
import { buildRenderedPreview } from '../view/RenderedPreviewBuilder.js';
import { pickImportAdapter, buildImportResult } from '../source/adapter-registry.js';





export async function importIntoModelExchange(store, { id = '', name = '', text = '', payload = null } = {}) {
      const match = pickImportAdapter({ name, text, payload });
      const adapter = new match.Adapter();
      const rawResult = await adapter.import({ id, name, text, payload });
      const result = buildImportResult({
        sourceRecord: rawResult.sourceRecord,
        parsed: rawResult.parsed,
        project: rawResult.project,
        diagnostics: rawResult.diagnostics || {}
      });

      store.patch({
        sourceRecord: result.sourceRecord,
        parsed: result.parsed,
        project: result.project,
        sourcePreview: buildSourcePreview(result.sourceRecord),
        canonicalPreview: buildCanonicalPreview(result.project),
        renderedPreview: buildRenderedPreview(result.project, store.viewState),
      });

}

export function updateViewState(store, patch) {
  store.setViewState(patch);
  if (store.project) {
    store.patch({
      renderedPreview: buildRenderedPreview(store.project, store.viewState),
    });
  }
}
