'use client';

import React, { useState } from 'react';
import { useStore, ALBUM_SIZES } from '@/src/store/projectStore';
import { X } from 'lucide-react';
import { AlbumSizeId } from '@/src/types';

export function NewProjectDialog() {
  const open = useStore(s => s.ui.newProjectOpen);
  const setUI = useStore(s => s.setUI);
  const newProject = useStore(s => s.newProject);
  const [name, setName] = useState('Mi Álbum');
  const [sizeId, setSizeId] = useState<AlbumSizeId>('10x10');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center" onClick={() => setUI({ newProjectOpen: false })}>
      <div
        className="bg-evr-panel border border-evr-border rounded-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-evr-border">
          <div className="font-semibold">Nuevo proyecto</div>
          <button className="btn-ghost p-1" onClick={() => setUI({ newProjectOpen: false })}>
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-evr-muted block mb-1">Nombre</label>
            <input className="input w-full" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="text-xs text-evr-muted block mb-1">Tamaño de álbum</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(ALBUM_SIZES) as AlbumSizeId[]).map(id => {
                const s = ALBUM_SIZES[id];
                const active = sizeId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSizeId(id)}
                    className={`border rounded p-3 flex flex-col items-center gap-1 ${
                      active ? 'border-evr-accent bg-evr-accent/10' : 'border-evr-border hover:bg-evr-hover'
                    }`}
                  >
                    <div className="bg-neutral-300 rounded" style={{
                      width: 40 * (s.widthIn / Math.max(s.widthIn, s.heightIn)),
                      height: 40 * (s.heightIn / Math.max(s.widthIn, s.heightIn))
                    }} />
                    <div className="text-[10px] font-medium">{s.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-evr-border">
          <button className="btn-outline" onClick={() => setUI({ newProjectOpen: false })}>Cancelar</button>
          <button
            className="btn-accent"
            onClick={() => {
              newProject(name || 'Sin título', sizeId);
              setUI({ newProjectOpen: false });
            }}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}