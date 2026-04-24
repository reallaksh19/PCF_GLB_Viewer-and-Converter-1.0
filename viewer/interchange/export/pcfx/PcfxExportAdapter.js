import { buildExportResult } from '../common/export-result.js';

export class PcfxExportAdapter {
  export(project) {
    const losses = [];
    if (!project.metadata) {
      losses.push({
        code: 'PCFX_NO_METADATA',
        severity: 'info',
        sourceObjectId: project.id,
        sourceKind: 'project',
        targetFormat: 'PCFX',
        preserved: ['all'],
        dropped: ['metadata']
      });
    }

    const text = JSON.stringify(project, null, 2);

    return buildExportResult({
      text,
      losses,
      meta: {
        producer: 'PcfxExportAdapter',
        sourceFormat: project.metadata?.format || 'UNKNOWN',
        targetFormat: 'PCFX'
      }
    });
  }
}
