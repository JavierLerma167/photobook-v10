'use client';

import React, { useRef, useState } from 'react';
import { useStore } from '@/src/store/projectStore';
import { Slot, Page } from '@/src/types';
import { fileToPhoto } from '@/src/utils/imageProxy';
import { pushHistory } from '@/src/engine/history';
import {
  Trash2, Copy, Clipboard, ClipboardPaste, ImageDown,
} from 'lucide-react';

interface Props {
  slot: Slot;
  page: Page;
  pageWidth: number;
  pageHeight: number;
  offsetX: number;
  viewWidth: number;
  selected: boolean;
}

type HandlePos = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const SNAP_THRESHOLD = 1.2;
const DRAG_START_THRESHOLD = 3;

export function SlotView({ slot, page, pageWidth, pageHeight, offsetX, viewWidth, selected }: Props) {
  const photos = useStore(s => s.history.present.photos);
  const allSlots = page.slots;
  const updateSlot = useStore(s => s.updateSlot);
  const clearSlot = useStore(s => s.clearSlot);
  const assignPhoto = useStore(s => s.assignPhoto);
  const select = useStore(s => s.select);
  const toggleSlotSelection = useStore(s => s.toggleSlotSelection);
  const selectedIds = useStore(s => s.ui.selectedSlotIds);
  const selectedSlotId = useStore(s => s.ui.selectedSlotId);

  // ✅ Acciones del menú contextual
  const duplicateSlot = useStore(s => s.duplicateSlot);
  const copySlot = useStore(s => s.copySlot);
  const pasteSlot = useStore(s => s.pasteSlot);
  const slotClipboard = useStore(s => s.ui.slotClipboard);

  const [dragOver, setDragOver] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const fileInput = useRef<HTMLInputElement>(null);

  const photo = slot.photoId ? photos.find(p => p.id === slot.photoId) : null;

  const isMultiSelected = selectedIds.length > 1 && selectedIds.includes(slot.id);
  const isPrimary = selectedSlotId === slot.id;

  const left = (slot.x / 100) * pageWidth;
  const top = (slot.y / 100) * pageHeight;
  const w = (slot.w / 100) * pageWidth;
  const h = (slot.h / 100) * pageHeight;

  // -------------------------------------------------------------
  // Drag / Drop de fotos desde la biblioteca
  //
  // Acepta dos formatos:
  //   - application/x-evr-photos → JSON array de IDs (grupo)
  //   - application/x-evr-photo  → un solo ID (individual)
  //
  // Comportamiento: SIEMPRE crea slots NUEVOS a partir de este slot,
  // sin reemplazar su foto. Los nuevos heredan el tamaño de este slot.
  // -------------------------------------------------------------
  const handleDragOver = (e: React.DragEvent) => {
    if (
      e.dataTransfer.types.includes('application/x-evr-photo') ||
      e.dataTransfer.types.includes('application/x-evr-photos')
    ) {
      e.preventDefault();
      setDragOver(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    // 1) Grupo de fotos
    const groupRaw = e.dataTransfer.getData('application/x-evr-photos');
    if (groupRaw) {
      try {
        const ids: string[] = JSON.parse(groupRaw);
        if (ids.length > 0) {
          createSlotsFromSlot(page, slot, ids);
          return;
        }
      } catch {
        // JSON inválido → caer al individual
      }
    }

    // 2) Individual
    const photoId = e.dataTransfer.getData('application/x-evr-photo');
    if (photoId) {
      createSlotsFromSlot(page, slot, [photoId]);
    }
  };

  // -------------------------------------------------------------
  // Menú contextual (clic derecho)
  // -------------------------------------------------------------
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);

    // Cerrar el menú al próximo clic en cualquier parte
    const close = () => {
      setMenuOpen(false);
      window.removeEventListener('mousedown', close);
      window.removeEventListener('contextmenu', close);
    };
    // Damos un tick para no capturar este mismo evento
    setTimeout(() => {
      window.addEventListener('mousedown', close);
      window.addEventListener('contextmenu', close);
    }, 0);
  };

  const handleContextAction = (
    action: 'delete' | 'duplicate' | 'replace' | 'copy' | 'paste',
  ) => {
    setMenuOpen(false);
    switch (action) {
      case 'delete':
        clearSlot(slot.id);
        break;
      case 'duplicate':
        duplicateSlot(slot.id);
        break;
      case 'copy':
        copySlot(slot.id);
        break;
      case 'paste':
        pasteSlot();
        break;
      case 'replace':
        fileInput.current?.click();
        break;
    }
  };

  // -------------------------------------------------------------
  // Cambiar la imagen del slot desde un archivo local
  // -------------------------------------------------------------
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newPhoto = await fileToPhoto(file);
    const importPhotos = useStore.getState().importPhotos;
    importPhotos([newPhoto]);
    assignPhoto(slot.id, newPhoto.id);
    e.target.value = '';
  };

  // -------------------------------------------------------------
  // Snapping
  // -------------------------------------------------------------
  const snapValue = (value: number, candidates: number[], threshold = SNAP_THRESHOLD): number => {
    let best = value;
    let bestDist = threshold;
    for (const c of candidates) {
      const d = Math.abs(value - c);
      if (d < bestDist) {
        best = c;
        bestDist = d;
      }
    }
    return best;
  };

  const computeSnapTargets = (excludeSelf: boolean) => {
    const xTargets: number[] = [0, 50, 100];
    const yTargets: number[] = [0, 50, 100];
    allSlots.forEach(s => {
      if (excludeSelf && s.id === slot.id) return;
      xTargets.push(s.x, s.x + s.w / 2, s.x + s.w);
      yTargets.push(s.y, s.y + s.h / 2, s.y + s.h);
    });
    return { xTargets, yTargets };
  };

  // -------------------------------------------------------------
  // startDrag: inicia el arrastre de N slots
  // -------------------------------------------------------------
  const startDrag = (initX: number, initY: number, ids: string[]) => {
    const isMultiDrag = ids.length > 1;

    const startPositions = ids
      .map(id => {
        const s = page.slots.find(x => x.id === id);
        return s ? { id, x: s.x, y: s.y, w: s.w, h: s.h } : null;
      })
      .filter(Boolean) as Array<{ id: string; x: number; y: number; w: number; h: number }>;

    if (startPositions.length === 0) return;

    const { xTargets, yTargets } = computeSnapTargets(true);

    const onMove = (ev: MouseEvent) => {
      const dxPct = ((ev.clientX - initX) / pageWidth) * 100;
      const dyPct = ((ev.clientY - initY) / pageHeight) * 100;
      const state = useStore.getState();

      if (isMultiDrag) {
        startPositions.forEach(p => {
          state.updateSlot(p.id, { x: p.x + dxPct, y: p.y + dyPct });
        });
        return;
      }

      const start = startPositions[0];
      let newX = start.x + dxPct;
      let newY = start.y + dyPct;

      const snapLeft = snapValue(newX, xTargets);
      const snapCenterX = snapValue(newX + start.w / 2, xTargets) - start.w / 2;
      const snapRight = snapValue(newX + start.w, xTargets) - start.w;
      newX = [snapLeft, snapCenterX, snapRight].reduce(
        (best, c) => (Math.abs(c - newX) < Math.abs(best - newX) ? c : best),
        newX,
      );

      const snapTop = snapValue(newY, yTargets);
      const snapCenterY = snapValue(newY + start.h / 2, yTargets) - start.h / 2;
      const snapBottom = snapValue(newY + start.h, yTargets) - start.h;
      newY = [snapTop, snapCenterY, snapBottom].reduce(
        (best, c) => (Math.abs(c - newY) < Math.abs(best - newY) ? c : best),
        newY,
      );

      state.updateSlot(start.id, {
        x: Math.max(-20, Math.min(120 - start.w, newX)),
        y: Math.max(-20, Math.min(120 - start.h, newY)),
      });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // -------------------------------------------------------------
  // Mover el slot (llamado desde el contenedor principal)
  // -------------------------------------------------------------
  const beginMove = (e: React.MouseEvent) => {
    if (slot.locked) return;
    e.stopPropagation();
    e.preventDefault();

    const isModifier = e.shiftKey || e.ctrlKey || e.metaKey;
    const isInMulti = selectedIds.length > 1 && selectedIds.includes(slot.id);

    // Caso A: modificador → decidir entre toggle o drag múltiple
    if (isModifier) {
      const startX = e.clientX;
      const startY = e.clientY;
      let didDrag = false;

      const onFirstMove = (ev: MouseEvent) => {
        const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
        if (dist > DRAG_START_THRESHOLD && !didDrag) {
          didDrag = true;
          window.removeEventListener('mousemove', onFirstMove);
          window.removeEventListener('mouseup', onFirstUp);

          const state = useStore.getState();
          const current = state.ui.selectedSlotIds;
          const toMove = current.includes(slot.id) ? current : [...current, slot.id];

          if (!current.includes(slot.id)) {
            state.toggleSlotSelection(slot.id);
          }

          startDrag(startX, startY, toMove);
        }
      };

      const onFirstUp = () => {
        window.removeEventListener('mousemove', onFirstMove);
        window.removeEventListener('mouseup', onFirstUp);
        if (!didDrag) {
          toggleSlotSelection(slot.id);
        }
      };

      window.addEventListener('mousemove', onFirstMove);
      window.addEventListener('mouseup', onFirstUp);
      return;
    }

    // Caso B: clic normal sobre slot ya en multi-selección → mover todos
    if (isInMulti) {
      startDrag(e.clientX, e.clientY, selectedIds);
      return;
    }

    // Caso C: clic normal → selección simple + mover
    select(slot.id, null);
    startDrag(e.clientX, e.clientY, [slot.id]);
  };

  // -------------------------------------------------------------
  // Redimensionar con 8 handles
  // -------------------------------------------------------------
  const beginResize = (e: React.MouseEvent, handle: HandlePos) => {
    if (slot.locked) return;

    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation();
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const start = { x: slot.x, y: slot.y, w: slot.w, h: slot.h };
    const { xTargets, yTargets } = computeSnapTargets(true);

    const onMove = (ev: MouseEvent) => {
      const dxPct = ((ev.clientX - startX) / pageWidth) * 100;
      const dyPct = ((ev.clientY - startY) / pageHeight) * 100;

      let x = start.x;
      let y = start.y;
      let newW = start.w;
      let newH = start.h;

      if (handle.includes('w')) {
        const rawX = start.x + dxPct;
        const snapped = snapValue(rawX, xTargets);
        const applied = Math.abs(snapped - rawX) < SNAP_THRESHOLD ? snapped : rawX;
        newW = start.w + (start.x - applied);
        x = applied;
      }
      if (handle.includes('e')) {
        const rawRight = start.x + start.w + dxPct;
        const snapped = snapValue(rawRight, xTargets);
        const applied = Math.abs(snapped - rawRight) < SNAP_THRESHOLD ? snapped : rawRight;
        newW = applied - start.x;
      }
      if (handle.includes('n')) {
        const rawY = start.y + dyPct;
        const snapped = snapValue(rawY, yTargets);
        const applied = Math.abs(snapped - rawY) < SNAP_THRESHOLD ? snapped : rawY;
        newH = start.h + (start.y - applied);
        y = applied;
      }
      if (handle.includes('s')) {
        const rawBottom = start.y + start.h + dyPct;
        const snapped = snapValue(rawBottom, yTargets);
        const applied = Math.abs(snapped - rawBottom) < SNAP_THRESHOLD ? snapped : rawBottom;
        newH = applied - start.y;
      }

      newW = Math.max(5, newW);
      newH = Math.max(5, newH);

      updateSlot(slot.id, { x, y, w: newW, h: newH });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // -------------------------------------------------------------
  // Pan interno de la foto (Alt + arrastrar dentro del slot con foto)
  // -------------------------------------------------------------
  const onPhotoMouseDown = (e: React.MouseEvent) => {
    if (!photo || slot.locked) return;
    if (!(e.altKey || e.shiftKey)) return;

    e.stopPropagation();
    e.preventDefault();
    select(slot.id, null);

    const startX = e.clientX;
    const startY = e.clientY;
    const startOffX = slot.offsetX;
    const startOffY = slot.offsetY;

    const onMove = (ev: MouseEvent) => {
      updateSlot(slot.id, {
        offsetX: Math.max(-1, Math.min(1, startOffX + ((ev.clientX - startX) / w) * 2)),
        offsetY: Math.max(-1, Math.min(1, startOffY + ((ev.clientY - startY) / h) * 2)),
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleCursors: Record<HandlePos, string> = {
    nw: 'nwse-resize',
    n: 'ns-resize',
    ne: 'nesw-resize',
    e: 'ew-resize',
    se: 'nwse-resize',
    s: 'ns-resize',
    sw: 'nesw-resize',
    w: 'ew-resize',
  };

  const showHandles = isPrimary && !slot.locked && !isMultiSelected;

  const ringClass = dragOver
    ? 'ring-2 ring-evr-accent'
    : isMultiSelected
    ? 'ring-2 ring-blue-400'
    : isPrimary
    ? 'ring-2 ring-evr-accent'
    : '';

  const slotBackground = slot.fit === 'contain' ? '#1a1d23' : '#f5f5f5';

  return (
    <>
      <div
        className={`absolute ${ringClass}`}
        style={{
          left,
          top,
          width: w,
          height: h,
          cursor: slot.locked ? 'not-allowed' : 'move',
        }}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onMouseDown={beginMove}
        onContextMenu={handleContextMenu}
        onDoubleClick={e => {
          e.stopPropagation();
          if (slot.photoId) clearSlot(slot.id);
        }}
      >
        <div
          className="w-full h-full overflow-hidden relative"
          style={{ background: slotBackground }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.proxyUrl}
              alt={photo.name}
              draggable={false}
              onMouseDown={onPhotoMouseDown}
              className="absolute select-none pointer-events-none inset-0"
              style={{
                width: '100%',
                height: '100%',
                objectFit: slot.fit,
                objectPosition: 'center',
                transform: `scale(${slot.zoom}) translate(${slot.offsetX * 20}%, ${slot.offsetY * 20}%) rotate(${slot.rotation}deg)`,
                transformOrigin: 'center',
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 border border-dashed border-neutral-300 pointer-events-none">
              Arrastra una foto
            </div>
          )}
        </div>

        {/* 8 handles de resize */}
        {showHandles && (
          <>
            {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as HandlePos[]).map(h => {
              const size = 12;
              const half = size / 2;
              const style: React.CSSProperties = {
                position: 'absolute',
                width: size,
                height: size,
                background: '#e8b04b',
                border: '2px solid #000',
                borderRadius: 2,
                boxShadow: '0 0 0 1px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.5)',
                cursor: handleCursors[h],
                zIndex: 999,
                pointerEvents: 'auto',
                userSelect: 'none',
              };
              if (h.includes('n')) style.top = -half;
              if (h.includes('s')) style.bottom = -half;
              if (h.includes('w')) style.left = -half;
              if (h.includes('e')) style.right = -half;
              if (h === 'n' || h === 's') {
                style.left = '50%';
                style.transform = 'translateX(-50%)';
              }
              if (h === 'e' || h === 'w') {
                style.top = '50%';
                style.transform = 'translateY(-50%)';
              }
              return (
                <div
                  key={h}
                  style={style}
                  onMouseDown={e => beginResize(e, h)}
                  onPointerDown={e => {
                    e.stopPropagation();
                  }}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Input oculto para "Cambiar imagen" */}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceFile}
      />

      {/* Menú contextual */}
      {menuOpen && (
        <div
          className="fixed z-[9999] bg-evr-panel border border-evr-border rounded shadow-2xl py-1 min-w-[180px]"
          style={{ left: menuPos.x, top: menuPos.y }}
          onMouseDown={e => e.stopPropagation()}
          onContextMenu={e => e.preventDefault()}
        >
          <MenuItem
            icon={<ImageDown size={13} />}
            label="Cambiar imagen…"
            onClick={() => handleContextAction('replace')}
          />
          <MenuItem
            icon={<Copy size={13} />}
            label="Duplicar slot"
            onClick={() => handleContextAction('duplicate')}
          />
          <MenuItem
            icon={<Clipboard size={13} />}
            label="Copiar"
            onClick={() => handleContextAction('copy')}
          />
          <MenuItem
            icon={<ClipboardPaste size={13} />}
            label="Pegar aquí"
            onClick={() => handleContextAction('paste')}
            disabled={!slotClipboard}
          />
          <div className="my-1 border-t border-evr-border" />
          <MenuItem
            icon={<Trash2 size={13} />}
            label="Borrar foto"
            onClick={() => handleContextAction('delete')}
            danger
            disabled={!slot.photoId}
          />
        </div>
      )}
    </>
  );
}

/* ============================================================
 * Item del menú contextual
 * ============================================================ */
function MenuItem({
  icon, label, onClick, disabled, danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      className={`w-full text-left text-xs px-3 py-1.5 flex items-center gap-2 transition-colors ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : danger
          ? 'hover:bg-red-600/20 text-red-400'
          : 'hover:bg-evr-hover text-evr-text'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ============================================================
 * Helpers
 * ============================================================ */

/**
 * Crea N slots nuevos a partir de un slot de referencia (el que recibe el drop).
 * Los nuevos slots heredan el tamaño del slot de referencia y se colocan
 * en cascada a la derecha/abajo para no taparse.
 *
 * No modifica el slot de referencia ni ningún otro slot existente.
 */
function createSlotsFromSlot(page: Page, refSlot: Slot, photoIds: string[]) {
  const state = useStore.getState();
  const pages = state.history.present.pages;
  const pageIndex = pages.findIndex(p => p.id === page.id);
  if (pageIndex < 0) return;

  const baseW = refSlot.w;
  const baseH = refSlot.h;
  const step = 4;

  const newSlots: Slot[] = photoIds.map((photoId, i) => {
    // Colocar en cascada: primero hacia la derecha, si se sale, abajo
    let x = refSlot.x + (i + 1) * step;
    let y = refSlot.y + (i + 1) * step;

    // Ajustar para no salirse de la página
    x = Math.max(0, Math.min(100 - baseW, x));
    y = Math.max(0, Math.min(100 - baseH, y));

    return {
      id: generateId(),
      x,
      y,
      w: baseW,
      h: baseH,
      photoId,
      fit: refSlot.fit,
      offsetX: 0,
      offsetY: 0,
      zoom: 1,
      rotation: 0,
      locked: false,
      z: page.slots.length + i,
    };
  });

  const updatedPage: Page = {
    ...page,
    slots: [...page.slots, ...newSlots],
  };

  const nextPages = pages.map((p, i) => (i === pageIndex ? updatedPage : p));

  // Seleccionamos el último slot creado
  const lastSlot = newSlots[newSlots.length - 1];

  useStore.setState(s => ({
    history: pushHistory(s.history, {
      ...s.history.present,
      pages: nextPages,
      updatedAt: Date.now(),
    }),
    ui: { ...s.ui, selectedSlotId: lastSlot.id, selectedSlotIds: [lastSlot.id] },
  }));
}

/**
 * Genera un ID único para slots nuevos.
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}