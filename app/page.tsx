'use client';

import { useEffect } from 'react';
import { TopBar } from '@/src/components/TopBar';
import { PhotoLibrary } from '@/src/components/PhotoLibrary';
import { Canvas } from '@/src/components/Canvas';
import { RightPanel } from '@/src/components/RightPanel';
import { PageStrip } from '@/src/components/PageStrip';
import { TemplateGallery } from '@/src/components/TemplateGallery';
import { PreflightPanel } from '@/src/components/PreflightPanel';
import { ExportDialog } from '@/src/components/ExportDialog';
import { NewProjectDialog } from '@/src/components/NewProjectDialog';
import { useStore } from '@/src/store/projectStore';

export default function Page() {
  const undo = useStore(s => s.undo);
  const redo = useStore(s => s.redo);
  const saveLocal = useStore(s => s.saveLocal);
  const shuffle = useStore(s => s.shuffleCurrentPage);
  const setUI = useStore(s => s.setUI);
  const zoom = useStore(s => s.ui.zoom);
  const showGrid = useStore(s => s.ui.showGrid);
  const nextSpread = useStore(s => s.nextSpread);
  const prevSpread = useStore(s => s.prevSpread);

  // -------------------------------------------------------------
  // Autosave cada 30s + al cerrar la pestaña
  // -------------------------------------------------------------
  useEffect(() => {
    const t = setInterval(() => saveLocal(), 30_000);
    const onUnload = () => saveLocal();
    window.addEventListener('beforeunload', onUnload);
    return () => {
      clearInterval(t);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [saveLocal]);

  // -------------------------------------------------------------
  // Atajos globales (Ctrl/Cmd + ...)
  // -------------------------------------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;

      // Undo / Redo
      if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (mod && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      // Guardar
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveLocal();
        return;
      }

      // Zoom
      if (mod && e.key === '0') {
        e.preventDefault();
        setUI({ zoom: 0.5 });
        return;
      }
      if (mod && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setUI({ zoom: Math.min(3, zoom + 0.1) });
        return;
      }
      if (mod && e.key === '-') {
        e.preventDefault();
        setUI({ zoom: Math.max(0.1, zoom - 0.1) });
        return;
      }

      // Navegación entre spreads (Alt + flechas)
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        nextSpread();
        return;
      }
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSpread();
        return;
      }

      // Atajos sin modificadores
      if (!mod) {
        if (e.key === 'r' || e.key === 'R') {
          setUI({ showGrid: !showGrid });
          return;
        }
        if ((e.key === 's' || e.key === 'S') && !e.altKey && !e.shiftKey) {
          shuffle();
          return;
        }
        if (e.key === 'g' || e.key === 'G') {
          setUI({ showGuides: !useStore.getState().ui.showGuides });
          return;
        }
        if (e.key === 'Escape') {
          useStore.getState().select(null, null);
          return;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, saveLocal, setUI, shuffle, zoom, showGrid, nextSpread, prevSpread]);

  // -------------------------------------------------------------
  // Atajos para el slot seleccionado: flechas para mover
  // -------------------------------------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const state = useStore.getState();
      const sel = state.ui.selectedSlotId;
      if (!sel) return;

      const mod = e.ctrlKey || e.metaKey;
      // Ctrl+... ya lo maneja el handler anterior (undo, save, etc.)
      if (mod) return;

      // Solo las flechas actúan sobre el slot
      const isArrow =
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown';
      if (!isArrow) return;

      // Alt + flecha = navegación de spreads, lo maneja el otro handler
      if (e.altKey) return;

      const project = state.history.present;
      const page = project.pages[project.currentPageIndex];
      if (!page) return;
      const slot = page.slots.find(s => s.id === sel);
      if (!slot || slot.locked) return;

      e.preventDefault();

      // Paso: 0.5% por defecto, 2% con Shift
      const step = e.shiftKey ? 2 : 0.5;

      switch (e.key) {
        case 'ArrowLeft':
          state.updateSlot(sel, { x: slot.x - step });
          break;
        case 'ArrowRight':
          state.updateSlot(sel, { x: slot.x + step });
          break;
        case 'ArrowUp':
          state.updateSlot(sel, { y: slot.y - step });
          break;
        case 'ArrowDown':
          state.updateSlot(sel, { y: slot.y + step });
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // -------------------------------------------------------------
  // Atajos para redimensionar con Ctrl + Alt + flechas
  // -------------------------------------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const state = useStore.getState();
      const sel = state.ui.selectedSlotId;
      if (!sel) return;
      if (!(e.ctrlKey || e.metaKey) || !e.altKey) return;

      const isArrow =
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown';
      if (!isArrow) return;

      const project = state.history.present;
      const page = project.pages[project.currentPageIndex];
      if (!page) return;
      const slot = page.slots.find(s => s.id === sel);
      if (!slot || slot.locked) return;

      e.preventDefault();
      const step = e.shiftKey ? 2 : 0.5;

      switch (e.key) {
        case 'ArrowLeft':
          state.updateSlot(sel, { w: Math.max(5, slot.w - step) });
          break;
        case 'ArrowRight':
          state.updateSlot(sel, { w: slot.w + step });
          break;
        case 'ArrowUp':
          state.updateSlot(sel, { h: Math.max(5, slot.h - step) });
          break;
        case 'ArrowDown':
          state.updateSlot(sel, { h: slot.h + step });
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-evr-bg text-evr-text">
      <TopBar />
      <div className="flex-1 flex min-h-0">
        <PhotoLibrary />
        <div className="flex-1 flex flex-col min-h-0">
          <Canvas />
          <PageStrip />
        </div>
        <RightPanel />
      </div>

      <TemplateGallery />
      <PreflightPanel />
      <ExportDialog />
      <NewProjectDialog />
    </div>
  );
}