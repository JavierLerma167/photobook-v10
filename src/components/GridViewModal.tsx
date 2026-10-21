'use client';
import React from 'react';
import { useStore } from '@/src/store/projectStore';
import { X } from 'lucide-react';
import { useAlbumSize } from '@/src/store/projectStore';

export function GridViewModal() {
  const open = useStore(s => s.ui.gridViewOpen);
  const setUI = useStore(s => s.setUI);
  const project = useStore(s => s.history.present);
  const goToPage = useStore(s => s.goToPage);
  const size = useAlbumSize();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col p-6" onClick={() => setUI({ gridViewOpen: false })}>
      <div className="flex justify-between items-center mb-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold">Todas las páginas</h2>
        <button className="btn-ghost p-2" onClick={() => setUI({ gridViewOpen: false })}>
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scroll-thin grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" onClick={e => e.stopPropagation()}>
        {project.pages.map((p, i) => (
          <div
            key={p.id}
            className="relative aspect-[1/1.4] bg-white rounded shadow cursor-pointer hover:ring-2 ring-evr-accent transition-all overflow-hidden"
            onClick={() => {
              goToPage(i);
              setUI({ gridViewOpen: false });
            }}
          >
            {/* Renderizar miniaturas de slots/textos aquí */}
            <div className="absolute inset-0 flex items-center justify-center text-black/50 text-xs">
              Página {i + 1}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
              {i === 0 ? 'Portada' : `Pág ${i}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}