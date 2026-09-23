'use client';

import React from 'react';
import { useStore } from '@/src/store/projectStore';
import { AlbumSize, Page } from '@/src/types';
import { SlotView } from './PhotoSlot';
import { TextElementView } from './TextElementView';

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
              width: pageW * 2 - safe * 2,
              height: pageH - safe * 2
            }}
          />
        )}

        {page.slots.map(slot => (
          <SlotView
            key={slot.id}
            slot={slot}
            page={page}
            pageWidth={pageW * 2}
            pageHeight={pageH}
            offsetX={0}
            viewWidth={pageW * 2}
            selected={selectedSlotId === slot.id}
          />
        ))}

        {page.texts.map(t => (
          <TextElementView
            key={t.id}
            text={t}
            pageWidth={pageW * 2}
            pageHeight={pageH}
            offsetX={0}
            selected={selectedTextId === t.id}
          />
        ))}
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
 * Contenido interno de una página (slots + textos + guías internas)
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
  return (
    <>
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
    </>
  );
}
