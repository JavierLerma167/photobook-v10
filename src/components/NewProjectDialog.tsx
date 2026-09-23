// src/components/NewProjectDialog.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/src/store/projectStore';
import { X, LayoutGrid } from 'lucide-react';
import { AlbumSize, AlbumSizeId, Unit, Orientation } from '@/src/types';

// ============================================================
// PRESETS (organizados por categorías, estilo Photoshop)
// ============================================================
interface PresetDef {
  id: string;
  label: string;
  widthIn: number;
  heightIn: number;
  dpi: number;
  category: string;
}

const PRESETS: PresetDef[] = [
  // ----- Álbumes cuadrados -----
  { id: '8x8',   label: '8 × 8 in',   widthIn: 8,  heightIn: 8,  dpi: 300, category: 'Álbumes cuadrados' },
  { id: '10x10', label: '10 × 10 in', widthIn: 10, heightIn: 10, dpi: 300, category: 'Álbumes cuadrados' },
  { id: '12x12', label: '12 × 12 in', widthIn: 12, heightIn: 12, dpi: 300, category: 'Álbumes cuadrados' },

  // ----- Álbumes apaisados -----
  { id: '11x14', label: '14 × 11 in', widthIn: 14, heightIn: 11, dpi: 300, category: 'Álbumes apaisados' },
  { id: '12x9',  label: '12 × 9 in',  widthIn: 12, heightIn: 9,  dpi: 300, category: 'Álbumes apaisados' },
  { id: '10x8',  label: '10 × 8 in',  widthIn: 10, heightIn: 8,  dpi: 300, category: 'Álbumes apaisados' },

  // ----- Álbumes verticales -----
  { id: '8x10',  label: '8 × 10 in',  widthIn: 8,  heightIn: 10, dpi: 300, category: 'Álbumes verticales' },
  { id: '9x12',  label: '9 × 12 in',  widthIn: 9,  heightIn: 12, dpi: 300, category: 'Álbumes verticales' },
  { id: '11x14p',label: '11 × 14 in', widthIn: 11, heightIn: 14, dpi: 300, category: 'Álbumes verticales' },

  // ----- Formatos internacionales -----
  { id: 'a4',     label: 'A4 · 21 × 29.7 cm', widthIn: 8.27, heightIn: 11.69, dpi: 300, category: 'Formatos internacionales' },
  { id: 'a3',     label: 'A3 · 29.7 × 42 cm', widthIn: 11.69, heightIn: 16.54, dpi: 300, category: 'Formatos internacionales' },
  { id: 'letter', label: 'Carta · 8.5 × 11 in', widthIn: 8.5, heightIn: 11, dpi: 300, category: 'Formatos internacionales' },
  { id: 'legal',  label: 'Legal · 8.5 × 14 in', widthIn: 8.5, heightIn: 14, dpi: 300, category: 'Formatos internacionales' },
];

// ============================================================
// CONVERSIÓN DE UNIDADES (normalizamos a pulgadas internamente)
// ============================================================
const TO_INCHES: Record<Unit, number> = {
  in: 1,
  cm: 1 / 2.54,
  mm: 1 / 25.4,
  px: 1 / 300, // se asume 300 DPI para convertir px → in
};

const FROM_INCHES: Record<Unit, number> = {
  in: 1,
  cm: 2.54,
  mm: 25.4,
  px: 300,
};

// Redondeo útil para mostrar valores en los inputs
const round = (v: number, decimals = 2) => {
  const f = Math.pow(10, decimals);
  return Math.round(v * f) / f;
};

// ============================================================
// COMPONENTE
// ============================================================
export function NewProjectDialog() {
  const open = useStore(s => s.ui.newProjectOpen);
  const setUI = useStore(s => s.setUI);
  const newProject = useStore(s => s.newProject);

  // ---------- Estado del formulario ----------
  const [name, setName] = useState('Mi Álbum');
  const [isCustom, setIsCustom] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('10x10');

  // Campos personalizados
  const [unit, setUnit] = useState<Unit>('in');
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [dpi, setDpi] = useState(300);
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  // ---------- Reset al abrir ----------
  useEffect(() => {
    if (open) {
      setName('Mi Álbum');
      setIsCustom(false);
      setSelectedPresetId('10x10');
      const p = PRESETS.find(x => x.id === '10x10')!;
      setWidth(p.widthIn);
      setHeight(p.heightIn);
      setDpi(p.dpi);
      setUnit('in');
      setOrientation('portrait');
    }
  }, [open]);

  // ---------- Preset activo ----------
  const activePreset = useMemo(
    () => PRESETS.find(p => p.id === selectedPresetId) ?? PRESETS[1],
    [selectedPresetId]
  );

  // ---------- Valores finales en pulgadas ----------
  const rawWidthIn  = isCustom ? width  * TO_INCHES[unit] : activePreset.widthIn;
  const rawHeightIn = isCustom ? height * TO_INCHES[unit] : activePreset.heightIn;
  const finalDpi    = isCustom ? dpi : activePreset.dpi;

  // ---------- Orientación ----------
  const orientedWidthIn  = orientation === 'portrait'
    ? Math.min(rawWidthIn, rawHeightIn)
    : Math.max(rawWidthIn, rawHeightIn);
  const orientedHeightIn = orientation === 'portrait'
    ? Math.max(rawWidthIn, rawHeightIn)
    : Math.min(rawWidthIn, rawHeightIn);

  // ---------- Vista previa ----------
  const previewMaxW = 200;
  const previewMaxH = 150;
  const aspect = orientedWidthIn / orientedHeightIn;
  let previewW = previewMaxW;
  let previewH = previewW / aspect;
  if (previewH > previewMaxH) {
    previewH = previewMaxH;
    previewW = previewH * aspect;
  }

  if (!open) return null;

  // ---------- Handlers ----------
  const handlePresetClick = (preset: PresetDef) => {
    setSelectedPresetId(preset.id);
    setIsCustom(false);
    // Sincronizamos los campos personalizados con el preset (por si el usuario
    // cambia de preset a personalizado sin editar nada antes)
    setWidth(round(preset.widthIn * FROM_INCHES[unit]));
    setHeight(round(preset.heightIn * FROM_INCHES[unit]));
    setDpi(preset.dpi);
    setOrientation(preset.widthIn > preset.heightIn ? 'landscape' : 'portrait');
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    setSelectedPresetId('');
    // Partimos del preset activo como valores iniciales
    setWidth(round(activePreset.widthIn * FROM_INCHES[unit]));
    setHeight(round(activePreset.heightIn * FROM_INCHES[unit]));
    setDpi(activePreset.dpi);
  };

  const handleCreate = () => {
    const size: AlbumSize = {
      id: (isCustom ? 'custom' : activePreset.id) as AlbumSizeId,
      label: isCustom
        ? `${round(width, 2)} × ${round(height, 2)} ${unit}`
        : activePreset.label,
      widthIn: round(orientedWidthIn, 4),
      heightIn: round(orientedHeightIn, 4),
      bleedIn: 0.125,
      safeIn: 0.3,
      gutterIn: 0.3,
      unit: isCustom ? unit : 'in',
      orientation,
      dpi: finalDpi,
    };
    newProject(name.trim() || 'Sin título', size);
    setUI({ newProjectOpen: false });
  };

  // ---------- Agrupación de presets por categoría ----------
  const categories = Array.from(new Set(PRESETS.map(p => p.category)));

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={() => setUI({ newProjectOpen: false })}
    >
      <div
        className="bg-evr-panel border border-evr-border rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* ===================== CABECERA ===================== */}
        <div className="flex items-center justify-between p-4 border-b border-evr-border">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} className="text-evr-accent" />
            <div className="font-semibold text-base">Nuevo proyecto</div>
          </div>
          <button
            className="btn-ghost p-1"
            onClick={() => setUI({ newProjectOpen: false })}
            title="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* ===================== CUERPO ===================== */}
        <div className="flex flex-1 min-h-0">
          {/* ---------- Columna izquierda: presets ---------- */}
          <div className="w-72 border-r border-evr-border flex flex-col min-h-0">
            <div className="p-3 border-b border-evr-border">
              <div className="text-[10px] font-semibold text-evr-muted uppercase tracking-wider">
                Tamaños predefinidos
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scroll-thin p-3 space-y-4">
              {categories.map(cat => (
                <div key={cat}>
                  <div className="text-[10px] text-evr-muted uppercase tracking-wider mb-1.5">
                    {cat}
                  </div>
                  <div className="space-y-0.5">
                    {PRESETS.filter(p => p.category === cat).map(p => {
                      const active = !isCustom && selectedPresetId === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handlePresetClick(p)}
                          className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors flex items-center justify-between gap-2 ${
                            active
                              ? 'bg-evr-accent text-black font-medium'
                              : 'hover:bg-evr-hover text-evr-text'
                          }`}
                        >
                          <span className="truncate">{p.label}</span>
                          <span className={`text-[9px] ${active ? 'text-black/60' : 'text-evr-muted'}`}>
                            {p.dpi}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Separador + Personalizado */}
              <div className="pt-3 border-t border-evr-border">
                <div className="text-[10px] text-evr-muted uppercase tracking-wider mb-1.5">
                  Otro
                </div>
                <button
                  onClick={handleCustomToggle}
                  className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                    isCustom
                      ? 'bg-evr-accent text-black font-medium'
                      : 'hover:bg-evr-hover text-evr-text'
                  }`}
                >
                  Personalizado…
                </button>
              </div>
            </div>
          </div>

          {/* ---------- Columna derecha: vista previa + ajustes ---------- */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Vista previa */}
            <div className="flex-1 flex items-center justify-center p-6 bg-evr-bg/60 min-h-[200px]">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="bg-white rounded shadow-2xl border border-evr-border flex items-center justify-center transition-all duration-200"
                  style={{ width: previewW, height: previewH }}
                >
                  <span className="text-[10px] text-neutral-500 select-none">
                    {round(orientedWidthIn, 2)} × {round(orientedHeightIn, 2)} in
                  </span>
                </div>
                <div className="text-[11px] text-evr-muted text-center">
                  {orientedWidthIn.toFixed(2)} × {orientedHeightIn.toFixed(2)} in
                  {' · '}
                  {(orientedWidthIn * 2.54).toFixed(1)} × {(orientedHeightIn * 2.54).toFixed(1)} cm
                  {' · '}
                  {finalDpi} DPI
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="p-4 border-t border-evr-border space-y-4 overflow-y-auto scroll-thin">
              {/* Nombre */}
              <div>
                <label className="text-xs text-evr-muted block mb-1">Nombre</label>
                <input
                  className="input w-full"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Unidad + DPI + Orientación */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-evr-muted block mb-1">Unidad</label>
                  <select
                    className="input w-full text-sm"
                    value={unit}
                    onChange={e => setUnit(e.target.value as Unit)}
                  >
                    <option value="in">Pulgadas (in)</option>
                    <option value="cm">Centímetros (cm)</option>
                    <option value="mm">Milímetros (mm)</option>
                    <option value="px">Píxeles (px)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-evr-muted block mb-1">Resolución</label>
                  <select
                    className="input w-full text-sm"
                    value={dpi}
                    onChange={e => setDpi(parseInt(e.target.value))}
                    disabled={!isCustom}
                    title={!isCustom ? 'Disponible solo en tamaño personalizado' : ''}
                  >
                    <option value={150}>150 DPI · Borrador</option>
                    <option value={300}>300 DPI · Impresión</option>
                    <option value={600}>600 DPI · Alta calidad</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-evr-muted block mb-1">Orientación</label>
                  <div className="flex gap-1">
                    <button
                      className={`flex-1 btn-outline text-xs py-1.5 flex items-center justify-center ${
                        orientation === 'portrait' ? 'bg-evr-hover border-evr-accent' : ''
                      }`}
                      onClick={() => setOrientation('portrait')}
                      title="Vertical"
                    >
                      <div className="w-3 h-4 border border-current rounded-sm" />
                    </button>
                    <button
                      className={`flex-1 btn-outline text-xs py-1.5 flex items-center justify-center ${
                        orientation === 'landscape' ? 'bg-evr-hover border-evr-accent' : ''
                      }`}
                      onClick={() => setOrientation('landscape')}
                      title="Horizontal"
                    >
                      <div className="w-4 h-3 border border-current rounded-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ancho y alto (solo en modo personalizado) */}
              {isCustom && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-evr-muted block mb-1">
                      Ancho ({unit})
                    </label>
                    <input
                      type="number"
                      className="input w-full text-sm"
                      value={width}
                      min={0.1}
                      step={unit === 'px' ? 1 : 0.1}
                      onChange={e => setWidth(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-evr-muted block mb-1">
                      Alto ({unit})
                    </label>
                    <input
                      type="number"
                      className="input w-full text-sm"
                      value={height}
                      min={0.1}
                      step={unit === 'px' ? 1 : 0.1}
                      onChange={e => setHeight(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}

              {/* Resumen final */}
              <div className="text-[10px] text-evr-muted bg-evr-bg border border-evr-border rounded p-2 space-y-0.5">
                <div>
                  <span className="text-evr-text">Tamaño final:</span>{' '}
                  {orientedWidthIn.toFixed(2)} × {orientedHeightIn.toFixed(2)} in
                  {' '}
                  ({(orientedWidthIn * 2.54).toFixed(1)} × {(orientedHeightIn * 2.54).toFixed(1)} cm)
                </div>
                <div>
                  <span className="text-evr-text">Orientación:</span>{' '}
                  {orientation === 'portrait' ? 'Vertical' : 'Horizontal'}
                </div>
                <div>
                  <span className="text-evr-text">Resolución:</span> {finalDpi} DPI
                </div>
                <div>
                  <span className="text-evr-text">Sangrado / Área segura / Medianil:</span>{' '}
                  0.125 in · 0.3 in · 0.3 in
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== PIE ===================== */}
        <div className="flex justify-end gap-2 p-4 border-t border-evr-border">
          <button
            className="btn-outline"
            onClick={() => setUI({ newProjectOpen: false })}
          >
            Cancelar
          </button>
          <button
            className="btn-accent"
            onClick={handleCreate}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
