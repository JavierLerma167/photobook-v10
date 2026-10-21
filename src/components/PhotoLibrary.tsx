'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useStore } from '@/src/store/projectStore';
import { fileToPhoto } from '@/src/utils/imageProxy';
import {
  Star, Trash2, Upload, CheckSquare, Square,
  Folder as FolderIcon, FolderPlus, Pencil, Check, X, ChevronDown
} from 'lucide-react';

export function PhotoLibrary() {
  const photos = useStore(s => s.history.present.photos);
  const folders = useStore(s => s.history.present.folders);
  const importPhotos = useStore(s => s.importPhotos);
  const removePhoto = useStore(s => s.removePhoto);
  const toggleFavorite = useStore(s => s.toggleFavorite);
  const assignPhoto = useStore(s => s.assignPhoto);
  const selectedSlotId = useStore(s => s.ui.selectedSlotId);

  // ✅ Acciones de carpetas
  const addFolder = useStore(s => s.addFolder);
  const renameFolder = useStore(s => s.renameFolder);
  const deleteFolder = useStore(s => s.deleteFolder);
  const movePhotoToFolder = useStore(s => s.movePhotoToFolder);

  // ✅ Setter para el estado global de carga
  const setUI = useStore(s => s.setUI);

  const [dragOver, setDragOver] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  // ✅ Estado de carpetas
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [moveMenuPhotoId, setMoveMenuPhotoId] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  // Suscribimos a `pages` (referencia estable del array en el store)
  const pages = useStore(s => s.history.present.pages);

  // Derivamos el Set de fotos usadas con useMemo → no se recrea en cada render
  const usedIds = useMemo(() => {
    const set = new Set<string>();
    pages.forEach(p => p.slots.forEach(sl => sl.photoId && set.add(sl.photoId)));
    return set;
  }, [pages]);

  // ✅ Filtramos las fotos por la carpeta activa
  const filteredPhotos = useMemo(() => {
    if (activeFolderId === null) return photos; // "Todas"
    return photos.filter(p => (p.folderId ?? null) === activeFolderId);
  }, [photos, activeFolderId]);

  // -------------------------------------------------------------
  // Importar archivos
  // -------------------------------------------------------------
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (arr.length === 0) return;

    // ✅ NUEVO: Activar el loader global antes de procesar
    setUI({
      isLoading: true,
      loadingMessage: `Importando ${arr.length} foto${arr.length !== 1 ? 's' : ''}…`,
    });

    try {
      // Convertimos todas las imágenes a Base64 (esto puede tardar)
      const converted = await Promise.all(arr.map(fileToPhoto));

      // ✅ Si hay una carpeta activa, las fotos nuevas se añaden a ella
      const withFolder = converted.map(p => ({
        ...p,
        folderId: activeFolderId && activeFolderId !== '__unfiled__' ? activeFolderId : null,
      }));
      importPhotos(withFolder);
    } catch (error) {
      console.error('Error al importar fotos:', error);
      alert('Hubo un problema al importar las fotos. Intenta con imágenes más ligeras.');
    } finally {
      // ✅ NUEVO: Ocultar el loader global (siempre, aunque haya error)
      setUI({ isLoading: false, loadingMessage: '' });
    }
  }, [importPhotos, activeFolderId, setUI]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  // -------------------------------------------------------------
  // Selección (clic, Ctrl/Cmd, Shift, checkbox)
  // -------------------------------------------------------------
  const handlePhotoClick = (photoId: string, index: number, e: React.MouseEvent) => {
    if (!e.shiftKey && !e.ctrlKey && !e.metaKey && selectedIds.size === 0 && selectedSlotId) {
      assignPhoto(selectedSlotId, photoId);
      return;
    }

    setSelectedIds(prev => {
      const next = new Set(prev);

      if (e.shiftKey && lastClickedIndex !== null) {
        const [from, to] = [lastClickedIndex, index].sort((a, b) => a - b);
        for (let i = from; i <= to; i++) next.add(filteredPhotos[i].id);
      } else if (e.ctrlKey || e.metaKey) {
        if (next.has(photoId)) next.delete(photoId);
        else next.add(photoId);
      } else {
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
  // Drag
  // -------------------------------------------------------------
  const handleDragStart = (photoId: string, e: React.DragEvent) => {
    const ids = selectedIds.has(photoId) ? Array.from(selectedIds) : [photoId];
    e.dataTransfer.setData('application/x-evr-photos', JSON.stringify(ids));
    e.dataTransfer.setData('application/x-evr-photo', photoId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // -------------------------------------------------------------
  // Handlers de carpetas
  // -------------------------------------------------------------
  const handleCreateFolder = () => {
    const id = addFolder();
    const folder = useStore.getState().history.present.folders.find(f => f.id === id);
    setEditingFolderId(id);
    setEditingFolderName(folder?.name || '');
  };

  const confirmRename = () => {
    if (editingFolderId && editingFolderName.trim()) {
      renameFolder(editingFolderId, editingFolderName.trim());
    }
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  const handleDeleteActiveFolder = () => {
    if (!activeFolderId || activeFolderId === '__unfiled__') return;
    const folder = folders.find(f => f.id === activeFolderId);
    if (!folder) return;
    if (confirm(`¿Eliminar la carpeta "${folder.name}"? Las fotos no se borrarán, quedarán sin carpeta.`)) {
      deleteFolder(activeFolderId);
      setActiveFolderId(null);
    }
  };

  // ✅ Mover la selección actual a una carpeta
  const moveSelectionTo = (folderId: string | null) => {
    if (selectedIds.size === 0) return;
    movePhotoToFolder(Array.from(selectedIds), folderId);
    clearSelection();
  };

  const activeFolder =
    activeFolderId && activeFolderId !== '__unfiled__'
      ? folders.find(f => f.id === activeFolderId) ?? null
      : null;

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
          Biblioteca ({filteredPhotos.length})
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

      {/* ✅ ---------- Barra de carpetas ---------- */}
      <div className="px-3 py-2 border-b border-evr-border space-y-2">
        <div className="flex items-center gap-1">
          <div className="relative flex-1">
            <select
              className="input w-full text-xs pr-6 appearance-none"
              value={activeFolderId ?? ''}
              onChange={e => setActiveFolderId(e.target.value || null)}
            >
              <option value="">Todas las fotos</option>
              <option value="__unfiled__">Sin carpeta</option>
              {folders.length > 0 && (
                <optgroup label="Carpetas">
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </optgroup>
              )}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-evr-muted pointer-events-none"
            />
          </div>
          <button
            className="btn-ghost p-1"
            onClick={handleCreateFolder}
            title="Crear nueva carpeta"
          >
            <FolderPlus size={14} />
          </button>
          {activeFolder && (
            <>
              <button
                className="btn-ghost p-1"
                onClick={() => {
                  setEditingFolderId(activeFolder.id);
                  setEditingFolderName(activeFolder.name);
                }}
                title="Renombrar carpeta"
              >
                <Pencil size={13} />
              </button>
              <button
                className="btn-ghost p-1 text-red-400"
                onClick={handleDeleteActiveFolder}
                title="Eliminar carpeta"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>

        {/* ✅ Input inline de renombrado */}
        {editingFolderId && (
          <div className="flex items-center gap-1">
            <input
              type="text"
              className="input text-xs flex-1"
              value={editingFolderName}
              onChange={e => setEditingFolderName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') confirmRename();
                if (e.key === 'Escape') {
                  setEditingFolderId(null);
                  setEditingFolderName('');
                }
              }}
              autoFocus
            />
            <button
              className="btn-ghost p-1 text-green-400"
              onClick={confirmRename}
              title="Guardar"
            >
              <Check size={13} />
            </button>
            <button
              className="btn-ghost p-1 text-red-400"
              onClick={() => {
                setEditingFolderId(null);
                setEditingFolderName('');
              }}
              title="Cancelar"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {activeFolder && (
          <div className="text-[10px] text-evr-muted flex items-center gap-1">
            <FolderIcon size={11} />
            <span className="truncate">Carpeta: {activeFolder.name}</span>
          </div>
        )}
      </div>

      {/* ---------- Barra de selección ---------- */}
      {selectedIds.size > 0 && (
        <div className="px-3 py-1.5 border-b border-evr-border flex items-center justify-between bg-evr-accent/10">
          <div className="text-[11px] text-evr-accent font-medium">
            {selectedIds.size} seleccionada{selectedIds.size !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1">
            <button
              className="text-[10px] text-evr-muted hover:text-evr-text"
              onClick={() => moveSelectionTo(null)}
              title="Mover selección a 'Sin carpeta'"
            >
              Sin carpeta
            </button>
            <span className="text-evr-muted">·</span>
            <button
              className="text-[10px] text-evr-muted hover:text-evr-text"
              onClick={clearSelection}
              title="Limpiar selección"
            >
              Limpiar
            </button>
          </div>
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
        {photos.length > 0 && filteredPhotos.length === 0 && (
          <div className="text-center text-evr-muted text-xs py-8 px-2 leading-relaxed">
            No hay fotos en esta carpeta.<br />
            Arrastra fotos aquí o cámbialas de carpeta.
          </div>
        )}
        <div className="grid grid-cols-2 gap-1.5">
          {filteredPhotos.map((p, i) => {
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

                {isUsed && !isSelected && (
                  <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-evr-accent border border-black/40" />
                )}

                {/* Checkbox de selección */}
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

                {/* Botones de acción */}
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
                    className="w-5 h-5 rounded bg-black/60 hover:bg-blue-600 flex items-center justify-center text-white"
                    onClick={e => {
                      e.stopPropagation();
                      setMoveMenuPhotoId(moveMenuPhotoId === p.id ? null : p.id);
                    }}
                    title="Mover a carpeta"
                  >
                    <FolderIcon size={11} />
                  </button>
                  <button
                    className="w-5 h-5 rounded bg-black/60 hover:bg-red-600 flex items-center justify-center text-white"
                    onClick={e => { e.stopPropagation(); removePhoto(p.id); }}
                    title="Eliminar"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>

                {/* ✅ Submenú de mover a carpeta */}
                {moveMenuPhotoId === p.id && (
                  <div
                    className="absolute top-7 right-1 z-20 bg-evr-panel border border-evr-border rounded shadow-xl py-1 min-w-[140px] text-[11px]"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="px-2 py-1 text-[9px] text-evr-muted uppercase tracking-wide">
                      Mover a…
                    </div>
                    <button
                      className={`w-full text-left px-2 py-1 hover:bg-evr-hover ${
                        (p.folderId ?? null) === null ? 'text-evr-accent' : ''
                      }`}
                      onClick={() => {
                        movePhotoToFolder([p.id], null);
                        setMoveMenuPhotoId(null);
                      }}
                    >
                      Sin carpeta
                    </button>
                    {folders.map(f => (
                      <button
                        key={f.id}
                        className={`w-full text-left px-2 py-1 hover:bg-evr-hover truncate ${
                          p.folderId === f.id ? 'text-evr-accent' : ''
                        }`}
                        onClick={() => {
                          movePhotoToFolder([p.id], f.id);
                          setMoveMenuPhotoId(null);
                        }}
                      >
                        {f.name}
                      </button>
                    ))}
                    {folders.length === 0 && (
                      <div className="px-2 py-1 text-evr-muted text-[10px] italic">
                        No hay carpetas
                      </div>
                    )}
                  </div>
                )}
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