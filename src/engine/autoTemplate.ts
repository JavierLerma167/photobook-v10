// src/engine/autoTemplate.ts
import { Template } from '@/src/types';
import { nanoid } from 'nanoid';

/**
 * Genera una plantilla "Full Bleed" para N fotos:
 * - Sin gaps (pegados al borde de la página)
 * - Layout razonable según el número de fotos
 * - 100% editable después de aplicada
 */
export function makeFullBleedTemplate(photoCount: number, name?: string): Template {
  const slots = generateFullBleedSlots(photoCount);

  return {
    id: `auto-fullbleed-${photoCount}-${nanoid(6)}`,
    name: name ?? `Auto Full Bleed (${photoCount})`,
    category: 'auto',
    style: 'Full Bleed',
    photoCount,
    builtin: false,
    slots,
  };
}

/**
 * Devuelve los slots para N fotos pegados a los bordes (sin gap).
 * Todas las coordenadas están en % (0-100).
 */
function generateFullBleedSlots(n: number): Array<{ x: number; y: number; w: number; h: number }> {
  if (n <= 0) return [];
  if (n === 1) return [{ x: 0, y: 0, w: 100, h: 100 }];

  if (n === 2) {
    // 2 apilados verticalmente
    return [
      { x: 0, y: 0, w: 100, h: 50 },
      { x: 0, y: 50, w: 100, h: 50 },
    ];
  }

  if (n === 3) {
    // Banda arriba (55%) + 2 abajo
    return [
      { x: 0, y: 0, w: 100, h: 55 },
      { x: 0, y: 55, w: 50, h: 45 },
      { x: 50, y: 55, w: 50, h: 45 },
    ];
  }

  if (n === 4) {
    // Grid 2×2
    return [
      { x: 0, y: 0, w: 50, h: 50 },
      { x: 50, y: 0, w: 50, h: 50 },
      { x: 0, y: 50, w: 50, h: 50 },
      { x: 50, y: 50, w: 50, h: 50 },
    ];
  }

  if (n === 5) {
    // Banda arriba (50%) + 4 abajo
    return [
      { x: 0, y: 0, w: 100, h: 50 },
      { x: 0, y: 50, w: 25, h: 50 },
      { x: 25, y: 50, w: 25, h: 50 },
      { x: 50, y: 50, w: 25, h: 50 },
      { x: 75, y: 50, w: 25, h: 50 },
    ];
  }

  if (n === 6) {
    // Grid 3×2
    return [
      { x: 0, y: 0, w: 33.333, h: 50 },
      { x: 33.333, y: 0, w: 33.333, h: 50 },
      { x: 66.666, y: 0, w: 33.334, h: 50 },
      { x: 0, y: 50, w: 33.333, h: 50 },
      { x: 33.333, y: 50, w: 33.333, h: 50 },
      { x: 66.666, y: 50, w: 33.334, h: 50 },
    ];
  }

  if (n === 7 || n === 8) {
    // Grid 4×2
    const out = [];
    for (let i = 0; i < 4; i++) {
      out.push({ x: i * 25, y: 0, w: 25, h: 50 });
    }
    for (let i = 0; i < 4; i++) {
      out.push({ x: i * 25, y: 50, w: 25, h: 50 });
    }
    return n === 7 ? out.slice(0, 7) : out;
  }

  if (n === 9) {
    // Grid 3×3
    const out = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        out.push({ x: c * 33.333, y: r * 33.333, w: 33.334, h: 33.334 });
      }
    }
    return out;
  }

  if (n === 10 || n === 11 || n === 12) {
    // Grid 4 columnas × 3 filas (se recortan las sobrantes)
    const out = [];
    const cols = 4;
    const rows = 3;
    const w = 100 / cols;
    const h = 100 / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({ x: c * w, y: r * h, w, h });
      }
    }
    return out.slice(0, n);
  }

  // >12 → grid cuadrado dinámico
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const w = 100 / cols;
  const h = 100 / rows;
  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (out.length >= n) break;
      out.push({ x: c * w, y: r * h, w, h });
    }
  }
  return out;
}