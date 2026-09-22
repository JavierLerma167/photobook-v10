'use client';

import React, { useMemo, useState } from 'react';
import { useStore } from '@/src/store/projectStore';
import { LayoutTemplate, Wand2, RefreshCw } from 'lucide-react';
import { Template } from '@/src/types';
import { suggestLayouts } from '@/src/engine/layoutEngine';

/**
 * Panel flotante que aparece sobre el canvas con sugerencias de layout.
 * - Si la página está vacía, propone plantillas aleatorias para la cantidad de fotos pendientes.
 * - Botón "Otra composición" (refresh) para regenerar las sugerencias.
 * - Botón "Shuffle" para barajar las fotos ya colocadas en el spread.
 */
export function LayoutSuggestions() {
  const project = useStore(s => s.history.present);
  const page = project.pages[project.currentPageIndex];
  const templates = useStore(s => s.templates);
  const applyTemplateToPage = useStore(s => s.applyTemplateToPage);
  const assignPhoto = useStore(s => s.assignPhoto);
  const setUI = useStore(s => s.setUI);
  const shuffleCurrentPage = useStore(s => s.shuffleCurrentPage);

  // Contador para forzar regeneración de sugerencias
  const [refreshKey, setRefreshKey] = useState(0);

  // Detectar fotos ya presentes en la página (asignadas a slots)
  const currentPhotoIds = page.slots.map(s => s.photoId).filter(Boolean) as string[];

  // Detectar fotos pendientes de colocar (importadas pero sin slot asignado)
  const usedElsewhere = useMemo(() => {
    const set = new Set<string>();
    project.pages.forEach(p => p.slots.forEach(sl => sl.photoId && set.add(sl.photoId)));
    return set;
  }, [project.pages]);
  const pendingPhotos = project.photos.filter(p => !usedElsewhere.has(p.id));

  // Determinar cuántas fotos considerar para sugerir
  const isPageEmpty = currentPhotoIds.length === 0;
  const n = isPageEmpty
    ? Math.min(pendingPhotos.length, 8)
    : currentPhotoIds.length;

  // Generar candidatas aleatorias (se recalcula cuando cambia refreshKey, n, o las plantillas)
  const candidates = useMemo<Template[]>(() => {
    if (page.kind === 'cover') return [];
    if (n === 0) return [];

    // Usar las fotos pendientes (o las del proyecto si no hay pendientes)
    const pool = pendingPhotos.length > 0
      ? pendingPhotos
      : project.photos.slice(0, n);

    // suggestLayouts con random=true → combinación aleatoria de plantillas afines
    return suggestLayouts(pool, templates, 6, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, n, templates, page.kind]);

  // Ocultar si no hay fotos en ningún lado
  if (project.photos.length === 0) return null;

  // Solo mostramos el panel si la página está vacía y hay fotos pendientes
  const show = isPageEmpty && n > 0;
  if (!show) return null;

  // Aplicar plantilla Y colocar las fotos pendientes en los slots en orden
  const applyWithPhotos = (template: Template) => {
    applyTemplateToPage(template.id);
    // Las fotos se colocan en el siguiente tick, tras aplicar la plantilla
    setTimeout(() => {
      const freshPage = useStore.getState().history.present.pages[
        useStore.getState().history.present.currentPageIndex
      ];
      const pool = pendingPhotos.length > 0 ? pendingPhotos : project.photos;
      freshPage.slots.forEach((sl, i) => {
        if (i < pool.length && !sl.photoId) {
          assignPhoto(sl.id, pool[i].id);
        }
      });
    }, 0);
  };

  return (
    <div className="absolute left-4 top-4 z-20 w-64 bg-evr-panel/95 backdrop-blur border border-evr-border rounded-lg shadow-2xl">
      <div className="p-3 border-b border-evr-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutTemplate size={14} className="text-evr-accent" />
          <div>
            <div className="text-xs font-semibold">Sugerencias</div>
            <div className="text-[10px] text-evr-muted">
              {n} foto{n !== 1 ? 's' : ''} · página vacía
            </div>
          </div>
        </div>
        <div className="flex gap-0.5">
          <button
            className="btn-ghost p-1"
            onClick={() => setRefreshKey(k => k + 1)}
            title="Otras sugerencias"
          >
            <RefreshCw size={12} />
          </button>
          <button
            className="btn-ghost p-1 text-[10px]"
            onClick={() => setUI({ templateGalleryOpen: true })}
            title="Ver todas las plantillas"
          >
            Ver todas
          </button>
        </div>
      </div>

      <div className="p-2 grid grid-cols-2 gap-1.5">
        {candidates.map(t => (
          <button
            key={t.id}
            onClick={() => applyWithPhotos(t)}
            className="aspect-[1.4/1] bg-white rounded overflow-hidden border border-evr-border hover:border-evr-accent transition-colors relative"
            title={t.name}
          >
            {t.slots.map((s, i) => (
              <div
                key={i}
                className="absolute bg-neutral-300 border border-neutral-400"
                style={{
                  left: `${Math.min(s.x, 100)}%`,
                  top: `${s.y}%`,
                  width: `${Math.min(s.w, 100 - Math.min(s.x, 100))}%`,
                  height: `${s.h}%`
                }}
              />
            ))}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] py-0.5 px-1 truncate">
              {t.name}
            </div>
          </button>
        ))}
        {candidates.length === 0 && (
          <div className="col-span-2 text-center text-[10px] text-evr-muted py-4">
            Sin sugerencias disponibles
          </div>
        )}
      </div>

      {pendingPhotos.length > 0 && (
        <div className="px-3 py-2 border-t border-evr-border flex items-center justify-between">
          <div className="text-[10px] text-evr-muted">
            {pendingPhotos.length} foto{pendingPhotos.length !== 1 ? 's' : ''} sin usar
          </div>
          <button
            className="btn-ghost p-1 text-[10px] flex items-center gap-1"
            onClick={() => shuffleCurrentPage()}
            title="Otra composición"
          >
            <Wand2 size={11} /> Shuffle
          </button>
        </div>
      )}
    </div>
  );
}
