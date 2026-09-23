'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useStore, useAlbumSize } from '@/src/store/projectStore';
import { Spread } from './Spread';
import { LayoutSuggestions } from './LayoutSuggestions';

export function Canvas() {
  const size = useAlbumSize();
  const zoom = useStore(s => s.ui.zoom);
  const panX = useStore(s => s.ui.panX);
  const panY = useStore(s => s.ui.panY);
  const setUI = useStore(s => s.setUI);
  const ref = useRef<HTMLDivElement>(null);
  const [panning, setPanning] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [zoomDraft, setZoomDraft] = useState<string>('');

  const onWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setUI({ zoom: Math.max(0.1, Math.min(3, zoom + delta)) });
    }
  };

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

  const onMouseDown = (e: React.MouseEvent) => {
    if (spaceHeld || e.button === 1) {
      setPanning(true);
      const startX = e.clientX - panX;
      const startY = e.clientY - panY;
      const move = (ev: MouseEvent) => {
        setUI({ panX: ev.clientX - startX, panY: ev.clientY - startY });
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

  // ---- Handlers del zoom editable ----
  const applyZoom = (v: number) => {
    setUI({ zoom: Math.max(0.1, Math.min(3, v)) });
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      ref={ref}
      className={`flex-1 relative overflow-hidden bg-[#0a0c10] ${panning ? 'cursor-grabbing' : spaceHeld ? 'cursor-grab' : 'cursor-default'}`}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
    >
      {/* Fondo punteado */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Panel flotante de sugerencias de layout */}
      <LayoutSuggestions />

      {/* Área de diseño */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        <Spread size={size} zoom={zoom} />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Zoom editable: − [input] % +                                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute bottom-3 right-3 bg-evr-panel border border-evr-border rounded flex items-center shadow-lg overflow-hidden">
        {/* Botón − */}
        <button
          className="w-7 h-7 flex items-center justify-center text-evr-text hover:bg-evr-hover transition-colors"
          onClick={() => applyZoom(zoom - 0.1)}
          title="Reducir zoom (−10%)"
        >
          <span className="text-base leading-none">−</span>
        </button>

        {/* Input numérico */}
        <div className="flex items-center border-x border-evr-border">
          <input
            type="number"
            className="w-12 h-7 bg-transparent text-center text-xs text-evr-text outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={zoomDraft !== '' ? zoomDraft : zoomPercent}
            min={10}
            max={300}
            step={5}
            onChange={e => {
              setZoomDraft(e.target.value);
            }}
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

        {/* Botón + */}
        <button
          className="w-7 h-7 flex items-center justify-center text-evr-text hover:bg-evr-hover transition-colors"
          onClick={() => applyZoom(zoom + 0.1)}
          title="Aumentar zoom (+10%)"
        >
          <span className="text-base leading-none">+</span>
        </button>

        {/* Reset a 100% (doble clic en el % o botón pequeño) */}
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
