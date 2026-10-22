'use client';
import React, { useState } from 'react';
import { useStore, useAlbumSize } from '@/src/store/projectStore';
import { X, GripVertical } from 'lucide-react';
import { Page } from '@/src/types';

export function GridViewModal() {
  const open = useStore(s => s.ui.gridViewOpen);
  const setUI = useStore(s => s.setUI);
  const project = useStore(s => s.history.present);
  const goToPage = useStore(s => s.goToPage);
  const reorderPages = useStore(s => s.reorderPages);
  const size = useAlbumSize();

  // ✅ NUEVO: Estado para el feedback visual del Drag & Drop
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (!open) return null;

  // -------------------------------------------------------------
  // Handlers del Drag & Drop
  // -------------------------------------------------------------
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    // Opcional: mejorar la imagen que se arrastra
    const target = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(target, target.clientWidth / 2, target.clientHeight / 2);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      reorderPages(sourceIndex, targetIndex);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex flex-col p-6 backdrop-blur-sm" 
      onClick={() => setUI({ gridViewOpen: false })}
    >
      <div className="flex justify-between items-center mb-6 shrink-0" onClick={e => e.stopPropagation()}>
        <div>
          <h2 className="text-lg font-bold">Todas las páginas</h2>
          <p className="text-xs text-evr-muted mt-1">Arrastra y suelta para reordenar las páginas.</p>
        </div>
        <button className="btn-ghost p-2" onClick={() => setUI({ gridViewOpen: false })}>
          <X size={20} />
        </button>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto scroll-thin grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 content-start pb-10" 
        onClick={e => e.stopPropagation()}
      >
        {project.pages.map((p, i) => {
          const isCover = p.kind === 'cover';
          const isSpanned = p.spanNext === true;
          
          // Calculamos aspect ratio (portada es más estrecha, spread es más ancho)
          const aspectW = isCover ? size.widthIn : (isSpanned ? size.widthIn * 2 : size.widthIn * 2);
          const aspectH = size.heightIn;
          
          // Feedback visual
          const isDragOver = dragOverIndex === i;

          return (
            <div
              key={p.id}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, i)}
              className={`relative group flex flex-col transition-all duration-150 cursor-grab active:cursor-grabbing ${
                isDragOver ? 'scale-105 z-10' : ''
              }`}
              onClick={() => {
                goToPage(i);
                setUI({ gridViewOpen: false });
              }}
            >
              {/* Contenedor de la miniatura */}
              <div 
                className={`relative w-full overflow-hidden rounded shadow-lg border-2 transition-colors ${
                  isDragOver ? 'border-blue-500 ring-4 ring-blue-500/30' : 'border-evr-border group-hover:border-evr-accent'
                }`}
                style={{ aspectRatio: `${aspectW} / ${aspectH}` }}
              >
                {/* ✅ Renderizado real de la página */}
                <PageThumbnail page={p} size={size} />

                {/* Overlay al hacer hover para indicar que se puede clicar */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                {/* Indicador de arrastre en la esquina */}
                <div className="absolute top-2 left-2 p-1 bg-black/50 rounded text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={14} />
                </div>
                
                {/* Etiqueta de página (Portada / Spread) */}
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded shadow">
                  {isCover ? 'PORTADA' : isSpanned ? 'PÁGINA DOBLE' : `PÁG. ${i}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
 * Miniatura de la página (Fondo + Slots + Textos)
 * Reutiliza la lógica de escalado del Spread.tsx
 * ============================================================ */
function PageThumbnail({ page, size }: { page: Page; size: any }) {
  const project = useStore(s => s.history.present);
  const photos = project.photos;
  
  const isCover = page.kind === 'cover';
  const isSpanned = page.spanNext === true;
  const pagesAcross = isCover ? 1 : (isSpanned ? 2 : 2);
  
  return (
    <div 
      className="w-full h-full relative"
      style={{ 
        backgroundColor: page.background || '#ffffff',
        // Fondo de imagen si existe
        backgroundImage: page.backgroundImage ? `url("${page.backgroundImage}")` : 'none',
        backgroundSize: page.backgroundImageFit || 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: page.backgroundImageFit === 'repeat' ? 'repeat' : 'no-repeat',
      }}
    >
      {/* Overlay oscuro si existe */}
      {page.backgroundOverlay && (
        <div className="absolute inset-0" style={{ background: page.backgroundOverlay }} />
      )}

      {/* Renderizar Slots */}
      {page.slots.map((slot) => {
        const photo = slot.photoId ? photos.find(p => p.id === slot.photoId) : null;
        
        return (
          <div
            key={slot.id}
            className="absolute overflow-hidden"
            style={{
              left: `${(slot.x / (isSpanned ? 2 : 1))}%`, // Ajuste para spreads
              top: `${slot.y}%`,
              width: `${(slot.w / (isSpanned ? 2 : 1))}%`,
              height: `${slot.h}%`,
              backgroundColor: '#f5f5f5', // Color base mientras carga
            }}
          >
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.proxyUrl}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  objectFit: slot.fit,
                  transform: `scale(${slot.zoom}) translate(${slot.offsetX * 20}%, ${slot.offsetY * 20}%) rotate(${slot.rotation}deg)`,
                }}
              />
            )}
          </div>
        );
      })}

      {/* Renderizar Textos (simplificado, solo texto y posición) */}
      {page.texts.map((t) => (
        <div
          key={t.id}
          className="absolute pointer-events-none whitespace-pre-wrap select-none"
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: `${t.w}%`,
            color: t.color,
            fontFamily: t.fontFamily,
            fontSize: `${Math.max(4, (t.fontSize / 1000) * 50)}px`, // Escalado aproximado para miniaturas
            fontWeight: t.fontWeight,
            textAlign: t.align,
            lineHeight: t.lineHeight,
          }}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}