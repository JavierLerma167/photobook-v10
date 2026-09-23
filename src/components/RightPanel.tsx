'use client';

import React from 'react';
import { useStore, useCurrentPage, useAlbumSize } from '@/src/store/projectStore';
import { computeEffectiveDpi, QUALITY_COLOR, QUALITY_LABEL } from '@/src/engine/resolution';
import { TEXTURES, FONT_OPTIONS, loadGoogleFont } from '@/src/engine/assets';
import {
  Lock, Unlock, Trash2, Maximize, RotateCw, Type, Image as ImageIcon,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  AlignStartHorizontal, AlignCenterHorizontal, AlignEndHorizontal,
  ArrowLeftToLine, ArrowRightToLine, ArrowUpToLine, ArrowDownToLine,
  MoveHorizontal, MoveVertical, Combine, SplitSquareHorizontal, SplitSquareVertical,
  Square, LayoutGrid, Box, Upload
} from 'lucide-react';
import { Photo, Slot, Page } from '@/src/types';

export function RightPanel() {
  const page = useCurrentPage();
  const size = useAlbumSize();
  const selectedSlotId = useStore(s => s.ui.selectedSlotId);
  const selectedTextId = useStore(s => s.ui.selectedTextId);
  const updateSlot = useStore(s => s.updateSlot);
  const updateText = useStore(s => s.updateText);
  const deleteText = useStore(s => s.deleteText);
  const addText = useStore(s => s.addText);
  const addSlot = useStore(s => s.addSlot);
  const photos = useStore(s => s.history.present.photos);
  const setProject = useStore(s => s.setProject);
  const project = useStore(s => s.history.present);

  // Toggle de bordes
  const showSlotBorders = useStore(s => s.ui.showSlotBorders);
  const setUI = useStore(s => s.setUI);

  // Estado local para las pestañas de fondo
  const [bgTab, setBgTab] = React.useState<'color' | 'textures' | 'custom'>('color');
  const customBgInputRef = React.useRef<HTMLInputElement>(null);

  const slot = page.slots.find(s => s.id === selectedSlotId);
  const text = page.texts.find(t => t.id === selectedTextId);
  const photo = slot?.photoId ? photos.find(p => p.id === slot.photoId) : null;

  // -------------------------------------------------------------
  // Actualiza un patch a la página actual
  // -------------------------------------------------------------
  const updateCurrentPage = (patch: Partial<Page>) => {
    const pages = project.pages.map((pg, i) =>
      i === project.currentPageIndex ? { ...pg, ...patch } : pg
    );
    setProject({ ...project, pages });
  };

  // Color de fondo (y opcionalmente limpia la imagen)
  const setBackground = (c: string, imageUrl: string | null = null) => {
    updateCurrentPage({ background: c, backgroundImage: imageUrl });
  };

  // Imagen de fondo
  const setBackgroundImage = (url: string | null) => {
    updateCurrentPage({
      backgroundImage: url,
      backgroundImageFit: url ? (page.backgroundImageFit || 'cover') : undefined,
      backgroundImageOpacity: url ? (page.backgroundImageOpacity ?? 1) : undefined,
    });
  };

  const setBackgroundImageFit = (fit: 'cover' | 'contain' | 'repeat') => {
    updateCurrentPage({ backgroundImageFit: fit });
  };

  const setBackgroundImageOpacity = (op: number) => {
    updateCurrentPage({ backgroundImageOpacity: op });
  };

  const setBackgroundOverlay = (color: string | null) => {
    updateCurrentPage({ backgroundOverlay: color });
  };

  return (
    <div className="w-64 lg:w-72 bg-evr-panel border-l border-evr-border flex flex-col shrink-0 overflow-y-auto scroll-thin">
      <div className="p-3 border-b border-evr-border">
        <div className="text-xs font-semibold text-evr-muted uppercase tracking-wide mb-3">
          Propiedades
        </div>

        {slot && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center gap-1.5">
                <ImageIcon size={13} /> Slot
              </div>
              <button
                className="btn-ghost p-1"
                onClick={() => updateSlot(slot.id, { locked: !slot.locked })}
                title={slot.locked ? 'Desbloquear' : 'Bloquear'}
              >
                {slot.locked ? <Lock size={13} /> : <Unlock size={13} />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <NumberField label="X %" value={slot.x} onChange={v => updateSlot(slot.id, { x: v })} />
              <NumberField label="Y %" value={slot.y} onChange={v => updateSlot(slot.id, { y: v })} />
              <NumberField label="W %" value={slot.w} onChange={v => updateSlot(slot.id, { w: v })} />
              <NumberField label="H %" value={slot.h} onChange={v => updateSlot(slot.id, { h: v })} />
            </div>

            <SliderField label="Zoom" min={1} max={3} step={0.01} value={slot.zoom}
              onChange={v => updateSlot(slot.id, { zoom: v })} />
            <SliderField label="Offset X" min={-1} max={1} step={0.01} value={slot.offsetX}
              onChange={v => updateSlot(slot.id, { offsetX: v })} />
            <SliderField label="Offset Y" min={-1} max={1} step={0.01} value={slot.offsetY}
              onChange={v => updateSlot(slot.id, { offsetY: v })} />
            <SliderField label="Rotación" min={-180} max={180} step={1} value={slot.rotation}
              onChange={v => updateSlot(slot.id, { rotation: v })} />

            <div className="flex gap-1">
              <button className="btn-outline flex-1 text-xs" onClick={() => updateSlot(slot.id, { rotation: (slot.rotation + 90) % 360 })}>
                <RotateCw size={12} className="inline" /> 90°
              </button>
              <button className="btn-outline flex-1 text-xs" onClick={() => updateSlot(slot.id, { zoom: 1, offsetX: 0, offsetY: 0 })}>
                <Maximize size={12} className="inline" /> Reset
              </button>
            </div>

            {/* Ajuste de foto dentro del slot */}
            <div>
              <div className="text-[10px] text-evr-muted uppercase tracking-wide mb-1.5">
                Ajuste de la foto
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['cover', 'contain', 'fill'] as const).map(fit => (
                  <button
                    key={fit}
                    className={`btn-outline text-xs py-1.5 ${
                      slot.fit === fit ? 'bg-evr-hover border-evr-accent' : ''
                    }`}
                    onClick={() => updateSlot(slot.id, { fit })}
                    title={
                      fit === 'cover' ? 'Rellenar el slot, recorta si hace falta' :
                      fit === 'contain' ? 'Ajustar sin recortar (deja márgenes)' :
                      'Estirar para llenar (puede deformar)'
                    }
                  >
                    {fit === 'cover' ? 'Cover' : fit === 'contain' ? 'Contain' : 'Fill'}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-evr-muted mt-1 leading-relaxed">
                {slot.fit === 'cover'
                  ? 'La foto llena el slot y se recorta. Ideal para ocupar todo el espacio.'
                  : slot.fit === 'contain'
                  ? 'La foto se ve completa dentro del slot, con márgenes. Sin recortes.'
                  : 'La foto se estira para llenar el slot. Puede deformar.'}
              </div>
            </div>

            {photo && <ResolutionBadge photo={photo} slot={slot} />}

            <MergeSplitTools slot={slot} />
            <AlignTools slot={slot} page={page} />
          </div>
        )}

        {text && (
          <div className="space-y-3">
            <div className="text-sm font-medium flex items-center gap-1.5">
              <Type size={13} /> Texto
            </div>
            <textarea
              className="input w-full text-sm resize-none"
              rows={2}
              value={text.text}
              onChange={e => updateText(text.id, { text: e.target.value })}
            />

            {/* Selector de fuente */}
            <div>
              <label className="text-[10px] text-evr-muted block mb-1">Fuente</label>
              <select
                className="input w-full text-xs"
                value={text.fontFamily}
                onChange={e => {
                  const family = e.target.value;
                  const font = FONT_OPTIONS.find(f => f.family === family);
                  if (font) loadGoogleFont(font.family, font.weights);
                  updateText(text.id, { fontFamily: family });
                }}
              >
                {FONT_OPTIONS.map(font => (
                  <option key={font.family} value={font.family}>
                    {font.family} ({font.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <NumberField label="X %" value={text.x} onChange={v => updateText(text.id, { x: v })} />
              <NumberField label="Y %" value={text.y} onChange={v => updateText(text.id, { y: v })} />
              <NumberField label="Size pt" value={text.fontSize} onChange={v => updateText(text.id, { fontSize: v })} />
              <NumberField label="Peso" value={text.fontWeight} onChange={v => updateText(text.id, { fontWeight: v })} />
              <NumberField label="Tracking" value={text.tracking} onChange={v => updateText(text.id, { tracking: v })} />
              <NumberField label="Interlineado" value={text.lineHeight} step={0.05} onChange={v => updateText(text.id, { lineHeight: v })} />
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['left', 'center', 'right'] as const).map(a => (
                <button
                  key={a}
                  className={`btn-outline text-xs ${text.align === a ? 'bg-evr-hover' : ''}`}
                  onClick={() => updateText(text.id, { align: a })}
                >
                  {a === 'left' ? 'Izq' : a === 'center' ? 'Centro' : 'Der'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-evr-muted">Color</label>
              <input type="color" value={text.color} onChange={e => updateText(text.id, { color: e.target.value })} />
            </div>
            <button className="btn-outline w-full text-xs text-red-400" onClick={() => deleteText(text.id)}>
              <Trash2 size={12} className="inline" /> Eliminar
            </button>
          </div>
        )}

        {!slot && !text && (
          <div className="text-xs text-evr-muted leading-relaxed">
            Selecciona un slot o un texto para editar sus propiedades.<br /><br />
            <span className="text-evr-text">Tips:</span><br />
            • Doble clic en un slot con foto → la vacía<br />
            • Alt + arrastrar dentro de un slot → mueve la foto<br />
            • Espacio + arrastrar → mover canvas<br />
            • Ctrl + rueda → zoom<br />
            • Flechas → mover slot seleccionado<br />
            • Shift+clic → multi-selección
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------
          Vista
          ---------------------------------------------------------------- */}
      <div className="p-3 border-b border-evr-border">
        <div className="text-xs font-semibold text-evr-muted uppercase tracking-wide mb-2">Vista</div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="accent-evr-accent"
            checked={showSlotBorders}
            onChange={e => setUI({ showSlotBorders: e.target.checked })}
          />
          <Box size={12} className="text-evr-muted" />
          <span className="text-xs">Mostrar bordes de los slots</span>
        </label>

        <div className="text-[10px] text-evr-muted mt-1.5 leading-relaxed">
          Desactívalo para una vista limpia sin marcos. El slot seleccionado siempre mostrará su contorno.
        </div>
      </div>

      {/* ----------------------------------------------------------------
          Diseño libre
          ---------------------------------------------------------------- */}
      <div className="p-3 border-b border-evr-border">
        <div className="text-xs font-semibold text-evr-muted uppercase tracking-wide mb-2">
          Diseño libre
        </div>
        <div className="grid grid-cols-2 gap-1">
          <button
            className="btn-outline text-xs flex items-center justify-center gap-1"
            onClick={() => addSlot()}
            title="Añadir un slot vacío en el centro de la página"
          >
            <Square size={12} />
            + Slot libre
          </button>
          <button
            className="btn-outline text-xs flex items-center justify-center gap-1"
            onClick={() => addSlot(undefined, { x: 0, y: 0, w: 100, h: 100, fit: 'contain' })}
            title="Añadir un slot que ocupa toda la página"
          >
            <LayoutGrid size={12} />
            + Full page
          </button>
        </div>
        <div className="text-[10px] text-evr-muted mt-1.5 leading-relaxed">
          Crea contenedores vacíos y arrastra fotos dentro. Muévelos y redimensiónalos libremente.
        </div>
      </div>

      <div className="p-3 border-b border-evr-border">
        <div className="text-xs font-semibold text-evr-muted uppercase tracking-wide mb-2">Añadir texto</div>
        <div className="grid grid-cols-2 gap-1">
          <button className="btn-outline text-xs" onClick={() => addText({ text: 'Título', fontSize: 36, fontWeight: 700 })}>
            <Type size={12} className="inline" /> Título
          </button>
          <button className="btn-outline text-xs" onClick={() => addText({ text: 'Subtítulo', fontSize: 18, fontWeight: 500 })}>
            <Type size={12} className="inline" /> Subtítulo
          </button>
          <button className="btn-outline text-xs" onClick={() => addText({ text: new Date().toLocaleDateString(), fontSize: 12, fontWeight: 400 })}>
            <Type size={12} className="inline" /> Fecha
          </button>
          <button className="btn-outline text-xs" onClick={() => addText({ text: 'Texto libre', fontSize: 14 })}>
            <Type size={12} className="inline" /> Texto
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------
          Fondo de página
          ---------------------------------------------------------------- */}
      <div className="p-3">
        <div className="text-xs font-semibold text-evr-muted uppercase tracking-wide mb-2">
          Fondo de página
        </div>

        {/* Pestañas: Color / Texturas / Imagen */}
        <div className="grid grid-cols-3 gap-1 mb-3">
          <button
            className={`btn-outline text-xs py-1 ${bgTab === 'color' ? 'bg-evr-hover border-evr-accent' : ''}`}
            onClick={() => setBgTab('color')}
          >
            Color
          </button>
          <button
            className={`btn-outline text-xs py-1 ${bgTab === 'textures' ? 'bg-evr-hover border-evr-accent' : ''}`}
            onClick={() => setBgTab('textures')}
          >
            Texturas
          </button>
          <button
            className={`btn-outline text-xs py-1 ${bgTab === 'custom' ? 'bg-evr-hover border-evr-accent' : ''}`}
            onClick={() => setBgTab('custom')}
          >
            Imagen
          </button>
        </div>

        {/* -------- Pestaña: Color -------- */}
        {bgTab === 'color' && (
          <>
            <div className="grid grid-cols-6 gap-1.5 mb-2">
              {[
                '#ffffff', '#faf7f2', '#f5f1ea', '#e8e4dc', '#d4cfc4', '#c9b8a0',
                '#9ca3af', '#4b5563', '#1f2937', '#0f1115', '#000000', '#0a0c10',
                '#fef3c7', '#dbeafe', '#fce7f3', '#dcfce7', '#ede9fe', '#ffedd5',
                '#78350f', '#7c2d12', '#831843', '#4c1d95', '#1e3a5f', '#064e3b',
              ].map(c => (
                <button
                  key={c}
                  className={`w-full aspect-square rounded border-2 transition-all ${
                    page.background === c && !page.backgroundImage
                      ? 'border-evr-accent scale-110 shadow-lg'
                      : 'border-evr-border hover:border-evr-muted'
                  }`}
                  style={{ background: c }}
                  onClick={() => setBackground(c, null)}
                  title={c}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2">
                <label className="text-[10px] text-evr-muted whitespace-nowrap">Personalizado</label>
                <input
                  type="color"
                  value={page.background || '#ffffff'}
                  onChange={e => setBackground(e.target.value, null)}
                  className="flex-1 h-7 cursor-pointer rounded border border-evr-border bg-transparent"
                />
              </div>
              <button
                className="btn-outline text-[10px] px-2 py-1"
                onClick={() => setBackground('#ffffff', null)}
                title="Restablecer a blanco"
              >
                Reset
              </button>
            </div>
          </>
        )}

        {/* -------- Pestaña: Texturas -------- */}
        {bgTab === 'textures' && (
          <>
            <div className="grid grid-cols-3 gap-1.5 mb-2 max-h-64 overflow-y-auto scroll-thin">
              {TEXTURES.map(tex => {
                const isActive = page.backgroundImage === tex.url;
                return (
                  <button
                    key={tex.id}
                    className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                      isActive ? 'border-evr-accent scale-105 shadow-lg' : 'border-evr-border hover:border-evr-muted'
                    }`}
                    onClick={() => setBackgroundImage(tex.url)}
                    title={tex.name}
                  >
                    <img src={tex.preview} alt={tex.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] py-0.5 text-center truncate px-0.5">
                      {tex.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {page.backgroundImage && (
              <button
                className="btn-outline w-full text-xs mb-2"
                onClick={() => setBackgroundImage(null)}
              >
                Quitar textura
              </button>
            )}
          </>
        )}

        {/* -------- Pestaña: Imagen personalizada -------- */}
        {bgTab === 'custom' && (
          <>
            <input
              ref={customBgInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    setBackgroundImage(reader.result);
                  }
                };
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
            <button
              className="btn-outline w-full text-xs mb-2 flex items-center justify-center gap-1"
              onClick={() => customBgInputRef.current?.click()}
            >
              <Upload size={12} /> Subir imagen de fondo
            </button>

            {page.backgroundImage && !TEXTURES.some(t => t.url === page.backgroundImage) && (
              <>
                <div className="aspect-[1.4/1] rounded overflow-hidden border border-evr-border mb-2">
                  <img src={page.backgroundImage} alt="Fondo personalizado" className="w-full h-full object-cover" />
                </div>
                <button
                  className="btn-outline w-full text-xs mb-2"
                  onClick={() => setBackgroundImage(null)}
                >
                  Quitar imagen
                </button>
              </>
            )}
          </>
        )}

        {/* -------- Controles de la imagen de fondo (si hay) -------- */}
        {page.backgroundImage && (
          <div className="space-y-2 mt-3 pt-3 border-t border-evr-border">
            <div>
              <div className="text-[10px] text-evr-muted uppercase tracking-wide mb-1">
                Ajuste de la imagen
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['cover', 'contain', 'repeat'] as const).map(fit => (
                  <button
                    key={fit}
                    className={`btn-outline text-xs py-1 ${
                      (page.backgroundImageFit || 'cover') === fit
                        ? 'bg-evr-hover border-evr-accent'
                        : ''
                    }`}
                    onClick={() => setBackgroundImageFit(fit)}
                  >
                    {fit === 'cover' ? 'Cover' : fit === 'contain' ? 'Contain' : 'Repeat'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-evr-muted mb-0.5">
                <span>Opacidad</span>
                <span>{Math.round((page.backgroundImageOpacity ?? 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={page.backgroundImageOpacity ?? 1}
                onChange={e => setBackgroundImageOpacity(parseFloat(e.target.value))}
                className="w-full accent-evr-accent"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-evr-accent"
                  checked={!!page.backgroundOverlay}
                  onChange={e => {
                    if (e.target.checked) {
                      setBackgroundOverlay('rgba(0,0,0,0.35)');
                    } else {
                      setBackgroundOverlay(null);
                    }
                  }}
                />
                <span className="text-xs">Overlay oscuro</span>
              </div>
              {page.backgroundOverlay && (
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="color"
                    value="#000000"
                    onChange={e => {
                      const hex = e.target.value.replace('#', '');
                      const r = parseInt(hex.slice(0, 2), 16);
                      const g = parseInt(hex.slice(2, 4), 16);
                      const b = parseInt(hex.slice(4, 6), 16);
                      setBackgroundOverlay(`rgba(${r},${g},${b},0.35)`);
                    }}
                    className="w-8 h-6 cursor-pointer rounded border border-evr-border bg-transparent"
                  />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={parseFloat(page.backgroundOverlay.match(/[\d.]+(?=\))/)?.[0] || '0.35')}
                    onChange={e => {
                      const alpha = parseFloat(e.target.value);
                      const base = page.backgroundOverlay!.replace(/[\d.]+(?=\))/, alpha.toString());
                      setBackgroundOverlay(base);
                    }}
                    className="flex-1 accent-evr-accent"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------- Muestra el color/imagen actual -------- */}
        <div className="mt-3 pt-3 border-t border-evr-border flex items-center gap-2 text-[10px] text-evr-muted">
          <div
            className="w-4 h-4 rounded border border-evr-border overflow-hidden"
            style={{ background: page.background || '#ffffff' }}
          >
            {page.backgroundImage && (
              <img src={page.backgroundImage} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <span className="truncate">
            {page.backgroundImage
              ? `Imagen + ${page.background}`
              : `Color: ${page.background || '#ffffff'}`}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Unir / Dividir slots
 * ============================================================ */

function MergeSplitTools({ slot }: { slot: Slot }) {
  const selectedIds = useStore(s => s.ui.selectedSlotIds);
  const mergeSlots = useStore(s => s.mergeSlots);
  const splitSlot = useStore(s => s.splitSlot);
  const canMerge = selectedIds.length >= 2;

  return (
    <div className="border-t border-evr-border pt-3 mt-3">
      <div className="text-[10px] text-evr-muted uppercase tracking-wide mb-1.5">
        Combinar slots
      </div>

      <button
        className={`btn-outline w-full text-xs mb-1 flex items-center justify-center gap-1.5 ${
          canMerge ? '' : 'opacity-40 cursor-not-allowed'
        }`}
        onClick={() => canMerge && mergeSlots(selectedIds)}
        disabled={!canMerge}
        title={
          canMerge
            ? `Unir ${selectedIds.length} slots en uno solo`
            : 'Selecciona 2 o más slots con Shift+clic'
        }
      >
        <Combine size={13} />
        Unir {selectedIds.length >= 2 ? `(${selectedIds.length})` : ''}
      </button>

      <div className="grid grid-cols-2 gap-1">
        <button
          className="btn-outline text-xs flex items-center justify-center gap-1"
          onClick={() => splitSlot(slot.id, 'h')}
          title="Dividir el slot en 2 mitades izquierda/derecha"
        >
          <SplitSquareHorizontal size={12} />
          Horiz
        </button>
        <button
          className="btn-outline text-xs flex items-center justify-center gap-1"
          onClick={() => splitSlot(slot.id, 'v')}
          title="Dividir el slot en 2 mitades arriba/abajo"
        >
          <SplitSquareVertical size={12} />
          Vert
        </button>
      </div>

      {selectedIds.length > 1 && (
        <div className="text-[10px] text-evr-accent mt-1.5">
          {selectedIds.length} slots seleccionados
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Alineación y distribución
 * ============================================================ */

function AlignTools({ slot, page }: { slot: Slot; page: Page }) {
  const updateSlot = useStore(s => s.updateSlot);

  const others = page.slots.filter((s: Slot) => s.id !== slot.id);

  const alignPageLeft = () => updateSlot(slot.id, { x: 0 });
  const alignPageRight = () => updateSlot(slot.id, { x: 100 - slot.w });
  const alignPageTop = () => updateSlot(slot.id, { y: 0 });
  const alignPageBottom = () => updateSlot(slot.id, { y: 100 - slot.h });
  const alignPageCenterH = () => updateSlot(slot.id, { x: 50 - slot.w / 2 });
  const alignPageCenterV = () => updateSlot(slot.id, { y: 50 - slot.h / 2 });

  const alignWithNeighbor = (
    dir: 'left' | 'right' | 'top' | 'bottom' | 'centerH' | 'centerV'
  ) => {
    if (others.length === 0) return;
    const cx = slot.x + slot.w / 2;
    const cy = slot.y + slot.h / 2;
    const nearest = others.reduce((best: Slot, s: Slot) => {
      const bcx = best.x + best.w / 2;
      const bcy = best.y + best.h / 2;
      const scx = s.x + s.w / 2;
      const scy = s.y + s.h / 2;
      const dB = Math.hypot(bcx - cx, bcy - cy);
      const dS = Math.hypot(scx - cx, scy - cy);
      return dS < dB ? s : best;
    }, others[0]);

    switch (dir) {
      case 'left':
        updateSlot(slot.id, { x: nearest.x });
        break;
      case 'right':
        updateSlot(slot.id, { x: nearest.x + nearest.w - slot.w });
        break;
      case 'top':
        updateSlot(slot.id, { y: nearest.y });
        break;
      case 'bottom':
        updateSlot(slot.id, { y: nearest.y + nearest.h - slot.h });
        break;
      case 'centerH':
        updateSlot(slot.id, { x: nearest.x + nearest.w / 2 - slot.w / 2 });
        break;
      case 'centerV':
        updateSlot(slot.id, { y: nearest.y + nearest.h / 2 - slot.h / 2 });
        break;
    }
  };

  const distributeH = () => {
    if (page.slots.length < 3) return;
    const sorted = [...page.slots].sort((a: Slot, b: Slot) => a.x - b.x);
    const totalW = sorted.reduce((sum: number, s: Slot) => sum + s.w, 0);
    const gaps = sorted.length - 1;
    const availableSpace = 100 - totalW;
    const gap = availableSpace / gaps;
    let cursor = 0;
    sorted.forEach((s: Slot) => {
      updateSlot(s.id, { x: cursor });
      cursor += s.w + gap;
    });
  };

  const distributeV = () => {
    if (page.slots.length < 3) return;
    const sorted = [...page.slots].sort((a: Slot, b: Slot) => a.y - b.y);
    const totalH = sorted.reduce((sum: number, s: Slot) => sum + s.h, 0);
    const gaps = sorted.length - 1;
    const availableSpace = 100 - totalH;
    const gap = availableSpace / gaps;
    let cursor = 0;
    sorted.forEach((s: Slot) => {
      updateSlot(s.id, { y: cursor });
      cursor += s.h + gap;
    });
  };

  const IconBtn = ({
    onClick,
    title,
    children,
    disabled
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      className="btn-outline text-xs py-1 flex items-center justify-center disabled:opacity-30"
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );

  return (
    <div className="border-t border-evr-border pt-3 mt-3">
      <div className="text-[10px] text-evr-muted uppercase tracking-wide mb-1.5">
        Alinear a la página
      </div>
      <div className="grid grid-cols-3 gap-1 mb-3">
        <IconBtn onClick={alignPageLeft} title="Borde izquierdo">
          <ArrowLeftToLine size={14} />
        </IconBtn>
        <IconBtn onClick={alignPageCenterH} title="Centrar horizontal">
          <AlignCenterVertical size={14} />
        </IconBtn>
        <IconBtn onClick={alignPageRight} title="Borde derecho">
          <ArrowRightToLine size={14} />
        </IconBtn>
        <IconBtn onClick={alignPageTop} title="Borde superior">
          <ArrowUpToLine size={14} />
        </IconBtn>
        <IconBtn onClick={alignPageCenterV} title="Centrar vertical">
          <AlignCenterHorizontal size={14} />
        </IconBtn>
        <IconBtn onClick={alignPageBottom} title="Borde inferior">
          <ArrowDownToLine size={14} />
        </IconBtn>
      </div>

      {others.length > 0 && (
        <>
          <div className="text-[10px] text-evr-muted uppercase tracking-wide mb-1.5">
            Con vecino más cercano
          </div>
          <div className="grid grid-cols-3 gap-1 mb-3">
            <IconBtn onClick={() => alignWithNeighbor('left')} title="Borde izquierdo">
              <AlignStartVertical size={14} />
            </IconBtn>
            <IconBtn onClick={() => alignWithNeighbor('centerH')} title="Centrar horizontal">
              <AlignCenterVertical size={14} />
            </IconBtn>
            <IconBtn onClick={() => alignWithNeighbor('right')} title="Borde derecho">
              <AlignEndVertical size={14} />
            </IconBtn>
            <IconBtn onClick={() => alignWithNeighbor('top')} title="Borde superior">
              <AlignStartHorizontal size={14} />
            </IconBtn>
            <IconBtn onClick={() => alignWithNeighbor('centerV')} title="Centrar vertical">
              <AlignCenterHorizontal size={14} />
            </IconBtn>
            <IconBtn onClick={() => alignWithNeighbor('bottom')} title="Borde inferior">
              <AlignEndHorizontal size={14} />
            </IconBtn>
          </div>
        </>
      )}

      {page.slots.length >= 3 && (
        <>
          <div className="text-[10px] text-evr-muted uppercase tracking-wide mb-1.5">
            Distribuir uniformemente
          </div>
          <div className="grid grid-cols-2 gap-1">
            <IconBtn onClick={distributeH} title="Distribuir horizontalmente">
              <MoveHorizontal size={14} />
              <span className="ml-1">Horiz</span>
            </IconBtn>
            <IconBtn onClick={distributeV} title="Distribuir verticalmente">
              <MoveVertical size={14} />
              <span className="ml-1">Vert</span>
            </IconBtn>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
 * Inputs auxiliares
 * ============================================================ */

function NumberField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="text-[10px] text-evr-muted">{label}</span>
      <input
        type="number"
        step={step}
        className="input text-xs"
        value={Math.round(value * 100) / 100}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
      />
    </label>
  );
}

function SliderField({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-evr-muted mb-0.5">
        <span>{label}</span>
        <span>{Math.round(value * 100) / 100}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-evr-accent"
      />
    </div>
  );
}

function ResolutionBadge({ photo, slot }: { photo: Photo; slot: Slot }) {
  const size = useAlbumSize();
  const info = computeEffectiveDpi(photo, slot, size, 300);
  return (
    <div className="flex items-center justify-between text-xs border border-evr-border rounded p-2">
      <span className="text-evr-muted">Resolución</span>
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: QUALITY_COLOR[info.level] }} />
        <span>{info.effectiveDpi} DPI</span>
        <span className="text-evr-muted">· {QUALITY_LABEL[info.level]}</span>
      </span>
    </div>
  );
}
