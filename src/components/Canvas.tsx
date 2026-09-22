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

      {/* Indicador de zoom */}
      <div className="absolute bottom-3 right-3 bg-evr-panel border border-evr-border rounded px-2 py-1 text-xs text-evr-muted">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}