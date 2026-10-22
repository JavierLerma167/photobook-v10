// src/components/ExportDialog.tsx
'use client';

import React, { useState } from 'react';
import { useStore, useAlbumSize } from '@/src/store/projectStore';
import { X, Download, Eye } from 'lucide-react';
import { exportProjectToPdf, exportPageToJpeg } from '@/src/utils/pdfExport';
import { Page } from '@/src/types';

export function ExportDialog() {
  const open = useStore(s => s.ui.exportOpen);
  const setUI = useStore(s => s.setUI);
  const project = useStore(s => s.history.present);
  // ✅ useAlbumSize() devuelve el AlbumSize activo:
  //    - un preset de ALBUM_SIZES si sizeId !== 'custom'
  //    - project.customSize si sizeId === 'custom'
  const size = useAlbumSize();

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
    // ✅ NUEVO: Activar el loader global
    setUI({ isLoading: true, loadingMessage: 'Generando PDF…' });

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
      // ✅ NUEVO: Ocultar el loader global
      setUI({ isLoading: false, loadingMessage: '' });
    }
  };

  const handleJpegs = async () => {
    setBusy(true);
    // ✅ NUEVO: Activar el loader global
    setUI({ isLoading: true, loadingMessage: 'Exportando imágenes…' });

    try {
      for (let i = 0; i < project.pages.length; i++) {
        const msg = `Exportando página ${i + 1} / ${project.pages.length}…`;
        setProgress(msg);
        // ✅ Actualizamos también el mensaje global
        setUI({ loadingMessage: msg });

        const blob = await exportPageToJpeg(project, i, size, dpi);
        download(blob, `${project.name.replace(/\s+/g, '_')}_p${String(i).padStart(2, '0')}.jpg`);
        await new Promise(r => setTimeout(r, 120));
      }
    } catch (e) {
      alert('Error al exportar JPEG: ' + (e as Error).message);
    } finally {
      setBusy(false);
      setProgress('');
      // ✅ NUEVO: Ocultar el loader global
      setUI({ isLoading: false, loadingMessage: '' });
    }
  };

  // ✅ NUEVO: Obtener las páginas para la vista previa
  const coverPage = project.pages[0];
  const firstSpreadLeft = project.pages[1];
  const firstSpreadRight = project.pages[2];

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-8 backdrop-blur-sm" onClick={() => setUI({ exportOpen: false })}>
      <div
        className="bg-evr-panel border border-evr-border rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-evr-border shrink-0">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-evr-accent" />
            <div className="font-semibold">Exportar Proyecto</div>
          </div>
          <button className="btn-ghost p-1" onClick={() => setUI({ exportOpen: false })}>
            <X size={16} />
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto scroll-thin p-4 space-y-5">
          
          {/* ✅ NUEVO: Vista Previa */}
          <div className="bg-evr-bg border border-evr-border rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-evr-muted uppercase tracking-wide mb-3">
              <Eye size={14} /> Vista previa del álbum
            </div>
            <div className="flex justify-center items-center gap-4">
              {/* Portada */}
              {coverPage && (
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-24 h-32 bg-white rounded shadow-lg overflow-hidden border border-evr-border relative"
                    style={{ aspectRatio: `${size.widthIn} / ${size.heightIn}` }}
                  >
                    <PageThumbnail page={coverPage} size={size} />
                  </div>
                  <span className="text-[10px] text-evr-muted">Portada</span>
                </div>
              )}

              {/* Primer Spread */}
              {firstSpreadLeft && firstSpreadRight && (
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-48 h-32 bg-white rounded shadow-lg overflow-hidden border border-evr-border flex"
                    style={{ aspectRatio: `${size.widthIn * 2} / ${size.heightIn}` }}
                  >
                    <div className="w-1/2 h-full relative">
                      <PageThumbnail page={firstSpreadLeft} size={size} />
                    </div>
                    <div className="w-px bg-neutral-300 z-10" />
                    <div className="w-1/2 h-full relative">
                      <PageThumbnail page={firstSpreadRight} size={size} />
                    </div>
                  </div>
                  <span className="text-[10px] text-evr-muted">Primera Página</span>
                </div>
              )}
            </div>
            <div className="text-center text-[10px] text-evr-muted mt-3">
              Se exportarán {project.pages.length} páginas.
            </div>
          </div>

          {/* Opciones de Exportación */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-evr-muted block mb-1">Resolución (DPI)</label>
              <select className="input w-full" value={dpi} onChange={e => setDpi(parseInt(e.target.value))}>
                <option value={150}>150 DPI (borrador)</option>
                <option value={300}>300 DPI (impresión)</option>
                <option value={600}>600 DPI (alta)</option>
              </select>
            </div>
            
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-2">
                <input id="guides" type="checkbox" checked={includeGuides} onChange={e => setIncludeGuides(e.target.checked)} />
                <label htmlFor="guides" className="text-sm">Incluir guías en PDF</label>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="text-xs text-evr-muted bg-evr-bg border border-evr-border rounded p-3 space-y-1">
            <div className="flex justify-between">
              <span>Tamaño:</span>
              <span className="text-evr-text">{size.label}</span>
            </div>
            <div className="flex justify-between">
              <span>Bleed / Safe / Gutter:</span>
              <span className="text-evr-text">{size.bleedIn}" · {size.safeIn}" · {size.gutterIn}"</span>
            </div>
            <div className="flex justify-between">
              <span>Total de páginas:</span>
              <span className="text-evr-text">{project.pages.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Fotografías en el proyecto:</span>
              <span className="text-evr-text">{project.photos.length}</span>
            </div>
          </div>

          {progress && <div className="text-xs text-evr-accent font-medium text-center">{progress}</div>}

          {/* Botones de Acción */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="btn-outline py-2.5" onClick={handleJpegs} disabled={busy}>
              <Download size={14} className="inline mr-2" /> Exportar JPEGs
            </button>
            <button className="btn-accent py-2.5" onClick={handlePdf} disabled={busy}>
              <Download size={14} className="inline mr-2" /> Exportar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * ✅ NUEVO: Miniatura de la página (Reutilizada del GridViewModal)
 * ============================================================ */
function PageThumbnail({ page, size }: { page: Page; size: any }) {
  const project = useStore(s => s.history.present);
  const photos = project.photos;
  
  const isCover = page.kind === 'cover';
  const isSpanned = page.spanNext === true;
  
  return (
    <div 
      className="w-full h-full relative"
      style={{ 
        backgroundColor: page.background || '#ffffff',
        backgroundImage: page.backgroundImage ? `url("${page.backgroundImage}")` : 'none',
        backgroundSize: page.backgroundImageFit || 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: page.backgroundImageFit === 'repeat' ? 'repeat' : 'no-repeat',
      }}
    >
      {/* Overlay oscuro si existe */}
      {page.backgroundOverlay && (
        <div className="absolute inset-0" style={{ background: page.backgroundOverlay }} />
      )}

      {/* Renderizar Slots */}
      {page.slots.map((slot) => {
        const photo = slot.photoId ? photos.find(p => p.id === slot.photoId) : null;
        return (
          <div
            key={slot.id}
            className="absolute overflow-hidden"
            style={{
              left: `${(slot.x / (isSpanned ? 2 : 1))}%`,
              top: `${slot.y}%`,
              width: `${(slot.w / (isSpanned ? 2 : 1))}%`,
              height: `${slot.h}%`,
              backgroundColor: '#f5f5f5',
            }}
          >
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.proxyUrl}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  objectFit: slot.fit,
                  transform: `scale(${slot.zoom}) translate(${slot.offsetX * 20}%, ${slot.offsetY * 20}%) rotate(${slot.rotation}deg)`,
                }}
              />
            )}
          </div>
        );
      })}

      {/* Renderizar Textos */}
      {page.texts.map((t) => (
        <div
          key={t.id}
          className="absolute pointer-events-none whitespace-pre-wrap select-none"
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: `${t.w}%`,
            color: t.color,
            fontFamily: t.fontFamily,
            fontSize: `${Math.max(4, (t.fontSize / 1000) * 50)}px`,
            fontWeight: t.fontWeight,
            textAlign: t.align,
            lineHeight: t.lineHeight,
          }}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
