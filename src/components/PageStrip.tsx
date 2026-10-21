'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useStore, useAlbumSize } from '@/src/store/projectStore';
import {
  Plus, Copy, Trash2, BookOpen, ArrowLeftRight,
  ChevronLeft, ChevronRight, LayoutGrid
} from 'lucide-react';

export function PageStrip() {
  const project = useStore(s => s.history.present);
  const currentIndex = project.currentPageIndex;
  const goToPage = useStore(s => s.goToPage);
  const addPage = useStore(s => s.addPage);
  const addSpread = useStore(s => s.addSpread);
  const duplicatePage = useStore(s => s.duplicatePage);
  const deletePage = useStore(s => s.deletePage);
  const togglePageSpan = useStore(s => s.togglePageSpan);
  const setUI = useStore(s => s.setUI);
  
  // ✅ NUEVO: Acción de reordenar
  const reorderPages = useStore(s => s.reorderPages);

  const size = useAlbumSize();

  // -------------------------------------------------------------
  // Refs para scroll de la tira de miniaturas
  // -------------------------------------------------------------
  const stripRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // ✅ NUEVO: Estado para el feedback visual del Drag & Drop
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const canDelete =
    project.pages.length > 1 && project.pages[currentIndex]?.kind !== 'cover';

  const currentPage = project.pages[currentIndex];
  const canSpan =
    !!currentPage &&
    currentPage.kind !== 'cover' &&
    currentIndex % 2 === 1;

  // -------------------------------------------------------------
  // Auto-scroll: cuando cambia la página activa, centrarla en la vista
  // -------------------------------------------------------------
  useEffect(() => {
    const container = stripRef.current;
    const active = currentPage ? itemRefs.current[currentPage.id] : null;
    if (!container || !active) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const isOutLeft = activeRect.left < containerRect.left;
    const isOutRight = activeRect.right > containerRect.right;

    if (isOutLeft || isOutRight) {
      active.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [currentIndex, currentPage?.id]);

  // -------------------------------------------------------------
  // Desplazamiento manual con los botones ◀ / ▶
  // -------------------------------------------------------------
  const scrollByAmount = (dir: 'left' | 'right') => {
    const container = stripRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.7;
    container.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  // -------------------------------------------------------------
  // Handlers del Drag & Drop
  // -------------------------------------------------------------
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      reorderPages(sourceIndex, targetIndex);
    }
  };

  return (
    <div className="h-28 md:h-36 bg-evr-panel border-t border-evr-border flex flex-col shrink-0">
      {/* ---------- Cabecera con acciones ---------- */}
      <div className="flex items-center justify-between px-3 py-1 border-b border-evr-border">
        <div className="text-[10px] font-semibold text-evr-muted uppercase tracking-wide">
          Páginas ({project.pages.length})
        </div>
        <div className="flex gap-1">
          {/* ✅ NUEVO: Botón para abrir vista de cuadrícula */}
          <button
            className="btn-ghost p-1"
            onClick={() => setUI({ gridViewOpen: true })}
            title="Ver todas las páginas"
          >
            <LayoutGrid size={13} />
          </button>

          <div className="w-px h-4 bg-evr-border mx-1 self-center" />

          {/* Flechas de scroll */}
          <button
            className="btn-ghost p-1"
            onClick={() => scrollByAmount('left')}
            title="Desplazar páginas a la izquierda"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            className="btn-ghost p-1"
            onClick={() => scrollByAmount('right')}
            title="Desplazar páginas a la derecha"
          >
            <ChevronRight size={13} />
          </button>

          <div className="w-px h-4 bg-evr-border mx-1 self-center" />

          {/* Unir / separar páginas */}
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
            title={
              canDelete
                ? 'Eliminar página actual'
                : 'No se puede eliminar (portada o única página)'
            }
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* ---------- Tira de miniaturas con scroll ---------- */}
      <div
        ref={stripRef}
        className="flex-1 flex gap-1 p-2 overflow-x-auto overflow-y-hidden scroll-thin items-stretch"
      >
        {project.pages.map((p, i) => {
          const isCover = p.kind === 'cover';
          const w = size.widthIn * 0.55;
          const h = size.heightIn * 0.55;
          const isActive = i === currentIndex;
          const isRightSideActive =
            i === currentIndex + 1 && !isCover && currentIndex > 0;

          const isSpannedByPrev =
            !isCover && project.pages[i - 1]?.spanNext === true;
          const spansNext = !isCover && p.spanNext === true;

          const label = isCover
            ? 'PORTADA'
            : spansNext
            ? `PÁG ${i} ↔ ${i + 1}`
            : isSpannedByPrev
            ? `PÁG ${i} (parte de ${i - 1})`
            : `${i}`;

          // Determinar estilo del borde (añadimos el estado de dragOverIndex)
          let borderClass = 'border-evr-border hover:border-evr-muted';
          if (dragOverIndex === i) {
            borderClass = 'border-blue-500 ring-2 ring-blue-500/50 scale-105';
          } else if (isActive) {
            borderClass = 'border-evr-accent';
          } else if (spansNext) {
            borderClass = 'border-evr-accent/60 border-dashed';
          } else if (isSpannedByPrev) {
            borderClass = 'border-evr-accent/30 border-dashed';
          } else if (isRightSideActive) {
            borderClass = 'border-evr-accent/40';
          }

          return (
            <React.Fragment key={p.id}>
              <button
                ref={el => {
                  itemRefs.current[p.id] = el;
                }}
                className={`relative shrink-0 rounded overflow-hidden border-2 transition-all duration-150 ${borderClass}`}
                style={{ width: w * 8, height: h * 8 }}
                onClick={() => goToPage(i)}
                title={isCover ? 'Portada' : `Página ${i}`}
                // ✅ NUEVO: Atributos de Drag & Drop
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, i)}
              >
                <div
                  className="w-full h-full relative pointer-events-none"
                  style={{ background: p.background || '#ffffff' }}
                >
                  {p.slots.map(sl => {
                    const photo = sl.photoId
                      ? project.photos.find(ph => ph.id === sl.photoId)
                      : null;

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