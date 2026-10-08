'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useStore } from '@/src/store/projectStore';
import { fileToPhoto } from '@/src/utils/imageProxy';
import { Star, Trash2, Upload, CheckSquare, Square } from 'lucide-react';

export function PhotoLibrary() {
  const photos = useStore(s => s.history.present.photos);
  const importPhotos = useStore(s => s.importPhotos);
  const removePhoto = useStore(s => s.removePhoto);
  const toggleFavorite = useStore(s => s.toggleFavorite);
  const assignPhoto = useStore(s => s.assignPhoto);
  const selectedSlotId = useStore(s => s.ui.selectedSlotId);

  const [dragOver, setDragOver] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  // Suscribimos a `pages` (referencia estable del array en el store)
  const pages = useStore(s => s.history.present.pages);

  // Derivamos el Set de fotos usadas con useMemo → no se recrea en cada render
  const usedIds = useMemo(() => {
    const set = new Set<string>();
    pages.forEach(p => p.slots.forEach(sl => sl.photoId && set.add(sl.photoId)));
    return set;
  }, [pages]);

  // -------------------------------------------------------------
  // Importar archivos
  // -------------------------------------------------------------
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (arr.length === 0) return;
    const converted = await Promise.all(arr.map(fileToPhoto));
    importPhotos(converted);
  }, [importPhotos]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  // -------------------------------------------------------------
  // Selección (clic, Ctrl/Cmd, Shift, checkbox)
  // -------------------------------------------------------------
  const handlePhotoClick = (photoId: string, index: number, e: React.MouseEvent) => {
    // Comportamiento clásico: si hay slot seleccionado y no hay multi-selección,
    // un click simple asigna la foto a ese slot.
    if (!e.shiftKey && !e.ctrlKey && !e.metaKey && selectedIds.size === 0 && selectedSlotId) {
      assignPhoto(selectedSlotId, photoId);
      return;
    }

    setSelectedIds(prev => {
      const next = new Set(prev);

      if (e.shiftKey && lastClickedIndex !== null) {
        // Rango entre el último clic y el actual
        const [from, to] = [lastClickedIndex, index].sort((a, b) => a - b);
        for (let i = from; i <= to; i++) next.add(photos[i].id);
      } else if (e.ctrlKey || e.metaKey) {
        // Toggle individual
        if (next.has(photoId)) next.delete(photoId);
        else next.add(photoId);
      } else {
        // Clic simple: selección única (o limpiar si ya era el único)
        if (next.size === 1 && next.has(photoId)) next.clear();
        else {
          next.clear();
          next.add(photoId);
        }
      }
      return next;
    });

    setLastClickedIndex(index);
  };

  const toggleSelectOne = (photoId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  // -------------------------------------------------------------
  // Drag: si la foto agarrada está seleccionada, arrastra toda la selección
  // -------------------------------------------------------------
  const handleDragStart = (photoId: string, e: React.DragEvent) => {
    const ids = selectedIds.has(photoId) ? Array.from(selectedIds) : [photoId];

    // Grupo (JSON)
    e.dataTransfer.setData('application/x-evr-photos', JSON.stringify(ids));
    // Individual (compatibilidad con drop handlers existentes)
    e.dataTransfer.setData('application/x-evr-photo', photoId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      className="w-52 lg:w-64 bg-evr-panel border-r border-evr-border flex flex-col shrink-0"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      {/* ---------- Cabecera ---------- */}
      <div className="p-3 border-b border-evr-border flex items-center justify-between">
        <div className="text-xs font-semibold text-evr-muted uppercase tracking-wide">
          Biblioteca ({photos.length})
        </div>
        <button
          className="btn-ghost p-1"
          onClick={() => fileInput.current?.click()}
          title="Importar fotos"
        >
          <Upload size={14} />
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* ---------- Barra de selección ---------- */}
      {selectedIds.size > 0 && (
        <div className="px-3 py-1.5 border-b border-evr-border flex items-center justify-between bg-evr-accent/10">
          <div className="text-[11px] text-evr-accent font-medium">
            {selectedIds.size} seleccionada{selectedIds.size !== 1 ? 's' : ''}
          </div>
          <button
            className="text-[10px] text-evr-muted hover:text-evr-text"
            onClick={clearSelection}
            title="Limpiar selección"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* ---------- Grid de fotos ---------- */}
      <div className={`flex-1 overflow-y-auto scroll-thin p-2 ${dragOver ? 'bg-evr-hover' : ''}`}>
        {photos.length === 0 && (
          <div className="text-center text-evr-muted text-xs py-8 px-2 leading-relaxed">
            Arrastra fotografías aquí<br />
            o haz clic en <Upload size={11} className="inline" /> para importar
          </div>
        )}
        <div className="grid grid-cols-2 gap-1.5">
          {photos.map((p, i) => {
            const isSelected = selectedIds.has(p.id);
            const isUsed = usedIds.has(p.id);
            const canClickAssign =
              !isSelected &&
              selectedIds.size === 0 &&
              !!selectedSlotId;

            return (
              <div
                key={p.id}
                className={`relative group aspect-square rounded overflow-hidden border cursor-pointer ${
                  isSelected
                    ? 'border-evr-accent ring-2 ring-evr-accent/60'
                    : isUsed
                    ? 'border-evr-accent/60'
                    : 'border-evr-border'
                } ${canClickAssign ? 'hover:border-evr-accent' : ''}`}
                draggable
                onDragStart={e => handleDragStart(p.id, e)}
                onClick={e => handlePhotoClick(p.id, i, e)}
                title={`${p.name} (${p.width}×${p.height})`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.proxyUrl}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Indicador de foto usada (sin selección activa) */}
                {isUsed && !isSelected && (
                  <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-evr-accent border border-black/40" />
                )}

                {/* Checkbox de selección (esquina superior izquierda) */}
                <button
                  className={`absolute top-1 left-1 w-4 h-4 rounded flex items-center justify-center ${
                    isSelected
                      ? 'bg-evr-accent text-black'
                      : 'bg-black/40 text-white/70 opacity-0 group-hover:opacity-100'
                  }`}
                  onClick={e => {
                    e.stopPropagation();
                    toggleSelectOne(p.id);
                  }}
                  title={isSelected ? 'Quitar de la selección' : 'Añadir a la selección'}
                >
                  {isSelected ? <CheckSquare size={10} /> : <Square size={10} />}
                </button>

                {/* Botones de acción (hover) */}
                <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100">
                  <button
                    className={`w-5 h-5 rounded bg-black/60 hover:bg-black/80 flex items-center justify-center ${
                      p.favorite ? 'text-evr-accent' : 'text-white'
                    }`}
                    onClick={e => { e.stopPropagation(); toggleFavorite(p.id); }}
                    title="Favorito"
                  >
                    <Star size={11} fill={p.favorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    className="w-5 h-5 rounded bg-black/60 hover:bg-red-600 flex items-center justify-center text-white"
                    onClick={e => { e.stopPropagation(); removePhoto(p.id); }}
                    title="Eliminar"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- Ayuda inferior ---------- */}
      <div className="p-2 border-t border-evr-border text-[10px] text-evr-muted leading-relaxed">
        {selectedIds.size > 0 ? (
          <>
            Arrastra la selección a una página para colocar las{' '}
            {selectedIds.size} foto{selectedIds.size !== 1 ? 's' : ''} en slots vacíos.
          </>
        ) : selectedSlotId ? (
          <>Haz clic en una foto para colocarla en el slot seleccionado.</>
        ) : (
          <>
            Clic = seleccionar · Ctrl/Cmd+clic = añadir · Shift+clic = rango<br />
            Arrastra una o varias fotos a la hoja.
          </>
        )}
      </div>
    </div>
  );
}