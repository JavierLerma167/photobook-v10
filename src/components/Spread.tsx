'use client';

import React, { useState } from 'react';
import { useStore } from '@/src/store/projectStore';
import { AlbumSize, Page, Slot } from '@/src/types';
import { SlotView } from './PhotoSlot';
import { TextElementView } from './TextElementView';
import { makeFullBleedTemplate } from '@/src/engine/autoTemplate';
import { pushHistory } from '@/src/engine/history';

interface Props {
  size: AlbumSize;
  zoom: number;
}

const PX_PER_IN = 96;

export function Spread({ size, zoom }: Props) {
  const project = useStore(s => s.history.present);
  const rawIndex = project.currentPageIndex;
  const showGuides = useStore(s => s.ui.showGuides);
  const showGrid = useStore(s => s.ui.showGrid);
  const selectedSlotId = useStore(s => s.ui.selectedSlotId);
  const selectedTextId = useStore(s => s.ui.selectedTextId);

  // -------------------------------------------------------------
  // Normalizar el índice para mostrar SIEMPRE el spread completo,
  // incluso si currentPageIndex apunta a la página derecha.
  // -------------------------------------------------------------
  let currentIndex = rawIndex;
  if (rawIndex > 0) {
    const p = project.pages[rawIndex];
    if (p && p.kind !== 'cover') {
      const offset = rawIndex - 1;
      if (offset % 2 === 1) {
        currentIndex = rawIndex - 1;
      }
    }
  }

  const leftPage = project.pages[currentIndex];
  const rightPage = project.pages[currentIndex + 1];
  const prevPage = currentIndex > 0 ? project.pages[currentIndex - 1] : undefined;

  // Caso 1: página "consumida" por la anterior (spanNext del anterior)
  if (prevPage?.spanNext && leftPage) {
    return (
      <SpannedPage
        page={prevPage}
        size={size}
        showGuides={showGuides}
        showGrid={showGrid}
        selectedSlotId={selectedSlotId}
        selectedTextId={selectedTextId}
      />
    );
  }

  // Caso 2: portada → página sola
  if (leftPage?.kind === 'cover') {
    return (
      <SinglePage
        page={leftPage}
        size={size}
        showGuides={showGuides}
        showGrid={showGrid}
        selectedSlotId={selectedSlotId}
        selectedTextId={selectedTextId}
      />
    );
  }

  // Caso 3: página izquierda extendida (spanNext) → doble ancho
  if (leftPage?.spanNext) {
    return (
      <SpannedPage
        page={leftPage}
        size={size}
        showGuides={showGuides}
        showGrid={showGrid}
        selectedSlotId={selectedSlotId}
        selectedTextId={selectedTextId}
      />
    );
  }

  // Caso 4: no hay página derecha → izquierda sola
  if (!rightPage) {
    return (
      <SinglePage
        page={leftPage}
        size={size}
        showGuides={showGuides}
        showGrid={showGrid}
        selectedSlotId={selectedSlotId}
        selectedTextId={selectedTextId}
      />
    );
  }

  // Caso 5: spread normal (izquierda + derecha)
  return (
    <SpreadDouble
      leftPage={leftPage}
      rightPage={rightPage}
      size={size}
      showGuides={showGuides}
      showGrid={showGrid}
      selectedSlotId={selectedSlotId}
      selectedTextId={selectedTextId}
    />
  );
}

/* ============================================================
 * Fondo de página (color + imagen/textura + overlay)
 * ============================================================ */
function PageBackground({ page }: { page: Page }) {
  const bg = page.background || '#ffffff';
  const img = page.backgroundImage;
  const fit = page.backgroundImageFit || 'cover';
  const opacity = page.backgroundImageOpacity ?? 1;
  const overlay = page.backgroundOverlay;

  return (
    <>
      {/* 1. Color base */}
      <div className="absolute inset-0" style={{ background: bg }} />

      {/* 2. Imagen/textura encima del color */}
      {img && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity,
            backgroundImage: `url("${img}")`,
            backgroundSize: fit === 'repeat' ? 'auto' : fit,
            backgroundRepeat: fit === 'repeat' ? 'repeat' : 'no-repeat',
            backgroundPosition: 'center center',
          }}
        />
      )}

      {/* 3. Overlay de color (para oscurecer o teñir) */}
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: overlay }}
        />
      )}
    </>
  );
}

/* ============================================================
 * Página individual (portada o última página impar)
 * ============================================================ */
function SinglePage({
  page, size, showGuides, showGrid, selectedSlotId, selectedTextId
}: {
  page: Page;
  size: AlbumSize;
  showGuides: boolean;
  showGrid: boolean;
  selectedSlotId: string | null;
  selectedTextId: string | null;
}) {
  const pageW = size.widthIn * PX_PER_IN;
  const pageH = size.heightIn * PX_PER_IN;
  const bleed = size.bleedIn * PX_PER_IN;
  const safe = size.safeIn * PX_PER_IN;

  const totalW = pageW + bleed * 2;
  const totalH = pageH + bleed * 2;

  return (
    <div
      className="relative shadow-2xl"
      style={{ width: totalW, height: totalH, borderRadius: 2 }}
    >
      {/* Fondo (color + imagen + overlay) */}
      <PageBackground page={page} />

      <div
        className="absolute"
        style={{
          left: bleed,
          top: bleed,
          width: pageW,
          height: pageH,
          overflow: 'hidden'
        }}
      >
        <PageInner
          page={page}
          pageWidth={pageW}
          pageHeight={pageH}
          safe={safe}
          showGuides={showGuides}
          showGrid={showGrid}
          selectedSlotId={selectedSlotId}
          selectedTextId={selectedTextId}
        />
      </div>

      {showGuides && (
        <div
          className="absolute pointer-events-none border border-red-500/60"
          style={{ left: bleed, top: bleed, width: pageW, height: pageH }}
        />
      )}
    </div>
  );
}

/* ============================================================
 * Doble página real (dos páginas consecutivas)
 * ============================================================ */
function SpreadDouble({
  leftPage, rightPage, size, showGuides, showGrid, selectedSlotId, selectedTextId
}: {
  leftPage: Page;
  rightPage: Page;
  size: AlbumSize;
  showGuides: boolean;
  showGrid: boolean;
  selectedSlotId: string | null;
  selectedTextId: string | null;
}) {
  const pageW = size.widthIn * PX_PER_IN;
  const pageH = size.heightIn * PX_PER_IN;
  const bleed = size.bleedIn * PX_PER_IN;
  const safe = size.safeIn * PX_PER_IN;
  const gutter = size.gutterIn * PX_PER_IN;

  const totalW = pageW * 2 + bleed * 2;
  const totalH = pageH + bleed * 2;

  return (
    <div
      className="relative shadow-2xl"
      style={{ width: totalW, height: totalH, borderRadius: 2 }}
    >
      {/* Mitad IZQUIERDA → leftPage */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: bleed,
          top: bleed,
          width: pageW,
          height: pageH,
        }}
      >
        <PageBackground page={leftPage} />
        <PageInner
          page={leftPage}
          pageWidth={pageW}
          pageHeight={pageH}
          safe={safe}
          showGuides={showGuides}
          showGrid={showGrid}
          selectedSlotId={selectedSlotId}
          selectedTextId={selectedTextId}
        />
      </div>

      {/* Mitad DERECHA → rightPage */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: bleed + pageW,
          top: bleed,
          width: pageW,
          height: pageH,
        }}
      >
        <PageBackground page={rightPage} />
        <PageInner
          page={rightPage}
          pageWidth={pageW}
          pageHeight={pageH}
          safe={safe}
          showGuides={showGuides}
          showGrid={showGrid}
          selectedSlotId={selectedSlotId}
          selectedTextId={selectedTextId}
        />
      </div>

      {/* Gutter (línea central de encuadernación) */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: bleed + pageW - gutter / 2,
          top: bleed,
          width: gutter,
          height: pageH,
          background: 'rgba(232,176,75,0.08)',
          borderLeft: '1px dashed rgba(232,176,75,0.5)',
          borderRight: '1px dashed rgba(232,176,75,0.5)'
        }}
      />

      {/* Línea de trim total */}
      {showGuides && (
        <div
          className="absolute pointer-events-none border border-red-500/60"
          style={{ left: bleed, top: bleed, width: totalW - bleed * 2, height: totalH - bleed * 2 }}
        />
      )}
    </div>
  );
}

/* ============================================================
 * Página EXTENDIDA (spanNext)
 * - Un solo lienzo de doble ancho
 * - Coordenadas de slots en rango 0-200 (para cruzar el gutter)
 * ============================================================ */
function SpannedPage({
  page, size, showGuides, showGrid, selectedSlotId, selectedTextId
}: {
  page: Page;
  size: AlbumSize;
  showGuides: boolean;
  showGrid: boolean;
  selectedSlotId: string | null;
  selectedTextId: string | null;
}) {
  const pageW = size.widthIn * PX_PER_IN;
  const pageH = size.heightIn * PX_PER_IN;
  const bleed = size.bleedIn * PX_PER_IN;
  const safe = size.safeIn * PX_PER_IN;
  const gutter = size.gutterIn * PX_PER_IN;

  // Doble ancho
  const totalW = pageW * 2 + bleed * 2;
  const totalH = pageH + bleed * 2;

  return (
    <div
      className="relative shadow-2xl"
      style={{ width: totalW, height: totalH, borderRadius: 2 }}
    >
      {/* Fondo (color + imagen + overlay) sobre el doble ancho */}
      <PageBackground page={page} />

      <div
        className="absolute"
        style={{
          left: bleed,
          top: bleed,
          width: pageW * 2,
          height: pageH,
          overflow: 'hidden'
        }}
      >
        {/* Reutilizamos PageInner con el ancho doblado */}
        <PageInner
          page={page}
          pageWidth={pageW * 2}
          pageHeight={pageH}
          safe={safe}
          showGuides={showGuides}
          showGrid={showGrid}
          selectedSlotId={selectedSlotId}
          selectedTextId={selectedTextId}
        />
      </div>

      {/* Gutter (referencia visual en el centro) */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: bleed + pageW - gutter / 2,
          top: bleed,
          width: gutter,
          height: pageH,
          background: 'rgba(232,176,75,0.08)',
          borderLeft: '1px dashed rgba(232,176,75,0.5)',
          borderRight: '1px dashed rgba(232,176,75,0.5)'
        }}
      />

      {showGuides && (
        <div
          className="absolute pointer-events-none border border-red-500/60"
          style={{ left: bleed, top: bleed, width: totalW - bleed * 2, height: totalH - bleed * 2 }}
        />
      )}
    </div>
  );
}

/* ============================================================
 * Contenido interno de una página (slots + textos + drop handler)
 *
 * Acepta drops de:
 *  - application/x-evr-photos  → JSON con array de IDs (grupo)
 *  - application/x-evr-photo   → ID individual
 *
 * Comportamiento:
 *  - Página VACÍA (ningún slot con foto):
 *      → genera una plantilla AUTO Full Bleed con N slots
 *  - Página con fotos:
 *      → CREA slots NUEVOS (uno por foto) sin tocar los existentes
 * ============================================================ */
function PageInner({
  page, pageWidth, pageHeight, safe, showGuides, showGrid, selectedSlotId, selectedTextId
}: {
  page: Page;
  pageWidth: number;
  pageHeight: number;
  safe: number;
  showGuides: boolean;
  showGrid: boolean;
  selectedSlotId: string | null;
  selectedTextId: string | null;
}) {
  const [isDragOverEmpty, setIsDragOverEmpty] = useState(false);

  const empty = isPageEmpty(page);

  // -------------------------------------------------------------
  // Drag over
  // -------------------------------------------------------------
  const handleDragOver = (e: React.DragEvent) => {
    if (
      e.dataTransfer.types.includes('application/x-evr-photos') ||
      e.dataTransfer.types.includes('application/x-evr-photo')
    ) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (empty) setIsDragOverEmpty(true);
    }
  };

  const handleDragLeave = () => setIsDragOverEmpty(false);

  // -------------------------------------------------------------
  // Drop handler
  // -------------------------------------------------------------
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverEmpty(false);

    // 1) Grupo
    const groupRaw = e.dataTransfer.getData('application/x-evr-photos');
    if (groupRaw) {
      try {
        const ids: string[] = JSON.parse(groupRaw);
        if (ids.length > 0) {
          handleGroupDrop(page, ids);
          return;
        }
      } catch {
        // ignorar
      }
    }

    // 2) Individual
    const single = e.dataTransfer.getData('application/x-evr-photo');
    if (single) {
      if (empty) {
        applyAutoTemplateAndAssign(page, [single]);
      } else {
        createSlotsForPhotos(page, [single]);
      }
    }
  };

  return (
    <div
      className="absolute inset-0"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Overlay cuando se arrastra sobre una página vacía */}
      {isDragOverEmpty && (
        <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-evr-accent bg-evr-accent/10 flex items-center justify-center z-50">
          <div className="bg-evr-panel/90 text-evr-text text-[11px] px-3 py-1.5 rounded shadow-lg">
            Suelta para crear Full Bleed
          </div>
        </div>
      )}

      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      )}

      {showGuides && (
        <div
          className="absolute pointer-events-none border border-sky-500/40"
          style={{
            left: safe,
            top: safe,
            width: pageWidth - safe * 2,
            height: pageHeight - safe * 2
          }}
        />
      )}

      {page.slots.map(slot => (
        <SlotView
          key={slot.id}
          slot={slot}
          page={page}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          offsetX={0}
          viewWidth={pageWidth}
          selected={selectedSlotId === slot.id}
        />
      ))}

      {page.texts.map(t => (
        <TextElementView
          key={t.id}
          text={t}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          offsetX={0}
          selected={selectedTextId === t.id}
        />
      ))}
    </div>
  );
}

/* ============================================================
 * Helpers
 * ============================================================ */

/**
 * ¿La página no tiene ninguna foto asignada?
 */
function isPageEmpty(page: Page): boolean {
  return page.slots.every(s => !s.photoId);
}

/**
 * Decide cómo colocar el grupo según el estado de la página:
 *  - Página vacía → genera plantilla auto Full Bleed
 *  - Página con fotos → crea slots nuevos (uno por foto)
 */
function handleGroupDrop(page: Page, photoIds: string[]) {
  if (isPageEmpty(page)) {
    applyAutoTemplateAndAssign(page, photoIds);
  } else {
    createSlotsForPhotos(page, photoIds);
  }
}

/**
 * Crea un slot NUEVO por cada foto del array, sin tocar los slots existentes.
 * Los slots se colocan cerca del centro con un pequeño desplazamiento en
 * cascada para que no queden perfectamente apilados.
 */
function createSlotsForPhotos(page: Page, photoIds: string[]) {
  const state = useStore.getState();
  const pages = state.history.present.pages;
  const pageIndex = pages.findIndex(p => p.id === page.id);
  if (pageIndex < 0) return;

  // Tamaño base para los slots nuevos (proporcional al número de fotos)
  const n = photoIds.length;
  const baseW = n === 1 ? 40 : n <= 3 ? 35 : n <= 6 ? 30 : 25;
  const baseH = n === 1 ? 30 : n <= 3 ? 30 : n <= 6 ? 25 : 22;

  // Punto de partida: centro, con un poco de margen
  const startX = 50 - baseW / 2;
  const startY = 50 - baseH / 2;

  // Desplazamiento en cascada para que no se solapen
  const step = 3;

  const newSlots: Slot[] = photoIds.map((photoId, i) => {
    // Distribuimos en una pequeña cuadrícula alrededor del centro
    const col = i % 3;
    const row = Math.floor(i / 3);
    const dx = col * step - step;
    const dy = row * step - step;

    const x = Math.max(0, Math.min(100 - baseW, startX + dx));
    const y = Math.max(0, Math.min(100 - baseH, startY + dy));

    return {
      id: generateId(),
      x,
      y,
      w: baseW,
      h: baseH,
      photoId,
      fit: 'cover',
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

  // Seleccionamos el último slot creado (el más reciente) para que el usuario
  // pueda moverlo/ajustarlo inmediatamente
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
 * Genera una plantilla Full Bleed con N slots, la aplica a la página
 * (reemplazando sus slots actuales) y asigna las fotos en orden.
 *
 * Todo en una sola llamada a setProject para que el undo sea atómico.
 */
function applyAutoTemplateAndAssign(page: Page, photoIds: string[]) {
  const state = useStore.getState();
  const pages = state.history.present.pages;

  const pageIndex = pages.findIndex(p => p.id === page.id);
  if (pageIndex < 0) return;

  // Generamos la plantilla con N slots
  const template = makeFullBleedTemplate(photoIds.length);

  // Construimos los slots nuevos a partir de la plantilla
  const newSlots: Slot[] = template.slots.map((s, i) => ({
    id: generateId(),
    x: s.x,
    y: s.y,
    w: s.w,
    h: s.h,
    photoId: null,
    fit: 'cover',
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
    rotation: 0,
    locked: false,
    z: i,
  }));

  // Asignamos las fotos en orden
  newSlots.forEach((slot, i) => {
    if (i < photoIds.length) slot.photoId = photoIds[i];
  });

  // Sustituimos slots + templateId en la página
  const updatedPage: Page = {
    ...page,
    slots: newSlots,
    templateId: template.id,
  };

  const nextPages = pages.map((p, i) => (i === pageIndex ? updatedPage : p));

  state.setProject({ ...state.history.present, pages: nextPages });
}

/**
 * Genera un ID único para slots nuevos. Usa crypto.randomUUID si está
 * disponible; si no, cae a un contador basado en tiempo + random.
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}