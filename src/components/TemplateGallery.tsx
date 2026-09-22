'use client';

import React from 'react';
import { useStore } from '@/src/store/projectStore';
import { X } from 'lucide-react';
import { Template } from '@/src/types';

export function TemplateGallery() {
  const open = useStore(s => s.ui.templateGalleryOpen);
  const setUI = useStore(s => s.setUI);
  const templates = useStore(s => s.templates);
  const applyTemplate = useStore(s => s.applyTemplateToPage);
  const currentPage = useStore(s => s.history.present.pages[s.history.present.currentPageIndex]);
  const [filter, setFilter] = React.useState<string>('all');
  const [styleFilter, setStyleFilter] = React.useState<string>('all');

  if (!open) return null;

  const isCover = currentPage.kind === 'cover';
  const pool = templates.filter(t => isCover ? t.category === 'cover' : t.category !== 'cover');

  const categories = Array.from(new Set(pool.map(t => t.category))).sort((a, b) => {
    if (a === 'cover') return -1;
    if (b === 'cover') return 1;
    return parseInt(a) - parseInt(b);
  });
  const styles = Array.from(new Set(pool.map(t => t.style)));

  const visible = pool.filter(t =>
    (filter === 'all' || t.category === filter) &&
    (styleFilter === 'all' || t.style === styleFilter)
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-8" onClick={() => setUI({ templateGalleryOpen: false })}>
      <div
        className="bg-evr-panel border border-evr-border rounded-lg w-full max-w-5xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-evr-border">
          <div>
            <div className="font-semibold">Plantillas</div>
            <div className="text-xs text-evr-muted">
              Haz clic para aplicar. Las fotos existentes se conservan en orden.
            </div>
          </div>
          <button className="btn-ghost p-1" onClick={() => setUI({ templateGalleryOpen: false })}>
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 p-3 border-b border-evr-border flex-wrap">
          <span className="text-xs text-evr-muted">Fotos:</span>
          <button className={`text-xs px-2 py-1 rounded ${filter === 'all' ? 'bg-evr-accent text-black' : 'hover:bg-evr-hover'}`} onClick={() => setFilter('all')}>Todas</button>
          {categories.map(c => (
            <button key={c}
              className={`text-xs px-2 py-1 rounded ${filter === c ? 'bg-evr-accent text-black' : 'hover:bg-evr-hover'}`}
              onClick={() => setFilter(c)}
            >{c === 'cover' ? 'Portada' : c}</button>
          ))}
          <div className="flex-1" />
          <span className="text-xs text-evr-muted">Estilo:</span>
          <button className={`text-xs px-2 py-1 rounded ${styleFilter === 'all' ? 'bg-evr-accent text-black' : 'hover:bg-evr-hover'}`} onClick={() => setStyleFilter('all')}>Todos</button>
          {styles.map(s => (
            <button key={s}
              className={`text-xs px-2 py-1 rounded ${styleFilter === s ? 'bg-evr-accent text-black' : 'hover:bg-evr-hover'}`}
              onClick={() => setStyleFilter(s)}
            >{s}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin p-4">
          <div className="grid grid-cols-4 gap-3">
            {visible.map(t => (
              <TemplateCard key={t.id} template={t} onApply={() => {
                applyTemplate(t.id);
                setUI({ templateGalleryOpen: false });
              }} />
            ))}
          </div>
          {visible.length === 0 && (
            <div className="text-center text-evr-muted text-sm py-12">No hay plantillas con esos filtros</div>
          )}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, onApply }: { template: Template; onApply: () => void }) {
  return (
    <button
      className="group bg-evr-bg border border-evr-border rounded overflow-hidden hover:border-evr-accent transition-colors text-left"
      onClick={onApply}
    >
      <div className="aspect-[1.4/1] bg-white relative">
        {template.slots.map((s, i) => (
          <div
            key={i}
            className="absolute bg-neutral-300 border border-neutral-400"
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: `${s.w}%`, height: `${s.h}%`
            }}
          />
        ))}
      </div>
      <div className="p-2">
        <div className="text-xs font-medium truncate">{template.name}</div>
        <div className="text-[10px] text-evr-muted">{template.style} · {template.photoCount} foto{template.photoCount > 1 ? 's' : ''}</div>
      </div>
    </button>
  );
}
