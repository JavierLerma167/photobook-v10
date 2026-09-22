'use client';

import React, { useCallback, useMemo, useRef } from 'react';
import { useStore } from '@/src/store/projectStore';
import { fileToPhoto } from '@/src/utils/imageProxy';
import { Star, Trash2, Upload } from 'lucide-react';

export function PhotoLibrary() {
  const photos = useStore(s => s.history.present.photos);
  const importPhotos = useStore(s => s.importPhotos);
  const removePhoto = useStore(s => s.removePhoto);
  const toggleFavorite = useStore(s => s.toggleFavorite);
  const assignPhoto = useStore(s => s.assignPhoto);
  const selectedSlotId = useStore(s => s.ui.selectedSlotId);
  const [dragOver, setDragOver] = React.useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Suscribimos a `pages` (referencia estable del array en el store)
  const pages = useStore(s => s.history.present.pages);

  // Derivamos el Set de fotos usadas con useMemo → no se recrea en cada render
  const usedIds = useMemo(() => {
    const set = new Set<string>();
    pages.forEach(p => p.slots.forEach(sl => sl.photoId && set.add(sl.photoId)));
    return set;
  }, [pages]);

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

  const handlePhotoClick = (photoId: string) => {
    if (selectedSlotId) assignPhoto(selectedSlotId, photoId);
  };

  return (
    <div
      className="w-64 bg-evr-panel border-r border-evr-border flex flex-col shrink-0"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <div className="p-3 border-b border-evr-border flex items-center justify-between">
        <div className="text-xs font-semibold text-evr-muted uppercase tracking-wide">
          Biblioteca ({photos.length})
        </div>
        <button className="btn-ghost p-1" onClick={() => fileInput.current?.click()} title="Importar fotos">
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

      <div className={`flex-1 overflow-y-auto scroll-thin p-2 ${dragOver ? 'bg-evr-hover' : ''}`}>
        {photos.length === 0 && (
          <div className="text-center text-evr-muted text-xs py-8 px-2 leading-relaxed">
            Arrastra fotografías aquí<br />o haz clic en <Upload size={11} className="inline" /> para importar
          </div>
        )}
        <div className="grid grid-cols-2 gap-1.5">
          {photos.map(p => (
            <div
              key={p.id}
              className={`relative group aspect-square rounded overflow-hidden border ${
                usedIds.has(p.id) ? 'border-evr-accent/60' : 'border-evr-border'
              } ${selectedSlotId ? 'cursor-pointer hover:border-evr-accent' : ''}`}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('application/x-evr-photo', p.id);
              }}
              onClick={() => handlePhotoClick(p.id)}
              title={`${p.name} (${p.width}×${p.height})`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.proxyUrl} alt={p.name} className="w-full h-full object-cover" draggable={false} />
              {usedIds.has(p.id) && (
                <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-evr-accent border border-black/40" />
              )}
              <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100">
                <button
                  className={`w-5 h-5 rounded bg-black/60 hover:bg-black/80 flex items-center justify-center ${p.favorite ? 'text-evr-accent' : 'text-white'}`}
                  onClick={e => { e.stopPropagation(); toggleFavorite(p.id); }}
                >
                  <Star size={11} fill={p.favorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  className="w-5 h-5 rounded bg-black/60 hover:bg-red-600 flex items-center justify-center text-white"
                  onClick={e => { e.stopPropagation(); removePhoto(p.id); }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSlotId && (
        <div className="p-2 border-t border-evr-border text-[11px] text-evr-accent bg-evr-accent/5">
          Haz clic en una foto para colocarla en el slot seleccionado
        </div>
      )}
    </div>
  );
}
