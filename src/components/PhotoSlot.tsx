'use client';

import React, { useState } from 'react';
import { useStore } from '@/src/store/projectStore';
import { Slot, Page } from '@/src/types';

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
  const [dragOver, setDragOver] = useState(false);
  const photo = slot.photoId ? photos.find(p => p.id === slot.photoId) : null;

  const isMultiSelected = selectedIds.length > 1 && selectedIds.includes(slot.id);
  const isPrimary = selectedSlotId === slot.id;

  const left = (slot.x / 100) * pageWidth;
  const top = (slot.y / 100) * pageHeight;
  const w = (slot.w / 100) * pageWidth;
  const h = (slot.h / 100) * pageHeight;

  // -------------------------------------------------------------
  // Drag / Drop de fotos desde la biblioteca
  // -------------------------------------------------------------
  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/x-evr-photo')) {
      e.preventDefault();
      setDragOver(true);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const photoId = e.dataTransfer.getData('application/x-evr-photo');
    if (photoId) assignPhoto(slot.id, photoId);
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
        newX
      );

      const snapTop = snapValue(newY, yTargets);
      const snapCenterY = snapValue(newY + start.h / 2, yTargets) - start.h / 2;
      const snapBottom = snapValue(newY + start.h, yTargets) - start.h;
      newY = [snapTop, snapCenterY, snapBottom].reduce(
        (best, c) => (Math.abs(c - newY) < Math.abs(best - newY) ? c : best),
        newY
      );

      state.updateSlot(start.id, {
        x: Math.max(-20, Math.min(120 - start.w, newX)),
        y: Math.max(-20, Math.min(120 - start.h, newY))
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
        offsetY: Math.max(-1, Math.min(1, startOffY + ((ev.clientY - startY) / h) * 2))
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
    w: 'ew-resize'
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
    <div
      className={`absolute ${ringClass}`}
      style={{
        left,
        top,
        width: w,
        height: h,
        cursor: slot.locked ? 'not-allowed' : 'move'
      }}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onMouseDown={beginMove}
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
              transformOrigin: 'center'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 border border-dashed border-neutral-300 pointer-events-none">
            Arrastra una foto
          </div>
        )}
      </div>

      {/* 8 handles de resize (más visibles y robustos) */}
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
              userSelect: 'none'
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
  );
}
