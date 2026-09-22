import { Template } from '@/src/types';

const S = (x: number, y: number, w: number, h: number) => ({ x, y, w, h });

export const BUILTIN_TEMPLATES: Template[] = [
  // ========== 1 FOTO ==========
  { id: 't1-full-editorial', name: 'Full Bleed', category: '1', style: 'Full Bleed', photoCount: 1, builtin: true,
    slots: [S(0, 0, 100, 100)] },
  { id: 't1-center-minimal', name: 'Centro', category: '1', style: 'Minimal', photoCount: 1, builtin: true,
    slots: [S(10, 10, 80, 80)] },
  { id: 't1-pano', name: 'Panorama', category: '1', style: 'Panorama', photoCount: 1, builtin: true,
    slots: [S(4, 30, 92, 40)] },
  { id: 't1-portrait-lux', name: 'Retrato Luxury', category: '1', style: 'Luxury', photoCount: 1, builtin: true,
    slots: [S(20, 5, 60, 90)] },
  { id: 't1-square-center', name: 'Cuadrado Centrado', category: '1', style: 'Classic', photoCount: 1, builtin: true,
    slots: [S(15, 15, 70, 70)] },
  { id: 't1-left-anchor', name: 'Anclado Izquierda', category: '1', style: 'Editorial', photoCount: 1, builtin: true,
    slots: [S(4, 4, 60, 92)] },
  { id: 't1-right-anchor', name: 'Anclado Derecha', category: '1', style: 'Editorial', photoCount: 1, builtin: true,
    slots: [S(40, 4, 56, 92)] },
  { id: 't1-band-top', name: 'Banda Superior', category: '1', style: 'Minimal', photoCount: 1, builtin: true,
    slots: [S(4, 4, 92, 55)] },
  { id: 't1-band-bottom', name: 'Banda Inferior', category: '1', style: 'Minimal', photoCount: 1, builtin: true,
    slots: [S(4, 41, 92, 55)] },

  // ========== 2 FOTOS ==========
  { id: 't2-split-v', name: 'Split Vertical', category: '2', style: 'Editorial', photoCount: 2, builtin: true,
    slots: [S(4, 4, 44, 92), S(52, 4, 44, 92)] },
  { id: 't2-split-h', name: 'Split Horizontal', category: '2', style: 'Editorial', photoCount: 2, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 92, 44)] },
  { id: 't2-hero-small', name: 'Hero + Detalle', category: '2', style: 'Magazine', photoCount: 2, builtin: true,
    slots: [S(4, 4, 64, 92), S(72, 4, 24, 92)] },
  { id: 't2-hero-small-r', name: 'Detalle + Hero', category: '2', style: 'Magazine', photoCount: 2, builtin: true,
    slots: [S(4, 4, 24, 92), S(32, 4, 64, 92)] },
  { id: 't2-equal-classic', name: 'Clásico Igual', category: '2', style: 'Classic', photoCount: 2, builtin: true,
    slots: [S(6, 6, 42, 88), S(52, 6, 42, 88)] },
  { id: 't2-stack-pano', name: 'Dos Panorámicas', category: '2', style: 'Panorama', photoCount: 2, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 92, 44)] },
  { id: 't2-diagonal', name: 'Diagonal Editorial', category: '2', style: 'Dynamic', photoCount: 2, builtin: true,
    slots: [S(4, 4, 70, 55), S(30, 45, 66, 51)] },
  { id: 't2-hero-band', name: 'Hero + Banda', category: '2', style: 'Editorial', photoCount: 2, builtin: true,
    slots: [S(4, 4, 92, 60), S(4, 68, 92, 28)] },

  // ========== 3 FOTOS ==========
  { id: 't3-hero-2', name: 'Hero + 2', category: '3', style: 'Editorial', photoCount: 3, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28)] },
  { id: 't3-hero-2-right', name: '2 + Hero', category: '3', style: 'Editorial', photoCount: 3, builtin: true,
    slots: [S(4, 4, 28, 28), S(4, 36, 28, 28), S(36, 4, 60, 60)] },
  { id: 't3-column', name: 'Columnas', category: '3', style: 'Minimal', photoCount: 3, builtin: true,
    slots: [S(4, 4, 28, 92), S(36, 4, 28, 92), S(68, 4, 28, 92)] },
  { id: 't3-feature', name: 'Feature', category: '3', style: 'Magazine', photoCount: 3, builtin: true,
    slots: [S(4, 4, 92, 58), S(4, 66, 44, 30), S(52, 66, 44, 30)] },
  { id: 't3-lux-band', name: 'Luxury Band', category: '3', style: 'Luxury', photoCount: 3, builtin: true,
    slots: [S(4, 10, 92, 40), S(4, 54, 44, 32), S(52, 54, 44, 32)] },
  { id: 't3-pano-2', name: 'Panorama + 2', category: '3', style: 'Panorama', photoCount: 3, builtin: true,
    slots: [S(4, 4, 92, 50), S(4, 58, 44, 38), S(52, 58, 44, 38)] },
  { id: 't3-mosaic', name: 'Mosaico 3', category: '3', style: 'Dynamic', photoCount: 3, builtin: true,
    slots: [S(4, 4, 44, 60), S(52, 4, 44, 28), S(52, 36, 44, 28)] },
  { id: 't3-hero-column', name: 'Hero + Columna', category: '3', style: 'Editorial', photoCount: 3, builtin: true,
    slots: [S(4, 4, 64, 92), S(72, 4, 24, 44), S(72, 52, 24, 44)] },

  // ========== 4 FOTOS ==========
  { id: 't4-grid', name: 'Grid 2×2', category: '4', style: 'Classic', photoCount: 4, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 44), S(4, 52, 44, 44), S(52, 52, 44, 44)] },
  { id: 't4-hero-3', name: 'Hero + 3', category: '4', style: 'Editorial', photoCount: 4, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28), S(4, 68, 92, 28)] },
  { id: 't4-magazine', name: 'Magazine', category: '4', style: 'Magazine', photoCount: 4, builtin: true,
    slots: [S(4, 4, 44, 58), S(52, 4, 44, 28), S(52, 36, 44, 26), S(4, 66, 92, 30)] },
  { id: 't4-dynamic', name: 'Dynamic', category: '4', style: 'Dynamic', photoCount: 4, builtin: true,
    slots: [S(4, 4, 56, 44), S(64, 4, 32, 44), S(4, 52, 32, 44), S(40, 52, 56, 44)] },
  { id: 't4-column', name: '4 Columnas', category: '4', style: 'Minimal', photoCount: 4, builtin: true,
    slots: [S(4, 4, 22, 92), S(28, 4, 22, 92), S(52, 4, 22, 92), S(76, 4, 20, 92)] },
  { id: 't4-lux-grid', name: 'Luxury Grid', category: '4', style: 'Luxury', photoCount: 4, builtin: true,
    slots: [S(10, 10, 38, 38), S(52, 10, 38, 38), S(10, 52, 38, 38), S(52, 52, 38, 38)] },
  { id: 't4-pano-band', name: 'Pano + 3 Abajo', category: '4', style: 'Panorama', photoCount: 4, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't4-hero-right', name: 'Columna + Hero', category: '4', style: 'Editorial', photoCount: 4, builtin: true,
    slots: [S(4, 4, 28, 28), S(4, 36, 28, 28), S(4, 68, 28, 28), S(36, 4, 60, 92)] },

  // ========== 5 FOTOS ==========
  { id: 't5-hero-4', name: 'Hero + 4', category: '5', style: 'Editorial', photoCount: 5, builtin: true,
    slots: [S(4, 4, 56, 60), S(64, 4, 32, 28), S(64, 36, 32, 28), S(4, 68, 44, 28), S(52, 68, 44, 28)] },
  { id: 't5-mosaic', name: 'Mosaico', category: '5', style: 'Magazine', photoCount: 5, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 20), S(52, 28, 44, 20), S(4, 52, 44, 44), S(52, 52, 44, 44)] },
  { id: 't5-band', name: 'Banda 5', category: '5', style: 'Minimal', photoCount: 5, builtin: true,
    slots: [S(4, 4, 92, 44), S(4, 52, 17, 44), S(23, 52, 17, 44), S(42, 52, 17, 44), S(61, 52, 35, 44)] },
  { id: 't5-hero-column', name: 'Hero + Columna', category: '5', style: 'Dynamic', photoCount: 5, builtin: true,
    slots: [S(4, 4, 60, 92), S(68, 4, 28, 20), S(68, 28, 28, 20), S(68, 52, 28, 20), S(68, 76, 28, 20)] },
  { id: 't5-hero-4-above', name: '4 + Hero Abajo', category: '5', style: 'Editorial', photoCount: 5, builtin: true,
    slots: [S(4, 4, 22, 60), S(28, 4, 22, 60), S(52, 4, 22, 60), S(76, 4, 20, 60), S(4, 68, 92, 28)] },

  // ========== 6 FOTOS ==========
  { id: 't6-grid3x2', name: 'Grid 3×2', category: '6', style: 'Classic', photoCount: 6, builtin: true,
    slots: [S(4, 4, 28, 44), S(36, 4, 28, 44), S(68, 4, 28, 44), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't6-hero-5', name: 'Hero + 5', category: '6', style: 'Editorial', photoCount: 6, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28), S(4, 68, 28, 28), S(36, 68, 28, 28), S(68, 68, 28, 28)] },
  { id: 't6-magazine', name: 'Magazine 6', category: '6', style: 'Magazine', photoCount: 6, builtin: true,
    slots: [S(4, 4, 44, 44), S(52, 4, 44, 20), S(52, 28, 44, 20), S(4, 52, 28, 44), S(36, 52, 28, 44), S(68, 52, 28, 44)] },
  { id: 't6-column-2', name: 'Columnas 6', category: '6', style: 'Minimal', photoCount: 6, builtin: true,
    slots: [S(4, 4, 44, 28), S(52, 4, 44, 28), S(4, 36, 44, 28), S(52, 36, 44, 28), S(4, 68, 44, 28), S(52, 68, 44, 28)] },

  // ========== 7 FOTOS ==========
  { id: 't7-mosaic', name: 'Mosaico 7', category: '7', style: 'Magazine', photoCount: 7, builtin: true,
    slots: [S(4, 4, 44, 30), S(52, 4, 44, 30), S(4, 38, 28, 28), S(36, 38, 28, 28), S(68, 38, 28, 28), S(4, 70, 44, 26), S(52, 70, 44, 26)] },
  { id: 't7-hero-6', name: 'Hero + 6', category: '7', style: 'Editorial', photoCount: 7, builtin: true,
    slots: [S(4, 4, 60, 60), S(68, 4, 28, 28), S(68, 36, 28, 28), S(4, 68, 22, 28), S(28, 68, 22, 28), S(52, 68, 22, 28), S(76, 68, 20, 28)] },

  // ========== 8 FOTOS ==========
  { id: 't8-grid', name: 'Grid 4×2', category: '8', style: 'Classic', photoCount: 8, builtin: true,
    slots: [S(4, 4, 22, 44), S(28, 4, 22, 44), S(52, 4, 22, 44), S(76, 4, 20, 44), S(4, 52, 22, 44), S(28, 52, 22, 44), S(52, 52, 22, 44), S(76, 52, 20, 44)] },
  { id: 't8-hero-7', name: 'Hero + 7', category: '8', style: 'Dynamic', photoCount: 8, builtin: true,
    slots: [S(4, 4, 50, 60), S(58, 4, 18, 28), S(78, 4, 18, 28), S(58, 36, 18, 28), S(78, 36, 18, 28), S(4, 68, 28, 28), S(36, 68, 28, 28), S(68, 68, 28, 28)] },
];

export const COVER_TEMPLATES: Template[] = [
  { id: 'cover-full', name: 'Portada Full Bleed', category: 'cover', style: 'Full Bleed', photoCount: 1, builtin: true,
    slots: [S(0, 0, 100, 100)] },
  { id: 'cover-frame', name: 'Portada Marco', category: 'cover', style: 'Luxury', photoCount: 1, builtin: true,
    slots: [S(15, 15, 70, 70)] },
  { id: 'cover-pano', name: 'Portada Panorama', category: 'cover', style: 'Panorama', photoCount: 1, builtin: true,
    slots: [S(5, 30, 90, 40)] },
  { id: 'cover-center-min', name: 'Portada Minimal', category: 'cover', style: 'Minimal', photoCount: 1, builtin: true,
    slots: [S(20, 20, 60, 60)] },
];