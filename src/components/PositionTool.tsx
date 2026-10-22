'use client';

import React from 'react';
import { useStore } from '@/src/store/projectStore';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Move } from 'lucide-react';

export function PositionTool() {
  const selectedSlotId = useStore(s => s.ui.selectedSlotId);
  const project = useStore(s => s.history.present);
  const updateSlot = useStore(s => s.updateSlot);
  const page = project.pages[project.currentPageIndex];

  if (!selectedSlotId || !page) return null;

  const slot = page.slots.find(s => s.id === selectedSlotId);
  if (!slot) return null;

  // Función para mover el slot
  const move = (dx: number, dy: number) => {
    updateSlot(slot.id, {
      x: Math.max(-20, Math.min(120 - slot.w, slot.x + dx)),
      y: Math.max(-20, Math.min(120 - slot.h, slot.y + dy)),
    });
  };

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 bg-evr-panel/95 backdrop-blur border border-evr-border rounded-lg shadow-2xl flex items-center gap-3 px-3 py-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Indicador */}
      <div className="flex items-center gap-1.5 text-[10px] text-evr-muted uppercase tracking-wider font-semibold">
        <Move size={13} className="text-evr-accent" />
        <span>Posición</span>
      </div>

      <div className="w-px h-8 bg-evr-border" />

      {/* D-Pad de 4 direcciones */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <div />
        <button
          className="w-7 h-7 flex items-center justify-center bg-evr-bg border border-evr-border rounded hover:bg-evr-hover text-evr-text"
          onClick={() => move(0, -0.5)}
          title="Mover arriba (0.5%)"
        >
          <ArrowUp size={13} />
        </button>
        <div />
        
        <button
          className="w-7 h-7 flex items-center justify-center bg-evr-bg border border-evr-border rounded hover:bg-evr-hover text-evr-text"
          onClick={() => move(-0.5, 0)}
          title="Mover izquierda (0.5%)"
        >
          <ArrowLeft size={13} />
        </button>
        <div className="w-7 h-7 flex items-center justify-center text-[9px] font-mono text-evr-muted">
          {slot.x.toFixed(0)},{slot.y.toFixed(0)}
        </div>
        <button
          className="w-7 h-7 flex items-center justify-center bg-evr-bg border border-evr-border rounded hover:bg-evr-hover text-evr-text"
          onClick={() => move(0.5, 0)}
          title="Mover derecha (0.5%)"
        >
          <ArrowRight size={13} />
        </button>
        
        <div />
        <button
          className="w-7 h-7 flex items-center justify-center bg-evr-bg border border-evr-border rounded hover:bg-evr-hover text-evr-text"
          onClick={() => move(0, 0.5)}
          title="Mover abajo (0.5%)"
        >
          <ArrowDown size={13} />
        </button>
        <div />
      </div>

      <div className="w-px h-8 bg-evr-border" />

      {/* Botones de paso rápido */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <button
            className="text-[10px] px-1.5 py-0.5 bg-evr-bg border border-evr-border rounded hover:bg-evr-hover text-evr-text"
            onClick={() => move(-5, 0)}
            title="Mover 5% a la izquierda"
          >
            -5%
          </button>
          <button
            className="text-[10px] px-1.5 py-0.5 bg-evr-bg border border-evr-border rounded hover:bg-evr-hover text-evr-text"
            onClick={() => move(5, 0)}
            title="Mover 5% a la derecha"
          >
            +5%
          </button>
        </div>
        <div className="flex gap-1">
          <button
            className="text-[10px] px-1.5 py-0.5 bg-evr-bg border border-evr-border rounded hover:bg-evr-hover text-evr-text"
            onClick={() => move(0, -5)}
            title="Mover 5% arriba"
          >
            -5%
          </button>
          <button
            className="text-[10px] px-1.5 py-0.5 bg-evr-bg border border-evr-border rounded hover:bg-evr-hover text-evr-text"
            onClick={() => move(0, 5)}
            title="Mover 5% abajo"
          >
            +5%
          </button>
        </div>
      </div>

    </div>
  );
}