'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useStore, useAlbumSize } from '@/src/store/projectStore';
import { Spread } from './Spread';
import { LayoutSuggestions } from './LayoutSuggestions';

const PX_PER_IN = 96;
const PAN_MARGIN = 200; // margen extra para poder panear un poco más allá de los bordes

export function Canvas() {
  const size = useAlbumSize();
  const zoom = useStore(s => s.ui.zoom);
  const panX = useStore(s => s.ui.panX);
  const panY = useStore(s => s.ui.panY);
  const setUI = useStore(s => s.setUI);
  const project = useStore(s => s.history.present);

  const ref = useRef<HTMLDivElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const vScrollRef = useRef<HTMLDivElement>(null);

  const [panning, setPanning] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [zoomDraft, setZoomDraft] = useState<string>('');
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // -------------------------------------------------------------
  // Medir viewport (con ResizeObserver)
  // -------------------------------------------------------------
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setViewport({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // -------------------------------------------------------------
  // Calcular tamaño del contenido (spread × zoom + margen)
  // -------------------------------------------------------------
  const currentIdx = project.currentPageIndex;
  const isCover = project.pages[currentIdx]?.kind === 'cover';
  const isSpanned =
    project.pages[currentIdx]?.spanNext === true ||
    project.pages[currentIdx - 1]?.spanNext === true;

  const pageW = size.widthIn * PX_PER_IN;
  const pageH = size.heightIn * PX_PER_IN;
  const bleed = size.bleedIn * PX_PER_IN;

  // Portada = 1 página. Spread normal o spanned = 2 páginas.
  const pagesAcross = isCover ? 1 : 2;
  const contentW = pageW * pagesAcross + bleed * 2;
  const contentH = pageH + bleed * 2;

  const scaledW = contentW * zoom;
  const scaledH = contentH * zoom;

  const totalW = scaledW + PAN_MARGIN * 2;
  const totalH = scaledH + PAN_MARGIN * 2;

  const maxPanX = Math.max(0, (totalW - viewport.w) / 2);
  const maxPanY = Math.max(0, (totalH - viewport.h) / 2);

  const needsHScroll = totalW > viewport.w;
  const needsVScroll = totalH > viewport.h;

  // -------------------------------------------------------------
  // Aplicar paneo con clamp
  // -------------------------------------------------------------
  const applyPanX = useCallback(
    (nextPanX: number) => {
      const clamped = Math.max(-maxPanX, Math.min(maxPanX, nextPanX));
      setUI({ panX: clamped });
    },
    [maxPanX, setUI]
  );

  const applyPanY = useCallback(
    (nextPanY: number) => {
      const clamped = Math.max(-maxPanY, Math.min(maxPanY, nextPanY));
      setUI({ panY: clamped });
    },
    [maxPanY, setUI]
  );

  // -------------------------------------------------------------
  // Sincronizar scrollbars cuando cambia panX / panY (por paneo)
  // -------------------------------------------------------------
  useEffect(() => {
    const el = hScrollRef.current;
    if (el && needsHScroll) {
      // Convertir panX (-maxPanX..maxPanX) a scrollLeft (0..scrollWidth-clientWidth)
      const range = el.scrollWidth - el.clientWidth;
      const ratio = maxPanX > 0 ? (panX + maxPanX) / (maxPanX * 2) : 0.5;
      const target = ratio * range;
      if (Math.abs(el.scrollLeft - target) > 1) {
        el.scrollLeft = target;
      }
    }
  }, [panX, maxPanX, needsHScroll]);

  useEffect(() => {
    const el = vScrollRef.current;
    if (el && needsVScroll) {
      const range = el.scrollHeight - el.clientHeight;
      const ratio = maxPanY > 0 ? (panY + maxPanY) / (maxPanY * 2) : 0.5;
      const target = ratio * range;
      if (Math.abs(el.scrollTop - target) > 1) {
        el.scrollTop = target;
      }
    }
  }, [panY, maxPanY, needsVScroll]);

  // -------------------------------------------------------------
  // Al mover la scrollbar → actualizar panX / panY
  // -------------------------------------------------------------
  const onHScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const range = el.scrollWidth - el.clientWidth;
    if (range <= 0) return;
    const ratio = el.scrollLeft / range;
    const pan = (ratio - 0.5) * 2 * maxPanX;
    applyPanX(pan);
  };

  const onVScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const range = el.scrollHeight - el.clientHeight;
    if (range <= 0) return;
    const ratio = el.scrollTop / range;
    const pan = (ratio - 0.5) * 2 * maxPanY;
    applyPanY(pan);
  };

  // -------------------------------------------------------------
  // Wheel zoom (Ctrl/Cmd + rueda)
  // -------------------------------------------------------------
  const onWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setUI({ zoom: Math.max(0.1, Math.min(3, zoom + delta)) });
    }
  };

  // -------------------------------------------------------------
  // Tecla Espacio para panear
  // -------------------------------------------------------------
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // -------------------------------------------------------------
  // Pan con Espacio + arrastrar (o botón central)
  // -------------------------------------------------------------
  const onMouseDown = (e: React.MouseEvent) => {
    if (spaceHeld || e.button === 1) {
      e.preventDefault();
      setPanning(true);
      const startX = e.clientX - panX;
      const startY = e.clientY - panY;
      const move = (ev: MouseEvent) => {
        applyPanX(ev.clientX - startX);
        applyPanY(ev.clientY - startY);
      };
      const up = () => {
        setPanning(false);
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    }
  };

  // -------------------------------------------------------------
  // Zoom editable
  // -------------------------------------------------------------
  const applyZoom = (v: number) => {
    setUI({ zoom: Math.max(0.1, Math.min(3, v)) });
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      ref={ref}
      className={`flex-1 relative overflow-hidden bg-[#0a0c10] ${
        panning ? 'cursor-grabbing' : spaceHeld ? 'cursor-grab' : 'cursor-default'
      }`}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
    >
      {/* Fondo punteado */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Panel flotante de sugerencias de layout */}
      <LayoutSuggestions />

      {/* Área de diseño (deja hueco para las scrollbars) */}
      <div
        className="absolute"
        style={{
          inset: 0,
          paddingRight: needsVScroll ? 12 : 0,
          paddingBottom: needsHScroll ? 12 : 0
        }}
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <Spread size={size} zoom={zoom} />
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Scrollbar horizontal                                       */}
      {/* ---------------------------------------------------------- */}
      {needsHScroll && (
        <div
          ref={hScrollRef}
          onScroll={onHScroll}
          className="absolute left-0 right-3 bottom-0 h-3 bg-evr-panel/90 backdrop-blur border-t border-evr-border overflow-x-auto overflow-y-hidden scroll-thin z-30"
        >
          {/* Spacer interior: su ancho simula el "contenido" */}
          <div
            style={{
              width: `${(totalW / viewport.w) * 100}%`,
              height: 1
            }}
          />
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Scrollbar vertical                                         */}
      {/* ---------------------------------------------------------- */}
      {needsVScroll && (
        <div
          ref={vScrollRef}
          onScroll={onVScroll}
          className="absolute top-0 bottom-3 right-0 w-3 bg-evr-panel/90 backdrop-blur border-l border-evr-border overflow-y-auto overflow-x-hidden scroll-thin z-30"
        >
          <div
            style={{
              height: `${(totalH / viewport.h) * 100}%`,
              width: 1
            }}
          />
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Zoom editable: − [input] % +                               */}
      {/* ---------------------------------------------------------- */}
      <div
        className={`absolute bg-evr-panel border border-evr-border rounded flex items-center shadow-lg overflow-hidden z-40 ${
          needsVScroll || needsHScroll ? 'bottom-5 right-5' : 'bottom-3 right-3'
        }`}
      >
        <button
          className="w-7 h-7 flex items-center justify-center text-evr-text hover:bg-evr-hover transition-colors"
          onClick={() => applyZoom(zoom - 0.1)}
          title="Reducir zoom (−10%)"
        >
          <span className="text-base leading-none">−</span>
        </button>

        <div className="flex items-center border-x border-evr-border">
          <input
            type="number"
            className="w-12 h-7 bg-transparent text-center text-xs text-evr-text outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={zoomDraft !== '' ? zoomDraft : zoomPercent}
            min={10}
            max={300}
            step={5}
            onChange={e => setZoomDraft(e.target.value)}
            onBlur={() => {
              const v = parseFloat(zoomDraft);
              if (!isNaN(v)) applyZoom(v / 100);
              setZoomDraft('');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const v = parseFloat(zoomDraft);
                if (!isNaN(v)) applyZoom(v / 100);
                setZoomDraft('');
                (e.target as HTMLInputElement).blur();
              } else if (e.key === 'Escape') {
                setZoomDraft('');
                (e.target as HTMLInputElement).blur();
              }
            }}
            title="Zoom (%)"
          />
          <span className="text-[10px] text-evr-muted pr-1">%</span>
        </div>

        <button
          className="w-7 h-7 flex items-center justify-center text-evr-text hover:bg-evr-hover transition-colors"
          onClick={() => applyZoom(zoom + 0.1)}
          title="Aumentar zoom (+10%)"
        >
          <span className="text-base leading-none">+</span>
        </button>

        <button
          className="w-7 h-7 flex items-center justify-center text-[10px] text-evr-muted hover:bg-evr-hover hover:text-evr-text transition-colors border-l border-evr-border"
          onClick={() => applyZoom(0.5)}
          title="Restablecer a 50%"
        >
          ½
        </button>
      </div>
    </div>
  );
}
