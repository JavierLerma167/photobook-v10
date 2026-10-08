import { Page, Slot, Template, Photo } from '@/src/types';
import { nanoid } from 'nanoid';

export function applyTemplate(page: Page, template: Template, keepPhotos = true): Page {
  const existingPhotos: Array<{ photoId: string; slot: Slot }> = [];
  if (keepPhotos) {
    const sorted = [...page.slots].sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });
    sorted.forEach(s => {
      if (s.photoId) existingPhotos.push({ photoId: s.photoId, slot: s });
    });
  }

  const newSlots: Slot[] = template.slots.map((t, i) => {
    const reused = existingPhotos[i];
    return {
      id: nanoid(8),
      x: t.x,
      y: t.y,
      w: t.w,
      h: t.h,
      photoId: reused ? reused.photoId : null,
      fit: reused ? reused.slot.fit : 'cover',
      offsetX: reused ? reused.slot.offsetX : 0,
      offsetY: reused ? reused.slot.offsetY : 0,
      zoom: reused ? reused.slot.zoom : 1,
      rotation: 0,
      locked: false,
      z: i
    };
  });

  return {
    ...page,
    templateId: template.id,
    slots: newSlots,
    texts: page.texts
  };
}

/**
 * Baraja las fotos de una página.
 *
 * - Si hay 2+ fotos: las redistribuye aleatoriamente entre los slots ocupados.
 * - Si hay 1 sola foto: la intercambia con el primer slot vacío (si existe),
 *   para que el shuffle tenga algún efecto visual. Si no hay slots vacíos,
 *   no hace nada (no hay nada que barajar).
 */
export function shufflePhotos(page: Page): Page {
  const occupiedSlots = page.slots.filter(s => s.photoId);
  const emptySlots = page.slots.filter(s => !s.photoId);

  // Sin fotos → no hay nada que barajar
  if (occupiedSlots.length === 0) return page;

  // Con 1 sola foto: si hay un slot vacío, la movemos a él (efecto visual de "shuffle")
  if (occupiedSlots.length === 1) {
    if (emptySlots.length === 0) return page; // nada que hacer
    const srcSlot = occupiedSlots[0];
    const targetSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
    const newSlots = page.slots.map(s => {
      if (s.id === srcSlot.id) return { ...s, photoId: null };
      if (s.id === targetSlot.id) return { ...s, photoId: srcSlot.photoId };
      return s;
    });
    return { ...page, slots: newSlots };
  }

  // 2+ fotos: barajar entre slots ocupados
  const photoIds = occupiedSlots.map(s => s.photoId!) as string[];
  const shuffled = [...photoIds].sort(() => Math.random() - 0.5);

  let idx = 0;
  const newSlots = page.slots.map(s => {
    if (!s.photoId) return s;
    const next = shuffled[idx++] ?? s.photoId;
    return { ...s, photoId: next };
  });

  return { ...page, slots: newSlots };
}

export function assignPhotoToSlot(page: Page, slotId: string, photoId: string): Page {
  const existing = page.slots.find(s => s.photoId === photoId);
  const target = page.slots.find(s => s.id === slotId);
  if (!target) return page;
  const newSlots = page.slots.map(s => {
    if (s.id === slotId) return { ...s, photoId };
    if (existing && s.id === existing.id) return { ...s, photoId: target.photoId };
    return s;
  });
  return { ...page, slots: newSlots };
}

/**
 * Sugiere plantillas para un conjunto de fotos.
 *
 * @param photos     fotos a colocar
 * @param templates  catálogo completo de plantillas
 * @param count      cuántas sugerencias devolver como máximo
 * @param random     si es true, devuelve un subconjunto aleatorio de las
 *                   mejores candidatas (útil para Auto Design variado).
 *                   Si es false, devuelve las N más afines de forma determinística.
 */
export function suggestLayouts(
  photos: Photo[],
  templates: Template[],
  count = 4,
  random = false
): Template[] {
  const n = photos.length;
  if (n === 0) return [];

  // Candidatas: solo plantillas de contenido (no portada)
  const candidates = templates.filter(t => t.category !== 'cover');
  if (candidates.length === 0) return [];

  // Calculamos afinidad: distancia entre nº de fotos del template y nº de fotos disponibles
  const scored = candidates.map(t => {
    const tc = parseInt(t.category, 10);
    const diff = Math.abs(tc - n);
    return { t, diff, tc };
  });

  // Filtro suave: aceptar plantillas cuya distancia no sea mayor que
  // max(2, mitad del número de fotos). Esto evita que con 3 fotos
  // sugiera plantillas de 8 (que quedarían con slots vacíos).
  const tolerance = Math.max(2, Math.ceil(n / 2));
  const viable = scored.filter(x => x.diff <= tolerance);

  // Si el filtro deja pocas, relajamos el criterio: tomamos las más cercanas
  const pool = viable.length >= 3 ? viable : scored;

  if (random) {
    // Orden aleatorio completo; pero damos preferencia a las más cercanas
    // Para eso: ordenamos por diff, luego "mezclamos" dentro de las mejores.
    // Estrategia: tomamos las 8 mejores y las mezclamos aleatoriamente.
    const sorted = [...pool].sort((a, b) => a.diff - b.diff);
    const top = sorted.slice(0, Math.min(8, sorted.length));
    const shuffled = [...top].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(x => x.t);
  }

  // Modo determinístico
  return pool
    .sort((a, b) => a.diff - b.diff)
    .slice(0, count)
    .map(x => x.t);
}