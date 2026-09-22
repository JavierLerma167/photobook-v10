'use client';

import React, { useState } from 'react';
import { useStore, ALBUM_SIZES } from '@/src/store/projectStore';
import { X, Download } from 'lucide-react';
import { exportProjectToPdf, exportPageToJpeg } from '@/src/utils/pdfExport';

export function ExportDialog() {
  const open = useStore(s => s.ui.exportOpen);
  const setUI = useStore(s => s.setUI);
  const project = useStore(s => s.history.present);
  const size = ALBUM_SIZES[project.sizeId];
  const [dpi, setDpi] = useState(300);
  const [includeGuides, setIncludeGuides] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');

  if (!open) return null;

  const download = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handlePdf = async () => {
    setBusy(true);
    setProgress('Generando PDF…');
    try {
      const blob = await exportProjectToPdf(project, size, {
        id: 'tmp', name: 'tmp', sizeId: size.id, dpi, bleedIn: size.bleedIn,
        safeIn: size.safeIn, gutterIn: size.gutterIn, colorSpace: 'sRGB',
        format: 'PDF', naming: 'page-{n}'
      }, { includeGuides });
      download(blob, `${project.name.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      alert('Error al exportar PDF: ' + (e as Error).message);
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  const handleJpegs = async () => {
    setBusy(true);
    try {
      for (let i = 0; i < project.pages.length; i++) {
        setProgress(`Exportando página ${i + 1} / ${project.pages.length}…`);
        const blob = await exportPageToJpeg(project, i, size, dpi);
        download(blob, `${project.name.replace(/\s+/g, '_')}_p${String(i).padStart(2, '0')}.jpg`);
        await new Promise(r => setTimeout(r, 120));
      }
    } catch (e) {
      alert('Error al exportar JPEG: ' + (e as Error).message);
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-8" onClick={() => setUI({ exportOpen: false })}>
      <div
        className="bg-evr-panel border border-evr-border rounded-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-evr-border">
          <div className="font-semibold">Exportar</div>
          <button className="btn-ghost p-1" onClick={() => setUI({ exportOpen: false })}>
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-evr-muted block mb-1">Resolución (DPI)</label>
            <select className="input w-full" value={dpi} onChange={e => setDpi(parseInt(e.target.value))}>
              <option value={150}>150 DPI (borrador)</option>
              <option value={300}>300 DPI (impresión)</option>
              <option value={600}>600 DPI (alta)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input id="guides" type="checkbox" checked={includeGuides} onChange={e => setIncludeGuides(e.target.checked)} />
            <label htmlFor="guides" className="text-sm">Incluir guías en PDF (trim + safe)</label>
          </div>

          <div className="text-xs text-evr-muted bg-evr-bg border border-evr-border rounded p-2 space-y-0.5">
            <div>Tamaño: {size.label}</div>
            <div>Bleed: {size.bleedIn}&quot; · Safe: {size.safeIn}&quot; · Gutter: {size.gutterIn}&quot;</div>
            <div>Páginas: {project.pages.length}</div>
            <div>Fotografías: {project.photos.length}</div>
          </div>

          {progress && <div className="text-xs text-evr-accent">{progress}</div>}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button className="btn-outline" onClick={handleJpegs} disabled={busy}>
              <Download size={13} className="inline mr-1" /> JPEG por página
            </button>
            <button className="btn-accent" onClick={handlePdf} disabled={busy}>
              <Download size={13} className="inline mr-1" /> PDF completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}