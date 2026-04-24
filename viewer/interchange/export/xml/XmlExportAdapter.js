import { buildExportResult } from '../common/export-result.js';

export class XmlExportAdapter {
  export(project) {
    const text = `<!-- XML export adapter starter. Add dialect-specific serialization. Project: ${project.id} -->`;
    const losses = [{
      code: 'XML_EXPORT_DEGRADED',
      severity: 'warning',
      sourceObjectId: project.id,
      sourceKind: 'project',
      targetFormat: 'XML',
      preserved: ['id'],
      dropped: ['assemblies', 'segments', 'supports', 'annotations']
    }];
    return buildExportResult({
      text,
      losses,
      meta: {
        producer: 'XmlExportAdapter',
        sourceFormat: project.metadata?.format || 'UNKNOWN',
        targetFormat: 'XML'
      }
    });
  }
}
