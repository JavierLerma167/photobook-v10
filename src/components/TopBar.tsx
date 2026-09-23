'use client';

import React, { useRef } from 'react';
import { useStore } from '@/src/store/projectStore';
import {
  FilePlus, Save, Undo2, Redo2, LayoutTemplate, Wand2,
  ShieldCheck, Download, Grid3x3, Square, PanelLeft, PanelRight
} from 'lucide-react';

export function TopBar() {
  const setUI = useStore(s => s.setUI);
  const undo = useStore(s => s.undo);
  const redo = useStore(s => s.redo);
  const saveLocal = useStore(s => s.saveLocal);
  const canUndo = useStore(s => s.history.past.length > 0);
  const canRedo = useStore(s => s.history.future.length > 0);
  const projectName = useStore(s => s.history.present.name);
  const renameProject = useStore(s => s.renameProject);
  const showGrid = useStore(s => s.ui.showGrid);
  const showGuides = useStore(s => s.ui.showGuides);
  const showSlotBorders = useStore(s => s.ui.showSlotBorders);
  const leftPanelOpen = useStore(s => s.ui.leftPanelOpen);
  const rightPanelOpen = useStore(s => s.ui.rightPanelOpen);
  const autoDesign = useStore(s => s.autoDesign);
  const photos = useStore(s => s.history.present.photos);

  const [editingName, setEditingName] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState(projectName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fotos favoritas primero, si existen; si no, todas las fotos
  const favorites = photos.filter(p => p.favorite);
  const designPool = favorites.length > 0 ? favorites : photos;
  const canAutoDesign = photos.length > 0;

  const handleAutoDesign = () => {
    if (!canAutoDesign) return;
    autoDesign(designPool.map(p => p.id));
  };

  return (
    <div className="h-12 bg-evr-panel border-b border-evr-border flex items-center px-3 gap-2 shrink-0 overflow-x-auto scroll-thin">
      <div className="flex items-center gap-2 pr-3 border-r border-evr-border shrink-0">
        <div className="w-6 h-6 rounded bg-evr-accent flex items-center justify-center text-black font-bold text-xs">E</div>
        <span className="text-sm font-semibold">EVR Album</span>
      </div>

      {editingName ? (
        <input
          ref={inputRef}
          className="input text-sm shrink-0"
          value={nameDraft}
          onChange={e => setNameDraft(e.target.value)}
          onBlur={() => { renameProject(nameDraft || 'Sin título'); setEditingName(false); }}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          autoFocus
        />
      ) : (
        <button
          onClick={() => { setNameDraft(projectName); setEditingName(true); }}
          className="text-sm text-evr-muted hover:text-evr-text px-2 shrink-0"
        >
          {projectName}
        </button>
      )}

      <div className="w-px h-6 bg-evr-border mx-1 shrink-0" />

      {/* ----------------------------------------------------------------
          Toggle panel izquierdo (Biblioteca)
          ---------------------------------------------------------------- */}
      <button
        className={`btn-ghost flex items-center gap-1.5 shrink-0 ${leftPanelOpen ? 'bg-evr-hover' : ''}`}
        onClick={() => setUI({ leftPanelOpen: !leftPanelOpen })}
        title={leftPanelOpen ? 'Ocultar biblioteca' : 'Mostrar biblioteca'}
      >
        <PanelLeft size={15} />
      </button>

      {/* ----------------------------------------------------------------
          Toggle panel derecho (Propiedades)
          ---------------------------------------------------------------- */}
      <button
        className={`btn-ghost flex items-center gap-1.5 shrink-0 ${rightPanelOpen ? 'bg-evr-hover' : ''}`}
        onClick={() => setUI({ rightPanelOpen: !rightPanelOpen })}
        title={rightPanelOpen ? 'Ocultar propiedades' : 'Mostrar propiedades'}
      >
        <PanelRight size={15} />
      </button>

      <div className="w-px h-6 bg-evr-border mx-1 shrink-0" />

      <button className="btn-ghost flex items-center gap-1.5 shrink-0" onClick={() => setUI({ newProjectOpen: true })}>
        <FilePlus size={15} /> Nuevo
      </button>
      <button className="btn-ghost flex items-center gap-1.5 shrink-0" onClick={saveLocal}>
        <Save size={15} /> Guardar
      </button>
      <button
        className="btn-ghost flex items-center gap-1.5 disabled:opacity-40 shrink-0"
        onClick={undo}
        disabled={!canUndo}
      >
        <Undo2 size={15} />
      </button>
      <button
        className="btn-ghost flex items-center gap-1.5 disabled:opacity-40 shrink-0"
        onClick={redo}
        disabled={!canRedo}
      >
        <Redo2 size={15} />
      </button>

      <div className="w-px h-6 bg-evr-border mx-1 shrink-0" />

      <button
        className="btn-ghost flex items-center gap-1.5 shrink-0"
        onClick={() => setUI({ templateGalleryOpen: true })}
      >
        <LayoutTemplate size={15} /> Plantillas
      </button>
      <button
        className="btn-ghost flex items-center gap-1.5 disabled:opacity-40 shrink-0"
        disabled={!canAutoDesign}
        onClick={handleAutoDesign}
        title={
          !canAutoDesign
            ? 'Importa fotos para usar Auto Design'
            : favorites.length > 0
            ? `Auto Design con ${favorites.length} favorita${favorites.length !== 1 ? 's' : ''}`
            : `Auto Design con ${photos.length} foto${photos.length !== 1 ? 's' : ''}`
        }
      >
        <Wand2 size={15} /> Auto Design
      </button>
      <button className="btn-ghost flex items-center gap-1.5 shrink-0" onClick={() => setUI({ preflightOpen: true })}>
        <ShieldCheck size={15} /> Preflight
      </button>
      <button className="btn-ghost flex items-center gap-1.5 shrink-0" onClick={() => setUI({ exportOpen: true })}>
        <Download size={15} /> Exportar
      </button>

      <div className="flex-1 min-w-[12px]" />

      {/* Botón cuadrícula */}
      <button
        className={`btn-ghost flex items-center gap-1.5 shrink-0 ${showGrid ? 'bg-evr-hover' : ''}`}
        onClick={() => setUI({ showGrid: !showGrid })}
        title="Mostrar cuadrícula"
      >
        <Grid3x3 size={15} />
      </button>

      {/* Botón bordes de slots */}
      <button
        className={`btn-ghost flex items-center gap-1.5 shrink-0 ${showSlotBorders ? 'bg-evr-hover' : ''}`}
        onClick={() => setUI({ showSlotBorders: !showSlotBorders })}
        title={showSlotBorders ? 'Ocultar bordes de slots' : 'Mostrar bordes de slots'}
      >
        <Square size={15} />
      </button>

      {/* Botón guías */}
      <button
        className={`btn-ghost flex items-center gap-1.5 shrink-0 ${showGuides ? 'bg-evr-hover' : ''}`}
        onClick={() => setUI({ showGuides: !showGuides })}
        title="Mostrar guías de impresión"
      >
        Guías
      </button>
    </div>
  );
}
