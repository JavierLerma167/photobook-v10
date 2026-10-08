// src/engine/templates.ts
import { Template } from '@/src/types';

const S = (x: number, y: number, w: number, h: number) => ({ x, y, w, h });

// ============================================================
// PLANTILLAS DE CONTENIDO
// ============================================================
export const BUILTIN_TEMPLATES: Template[] = [

  // ============================================================
  // 1 FOTO — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't1-full', name: 'Full Bleed', category: '1', style: 'Full Bleed', photoCount: 1, builtin: true,
    slots: [S(0, 0, 100, 100)] },
  { id: 't1-wide-strip', name: 'Franja Horizontal', category: '1', style: 'Full Bleed', photoCount: 1, builtin: true,
    slots: [S(0, 40, 100, 20)] },
  // Minimal
  { id: 't1-center', name: 'Centro', category: '1', style: 'Minimal', photoCount: 1, builtin: true,
    slots: [S(10, 10, 80, 80)] },
  { id: 't1-center-tight', name: 'Centro Ajustado', category: '1', style: 'Minimal', photoCount: 1, builtin: true,
    slots: [S(15, 15, 70, 70)] },
  // Panorama
  { id: 't1-pano', name: 'Panorama', category: '1', style: 'Panorama', photoCount: 1, builtin: true,
    slots: [S(4, 30, 92, 40)] },
  { id: 't1-pano-top', name: 'Pano Arriba', category: '1', style: 'Panorama', photoCount: 1, builtin: true,
    slots: [S(4, 4, 92, 40)] },
  // Luxury
  { id: 't1-portrait-lux', name: 'Retrato Luxury', category: '1', style: 'Luxury', photoCount: 1, builtin: true,
    slots: [S(20, 5, 60, 90)] },
  { id: 't1-circle-lux', name: 'Círculo Luxury', category: '1', style: 'Luxury', photoCount: 1, builtin: true,
    slots: [S(15, 15, 70, 70)] },
  // Classic
  { id: 't1-square-center', name: 'Cuadrado Centrado', category: '1', style: 'Classic', photoCount: 1, builtin: true,
    slots: [S(15, 15, 70, 70)] },
  { id: 't1-frame-classic', name: 'Marco Clásico', category: '1', style: 'Classic', photoCount: 1, builtin: true,
    slots: [S(8, 8, 84, 84)] },
  // Editorial
  { id: 't1-left-anchor', name: 'Anclado Izquierda', category: '1', style: 'Editorial', photoCount: 1, builtin: true,
    slots: [S(4, 4, 60, 92)] },
  { id: 't1-right-anchor', name: 'Anclado Derecha', category: '1', style: 'Editorial', photoCount: 1, builtin: true,
    slots: [S(40, 4, 56, 92)] },
  // Magazine
  { id: 't1-band-mid', name: 'Banda Central', category: '1', style: 'Magazine', photoCount: 1, builtin: true,
    slots: [S(4, 25, 92, 50)] },
  { id: 't1-hero-wide', name: 'Hero Ancho', category: '1', style: 'Magazine', photoCount: 1, builtin: true,
    slots: [S(0, 25, 100, 50)] },
  // Wedding
  { id: 't1-portrait-tall', name: 'Retrato Vertical', category: '1', style: 'Wedding', photoCount: 1, builtin: true,
    slots: [S(25, 4, 50, 92)] },
  { id: 't1-wedding-center', name: 'Wedding Centro', category: '1', style: 'Wedding', photoCount: 1, builtin: true,
    slots: [S(20, 20, 60, 60)] },
  // Dynamic
  { id: 't1-diamond', name: 'Diamante', category: '1', style: 'Dynamic', photoCount: 1, builtin: true,
    slots: [S(20, 20, 60, 60)] },
  { id: 't1-dynamic-diag', name: 'Diagonal', category: '1', style: 'Dynamic', photoCount: 1, builtin: true,
    slots: [S(10, 5, 80, 60)] },
  // Collage
  { id: 't1-polaroid', name: 'Polaroid', category: '1', style: 'Collage', photoCount: 1, builtin: true,
    slots: [S(12, 8, 76, 80)] },
  { id: 't1-collage-off', name: 'Collage Descentrado', category: '1', style: 'Collage', photoCount: 1, builtin: true,
    slots: [S(8, 15, 70, 70)] },
  // Grid
  { id: 't1-grid-full', name: 'Grid Full', category: '1', style: 'Grid', photoCount: 1, builtin: true,
    slots: [S(0, 0, 100, 100)] },
  { id: 't1-grid-margin', name: 'Grid con Margen', category: '1', style: 'Grid', photoCount: 1, builtin: true,
    slots: [S(6, 6, 88, 88)] },
  // Mosaic
  { id: 't1-mosaic-big', name: 'Mosaico Grande', category: '1', style: 'Mosaic', photoCount: 1, builtin: true,
    slots: [S(4, 4, 92, 92)] },
  { id: 't1-mosaic-small', name: 'Mosaico Pequeño', category: '1', style: 'Mosaic', photoCount: 1, builtin: true,
    slots: [S(15, 15, 70, 70)] },

  // ============================================================
  // 2 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't2-split-v-tight', name: 'Split Vertical Juntos', category: '2', style: 'Full Bleed', photoCount: 2, builtin: true,
    slots: [S(0, 0, 50, 100), S(50, 0, 50, 100)] },
  { id: 't2-split-h-tight', name: 'Split Horizontal Juntos', category: '2', style: 'Full Bleed', photoCount: 2, builtin: true,
    slots: [S(0, 0, 100, 50), S(0, 50, 100, 50)] },
  // Minimal
  { id: 't2-min-pair', name: 'Dúo Minimal', category: '2', style: 'Minimal', photoCount: 2, builtin: true,
    slots: [S(10, 10, 35, 80), S(55, 10, 35, 80)] },
  { id: 't2-min-two-bands', name: 'Dos Bandas Minimal', category: '2', style: 'Minimal', photoCount: 2, builtin: true,
    slots: [S(4, 15, 92, 30), S(4, 55, 92, 30)] },
  // Panorama
  { id: 't2-stack-pano', name: 'Dos Panorámicas', category: '2', style: 'Panorama', photoCount: 2, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 92, 44)] },
  { id: 't2-pano-pair', name: 'Par Panorámico', category: '2', style: 'Panorama', photoCount: 2, builtin: true,
    slots: [S(4, 10, 92, 35), S(4, 55, 92, 35)] },
  // Luxury
  { id: 't2-lux-pair', name: 'Dúo Luxury', category: '2', style: 'Luxury', photoCount: 2, builtin: true,
    slots: [S(8, 8, 38, 84), S(54, 8, 38, 84)] },
  { id: 't2-lux-band', name: 'Luxury Band Dúo', category: '2', style: 'Luxury', photoCount: 2, builtin: true,
    slots: [S(10, 10, 80, 38), S(10, 52, 80, 38)] },
  // Classic
  { id: 't2-equal-classic', name: 'Clásico Igual', category: '2', style: 'Classic', photoCount: 2, builtin: true,
    slots: [S(6, 6, 42, 88), S(52, 6, 42, 88)] },
  { id: 't2-square-pair', name: 'Dúo Cuadrado', category: '2', style: 'Classic', photoCount: 2, builtin: true,
    slots: [S(6, 25, 42, 50), S(52, 25, 42, 50)] },
  // Editorial
  { id: 't2-split-v', name: 'Split Vertical', category: '2', style: 'Editorial', photoCount: 2, builtin: true,
    slots: [S(4, 4, 44, 92), S(52, 4, 44, 92)] },
  { id: 't2-split-h', name: 'Split Horizontal', category: '2', style: 'Editorial', photoCount: 2, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 92, 44)] },
  // Magazine
  { id: 't2-hero-small', name: 'Hero + Detalle', category: '2', style: 'Magazine', photoCount: 2, builtin: true,
    slots: [S(4, 4, 64, 92), S(72, 4, 24, 92)] },
  { id: 't2-magazine', name: 'Magazine Split', category: '2', style: 'Magazine', photoCount: 2, builtin: true,
    slots: [S(4, 4, 92, 58), S(4, 66, 92, 30)] },
  // Wedding
  { id: 't2-wedding-pair', name: 'Pareja Wedding', category: '2', style: 'Wedding', photoCount: 2, builtin: true,
    slots: [S(10, 10, 35, 80), S(55, 10, 35, 80)] },
  { id: 't2-wedding-band', name: 'Wedding Band Dúo', category: '2', style: 'Wedding', photoCount: 2, builtin: true,
    slots: [S(10, 20, 80, 25), S(10, 55, 80, 25)] },
  // Dynamic
  { id: 't2-diagonal', name: 'Diagonal Editorial', category: '2', style: 'Dynamic', photoCount: 2, builtin: true,
    slots: [S(4, 4, 70, 55), S(30, 45, 66, 51)] },
  { id: 't2-overlap', name: 'Superposición', category: '2', style: 'Dynamic', photoCount: 2, builtin: true,
    slots: [S(4, 4, 60, 70), S(35, 25, 60, 70)] },
  // Collage
  { id: 't2-collage-pair', name: 'Collage Dúo', category: '2', style: 'Collage', photoCount: 2, builtin: true,
    slots: [S(4, 4, 50, 60), S(40, 30, 56, 66)] },
  { id: 't2-collage-two', name: 'Collage Dos', category: '2', style: 'Collage', photoCount: 2, builtin: true,
    slots: [S(8, 8, 45, 45), S(45, 45, 45, 45)] },
  // Grid
  { id: 't2-grid-2-tight', name: 'Grid 1×2 Juntos', category: '2', style: 'Grid', photoCount: 2, builtin: true,
    slots: [S(0, 0, 50, 100), S(50, 0, 50, 100)] },
  { id: 't2-grid-2-col', name: 'Grid 2 Columnas', category: '2', style: 'Grid', photoCount: 2, builtin: true,
    slots: [S(6, 6, 42, 88), S(52, 6, 42, 88)] },
  // Mosaic
  { id: 't2-mosaic-big-small', name: 'Mosaico Grande + Pequeño', category: '2', style: 'Mosaic', photoCount: 2, builtin: true,
    slots: [S(4, 4, 60, 92), S(68, 4, 28, 44)] },
  { id: 't2-mosaic-bands', name: 'Mosaico Bandas', category: '2', style: 'Mosaic', photoCount: 2, builtin: true,
    slots: [S(4, 4, 92, 40), S(4, 48, 44, 44)] },

  // ============================================================
  // 3 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't3-column-tight', name: 'Columnas Juntas', category: '3', style: 'Full Bleed', photoCount: 3, builtin: true,
    slots: [S(0, 0, 33.33, 100), S(33.33, 0, 33.33, 100), S(66.66, 0, 33.34, 100)] },
  { id: 't3-rows-tight', name: 'Filas Juntas', category: '3', style: 'Full Bleed', photoCount: 3, builtin: true,
    slots: [S(0, 0, 100, 33.33), S(0, 33.33, 100, 33.33), S(0, 66.66, 100, 33.34)] },
  // Minimal
  { id: 't3-column', name: 'Columnas', category: '3', style: 'Minimal', photoCount: 3, builtin: true,
    slots: [S(4, 4, 28, 92), S(36, 4, 28, 92), S(68, 4, 28, 92)] },
  { id: 't3-stack', name: 'Apilado Horizontal', category: '3', style: 'Minimal', photoCount: 3, builtin: true,
    slots: [S(4, 4, 92, 28), S(4, 36, 92, 28), S(4, 68, 92, 28)] },
  // Panorama
  { id: 't3-pano-2', name: 'Panorama + 2', category: '3', style: 'Panorama', photoCount: 3, builtin: true,
    slots: [S(4, 4, 92, 50), S(4, 58, 44, 38), S(52, 58, 44, 38)] },
  { id: 't3-pano-hero', name: 'Pano Hero + 2', category: '3', style: 'Panorama', photoCount: 3, builtin: true,
    slots: [S(4, 4, 92, 55), S(4, 63, 44, 33), S(52, 63, 44, 33)] },
  // Luxury
  { id: 't3-lux-band', name: 'Luxury Band', category: '3', style: 'Luxury', photoCount: 3, builtin: true,
    slots: [S(4, 10, 92, 40), S(4, 54, 44, 32), S(52, 54, 44, 32)] },
  { id: 't3-lux-triangle', name: 'Luxury Triangle', category: '3', style: 'Luxury', photoCount: 3, builtin: true,
    slots: [S(8, 8, 34, 34), S(58, 8, 34, 34), S(33, 55, 34, 34)] },
  // Classic
  { id: 't3-classic-3', name: 'Clásico 3', category: '3', style: 'Classic', photoCount: 3, builtin: true,
    slots: [S(6, 6, 40, 40), S(54, 6, 40, 40), S(30, 54, 40, 40)] },
  { id: 't3-classic-row', name: 'Clásico Fila', category: '3', style: 'Classic', photoCount: 3, builtin: true,
    slots: [S(4, 30, 28, 40), S(36, 30, 28, 40), S(68, 30, 28, 40)] },
  // Editorial
  { id: 't3-hero-2', name: 'Hero + 2', category: '3', style: 'Editorial', photoCount: 3, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28)] },
  { id: 't3-hero-bottom', name: '2 + Hero Abajo', category: '3', style: 'Editorial', photoCount: 3, builtin: true,
    slots: [S(4, 4, 44, 60), S(52, 4, 44, 60), S(4, 68, 92, 28)] },
  // Magazine
  { id: 't3-feature', name: 'Feature', category: '3', style: 'Magazine', photoCount: 3, builtin: true,
    slots: [S(4, 4, 92, 58), S(4, 66, 44, 30), S(52, 66, 44, 30)] },
  { id: 't3-magazine', name: 'Magazine 3', category: '3', style: 'Magazine', photoCount: 3, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 92, 44)] },
  // Wedding
  { id: 't3-wedding-trio', name: 'Trío Wedding', category: '3', style: 'Wedding', photoCount: 3, builtin: true,
    slots: [S(20, 4, 60, 60), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  { id: 't3-wedding-row', name: 'Wedding Fila', category: '3', style: 'Wedding', photoCount: 3, builtin: true,
    slots: [S(6, 15, 28, 70), S(36, 15, 28, 70), S(66, 15, 28, 70)] },
  // Dynamic
  { id: 't3-mosaic', name: 'Mosaico 3', category: '3', style: 'Dynamic', photoCount: 3, builtin: true,
    slots: [S(4, 4, 44, 60), S(52, 4, 44, 28), S(52, 36, 44, 28)] },
  { id: 't3-dynamic', name: 'Dynamic 3', category: '3', style: 'Dynamic', photoCount: 3, builtin: true,
    slots: [S(4, 4, 56, 44), S(64, 4, 32, 92), S(4, 52, 56, 44)] },
  // Collage
  { id: 't3-collage-3', name: 'Collage 3', category: '3', style: 'Collage', photoCount: 3, builtin: true,
    slots: [S(10, 10, 45, 45), S(45, 45, 45, 45), S(10, 60, 30, 30)] },
  { id: 't3-collage-l', name: 'Collage en L', category: '3', style: 'Collage', photoCount: 3, builtin: true,
    slots: [S(4, 4, 60, 60), S(4, 68, 44, 28), S(52, 4, 44, 44)] },
  // Grid
  { id: 't3-grid-tight', name: 'Grid 1×3 Juntos', category: '3', style: 'Grid', photoCount: 3, builtin: true,
    slots: [S(0, 0, 33.33, 100), S(33.33, 0, 33.33, 100), S(66.66, 0, 33.34, 100)] },
  { id: 't3-grid-rows', name: 'Grid 3 Filas', category: '3', style: 'Grid', photoCount: 3, builtin: true,
    slots: [S(4, 4, 92, 28), S(4, 36, 92, 28), S(4, 68, 92, 28)] },
  // Mosaic
  { id: 't3-mosaic-big-small', name: 'Mosaico 3 Mixto', category: '3', style: 'Mosaic', photoCount: 3, builtin: true,
    slots: [S(4, 4, 60, 92), S(68, 4, 28, 44), S(68, 52, 28, 44)] },
  { id: 't3-mosaic-band', name: 'Mosaico Banda', category: '3', style: 'Mosaic', photoCount: 3, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 44, 44), S(52, 52, 44, 44)] },

  // ============================================================
  // 4 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't4-grid-tight', name: 'Grid 2×2 Juntos', category: '4', style: 'Full Bleed', photoCount: 4, builtin: true,
    slots: [S(0, 0, 50, 50), S(50, 0, 50, 50), S(0, 50, 50, 50), S(50, 50, 50, 50)] },
  { id: 't4-column-tight', name: '4 Columnas Juntas', category: '4', style: 'Full Bleed', photoCount: 4, builtin: true,
    slots: [S(0, 0, 25, 100), S(25, 0, 25, 100), S(50, 0, 25, 100), S(75, 0, 25, 100)] },
  // Minimal
  { id: 't4-column', name: '4 Columnas', category: '4', style: 'Minimal', photoCount: 4, builtin: true,
    slots: [S(4, 4, 22, 92), S(28, 4, 22, 92), S(52, 4, 22, 92), S(76, 4, 20, 92)] },
  { id: 't4-rows', name: '4 Filas', category: '4', style: 'Minimal', photoCount: 4, builtin: true,
    slots: [S(4, 4, 92, 21), S(4, 27, 92, 21), S(4, 50, 92, 21), S(4, 73, 92, 23)] },
  // Panorama
  { id: 't4-pano-band', name: 'Pano + 3 Abajo', category: '4', style: 'Panorama', photoCount: 4, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't4-panorama-2', name: '2 Panorámicas', category: '4', style: 'Panorama', photoCount: 4, builtin: true,
    slots: [S(4, 4, 92, 22), S(4, 28, 92, 22), S(4, 52, 92, 22), S(4, 76, 92, 20)] },
  // Luxury
  { id: 't4-lux-grid', name: 'Luxury Grid', category: '4', style: 'Luxury', photoCount: 4, builtin: true,
    slots: [S(10, 10, 38, 38), S(52, 10, 38, 38), S(10, 52, 38, 38), S(52, 52, 38, 38)] },
  { id: 't4-lux-bands', name: 'Luxury Bands', category: '4', style: 'Luxury', photoCount: 4, builtin: true,
    slots: [S(10, 4, 80, 22), S(10, 28, 80, 22), S(10, 52, 80, 22), S(10, 76, 80, 20)] },
  // Classic
  { id: 't4-grid', name: 'Grid 2×2', category: '4', style: 'Classic', photoCount: 4, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 44, 44), S(52, 52, 44, 44)] },
  { id: 't4-square-row', name: 'Fila de Cuadrados', category: '4', style: 'Classic', photoCount: 4, builtin: true,
    slots: [S(4, 30, 22, 40), S(28, 30, 22, 40), S(52, 30, 22, 40), S(76, 30, 20, 40)] },
  // Editorial
  { id: 't4-hero-3', name: 'Hero + 3', category: '4', style: 'Editorial', photoCount: 4, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28), S(4, 68, 92, 28)] },
  { id: 't4-hero-left', name: 'Hero + Columna', category: '4', style: 'Editorial', photoCount: 4, builtin: true,
    slots: [S(4, 4, 60, 92), S(68, 4, 28, 28), S(68, 36, 28, 28), S(68, 68, 28, 28)] },
  // Magazine
  { id: 't4-magazine', name: 'Magazine', category: '4', style: 'Magazine', photoCount: 4, builtin: true,
    slots: [S(4, 4, 44, 58), S(52, 4, 44, 28), S(52, 36, 44, 26), S(4, 66, 92, 30)] },
  { id: 't4-mag-top', name: 'Magazine Top', category: '4', style: 'Magazine', photoCount: 4, builtin: true,
    slots: [S(4, 4, 60, 44), S(68, 4, 28, 44), S(4, 52, 44, 44), S(52, 52, 44, 44)] },
  // Wedding
  { id: 't4-wedding-grid', name: 'Wedding Grid', category: '4', style: 'Wedding', photoCount: 4, builtin: true,
    slots: [S(15, 15, 32, 32), S(53, 15, 32, 32), S(15, 53, 32, 32), S(53, 53, 32, 32)] },
  { id: 't4-wedding-band', name: 'Wedding Band', category: '4', style: 'Wedding', photoCount: 4, builtin: true,
    slots: [S(10, 4, 80, 22), S(10, 28, 80, 22), S(10, 52, 80, 22), S(10, 76, 80, 20)] },
  // Dynamic
  { id: 't4-dynamic', name: 'Dynamic', category: '4', style: 'Dynamic', photoCount: 4, builtin: true,
    slots: [S(4, 4, 56, 44), S(64, 4, 32, 44), S(4, 52, 32, 44), S(40, 52, 56, 44)] },
  { id: 't4-dynamic-bands', name: 'Dynamic Bands', category: '4', style: 'Dynamic', photoCount: 4, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 92, 28), S(4, 70, 92, 26)] },
  // Collage
  { id: 't4-collage-4', name: 'Collage 4', category: '4', style: 'Collage', photoCount: 4, builtin: true,
    slots: [S(6, 6, 42, 42), S(52, 6, 42, 42), S(6, 52, 42, 42), S(52, 52, 42, 42)] },
  { id: 't4-collage-overlap', name: 'Collage Superpuesto', category: '4', style: 'Collage', photoCount: 4, builtin: true,
    slots: [S(4, 4, 45, 45), S(45, 4, 50, 50), S(4, 45, 50, 50), S(45, 45, 45, 45)] },
  // Grid
  { id: 't4-grid-gap', name: 'Grid 2×2 con Gap', category: '4', style: 'Grid', photoCount: 4, builtin: true,
    slots: [S(6, 6, 40, 40), S(54, 6, 40, 40), S(6, 54, 40, 40), S(54, 54, 40, 40)] },
  { id: 't4-grid-4x1', name: 'Grid 4×1', category: '4', style: 'Grid', photoCount: 4, builtin: true,
    slots: [S(4, 30, 22, 40), S(28, 30, 22, 40), S(52, 30, 22, 40), S(76, 30, 20, 40)] },
  // Mosaic
  { id: 't4-mosaic-4', name: 'Mosaico 4', category: '4', style: 'Mosaic', photoCount: 4, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 44), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  { id: 't4-mosaic-t', name: 'Mosaico T', category: '4', style: 'Mosaic', photoCount: 4, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },

  // ============================================================
  // 5 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't5-grid-tight', name: 'Grid 5 Juntos', category: '5', style: 'Full Bleed', photoCount: 5, builtin: true,
    slots: [S(0, 0, 50, 50), S(50, 0, 50, 50), S(0, 50, 33.33, 50), S(33.33, 50, 33.33, 50), S(66.66, 50, 33.34, 50)] },
  { id: 't5-band-tight', name: 'Banda Full 5', category: '5', style: 'Full Bleed', photoCount: 5, builtin: true,
    slots: [S(0, 0, 100, 50), S(0, 50, 20, 50), S(20, 50, 20, 50), S(40, 50, 20, 50), S(60, 50, 40, 50)] },
  // Minimal
  { id: 't5-band', name: 'Banda 5', category: '5', style: 'Minimal', photoCount: 5, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 17, 44), S(23, 52, 17, 44), S(42, 52, 17, 44), S(61, 52, 35, 44)] },
  { id: 't5-minimal-strip', name: 'Tira 5', category: '5', style: 'Minimal', photoCount: 5, builtin: true,
    slots: [S(4, 35, 17, 30), S(24, 35, 17, 30), S(44, 35, 17, 30), S(64, 35, 17, 30), S(84, 35, 12, 30)] },
  // Panorama
  { id: 't5-pano-4', name: 'Pano + 4 Abajo', category: '5', style: 'Panorama', photoCount: 5, builtin: true,
    slots: [S(4, 4, 92, 40), S(4, 48, 22, 22), S(28, 48, 22, 22), S(52, 48, 22, 22), S(4, 74, 92, 22)] },
  { id: 't5-pano-band', name: 'Pano + Banda', category: '5', style: 'Panorama', photoCount: 5, builtin: true,
    slots: [S(4, 4, 92, 40), S(4, 48, 22, 48), S(28, 48, 22, 48), S(52, 48, 22, 48), S(76, 48, 20, 48)] },
  // Luxury
  { id: 't5-lux-band', name: 'Luxury Band 5', category: '5', style: 'Luxury', photoCount: 5, builtin: true,
    slots: [S(10, 4, 80, 30), S(10, 40, 24, 52), S(38, 40, 24, 52), S(66, 40, 24, 52), S(10, 40, 80, 8)] },
  { id: 't5-lux-grid', name: 'Luxury Grid 5', category: '5', style: 'Luxury', photoCount: 5, builtin: true,
    slots: [S(8, 8, 26, 40), S(37, 8, 26, 40), S(66, 8, 26, 40), S(8, 52, 40, 40), S(52, 52, 40, 40)] },
  // Classic
  { id: 't5-grid-2-3', name: 'Grid 2+3', category: '5', style: 'Classic', photoCount: 5, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't5-classic-5', name: 'Clásico 5', category: '5', style: 'Classic', photoCount: 5, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  // Editorial
  { id: 't5-hero-4', name: 'Hero + 4', category: '5', style: 'Editorial', photoCount: 5, builtin: true,
    slots: [S(4, 4, 56, 60), S(64, 4, 32, 28), S(64, 36, 32, 28), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  { id: 't5-hero-top', name: 'Hero Top + 4', category: '5', style: 'Editorial', photoCount: 5, builtin: true,
    slots: [S(4, 4, 92, 40), S(4, 48, 22, 48), S(28, 48, 22, 48), S(52, 48, 22, 48), S(76, 48, 20, 48)] },
  // Magazine
  { id: 't5-mosaic', name: 'Mosaico 5', category: '5', style: 'Magazine', photoCount: 5, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 20), S(52, 28, 44, 20), S(4, 52, 44, 44), S(52, 52, 44, 44)] },
  { id: 't5-magazine', name: 'Magazine 5', category: '5', style: 'Magazine', photoCount: 5, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  // Wedding
  { id: 't5-wedding-5', name: 'Wedding 5', category: '5', style: 'Wedding', photoCount: 5, builtin: true,
    slots: [S(20, 4, 60, 50), S(4, 60, 28, 28), S(36, 60, 28, 28), S(68, 60, 28, 28), S(4, 92, 92, 6)] },
  { id: 't5-wedding-grid', name: 'Wedding Grid 5', category: '5', style: 'Wedding', photoCount: 5, builtin: true,
    slots: [S(10, 10, 26, 40), S(37, 10, 26, 40), S(64, 10, 26, 40), S(10, 52, 40, 38), S(52, 52, 38, 38)] },
  // Dynamic
  { id: 't5-hero-column', name: 'Hero + Columna', category: '5', style: 'Dynamic', photoCount: 5, builtin: true,
    slots: [S(4, 4, 60, 92), S(68, 4, 28, 20), S(68, 28, 28, 20), S(68, 52, 28, 20), S(68, 76, 28, 20)] },
  { id: 't5-dynamic-mix', name: 'Dynamic Mix 5', category: '5', style: 'Dynamic', photoCount: 5, builtin: true,
    slots: [S(4, 4, 60, 40), S(68, 4, 28, 40), S(4, 48, 28, 48), S(36, 48, 28, 48), S(68, 48, 28, 48)] },
  // Collage
  { id: 't5-collage-5', name: 'Collage 5', category: '5', style: 'Collage', photoCount: 5, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't5-collage-stack', name: 'Collage Stack', category: '5', style: 'Collage', photoCount: 5, builtin: true,
    slots: [S(4, 4, 55, 55), S(40, 20, 55, 55), S(4, 65, 30, 30), S(35, 75, 30, 22), S(66, 65, 30, 30)] },
  // Grid
  { id: 't5-grid-5x1', name: 'Grid 5×1', category: '5', style: 'Grid', photoCount: 5, builtin: true,
    slots: [S(4, 30, 17, 40), S(23, 30, 17, 40), S(42, 30, 17, 40), S(61, 30, 17, 40), S(80, 30, 16, 40)] },
  { id: 't5-grid-3-2', name: 'Grid 3+2', category: '5', style: 'Grid', photoCount: 5, builtin: true,
    slots: [S(4, 4, 28, 44), S(36, 4, 28, 44), S(68, 4, 28, 44), S(4, 52, 44, 44), S(52, 52, 44, 44)] },
  // Mosaic
  { id: 't5-mosaic-mix', name: 'Mosaico 5', category: '5', style: 'Mosaic', photoCount: 5, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28), S(4, 68, 92, 28), S(4, 4, 60, 60)] },
  { id: 't5-mosaic-bands', name: 'Mosaico Bandas', category: '5', style: 'Mosaic', photoCount: 5, builtin: true,
    slots: [S(4, 4, 92, 30), S(4, 38, 22, 58), S(28, 38, 22, 58), S(52, 38, 22, 58), S(76, 38, 20, 58)] },

  // ============================================================
  // 6 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't6-grid3x2-tight', name: 'Grid 3×2 Juntos', category: '6', style: 'Full Bleed', photoCount: 6, builtin: true,
    slots: [S(0, 0, 33.33, 50), S(33.33, 0, 33.33, 50), S(66.66, 0, 33.34, 50), S(0, 50, 33.33, 50), S(33.33, 50, 33.33, 50), S(66.66, 50, 33.34, 50)] },
  { id: 't6-grid2x3-tight', name: 'Grid 2×3 Juntos', category: '6', style: 'Full Bleed', photoCount: 6, builtin: true,
    slots: [S(0, 0, 50, 33.33), S(50, 0, 50, 33.33), S(0, 33.33, 50, 33.33), S(50, 33.33, 50, 33.33), S(0, 66.66, 50, 33.34), S(50, 66.66, 50, 33.34)] },
  // Minimal
  { id: 't6-column-2', name: 'Columnas 6', category: '6', style: 'Minimal', photoCount: 6, builtin: true,
    slots: [S(4, 4, 44, 28), S(52, 4, 44, 28), S(4, 36, 44, 28), S(52, 36, 44, 28), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  { id: 't6-columns-3x2', name: '3 Columnas × 2', category: '6', style: 'Minimal', photoCount: 6, builtin: true,
    slots: [S(4, 4, 28, 44), S(36, 4, 28, 44), S(68, 4, 28, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  // Panorama
  { id: 't6-pano-5', name: 'Pano + 5 Abajo', category: '6', style: 'Panorama', photoCount: 6, builtin: true,
    slots: [S(4, 4, 92, 40), S(4, 48, 17, 48), S(23, 48, 17, 48), S(42, 48, 17, 48), S(61, 48, 17, 48), S(80, 48, 16, 48)] },
  { id: 't6-panorama-3', name: '3 Panorámicas', category: '6', style: 'Panorama', photoCount: 6, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 44, 28), S(52, 38, 44, 28), S(4, 70, 44, 26), S(52, 70, 44, 26)] },
  // Luxury
  { id: 't6-lux-3x2', name: 'Luxury 3×2', category: '6', style: 'Luxury', photoCount: 6, builtin: true,
    slots: [S(8, 8, 26, 40), S(37, 8, 26, 40), S(66, 8, 26, 40), S(8, 52, 26, 40), S(37, 52, 26, 40), S(66, 52, 26, 40)] },
  { id: 't6-lux-band', name: 'Luxury Band 6', category: '6', style: 'Luxury', photoCount: 6, builtin: true,
    slots: [S(10, 4, 80, 30), S(10, 40, 25, 52), S(37, 40, 25, 52), S(64, 40, 26, 52), S(10, 40, 80, 8), S(10, 40, 80, 8)] },
  // Classic
  { id: 't6-grid3x2', name: 'Grid 3×2', category: '6', style: 'Classic', photoCount: 6, builtin: true,
    slots: [S(4, 4, 28, 44), S(36, 4, 28, 44), S(68, 4, 28, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't6-grid2x3', name: 'Grid 2×3', category: '6', style: 'Classic', photoCount: 6, builtin: true,
    slots: [S(4, 4, 44, 28), S(52, 4, 44, 28), S(4, 36, 44, 28), S(52, 36, 44, 28), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  // Editorial
  { id: 't6-hero-5', name: 'Hero + 5', category: '6', style: 'Editorial', photoCount: 6, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28), S(4, 68, 28, 28), S(36, 68, 28, 28), S(68, 68, 28, 28)] },
  { id: 't6-hero-bottom', name: '5 + Hero Abajo', category: '6', style: 'Editorial', photoCount: 6, builtin: true,
    slots: [S(4, 4, 17, 60), S(23, 4, 17, 60), S(42, 4, 17, 60), S(61, 4, 17, 60), S(80, 4, 16, 60), S(4, 68, 92, 28)] },
  // Magazine
  { id: 't6-magazine', name: 'Magazine 6', category: '6', style: 'Magazine', photoCount: 6, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 20), S(52, 28, 44, 20), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't6-feature', name: 'Feature 6', category: '6', style: 'Magazine', photoCount: 6, builtin: true,
    slots: [S(4, 4, 92, 40), S(4, 48, 28, 48), S(36, 48, 28, 48), S(68, 48, 28, 48), S(4, 4, 44, 20), S(52, 4, 44, 20)] },
  // Wedding
  { id: 't6-wedding-6', name: 'Wedding 6', category: '6', style: 'Wedding', photoCount: 6, builtin: true,
    slots: [S(20, 4, 60, 40), S(4, 48, 22, 22), S(28, 48, 22, 22), S(52, 48, 22, 22), S(76, 48, 20, 22), S(4, 74, 44, 22)] },
  { id: 't6-wedding-grid', name: 'Wedding Grid 6', category: '6', style: 'Wedding', photoCount: 6, builtin: true,
    slots: [S(10, 10, 26, 40), S(37, 10, 26, 40), S(64, 10, 26, 40), S(10, 52, 26, 40), S(37, 52, 26, 40), S(64, 52, 26, 40)] },
  // Dynamic
  { id: 't6-dynamic-6', name: 'Dynamic 6', category: '6', style: 'Dynamic', photoCount: 6, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 28, 28), S(36, 38, 28, 28), S(68, 38, 28, 28), S(4, 70, 92, 26)] },
  { id: 't6-dynamic-2-4', name: 'Dynamic 2+4', category: '6', style: 'Dynamic', photoCount: 6, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 60), S(4, 68, 22, 28), S(28, 68, 22, 28), S(52, 68, 22, 28), S(76, 68, 20, 28)] },
  // Collage
  { id: 't6-collage-6', name: 'Collage 6', category: '6', style: 'Collage', photoCount: 6, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 28, 28), S(36, 38, 28, 28), S(68, 38, 28, 28), S(4, 70, 92, 26)] },
  { id: 't6-collage-mix', name: 'Collage Mix 6', category: '6', style: 'Collage', photoCount: 6, builtin: true,
    slots: [S(4, 4, 60, 44), S(68, 4, 28, 44), S(4, 52, 22, 44), S(28, 52, 22, 44), S(52, 52, 22, 44), S(76, 52, 20, 44)] },
  // Grid
  { id: 't6-square-grid', name: 'Grid Cuadrado', category: '6', style: 'Grid', photoCount: 6, builtin: true,
    slots: [S(4, 4, 28, 44), S(36, 4, 28, 44), S(68, 4, 28, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't6-grid-3x2-gap', name: 'Grid 3×2 Gap', category: '6', style: 'Grid', photoCount: 6, builtin: true,
    slots: [S(6, 6, 26, 42), S(37, 6, 26, 42), S(68, 6, 26, 42), S(6, 52, 26, 42), S(37, 52, 26, 42), S(68, 52, 26, 42)] },
  // Mosaic
  { id: 't6-mosaic-6', name: 'Mosaico 6', category: '6', style: 'Mosaic', photoCount: 6, builtin: true,
    slots: [S(4, 4, 60, 44), S(68, 4, 28, 20), S(68, 28, 28, 20), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't6-mosaic-hero', name: 'Mosaico Hero', category: '6', style: 'Mosaic', photoCount: 6, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28), S(4, 68, 44, 28), S(52, 68, 44, 28), S(4, 4, 60, 60)] },

  // ============================================================
  // 7 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't7-mosaic-tight', name: 'Mosaico Juntos 7', category: '7', style: 'Full Bleed', photoCount: 7, builtin: true,
    slots: [S(0, 0, 50, 33.33), S(50, 0, 50, 33.33), S(0, 33.33, 25, 33.34), S(25, 33.33, 25, 33.34), S(50, 33.33, 25, 33.34), S(75, 33.33, 25, 33.34), S(0, 66.67, 100, 33.33)] },
  { id: 't7-grid-tight', name: 'Grid Irregular', category: '7', style: 'Full Bleed', photoCount: 7, builtin: true,
    slots: [S(0, 0, 50, 33.33), S(50, 0, 50, 33.33), S(0, 33.33, 33.33, 33.34), S(33.33, 33.33, 33.33, 33.34), S(66.66, 33.33, 33.34, 33.34), S(0, 66.67, 50, 33.33), S(50, 66.67, 50, 33.33)] },
  // Minimal
  { id: 't7-column-7', name: '7 Columnas', category: '7', style: 'Minimal', photoCount: 7, builtin: true,
    slots: [S(2, 4, 13, 92), S(16, 4, 13, 92), S(30, 4, 13, 92), S(44, 4, 13, 92), S(58, 4, 13, 92), S(72, 4, 13, 92), S(86, 4, 12, 92)] },
  { id: 't7-3x3-min', name: 'Grid 3×3 Min', category: '7', style: 'Minimal', photoCount: 7, builtin: true,
    slots: [S(4, 4, 28, 28), S(36, 4, 28, 28), S(68, 4, 28, 28), S(4, 36, 28, 28), S(36, 36, 28, 28), S(68, 36, 28, 28), S(4, 68, 92, 28)] },
  // Panorama
  { id: 't7-pano-6', name: 'Pano + 6 Abajo', category: '7', style: 'Panorama', photoCount: 7, builtin: true,
    slots: [S(4, 4, 92, 38), S(4, 46, 15, 50), S(20, 46, 15, 50), S(36, 46, 15, 50), S(52, 46, 15, 50), S(68, 46, 14, 50), S(83, 46, 13, 50)] },
  { id: 't7-panorama-3x2', name: '3 Panos + 4', category: '7', style: 'Panorama', photoCount: 7, builtin: true,
    slots: [S(4, 4, 92, 25), S(4, 33, 92, 25), S(4, 62, 92, 25), S(4, 91, 28, 5), S(36, 91, 28, 5), S(68, 91, 28, 5), S(4, 91, 92, 2)] },
  // Luxury
  { id: 't7-lux-band', name: 'Luxury Band 7', category: '7', style: 'Luxury', photoCount: 7, builtin: true,
    slots: [S(10, 4, 80, 30), S(10, 40, 18, 52), S(30, 40, 18, 52), S(50, 40, 18, 52), S(70, 40, 20, 52), S(10, 40, 80, 6), S(10, 40, 80, 6)] },
  { id: 't7-luxury-grid', name: 'Luxury Grid 7', category: '7', style: 'Luxury', photoCount: 7, builtin: true,
    slots: [S(8, 8, 26, 40), S(37, 8, 26, 40), S(66, 8, 26, 40), S(8, 52, 26, 40), S(37, 52, 26, 40), S(66, 52, 26, 40), S(8, 8, 84, 2)] },
  // Classic
  { id: 't7-3x2-1', name: 'Grid 3×2 + 1', category: '7', style: 'Classic', photoCount: 7, builtin: true,
    slots: [S(4, 4, 28, 38), S(36, 4, 28, 38), S(68, 4, 28, 38), S(4, 46, 28, 38), S(36, 46, 28, 38), S(68, 46, 28, 38), S(4, 88, 92, 8)] },
  { id: 't7-classic-7', name: 'Clásico 7', category: '7', style: 'Classic', photoCount: 7, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 44, 30), S(52, 38, 44, 30), S(4, 72, 28, 24), S(36, 72, 28, 24), S(68, 72, 28, 24)] },
  // Editorial
  { id: 't7-hero-6', name: 'Hero + 6', category: '7', style: 'Editorial', photoCount: 7, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28), S(4, 68, 22, 28), S(28, 68, 22, 28), S(52, 68, 22, 28), S(76, 68, 20, 28)] },
  { id: 't7-hero-grid', name: 'Hero + Grid 6', category: '7', style: 'Editorial', photoCount: 7, builtin: true,
    slots: [S(4, 4, 92, 38), S(4, 46, 28, 24), S(36, 46, 28, 24), S(68, 46, 28, 24), S(4, 74, 28, 22), S(36, 74, 28, 22), S(68, 74, 28, 22)] },
  // Magazine
  { id: 't7-magazine', name: 'Magazine 7', category: '7', style: 'Magazine', photoCount: 7, builtin: true,
    slots: [S(4, 4, 60, 40), S(68, 4, 28, 18), S(68, 24, 28, 20), S(4, 48, 44, 48), S(52, 48, 44, 22), S(52, 74, 44, 22), S(4, 4, 92, 2)] },
  { id: 't7-mag-2-5', name: 'Magazine 2+5', category: '7', style: 'Magazine', photoCount: 7, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 17, 44), S(23, 52, 17, 44), S(42, 52, 17, 44), S(61, 52, 17, 44), S(80, 52, 16, 44)] },
  // Wedding
  { id: 't7-wedding-7', name: 'Wedding 7', category: '7', style: 'Wedding', photoCount: 7, builtin: true,
    slots: [S(20, 4, 60, 50), S(4, 58, 22, 22), S(28, 58, 22, 22), S(52, 58, 22, 22), S(76, 58, 20, 22), S(4, 82, 44, 14), S(52, 82, 44, 14)] },
  { id: 't7-wedding-2-5', name: 'Wedding 2+5', category: '7', style: 'Wedding', photoCount: 7, builtin: true,
    slots: [S(15, 4, 70, 40), S(4, 48, 22, 22), S(28, 48, 22, 22), S(52, 48, 22, 22), S(76, 48, 20, 22), S(4, 74, 44, 22), S(52, 74, 44, 22)] },
  // Dynamic
  { id: 't7-dynamic', name: 'Dynamic 7', category: '7', style: 'Dynamic', photoCount: 7, builtin: true,
    slots: [S(4, 4, 56, 40), S(64, 4, 32, 20), S(64, 26, 32, 18), S(4, 48, 28, 48), S(36, 48, 28, 48), S(68, 48, 28, 48), S(4, 4, 92, 2)] },
  { id: 't7-triangle', name: 'Triángulo 7', category: '7', style: 'Dynamic', photoCount: 7, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 28, 28), S(36, 52, 28, 28), S(68, 52, 28, 28), S(4, 82, 44, 14), S(52, 82, 44, 14)] },
  // Collage
  { id: 't7-collage-7', name: 'Collage 7', category: '7', style: 'Collage', photoCount: 7, builtin: true,
    slots: [S(4, 4, 60, 40), S(68, 4, 28, 40), S(4, 48, 28, 48), S(36, 48, 28, 48), S(68, 48, 28, 22), S(68, 74, 28, 22), S(4, 48, 92, 2)] },
  { id: 't7-collage-2-5', name: 'Collage 2+5', category: '7', style: 'Collage', photoCount: 7, builtin: true,
    slots: [S(4, 4, 60, 44), S(68, 4, 28, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 22), S(68, 74, 28, 22), S(4, 52, 60, 4)] },
  // Grid
  { id: 't7-grid-4-3', name: 'Grid 4+3', category: '7', style: 'Grid', photoCount: 7, builtin: true,
    slots: [S(4, 4, 22, 44), S(28, 4, 22, 44), S(52, 4, 22, 44), S(76, 4, 20, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't7-grid-2-3-2', name: 'Grid 2+3+2', category: '7', style: 'Grid', photoCount: 7, builtin: true,
    slots: [S(4, 4, 44, 28), S(52, 4, 44, 28), S(4, 36, 28, 28), S(36, 36, 28, 28), S(68, 36, 28, 28), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  // Mosaic
  { id: 't7-mosaic', name: 'Mosaico 7', category: '7', style: 'Mosaic', photoCount: 7, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 28, 28), S(36, 38, 28, 28), S(68, 38, 28, 28), S(4, 70, 44, 26), S(52, 70, 44, 26)] },
  { id: 't7-mosaic-full', name: 'Mosaico Full 7', category: '7', style: 'Mosaic', photoCount: 7, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44), S(4, 4, 44, 20), S(52, 4, 44, 20)] },

  // ============================================================
  // 8 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't8-grid-4x2-tight', name: 'Grid 4×2 Juntos', category: '8', style: 'Full Bleed', photoCount: 8, builtin: true,
    slots: [S(0, 0, 25, 50), S(25, 0, 25, 50), S(50, 0, 25, 50), S(75, 0, 25, 50), S(0, 50, 25, 50), S(25, 50, 25, 50), S(50, 50, 25, 50), S(75, 50, 25, 50)] },
  { id: 't8-grid-2x4-tight', name: 'Grid 2×4 Juntos', category: '8', style: 'Full Bleed', photoCount: 8, builtin: true,
    slots: [S(0, 0, 50, 25), S(50, 0, 50, 25), S(0, 25, 50, 25), S(50, 25, 50, 25), S(0, 50, 50, 25), S(50, 50, 50, 25), S(0, 75, 50, 25), S(50, 75, 50, 25)] },
  // Minimal
  { id: 't8-3x3-min', name: 'Grid 3×3 Min', category: '8', style: 'Minimal', photoCount: 8, builtin: true,
    slots: [S(4, 4, 28, 28), S(36, 4, 28, 28), S(68, 4, 28, 28), S(4, 36, 28, 28), S(36, 36, 28, 28), S(68, 36, 28, 28), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  { id: 't8-columns-4x2', name: '4 Columnas × 2', category: '8', style: 'Minimal', photoCount: 8, builtin: true,
    slots: [S(4, 4, 22, 44), S(28, 4, 22, 44), S(52, 4, 22, 44), S(76, 4, 20, 44), S(4, 52, 22, 44), S(28, 52, 22, 44), S(52, 52, 22, 44), S(76, 52, 20, 44)] },
  // Panorama
  { id: 't8-pano-7', name: 'Pano + 7 Abajo', category: '8', style: 'Panorama', photoCount: 8, builtin: true,
    slots: [S(4, 4, 92, 32), S(4, 40, 13, 26), S(19, 40, 13, 26), S(34, 40, 13, 26), S(49, 40, 13, 26), S(64, 40, 13, 26), S(79, 40, 17, 26), S(4, 70, 92, 26)] },
  { id: 't8-panorama-2', name: '4 Panorámicas', category: '8', style: 'Panorama', photoCount: 8, builtin: true,
    slots: [S(4, 4, 44, 22), S(52, 4, 44, 22), S(4, 28, 44, 22), S(52, 28, 44, 22), S(4, 52, 44, 22), S(52, 52, 44, 22), S(4, 76, 44, 20), S(52, 76, 44, 20)] },
  // Luxury
  { id: 't8-lux-band', name: 'Luxury Band 8', category: '8', style: 'Luxury', photoCount: 8, builtin: true,
    slots: [S(10, 4, 80, 25), S(10, 33, 18, 30), S(30, 33, 18, 30), S(50, 33, 18, 30), S(70, 33, 20, 30), S(10, 67, 18, 26), S(30, 67, 18, 26), S(50, 67, 18, 26)] },
  { id: 't8-lux-grid', name: 'Luxury Grid 8', category: '8', style: 'Luxury', photoCount: 8, builtin: true,
    slots: [S(8, 8, 20, 40), S(30, 8, 20, 40), S(52, 8, 20, 40), S(74, 8, 18, 40), S(8, 52, 20, 40), S(30, 52, 20, 40), S(52, 52, 20, 40), S(74, 52, 18, 40)] },
  // Classic
  { id: 't8-grid', name: 'Grid 4×2', category: '8', style: 'Classic', photoCount: 8, builtin: true,
    slots: [S(4, 4, 22, 44), S(28, 4, 22, 44), S(52, 4, 22, 44), S(76, 4, 20, 44), S(4, 52, 22, 44), S(28, 52, 22, 44), S(52, 52, 22, 44), S(76, 52, 20, 44)] },
  { id: 't8-grid-2x4', name: 'Grid 2×4', category: '8', style: 'Classic', photoCount: 8, builtin: true,
    slots: [S(4, 4, 44, 22), S(52, 4, 44, 22), S(4, 28, 44, 22), S(52, 28, 44, 22), S(4, 52, 44, 22), S(52, 52, 44, 22), S(4, 76, 44, 20), S(52, 76, 44, 20)] },
  // Editorial
  { id: 't8-hero-grid', name: 'Hero + Grid 7', category: '8', style: 'Editorial', photoCount: 8, builtin: true,
    slots: [S(4, 4, 60, 44), S(68, 4, 28, 20), S(68, 28, 28, 20), S(4, 52, 28, 22), S(36, 52, 28, 22), S(68, 52, 28, 22), S(4, 78, 44, 18), S(52, 78, 44, 18)] },
  { id: 't8-hero-top', name: 'Hero Top + 7', category: '8', style: 'Editorial', photoCount: 8, builtin: true,
    slots: [S(4, 4, 92, 32), S(4, 40, 22, 26), S(28, 40, 22, 26), S(52, 40, 22, 26), S(76, 40, 20, 26), S(4, 70, 28, 26), S(36, 70, 28, 26), S(68, 70, 28, 26)] },
  // Magazine
  { id: 't8-magazine', name: 'Magazine 8', category: '8', style: 'Magazine', photoCount: 8, builtin: true,
    slots: [S(4, 4, 60, 44), S(68, 4, 28, 20), S(68, 28, 28, 20), S(4, 52, 28, 22), S(36, 52, 28, 22), S(68, 52, 28, 22), S(4, 78, 44, 18), S(52, 78, 44, 18)] },
  { id: 't8-hero-7', name: 'Hero + 7', category: '8', style: 'Magazine', photoCount: 8, builtin: true,
    slots: [S(4, 4, 50, 60), S(58, 4, 18, 28), S(78, 4, 18, 28), S(58, 36, 18, 28), S(78, 36, 18, 28), S(4, 68, 28, 28), S(36, 68, 28, 28), S(68, 68, 28, 28)] },
  // Wedding
  { id: 't8-wedding-8', name: 'Wedding 8', category: '8', style: 'Wedding', photoCount: 8, builtin: true,
    slots: [S(15, 4, 70, 50), S(4, 58, 22, 22), S(28, 58, 22, 22), S(52, 58, 22, 22), S(76, 58, 20, 22), S(4, 84, 28, 12), S(36, 84, 28, 12), S(68, 84, 28, 12)] },
  { id: 't8-wedding-grid', name: 'Wedding Grid 8', category: '8', style: 'Wedding', photoCount: 8, builtin: true,
    slots: [S(10, 10, 20, 40), S(32, 10, 20, 40), S(54, 10, 20, 40), S(76, 10, 16, 40), S(10, 52, 20, 40), S(32, 52, 20, 40), S(54, 52, 20, 40), S(76, 52, 16, 40)] },
  // Dynamic
  { id: 't8-dynamic-8', name: 'Dynamic 8', category: '8', style: 'Dynamic', photoCount: 8, builtin: true,
    slots: [S(4, 4, 30, 44), S(38, 4, 30, 44), S(72, 4, 24, 44), S(4, 52, 30, 44), S(38, 52, 30, 44), S(72, 52, 24, 20), S(72, 76, 24, 20), S(4, 4, 92, 2)] },
  { id: 't8-dynamic-bands', name: 'Dynamic Bands 8', category: '8', style: 'Dynamic', photoCount: 8, builtin: true,
    slots: [S(4, 4, 44, 22), S(52, 4, 44, 22), S(4, 28, 44, 22), S(52, 28, 44, 22), S(4, 52, 28, 22), S(36, 52, 28, 22), S(68, 52, 28, 22), S(4, 76, 92, 20)] },
  // Collage
  { id: 't8-collage-8', name: 'Collage 8', category: '8', style: 'Collage', photoCount: 8, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 22, 22), S(78, 4, 18, 22), S(52, 30, 22, 22), S(78, 30, 18, 22), S(4, 52, 44, 44), S(52, 52, 44, 22), S(52, 78, 44, 18)] },
  { id: 't8-collage-mosaic', name: 'Collage Mosaico 8', category: '8', style: 'Collage', photoCount: 8, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 22, 15), S(78, 4, 18, 15), S(52, 21, 22, 15), S(78, 21, 18, 15), S(4, 38, 44, 58), S(52, 38, 44, 28), S(52, 70, 44, 26)] },
  // Grid
  { id: 't8-4x2-gap', name: 'Grid 4×2 Gap', category: '8', style: 'Grid', photoCount: 8, builtin: true,
    slots: [S(6, 6, 20, 40), S(29, 6, 20, 40), S(52, 6, 20, 40), S(75, 6, 19, 40), S(6, 54, 20, 40), S(29, 54, 20, 40), S(52, 54, 20, 40), S(75, 54, 19, 40)] },
  { id: 't8-grid-3-3-2', name: 'Grid 3+3+2', category: '8', style: 'Grid', photoCount: 8, builtin: true,
    slots: [S(4, 4, 28, 28), S(36, 4, 28, 28), S(68, 4, 28, 28), S(4, 36, 28, 28), S(36, 36, 28, 28), S(68, 36, 28, 28), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  // Mosaic
  { id: 't8-mosaic-8', name: 'Mosaico 8', category: '8', style: 'Mosaic', photoCount: 8, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 28, 28), S(36, 38, 28, 28), S(68, 38, 28, 28), S(4, 70, 28, 26), S(36, 70, 28, 26), S(68, 70, 28, 26)] },
  { id: 't8-mosaic-t', name: 'Mosaico T 8', category: '8', style: 'Mosaic', photoCount: 8, builtin: true,
    slots: [S(4, 4, 92, 30), S(4, 38, 22, 28), S(28, 38, 22, 28), S(52, 38, 22, 28), S(76, 38, 20, 28), S(4, 70, 28, 26), S(36, 70, 28, 26), S(68, 70, 28, 26)] },

  // ============================================================
  // 9 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't9-grid-3x3-tight', name: 'Grid 3×3 Juntos', category: '9', style: 'Full Bleed', photoCount: 9, builtin: true,
    slots: [S(0, 0, 33.33, 33.33), S(33.33, 0, 33.33, 33.33), S(66.66, 0, 33.34, 33.33), S(0, 33.33, 33.33, 33.34), S(33.33, 33.33, 33.33, 33.34), S(66.66, 33.33, 33.34, 33.34), S(0, 66.67, 33.33, 33.33), S(33.33, 66.67, 33.33, 33.33), S(66.66, 66.67, 33.34, 33.33)] },
  { id: 't9-mosaic-tight', name: 'Mosaico Juntos 9', category: '9', style: 'Full Bleed', photoCount: 9, builtin: true,
    slots: [S(0, 0, 33.33, 33.33), S(33.33, 0, 33.33, 33.33), S(66.66, 0, 33.34, 33.33), S(0, 33.33, 25, 33.34), S(25, 33.33, 25, 33.34), S(50, 33.33, 25, 33.34), S(75, 33.33, 25, 33.34), S(0, 66.67, 50, 33.33), S(50, 66.67, 50, 33.33)] },
  // Minimal
  { id: 't9-columns-3x3', name: '3 Columnas × 3', category: '9', style: 'Minimal', photoCount: 9, builtin: true,
    slots: [S(4, 4, 28, 28), S(36, 4, 28, 28), S(68, 4, 28, 28), S(4, 36, 28, 28), S(36, 36, 28, 28), S(68, 36, 28, 28), S(4, 68, 28, 28), S(36, 68, 28, 28), S(68, 68, 28, 28)] },
  { id: 't9-grid-9-equal', name: 'Grid 9 Igual', category: '9', style: 'Minimal', photoCount: 9, builtin: true,
    slots: [S(4, 4, 28, 28), S(36, 4, 28, 28), S(68, 4, 28, 28), S(4, 36, 28, 28), S(36, 36, 28, 28), S(68, 36, 28, 28), S(4, 68, 28, 28), S(36, 68, 28, 28), S(68, 68, 28, 28)] },
  // Panorama
  { id: 't9-panorama-9', name: 'Pano + 8 Abajo', category: '9', style: 'Panorama', photoCount: 9, builtin: true,
    slots: [S(4, 4, 92, 38), S(4, 46, 22, 22), S(28, 46, 22, 22), S(52, 46, 22, 22), S(76, 46, 20, 22), S(4, 70, 22, 26), S(28, 70, 22, 26), S(52, 70, 22, 26), S(76, 70, 20, 26)] },
  { id: 't9-panorama-3x3', name: '3x3 Panorama', category: '9', style: 'Panorama', photoCount: 9, builtin: true,
    slots: [S(4, 4, 92, 22), S(4, 30, 30, 30), S(35, 30, 30, 30), S(66, 30, 30, 30), S(4, 63, 30, 33), S(35, 63, 30, 33), S(66, 63, 30, 33), S(4, 4, 30, 22), S(66, 4, 30, 22)] },
  // Luxury
  { id: 't9-lux-grid', name: 'Luxury Grid 9', category: '9', style: 'Luxury', photoCount: 9, builtin: true,
    slots: [S(8, 8, 26, 26), S(37, 8, 26, 26), S(66, 8, 26, 26), S(8, 37, 26, 26), S(37, 37, 26, 26), S(66, 37, 26, 26), S(8, 66, 26, 26), S(37, 66, 26, 26), S(66, 66, 26, 26)] },
  { id: 't9-lux-strips', name: 'Luxury Strips 9', category: '9', style: 'Luxury', photoCount: 9, builtin: true,
    slots: [S(10, 4, 80, 20), S(10, 28, 80, 20), S(10, 52, 14, 44), S(26, 52, 14, 44), S(42, 52, 14, 44), S(58, 52, 14, 44), S(74, 52, 16, 44), S(10, 28, 80, 2), S(10, 52, 80, 2)] },
  // Classic
  { id: 't9-grid-3x3', name: 'Grid 3×3', category: '9', style: 'Classic', photoCount: 9, builtin: true,
    slots: [S(4, 4, 28, 28), S(36, 4, 28, 28), S(68, 4, 28, 28), S(4, 36, 28, 28), S(36, 36, 28, 28), S(68, 36, 28, 28), S(4, 68, 28, 28), S(36, 68, 28, 28), S(68, 68, 28, 28)] },
  { id: 't9-grid-4-3-2', name: 'Grid 4+3+2', category: '9', style: 'Classic', photoCount: 9, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 28, 30), S(36, 38, 28, 30), S(68, 38, 28, 30), S(4, 72, 44, 24), S(52, 72, 44, 24)] },
  // Editorial
  { id: 't9-hero-8', name: 'Hero + 8', category: '9', style: 'Editorial', photoCount: 9, builtin: true,
    slots: [S(4, 4, 56, 60), S(64, 4, 15, 28), S(83, 4, 13, 28), S(64, 36, 15, 28), S(83, 36, 13, 28), S(4, 68, 15, 28), S(23, 68, 15, 28), S(42, 68, 15, 28), S(61, 68, 35, 28)] },
  { id: 't9-hero-corners', name: 'Hero + 8 Esquinas', category: '9', style: 'Editorial', photoCount: 9, builtin: true,
    slots: [S(20, 20, 60, 60), S(4, 4, 14, 14), S(82, 4, 14, 14), S(4, 82, 14, 14), S(82, 82, 14, 14), S(20, 4, 60, 14), S(20, 82, 60, 14), S(4, 20, 14, 60), S(82, 20, 14, 60)] },
  // Magazine
  { id: 't9-3x3-magazine', name: 'Magazine 9', category: '9', style: 'Magazine', photoCount: 9, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 22, 44), S(78, 4, 18, 44), S(4, 52, 22, 44), S(30, 52, 22, 44), S(56, 52, 20, 44), S(80, 52, 16, 44), S(4, 4, 44, 20), S(52, 4, 44, 20)] },
  { id: 't9-mag-3-6', name: 'Magazine 3+6', category: '9', style: 'Magazine', photoCount: 9, builtin: true,
    slots: [S(4, 4, 28, 44), S(36, 4, 28, 44), S(68, 4, 28, 44), S(4, 52, 14, 44), S(20, 52, 14, 44), S(36, 52, 14, 44), S(52, 52, 14, 44), S(68, 52, 14, 44), S(84, 52, 12, 44)] },
  // Wedding
  { id: 't9-wedding-9', name: 'Wedding 9', category: '9', style: 'Wedding', photoCount: 9, builtin: true,
    slots: [S(20, 4, 60, 50), S(4, 58, 18, 22), S(26, 58, 18, 22), S(48, 58, 18, 22), S(70, 58, 26, 22), S(4, 84, 18, 12), S(26, 84, 18, 12), S(48, 84, 18, 12), S(70, 84, 26, 12)] },
  { id: 't9-wedding-9b', name: 'Wedding Grid 9', category: '9', style: 'Wedding', photoCount: 9, builtin: true,
    slots: [S(10, 4, 80, 40), S(4, 48, 22, 22), S(28, 48, 22, 22), S(52, 48, 22, 22), S(76, 48, 20, 22), S(4, 74, 22, 22), S(28, 74, 22, 22), S(52, 74, 22, 22), S(76, 74, 20, 22)] },
  // Dynamic
  { id: 't9-dynamic', name: 'Dynamic 9', category: '9', style: 'Dynamic', photoCount: 9, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 28, 28), S(36, 38, 28, 28), S(68, 38, 28, 28), S(4, 70, 22, 26), S(30, 70, 22, 26), S(56, 70, 20, 26), S(80, 70, 16, 26)] },
  { id: 't9-hero-mid-8', name: 'Hero Central + 8', category: '9', style: 'Dynamic', photoCount: 9, builtin: true,
    slots: [S(4, 4, 22, 44), S(28, 4, 22, 44), S(52, 4, 22, 44), S(76, 4, 20, 44), S(4, 52, 92, 16), S(4, 72, 28, 24), S(36, 72, 28, 24), S(68, 72, 28, 24), S(4, 4, 92, 2)] },
  // Collage
  { id: 't9-collage-9', name: 'Collage 9', category: '9', style: 'Collage', photoCount: 9, builtin: true,
    slots: [S(4, 4, 30, 30), S(37, 4, 30, 30), S(70, 4, 26, 30), S(4, 37, 30, 30), S(37, 37, 30, 30), S(70, 37, 26, 30), S(4, 70, 30, 26), S(37, 70, 30, 26), S(70, 70, 26, 26)] },
  { id: 't9-collage-9b', name: 'Collage Full 9', category: '9', style: 'Collage', photoCount: 9, builtin: true,
    slots: [S(4, 4, 30, 30), S(37, 4, 30, 30), S(70, 4, 26, 30), S(4, 37, 30, 30), S(37, 37, 30, 30), S(70, 37, 26, 30), S(4, 70, 30, 26), S(37, 70, 30, 26), S(70, 70, 26, 26)] },
  // Grid
  { id: 't9-grid-2-3-4', name: 'Grid 2+3+4', category: '9', style: 'Grid', photoCount: 9, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 28, 28), S(36, 38, 28, 28), S(68, 38, 28, 28), S(4, 70, 22, 26), S(28, 70, 22, 26), S(52, 70, 22, 26), S(76, 70, 20, 26)] },
  { id: 't9-grid-3x3-gap', name: 'Grid 3×3 Gap', category: '9', style: 'Grid', photoCount: 9, builtin: true,
    slots: [S(5, 5, 27, 27), S(36.5, 5, 27, 27), S(68, 5, 27, 27), S(5, 36.5, 27, 27), S(36.5, 36.5, 27, 27), S(68, 36.5, 27, 27), S(5, 68, 27, 27), S(36.5, 68, 27, 27), S(68, 68, 27, 27)] },
  // Mosaic
  { id: 't9-mosaic', name: 'Mosaico 9', category: '9', style: 'Mosaic', photoCount: 9, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 22, 22), S(78, 4, 18, 22), S(52, 30, 22, 22), S(78, 30, 18, 22), S(4, 52, 22, 44), S(30, 52, 22, 44), S(56, 52, 20, 44), S(80, 52, 16, 44)] },
  { id: 't9-mosaic-mix', name: 'Mosaico Mix 9', category: '9', style: 'Mosaic', photoCount: 9, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 22, 15), S(78, 4, 18, 15), S(52, 21, 22, 15), S(78, 21, 18, 15), S(4, 38, 44, 58), S(52, 38, 22, 58), S(78, 38, 18, 28), S(78, 68, 18, 28)] },

  // ============================================================
  // 10 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't10-grid-tight', name: 'Grid 5×2 Juntos', category: '10', style: 'Full Bleed', photoCount: 10, builtin: true,
    slots: [S(0, 0, 20, 50), S(20, 0, 20, 50), S(40, 0, 20, 50), S(60, 0, 20, 50), S(80, 0, 20, 50), S(0, 50, 20, 50), S(20, 50, 20, 50), S(40, 50, 20, 50), S(60, 50, 20, 50), S(80, 50, 20, 50)] },
  { id: 't10-2x5-tight', name: 'Grid 2×5 Juntos', category: '10', style: 'Full Bleed', photoCount: 10, builtin: true,
    slots: [S(0, 0, 50, 20), S(50, 0, 50, 20), S(0, 20, 50, 20), S(50, 20, 50, 20), S(0, 40, 50, 20), S(50, 40, 50, 20), S(0, 60, 50, 20), S(50, 60, 50, 20), S(0, 80, 50, 20), S(50, 80, 50, 20)] },
  // Minimal
  { id: 't10-grid-5x2', name: 'Grid 5×2', category: '10', style: 'Minimal', photoCount: 10, builtin: true,
    slots: [S(2, 4, 18, 44), S(22, 4, 18, 44), S(42, 4, 18, 44), S(62, 4, 18, 44), S(82, 4, 16, 44), S(2, 52, 18, 44), S(22, 52, 18, 44), S(42, 52, 18, 44), S(62, 52, 18, 44), S(82, 52, 16, 44)] },
  { id: 't10-grid-2x5', name: 'Grid 2×5', category: '10', style: 'Minimal', photoCount: 10, builtin: true,
    slots: [S(4, 4, 44, 18), S(52, 4, 44, 18), S(4, 24, 44, 18), S(52, 24, 44, 18), S(4, 44, 44, 18), S(52, 44, 44, 18), S(4, 64, 44, 15), S(52, 64, 44, 15), S(4, 81, 44, 15), S(52, 81, 44, 15)] },
  // Panorama
  { id: 't10-panorama', name: 'Panorama 10', category: '10', style: 'Panorama', photoCount: 10, builtin: true,
    slots: [S(4, 4, 92, 25), S(4, 33, 44, 22), S(52, 33, 44, 22), S(4, 59, 28, 22), S(36, 59, 28, 22), S(68, 59, 28, 22), S(4, 85, 22, 11), S(28, 85, 22, 11), S(52, 85, 22, 11), S(76, 85, 20, 11)] },
  { id: 't10-pano-3-7', name: '3 Panos + 7', category: '10', style: 'Panorama', photoCount: 10, builtin: true,
    slots: [S(4, 4, 92, 22), S(4, 30, 44, 22), S(52, 30, 44, 22), S(4, 56, 14, 42), S(20, 56, 14, 42), S(36, 56, 14, 42), S(52, 56, 14, 42), S(68, 56, 14, 42), S(84, 56, 12, 42), S(4, 56, 44, 2)] },
  // Luxury
  { id: 't10-lux-grid', name: 'Luxury Grid 10', category: '10', style: 'Luxury', photoCount: 10, builtin: true,
    slots: [S(8, 8, 20, 40), S(30, 8, 20, 40), S(52, 8, 20, 40), S(74, 8, 18, 40), S(8, 52, 20, 20), S(30, 52, 20, 20), S(52, 52, 20, 20), S(74, 52, 18, 20), S(8, 76, 20, 16), S(30, 76, 20, 16)] },
  { id: 't10-lux-strips', name: 'Luxury Strips 10', category: '10', style: 'Luxury', photoCount: 10, builtin: true,
    slots: [S(10, 4, 80, 20), S(10, 28, 80, 20), S(10, 52, 14, 44), S(26, 52, 14, 44), S(42, 52, 14, 44), S(58, 52, 14, 44), S(74, 52, 16, 44), S(10, 28, 80, 2), S(10, 52, 80, 2), S(10, 4, 80, 2)] },
  // Classic
  { id: 't10-grid-5-5', name: 'Grid 5+5', category: '10', style: 'Classic', photoCount: 10, builtin: true,
    slots: [S(2, 4, 18, 44), S(22, 4, 18, 44), S(42, 4, 18, 44), S(62, 4, 18, 44), S(82, 4, 16, 44), S(2, 52, 18, 44), S(22, 52, 18, 44), S(42, 52, 18, 44), S(62, 52, 18, 44), S(82, 52, 16, 44)] },
  { id: 't10-grid-4-3-3', name: 'Grid 4+3+3', category: '10', style: 'Classic', photoCount: 10, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 28, 30), S(36, 38, 28, 30), S(68, 38, 28, 30), S(4, 72, 28, 24), S(36, 72, 28, 24), S(68, 72, 28, 24)] },
  // Editorial
  { id: 't10-hero-9', name: 'Hero + 9', category: '10', style: 'Editorial', photoCount: 10, builtin: true,
    slots: [S(4, 4, 50, 60), S(58, 4, 15, 28), S(75, 4, 21, 28), S(58, 36, 15, 28), S(75, 36, 21, 28), S(4, 68, 15, 28), S(21, 68, 15, 28), S(38, 68, 15, 28), S(55, 68, 15, 28), S(72, 68, 24, 28)] },
  { id: 't10-hero-corners', name: 'Hero + 9 Esquinas', category: '10', style: 'Editorial', photoCount: 10, builtin: true,
    slots: [S(20, 20, 60, 60), S(4, 4, 14, 14), S(82, 4, 14, 14), S(4, 82, 14, 14), S(82, 82, 14, 14), S(20, 4, 28, 14), S(52, 4, 28, 14), S(20, 82, 28, 14), S(52, 82, 28, 14), S(4, 20, 14, 60)] },
  // Magazine
  { id: 't10-magazine', name: 'Magazine 10', category: '10', style: 'Magazine', photoCount: 10, builtin: true,
    slots: [S(4, 4, 60, 44), S(68, 4, 14, 20), S(84, 4, 12, 20), S(68, 28, 14, 20), S(84, 28, 12, 20), S(4, 52, 22, 22), S(28, 52, 22, 22), S(52, 52, 22, 22), S(76, 52, 20, 22), S(4, 78, 92, 18)] },
  { id: 't10-mag-2-8', name: 'Magazine 2+8', category: '10', style: 'Magazine', photoCount: 10, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 11, 44), S(17, 52, 11, 44), S(30, 52, 11, 44), S(43, 52, 11, 44), S(56, 52, 11, 44), S(69, 52, 11, 44), S(82, 52, 14, 44), S(4, 52, 92, 2)] },
  // Wedding
  { id: 't10-wedding', name: 'Wedding 10', category: '10', style: 'Wedding', photoCount: 10, builtin: true,
    slots: [S(20, 4, 60, 40), S(4, 48, 22, 22), S(28, 48, 22, 22), S(52, 48, 22, 22), S(76, 48, 20, 22), S(4, 74, 22, 22), S(28, 74, 22, 22), S(52, 74, 22, 22), S(76, 74, 20, 22), S(20, 4, 60, 4)] },
  { id: 't10-wedding-10b', name: 'Wedding Full 10', category: '10', style: 'Wedding', photoCount: 10, builtin: true,
    slots: [S(10, 4, 80, 40), S(4, 48, 18, 22), S(24, 48, 18, 22), S(44, 48, 18, 22), S(64, 48, 18, 22), S(84, 48, 12, 22), S(4, 74, 18, 22), S(24, 74, 18, 22), S(44, 74, 18, 22), S(64, 74, 32, 22)] },
  // Dynamic
  { id: 't10-dynamic', name: 'Dynamic 10', category: '10', style: 'Dynamic', photoCount: 10, builtin: true,
    slots: [S(4, 4, 30, 44), S(38, 4, 30, 44), S(72, 4, 24, 44), S(4, 52, 22, 22), S(28, 52, 22, 22), S(52, 52, 22, 22), S(76, 52, 20, 22), S(4, 78, 22, 18), S(28, 78, 22, 18), S(52, 78, 44, 18)] },
  { id: 't10-dynamic-bands', name: 'Dynamic Bands 10', category: '10', style: 'Dynamic', photoCount: 10, builtin: true,
    slots: [S(4, 4, 44, 22), S(52, 4, 44, 22), S(4, 28, 44, 22), S(52, 28, 44, 22), S(4, 52, 28, 22), S(36, 52, 28, 22), S(68, 52, 28, 22), S(4, 76, 22, 20), S(28, 76, 22, 20), S(52, 76, 44, 20)] },
  // Collage
  { id: 't10-collage', name: 'Collage 10', category: '10', style: 'Collage', photoCount: 10, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 22, 30), S(28, 38, 22, 30), S(52, 38, 22, 30), S(76, 38, 20, 30), S(4, 72, 44, 24), S(52, 72, 44, 24)] },
  { id: 't10-collage-10b', name: 'Collage Full 10', category: '10', style: 'Collage', photoCount: 10, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 30, 30), S(37, 38, 30, 30), S(70, 38, 26, 30), S(4, 72, 30, 24), S(37, 72, 30, 24), S(70, 72, 26, 24)] },
  // Grid
  { id: 't10-grid-5-5b', name: 'Grid 5+5', category: '10', style: 'Grid', photoCount: 10, builtin: true,
    slots: [S(2, 4, 18, 44), S(22, 4, 18, 44), S(42, 4, 18, 44), S(62, 4, 18, 44), S(82, 4, 16, 44), S(2, 52, 18, 44), S(22, 52, 18, 44), S(42, 52, 18, 44), S(62, 52, 18, 44), S(82, 52, 16, 44)] },
  { id: 't10-grid-3-4-3', name: 'Grid 3+4+3', category: '10', style: 'Grid', photoCount: 10, builtin: true,
    slots: [S(4, 4, 28, 30), S(36, 4, 28, 30), S(68, 4, 28, 30), S(4, 38, 22, 30), S(28, 38, 22, 30), S(52, 38, 22, 30), S(76, 38, 20, 30), S(4, 72, 28, 24), S(36, 72, 28, 24), S(68, 72, 28, 24)] },
  // Mosaic
  { id: 't10-mosaic', name: 'Mosaico 10', category: '10', style: 'Mosaic', photoCount: 10, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 22, 22), S(78, 4, 18, 22), S(52, 30, 22, 22), S(78, 30, 18, 22), S(4, 52, 22, 22), S(30, 52, 22, 22), S(56, 52, 20, 22), S(80, 52, 16, 22), S(4, 78, 92, 18)] },
  { id: 't10-mosaic-hero', name: 'Mosaico Hero 10', category: '10', style: 'Mosaic', photoCount: 10, builtin: true,
    slots: [S(4, 4, 60, 50), S(68, 4, 28, 15), S(68, 21, 28, 15), S(68, 38, 28, 15), S(4, 58, 22, 20), S(28, 58, 22, 20), S(52, 58, 22, 20), S(76, 58, 20, 20), S(4, 82, 44, 14), S(52, 82, 44, 14)] },

  // ============================================================
  // 11 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't11-grid-tight', name: 'Grid 11 Juntos', category: '11', style: 'Full Bleed', photoCount: 11, builtin: true,
    slots: [S(0, 0, 25, 25), S(25, 0, 25, 25), S(50, 0, 25, 25), S(75, 0, 25, 25), S(0, 25, 25, 25), S(25, 25, 25, 25), S(50, 25, 25, 25), S(75, 25, 25, 25), S(0, 50, 33.33, 50), S(33.33, 50, 33.33, 50), S(66.66, 50, 33.34, 50)] },
  { id: 't11-mosaic-tight', name: 'Mosaico Juntos 11', category: '11', style: 'Full Bleed', photoCount: 11, builtin: true,
    slots: [S(0, 0, 33.33, 33.33), S(33.33, 0, 33.33, 33.33), S(66.66, 0, 33.34, 33.33), S(0, 33.33, 25, 33.34), S(25, 33.33, 25, 33.34), S(50, 33.33, 25, 33.34), S(75, 33.33, 25, 33.34), S(0, 66.67, 22, 33.33), S(22, 66.67, 22, 33.33), S(44, 66.67, 22, 33.33), S(66, 66.67, 34, 33.33)] },
  // Minimal
  { id: 't11-columns', name: '11 Columnas', category: '11', style: 'Minimal', photoCount: 11, builtin: true,
    slots: [S(2, 4, 8, 92), S(12, 4, 8, 92), S(22, 4, 8, 92), S(32, 4, 8, 92), S(42, 4, 8, 92), S(52, 4, 8, 92), S(62, 4, 8, 92), S(72, 4, 8, 92), S(82, 4, 8, 92), S(92, 4, 6, 92), S(2, 4, 8, 4)] },
  { id: 't11-rows', name: '11 Filas', category: '11', style: 'Minimal', photoCount: 11, builtin: true,
    slots: [S(4, 2, 92, 8), S(4, 12, 92, 8), S(4, 22, 92, 8), S(4, 32, 92, 8), S(4, 42, 92, 8), S(4, 52, 92, 8), S(4, 62, 92, 8), S(4, 72, 92, 8), S(4, 82, 92, 8), S(4, 92, 92, 6), S(4, 2, 92, 2)] },
  // Panorama
  { id: 't11-pano-4-7', name: '4 Panos + 7', category: '11', style: 'Panorama', photoCount: 11, builtin: true,
    slots: [S(4, 4, 92, 20), S(4, 28, 44, 20), S(52, 28, 44, 20), S(4, 52, 14, 44), S(20, 52, 14, 44), S(36, 52, 14, 44), S(52, 52, 14, 44), S(68, 52, 14, 44), S(84, 52, 12, 44), S(4, 28, 44, 2), S(52, 28, 44, 2)] },
  { id: 't11-pano-2-9', name: '2 Panos + 9', category: '11', style: 'Panorama', photoCount: 11, builtin: true,
    slots: [S(4, 4, 92, 22), S(4, 30, 92, 22), S(4, 56, 14, 42), S(20, 56, 14, 42), S(36, 56, 14, 42), S(52, 56, 14, 42), S(68, 56, 14, 42), S(84, 56, 12, 42), S(4, 82, 22, 14), S(28, 82, 22, 14), S(52, 82, 44, 14)] },
  // Luxury
  { id: 't11-lux-strips', name: 'Luxury Strips 11', category: '11', style: 'Luxury', photoCount: 11, builtin: true,
    slots: [S(10, 4, 80, 16), S(10, 22, 80, 16), S(10, 40, 14, 52), S(26, 40, 14, 52), S(42, 40, 14, 52), S(58, 40, 14, 52), S(74, 40, 16, 52), S(10, 22, 80, 2), S(10, 40, 80, 2), S(10, 4, 80, 2), S(10, 92, 80, 2)] },
  { id: 't11-lux-band', name: 'Luxury Band 11', category: '11', style: 'Luxury', photoCount: 11, builtin: true,
    slots: [S(10, 4, 80, 22), S(10, 28, 80, 22), S(10, 52, 14, 44), S(24, 52, 14, 44), S(38, 52, 14, 44), S(52, 52, 14, 44), S(66, 52, 14, 44), S(80, 52, 12, 44), S(10, 28, 80, 2), S(10, 52, 80, 2), S(10, 4, 80, 2)] },
  // Classic
  { id: 't11-grid-4-4-3', name: 'Grid 4+4+3', category: '11', style: 'Classic', photoCount: 11, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 22, 30), S(28, 38, 22, 30), S(52, 38, 22, 30), S(76, 38, 20, 30), S(4, 72, 28, 24), S(36, 72, 28, 24), S(68, 72, 28, 24)] },
  { id: 't11-grid-3-4-4', name: 'Grid 3+4+4', category: '11', style: 'Classic', photoCount: 11, builtin: true,
    slots: [S(4, 4, 28, 28), S(36, 4, 28, 28), S(68, 4, 28, 28), S(4, 36, 22, 30), S(28, 36, 22, 30), S(52, 36, 22, 30), S(76, 36, 20, 30), S(4, 70, 22, 26), S(28, 70, 22, 26), S(52, 70, 22, 26), S(76, 70, 20, 26)] },
  // Editorial
  { id: 't11-hero', name: 'Hero + 10', category: '11', style: 'Editorial', photoCount: 11, builtin: true,
    slots: [S(4, 4, 60, 50), S(68, 4, 28, 16), S(68, 22, 28, 16), S(68, 40, 28, 14), S(4, 58, 22, 20), S(28, 58, 22, 20), S(52, 58, 22, 20), S(76, 58, 20, 20), S(4, 82, 28, 14), S(36, 82, 28, 14), S(68, 82, 28, 14)] },
  { id: 't11-hero-mid', name: 'Hero Central + 10', category: '11', style: 'Editorial', photoCount: 11, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 92, 16), S(4, 58, 28, 38), S(36, 58, 28, 38), S(68, 58, 28, 38), S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 44, 30)] },
  // Magazine
  { id: 't11-mag-3-8', name: 'Magazine 3+8', category: '11', style: 'Magazine', photoCount: 11, builtin: true,
    slots: [S(4, 4, 28, 44), S(36, 4, 28, 44), S(68, 4, 28, 44), S(4, 52, 11, 44), S(17, 52, 11, 44), S(30, 52, 11, 44), S(43, 52, 11, 44), S(56, 52, 11, 44), S(69, 52, 11, 44), S(82, 52, 14, 44), S(4, 52, 92, 2)] },
  { id: 't11-mag-2-9', name: 'Magazine 2+9', category: '11', style: 'Magazine', photoCount: 11, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 10, 44), S(16, 52, 10, 44), S(28, 52, 10, 44), S(40, 52, 10, 44), S(52, 52, 10, 44), S(64, 52, 10, 44), S(76, 52, 10, 44), S(88, 52, 8, 44), S(4, 52, 44, 2)] },
  // Wedding
  { id: 't11-wedding', name: 'Wedding 11', category: '11', style: 'Wedding', photoCount: 11, builtin: true,
    slots: [S(20, 4, 60, 40), S(4, 48, 22, 22), S(28, 48, 22, 22), S(52, 48, 22, 22), S(76, 48, 20, 22), S(4, 74, 22, 22), S(28, 74, 22, 22), S(52, 74, 22, 22), S(76, 74, 20, 22), S(4, 4, 14, 40), S(82, 4, 14, 40)] },
  { id: 't11-wedding-11b', name: 'Wedding Grid 11', category: '11', style: 'Wedding', photoCount: 11, builtin: true,
    slots: [S(10, 4, 80, 40), S(4, 48, 18, 22), S(24, 48, 18, 22), S(44, 48, 18, 22), S(64, 48, 18, 22), S(84, 48, 12, 22), S(4, 74, 18, 22), S(24, 74, 18, 22), S(44, 74, 18, 22), S(64, 74, 18, 22), S(84, 74, 12, 22)] },
  // Dynamic
  { id: 't11-dynamic', name: 'Dynamic 11', category: '11', style: 'Dynamic', photoCount: 11, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 22, 22), S(78, 4, 18, 22), S(52, 30, 22, 22), S(78, 30, 18, 22), S(4, 52, 22, 22), S(30, 52, 22, 22), S(56, 52, 20, 22), S(80, 52, 16, 22), S(4, 78, 44, 18), S(52, 78, 44, 18)] },
  { id: 't11-dynamic-bands', name: 'Dynamic Bands 11', category: '11', style: 'Dynamic', photoCount: 11, builtin: true,
    slots: [S(4, 4, 44, 20), S(52, 4, 44, 20), S(4, 26, 44, 20), S(52, 26, 44, 20), S(4, 48, 28, 22), S(36, 48, 28, 22), S(68, 48, 28, 22), S(4, 72, 28, 24), S(36, 72, 28, 24), S(68, 72, 28, 24), S(4, 4, 92, 2)] },
  // Collage
  { id: 't11-collage', name: 'Collage 11', category: '11', style: 'Collage', photoCount: 11, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 22, 30), S(28, 38, 22, 30), S(52, 38, 22, 30), S(76, 38, 20, 30), S(4, 72, 28, 24), S(36, 72, 28, 24), S(68, 72, 28, 24)] },
  { id: 't11-collage-11b', name: 'Collage Full 11', category: '11', style: 'Collage', photoCount: 11, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 22, 30), S(28, 38, 22, 30), S(52, 38, 22, 30), S(76, 38, 20, 30), S(4, 72, 22, 24), S(28, 72, 22, 24), S(52, 72, 44, 24)] },
  // Grid
  { id: 't11-grid', name: 'Grid 4+3+4', category: '11', style: 'Grid', photoCount: 11, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 28, 30), S(36, 38, 28, 30), S(68, 38, 28, 30), S(4, 72, 22, 24), S(28, 72, 22, 24), S(52, 72, 22, 24), S(76, 72, 20, 24)] },
  { id: 't11-grid-5-3-3', name: 'Grid 5+3+3', category: '11', style: 'Grid', photoCount: 11, builtin: true,
    slots: [S(2, 4, 18, 30), S(22, 4, 18, 30), S(42, 4, 18, 30), S(62, 4, 18, 30), S(82, 4, 16, 30), S(4, 38, 28, 30), S(36, 38, 28, 30), S(68, 38, 28, 30), S(4, 72, 28, 24), S(36, 72, 28, 24), S(68, 72, 28, 24)] },
  // Mosaic
  { id: 't11-mosaic', name: 'Mosaico 11', category: '11', style: 'Mosaic', photoCount: 11, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 22, 15), S(76, 4, 20, 15), S(52, 21, 22, 15), S(76, 21, 20, 15), S(4, 38, 22, 28), S(28, 38, 22, 28), S(52, 38, 22, 28), S(76, 38, 20, 28), S(4, 70, 44, 26), S(52, 70, 44, 26)] },
  { id: 't11-mosaic-hero', name: 'Mosaico Hero 11', category: '11', style: 'Mosaic', photoCount: 11, builtin: true,
    slots: [S(4, 4, 60, 50), S(68, 4, 28, 15), S(68, 21, 28, 15), S(68, 38, 28, 15), S(4, 58, 18, 20), S(24, 58, 18, 20), S(44, 58, 18, 20), S(64, 58, 32, 20), S(4, 82, 22, 14), S(28, 82, 22, 14), S(52, 82, 44, 14)] },

  // ============================================================
  // 12 FOTOS — 12 estilos × 2 variantes = 24 plantillas
  // ============================================================
  // Full Bleed
  { id: 't12-grid-4x3-tight', name: 'Grid 4×3 Juntos', category: '12', style: 'Full Bleed', photoCount: 12, builtin: true,
    slots: [S(0, 0, 25, 33.33), S(25, 0, 25, 33.33), S(50, 0, 25, 33.33), S(75, 0, 25, 33.33), S(0, 33.33, 25, 33.34), S(25, 33.33, 25, 33.34), S(50, 33.33, 25, 33.34), S(75, 33.33, 25, 33.34), S(0, 66.67, 25, 33.33), S(25, 66.67, 25, 33.33), S(50, 66.67, 25, 33.33), S(75, 66.67, 25, 33.33)] },
  { id: 't12-grid-3x4-tight', name: 'Grid 3×4 Juntos', category: '12', style: 'Full Bleed', photoCount: 12, builtin: true,
    slots: [S(0, 0, 33.33, 25), S(33.33, 0, 33.33, 25), S(66.66, 0, 33.34, 25), S(0, 25, 33.33, 25), S(33.33, 25, 33.33, 25), S(66.66, 25, 33.34, 25), S(0, 50, 33.33, 25), S(33.33, 50, 33.33, 25), S(66.66, 50, 33.34, 25), S(0, 75, 33.33, 25), S(33.33, 75, 33.33, 25), S(66.66, 75, 33.34, 25)] },
  // Minimal
  { id: 't12-grid-3x4', name: 'Grid 3×4', category: '12', style: 'Minimal', photoCount: 12, builtin: true,
    slots: [S(4, 4, 28, 21), S(36, 4, 28, 21), S(68, 4, 28, 21), S(4, 28, 28, 21), S(36, 28, 28, 21), S(68, 28, 28, 21), S(4, 52, 28, 21), S(36, 52, 28, 21), S(68, 52, 28, 21), S(4, 76, 28, 20), S(36, 76, 28, 20), S(68, 76, 28, 20)] },
  { id: 't12-grid-4x3', name: 'Grid 4×3', category: '12', style: 'Minimal', photoCount: 12, builtin: true,
    slots: [S(4, 4, 22, 28), S(28, 4, 22, 28), S(52, 4, 22, 28), S(76, 4, 20, 28), S(4, 36, 22, 28), S(28, 36, 22, 28), S(52, 36, 22, 28), S(76, 36, 20, 28), S(4, 68, 22, 28), S(28, 68, 22, 28), S(52, 68, 22, 28), S(76, 68, 20, 28)] },
  // Panorama
  { id: 't12-pano-4-8', name: '4 Panos + 8', category: '12', style: 'Panorama', photoCount: 12, builtin: true,
    slots: [S(4, 4, 92, 20), S(4, 28, 44, 20), S(52, 28, 44, 20), S(4, 52, 14, 22), S(20, 52, 14, 22), S(36, 52, 14, 22), S(52, 52, 14, 22), S(68, 52, 14, 22), S(84, 52, 12, 22), S(4, 78, 22, 18), S(28, 78, 22, 18), S(52, 78, 44, 18)] },
  { id: 't12-pano-3-9', name: '3 Panos + 9', category: '12', style: 'Panorama', photoCount: 12, builtin: true,
    slots: [S(4, 4, 92, 20), S(4, 28, 44, 20), S(52, 28, 44, 20), S(4, 52, 11, 44), S(17, 52, 11, 44), S(30, 52, 11, 44), S(43, 52, 11, 44), S(56, 52, 11, 44), S(69, 52, 11, 44), S(82, 52, 14, 44), S(4, 52, 44, 2), S(52, 28, 44, 2)] },
  // Luxury
  { id: 't12-luxury', name: 'Luxury Grid 12', category: '12', style: 'Luxury', photoCount: 12, builtin: true,
    slots: [S(8, 8, 20, 20), S(30, 8, 20, 20), S(52, 8, 20, 20), S(74, 8, 18, 20), S(8, 30, 20, 20), S(30, 30, 20, 20), S(52, 30, 20, 20), S(74, 30, 18, 20), S(8, 52, 20, 20), S(30, 52, 20, 20), S(52, 52, 20, 20), S(74, 52, 18, 20)] },
  { id: 't12-lux-strips', name: 'Luxury Strips 12', category: '12', style: 'Luxury', photoCount: 12, builtin: true,
    slots: [S(10, 4, 80, 14), S(10, 20, 80, 14), S(10, 36, 14, 30), S(26, 36, 14, 30), S(42, 36, 14, 30), S(58, 36, 14, 30), S(74, 36, 16, 30), S(10, 68, 14, 28), S(26, 68, 14, 28), S(42, 68, 14, 28), S(58, 68, 14, 28), S(74, 68, 16, 28)] },
  // Classic
  { id: 't12-grid-3-3-3-3', name: 'Grid 3+3+3+3', category: '12', style: 'Classic', photoCount: 12, builtin: true,
    slots: [S(4, 4, 28, 21), S(36, 4, 28, 21), S(68, 4, 28, 21), S(4, 28, 28, 21), S(36, 28, 28, 21), S(68, 28, 28, 21), S(4, 52, 28, 21), S(36, 52, 28, 21), S(68, 52, 28, 21), S(4, 76, 28, 20), S(36, 76, 28, 20), S(68, 76, 28, 20)] },
  { id: 't12-grid-4-4-4', name: 'Grid 4+4+4', category: '12', style: 'Classic', photoCount: 12, builtin: true,
    slots: [S(4, 4, 22, 28), S(28, 4, 22, 28), S(52, 4, 22, 28), S(76, 4, 20, 28), S(4, 36, 22, 28), S(28, 36, 22, 28), S(52, 36, 22, 28), S(76, 36, 20, 28), S(4, 68, 22, 28), S(28, 68, 22, 28), S(52, 68, 22, 28), S(76, 68, 20, 28)] },
  // Editorial
  { id: 't12-hero', name: 'Hero + 11', category: '12', style: 'Editorial', photoCount: 12, builtin: true,
    slots: [S(4, 4, 50, 50), S(58, 4, 19, 16), S(79, 4, 17, 16), S(58, 22, 19, 16), S(79, 22, 17, 16), S(58, 40, 19, 14), S(79, 40, 17, 14), S(4, 58, 19, 20), S(25, 58, 19, 20), S(46, 58, 19, 20), S(67, 58, 14, 20), S(83, 58, 13, 20)] },
  { id: 't12-hero-corners', name: 'Hero + 11 Esquinas', category: '12', style: 'Editorial', photoCount: 12, builtin: true,
    slots: [S(20, 20, 60, 60), S(4, 4, 14, 14), S(82, 4, 14, 14), S(4, 82, 14, 14), S(82, 82, 14, 14), S(20, 4, 28, 14), S(52, 4, 28, 14), S(20, 82, 28, 14), S(52, 82, 28, 14), S(4, 20, 14, 28), S(4, 52, 14, 28), S(82, 20, 14, 60)] },
  // Magazine
  { id: 't12-mag-4-8', name: 'Magazine 4+8', category: '12', style: 'Magazine', photoCount: 12, builtin: true,
    slots: [S(4, 4, 22, 44), S(28, 4, 22, 44), S(52, 4, 22, 44), S(76, 4, 20, 44), S(4, 52, 11, 44), S(17, 52, 11, 44), S(30, 52, 11, 44), S(43, 52, 11, 44), S(56, 52, 11, 44), S(69, 52, 11, 44), S(82, 52, 14, 44), S(4, 52, 92, 2)] },
  { id: 't12-mag-3-9', name: 'Magazine 3+9', category: '12', style: 'Magazine', photoCount: 12, builtin: true,
    slots: [S(4, 4, 28, 44), S(36, 4, 28, 44), S(68, 4, 28, 44), S(4, 52, 10, 44), S(16, 52, 10, 44), S(28, 52, 10, 44), S(40, 52, 10, 44), S(52, 52, 10, 44), S(64, 52, 10, 44), S(76, 52, 10, 44), S(88, 52, 8, 44), S(4, 52, 92, 2)] },
  // Wedding
  { id: 't12-wedding-12', name: 'Wedding 12', category: '12', style: 'Wedding', photoCount: 12, builtin: true,
    slots: [S(10, 4, 80, 40), S(4, 48, 18, 22), S(24, 48, 18, 22), S(44, 48, 18, 22), S(64, 48, 18, 22), S(84, 48, 12, 22), S(4, 74, 18, 22), S(24, 74, 18, 22), S(44, 74, 18, 22), S(64, 74, 18, 22), S(84, 74, 12, 22), S(10, 4, 80, 2)] },
  { id: 't12-wedding-grid', name: 'Wedding Grid 12', category: '12', style: 'Wedding', photoCount: 12, builtin: true,
    slots: [S(10, 10, 18, 20), S(30, 10, 18, 20), S(50, 10, 18, 20), S(70, 10, 20, 20), S(10, 32, 18, 20), S(30, 32, 18, 20), S(50, 32, 18, 20), S(70, 32, 20, 20), S(10, 54, 18, 20), S(30, 54, 18, 20), S(50, 54, 18, 20), S(70, 54, 20, 20)] },
  // Dynamic
  { id: 't12-dynamic-bands', name: 'Dynamic Bands 12', category: '12', style: 'Dynamic', photoCount: 12, builtin: true,
    slots: [S(4, 4, 44, 20), S(52, 4, 44, 20), S(4, 26, 44, 20), S(52, 26, 44, 20), S(4, 48, 28, 20), S(36, 48, 28, 20), S(68, 48, 28, 20), S(4, 70, 22, 26), S(28, 70, 22, 26), S(52, 70, 22, 26), S(76, 70, 20, 26), S(4, 4, 92, 2)] },
  { id: 't12-dynamic-mix', name: 'Dynamic Mix 12', category: '12', style: 'Dynamic', photoCount: 12, builtin: true,
    slots: [S(4, 4, 30, 44), S(38, 4, 30, 44), S(72, 4, 24, 44), S(4, 52, 22, 22), S(28, 52, 22, 22), S(52, 52, 22, 22), S(76, 52, 20, 22), S(4, 78, 22, 18), S(28, 78, 22, 18), S(52, 78, 22, 18), S(76, 78, 20, 18), S(4, 4, 92, 2)] },
  // Collage
  { id: 't12-collage', name: 'Collage 12', category: '12', style: 'Collage', photoCount: 12, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 22, 30), S(28, 38, 22, 30), S(52, 38, 22, 30), S(76, 38, 20, 30), S(4, 72, 22, 24), S(28, 72, 22, 24), S(52, 72, 22, 24), S(76, 72, 20, 24)] },
  { id: 't12-collage-full', name: 'Collage Full 12', category: '12', style: 'Collage', photoCount: 12, builtin: true,
    slots: [S(4, 4, 22, 30), S(28, 4, 22, 30), S(52, 4, 22, 30), S(76, 4, 20, 30), S(4, 38, 30, 30), S(37, 38, 30, 30), S(70, 38, 26, 30), S(4, 72, 22, 24), S(28, 72, 22, 24), S(52, 72, 22, 24), S(76, 72, 20, 24), S(4, 4, 92, 2)] },
  // Grid
  { id: 't12-grid-4-4-4b', name: 'Grid 4+4+4', category: '12', style: 'Grid', photoCount: 12, builtin: true,
    slots: [S(4, 4, 22, 28), S(28, 4, 22, 28), S(52, 4, 22, 28), S(76, 4, 20, 28), S(4, 36, 22, 28), S(28, 36, 22, 28), S(52, 36, 22, 28), S(76, 36, 20, 28), S(4, 68, 22, 28), S(28, 68, 22, 28), S(52, 68, 22, 28), S(76, 68, 20, 28)] },
  { id: 't12-grid-3-3-3-3b', name: 'Grid 3+3+3+3', category: '12', style: 'Grid', photoCount: 12, builtin: true,
    slots: [S(4, 4, 28, 21), S(36, 4, 28, 21), S(68, 4, 28, 21), S(4, 28, 28, 21), S(36, 28, 28, 21), S(68, 28, 28, 21), S(4, 52, 28, 21), S(36, 52, 28, 21), S(68, 52, 28, 21), S(4, 76, 28, 20), S(36, 76, 28, 20), S(68, 76, 28, 20)] },
  // Mosaic
  { id: 't12-mosaic', name: 'Mosaico 12', category: '12', style: 'Mosaic', photoCount: 12, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 22, 15), S(76, 4, 20, 15), S(52, 21, 22, 15), S(76, 21, 20, 15), S(4, 38, 22, 28), S(28, 38, 22, 28), S(52, 38, 22, 28), S(76, 38, 20, 28), S(4, 70, 22, 26), S(28, 70, 22, 26), S(52, 70, 44, 26)] },
  { id: 't12-mosaic-mix', name: 'Mosaico Mix 12', category: '12', style: 'Mosaic', photoCount: 12, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 22, 15), S(76, 4, 20, 15), S(52, 21, 22, 15), S(76, 21, 20, 15), S(4, 38, 22, 28), S(28, 38, 22, 28), S(52, 38, 22, 28), S(76, 38, 20, 28), S(4, 70, 22, 26), S(28, 70, 22, 26), S(52, 70, 22, 26)] },
];

// ============================================================
// PORTADAS (12 plantillas, 1 estilo por cada uno)
// ============================================================
export const COVER_TEMPLATES: Template[] = [
  { id: 'cover-full', name: 'Portada Full Bleed', category: 'cover', style: 'Full Bleed', photoCount: 1, builtin: true,
    slots: [S(0, 0, 100, 100)] },
  { id: 'cover-frame', name: 'Portada Marco', category: 'cover', style: 'Luxury', photoCount: 1, builtin: true,
    slots: [S(15, 15, 70, 70)] },
  { id: 'cover-frame-wide', name: 'Portada Marco Ancho', category: 'cover', style: 'Classic', photoCount: 1, builtin: true,
    slots: [S(10, 10, 80, 80)] },
  { id: 'cover-pano', name: 'Portada Panorama', category: 'cover', style: 'Panorama', photoCount: 1, builtin: true,
    slots: [S(5, 30, 90, 40)] },
  { id: 'cover-pano-top', name: 'Portada Pano Arriba', category: 'cover', style: 'Panorama', photoCount: 1, builtin: true,
    slots: [S(5, 10, 90, 40)] },
  { id: 'cover-center-min', name: 'Portada Minimal', category: 'cover', style: 'Minimal', photoCount: 1, builtin: true,
    slots: [S(20, 20, 60, 60)] },
  { id: 'cover-classic', name: 'Portada Clásica', category: 'cover', style: 'Classic', photoCount: 1, builtin: true,
    slots: [S(10, 15, 80, 70)] },
  { id: 'cover-editorial', name: 'Portada Editorial', category: 'cover', style: 'Editorial', photoCount: 1, builtin: true,
    slots: [S(0, 30, 100, 40)] },
  { id: 'cover-wedding', name: 'Portada Wedding', category: 'cover', style: 'Wedding', photoCount: 1, builtin: true,
    slots: [S(15, 20, 70, 60)] },
  { id: 'cover-magazine', name: 'Portada Magazine', category: 'cover', style: 'Magazine', photoCount: 1, builtin: true,
    slots: [S(0, 40, 100, 50)] },
  { id: 'cover-center-portrait', name: 'Portada Retrato Centrado', category: 'cover', style: 'Editorial', photoCount: 1, builtin: true,
    slots: [S(25, 5, 50, 90)] },
  { id: 'cover-dynamic', name: 'Portada Dinámica', category: 'cover', style: 'Dynamic', photoCount: 1, builtin: true,
    slots: [S(10, 10, 80, 60)] },
];