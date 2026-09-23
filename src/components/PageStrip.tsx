'use client';

import React from 'react';
import { useStore, useAlbumSize } from '@/src/store/projectStore';
import { Plus, Copy, Trash2, BookOpen, ArrowLeftRight } from 'lucide-react';

export function PageStrip() {
  const project = useStore(s => s.history.present);
  const currentIndex = project.currentPageIndex;
  const goToPage = useStore(s => s.goToPage);
  const addPage = useStore(s => s.addPage);
  const addSpread = useStore(s => s.addSpread);
  const duplicatePage = useStore(s => s.duplicatePage);
  const deletePage = useStore(s => s.deletePage);
  const togglePageSpan = useStore(s => s.togglePageSpan);

  // ✅ useAlbumSize() devuelve el AlbumSize activo:
  //    - un preset si sizeId !== 'custom'
  //    - project.customSize si sizeId === 'custom'
  const size = useAlbumSize();

  const canDelete = project.pages.length > 1 && project.pages[currentIndex]?.kind !== 'cover';

  // -------------------------------------------------------------
  // Determinar si la página actual puede unirse con la siguiente.
  // Solo páginas izquierdas del spread (índices impares) que no sean portada.
  // -------------------------------------------------------------
  const currentPage = project.pages[currentIndex];
  const canSpan =
    !!currentPage &&
    currentPage.kind !== 'cover' &&
    currentIndex % 2 === 1;

  return (
    <div className="h-24 md:h-32 bg-evr-panel border-t border-evr-border flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-1 border-b border-evr-border">
        <div className="text-[10px] font-semibold text-evr-muted uppercase tracking-wide">
          Páginas ({project.pages.length})
        </div>
        <div className="flex gap-1">
          {/* Nuevo: unir/separar páginas */}
          <button
            className={`btn-ghost p-1 disabled:opacity-30 ${
              currentPage?.spanNext ? 'bg-evr-accent text-black' : ''
            }`}
            onClick={() => togglePageSpan(currentIndex)}
            disabled={!canSpan}
            title={
              !canSpan
                ? 'Solo se pueden extender páginas izquierdas del spread'
                : currentPage?.spanNext
                ? 'Separar las dos páginas'
                : 'Unir con la página derecha (cruzar el gutter)'
            }
          >
            <ArrowLeftRight size={13} />
          </button>

          <button
            className="btn-ghost p-1"
            onClick={() => addSpread()}
            title="Añadir spread (2 páginas)"
          >
            <BookOpen size={13} />
          </button>
          <button
            className="btn-ghost p-1"
            onClick={() => addPage()}
            title="Añadir 1 página"
          >
            <Plus size={13} />
          </button>
          <button
            className="btn-ghost p-1"
            onClick={() => duplicatePage(currentIndex)}
            title="Duplicar página actual"
          >
            <Copy size={13} />
          </button>
          <button
            className="btn-ghost p-1 text-red-400 disabled:opacity-30"
            onClick={() => deletePage(currentIndex)}
            disabled={!canDelete}
            title={canDelete ? 'Eliminar página actual' : 'No se puede eliminar (portada o única página)'}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-1 p-2 overflow-x-auto scroll-thin items-stretch">
        {project.pages.map((p, i) => {
          const isCover = p.kind === 'cover';
          const w = size.widthIn * 0.55;
          const h = size.heightIn * 0.55;
          const isActive = i === currentIndex;
          const isRightSideActive = i === currentIndex + 1 && !isCover && currentIndex > 0;

          // ¿Esta página está "consumida" por la anterior (que tiene spanNext)?
          const isSpannedByPrev = !isCover && project.pages[i - 1]?.spanNext === true;
          // ¿Esta página extiende a la siguiente?
          const spansNext = !isCover && p.spanNext === true;

          const label = isCover
            ? 'PORTADA'
            : spansNext
            ? `PÁG ${i} ↔ ${i + 1}`
            : isSpannedByPrev
            ? `PÁG ${i} (parte de ${i - 1})`
            : `${i}`;

          // Determinar estilo del borde
          let borderClass = 'border-evr-border hover:border-evr-muted';
          if (isActive) borderClass = 'border-evr-accent';
          else if (spansNext) borderClass = 'border-evr-accent/60 border-dashed';
          else if (isSpannedByPrev) borderClass = 'border-evr-accent/30 border-dashed';
          else if (isRightSideActive) borderClass = 'border-evr-accent/40';

          return (
            <React.Fragment key={p.id}>
              <button
                className={`relative shrink-0 rounded overflow-hidden border-2 transition-colors ${borderClass}`}
                style={{ width: w * 8, height: h * 8 }}
                onClick={() => goToPage(i)}
                title={isCover ? 'Portada' : `Página ${i}`}
              >
                <div
                  className="w-full h-full relative"
                  style={{ background: p.background || '#ffffff' }}
                >
                  {p.slots.map(sl => {
                    const photo = sl.photoId ? project.photos.find(ph => ph.id === sl.photoId) : null;
                    // En páginas extendidas, los slots pueden tener w/x hasta 200.
                    // En la miniatura, si es spanned, escalamos x/w a 0-100 (dividiendo por 2).
                    const isSpanned = spansNext;
                    const scale = isSpanned ? 2 : 1;
                    const left = Math.max(0, Math.min(100, sl.x / scale));
                    const top = Math.max(0, Math.min(100, sl.y));
                    const width = Math.min(100 - left, sl.w / scale);
                    const height = Math.min(100, sl.h);

                    return (
                      <div
                        key={sl.id}
                        className="absolute overflow-hidden bg-neutral-200"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          width: `${width}%`,
                          height: `${height}%`
                        }}
                      >
                        {photo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo.proxyUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                        )}
                      </div>
                    );
                  })}
                  {p.texts.length > 0 && (
                    <div
                      className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-blue-400/80"
                      title="Contiene texto"
                    />
                  )}
                </div>
                <div
                  className={`absolute bottom-0 left-0 right-0 text-[9px] py-0.5 text-center truncate px-0.5 ${
                    isActive
                      ? 'bg-evr-accent text-black font-semibold'
                      : spansNext
                      ? 'bg-evr-accent/60 text-black'
                      : isSpannedByPrev
                      ? 'bg-black/60 text-white/80'
                      : 'bg-black/70 text-white'
                  }`}
                >
                  {label}
                </div>
              </button>

              {/* Separador entre portada y cuerpo */}
              {isCover && i + 1 < project.pages.length && (
                <div
                  className="flex items-center px-1 text-evr-muted text-xs select-none"
                  aria-hidden
                >
                  │
                </div>
              )}

              {/* Separador entre pares de spreads (solo si NO están unidos) */}
              {!isCover &&
                i > 0 &&
                i % 2 === 0 &&
                i + 1 < project.pages.length &&
                !project.pages[i - 1]?.spanNext &&
                !p.spanNext && (
                  <div
                    className="flex items-center px-1 text-evr-muted text-[10px] select-none"
                    aria-hidden
                  >
                    ·
                  </div>
                )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
