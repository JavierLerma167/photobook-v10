// src/store/projectStore.ts
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  Project, Photo, Page, Slot, TextElement, AlbumSizeId, PrintProfile, Template, AlbumSize
} from '@/src/types';
import { BUILTIN_TEMPLATES, COVER_TEMPLATES } from '@/src/engine/templates';
import { applyTemplate, assignPhotoToSlot, shufflePhotos, suggestLayouts } from '@/src/engine/layoutEngine';
import { HistoryState, pushHistory, undo as undoH, redo as redoH } from '@/src/engine/history';

// ============================================================
// TAMAÑOS PREDEFINIDOS
// ============================================================
export const ALBUM_SIZES: Record<Exclude<AlbumSizeId, 'custom'>, AlbumSize> = {
  '8x8':   { id: '8x8',   label: '8×8 in',   widthIn: 8,  heightIn: 8,  bleedIn: 0.125, safeIn: 0.25, gutterIn: 0.25, unit: 'in', orientation: 'portrait',  dpi: 300 },
  '10x10': { id: '10x10', label: '10×10 in', widthIn: 10, heightIn: 10, bleedIn: 0.125, safeIn: 0.3,  gutterIn: 0.3,  unit: 'in', orientation: 'portrait',  dpi: 300 },
  '12x12': { id: '12x12', label: '12×12 in', widthIn: 12, heightIn: 12, bleedIn: 0.125, safeIn: 0.35, gutterIn: 0.35, unit: 'in', orientation: 'portrait',  dpi: 300 },
  '11x14': { id: '11x14', label: '11×14 in', widthIn: 14, heightIn: 11, bleedIn: 0.125, safeIn: 0.35, gutterIn: 0.35, unit: 'in', orientation: 'landscape', dpi: 300 }
};

export const DEFAULT_PROFILES: PrintProfile[] = [
  { id: 'default', name: 'Estándar 300 DPI', sizeId: '10x10', dpi: 300, bleedIn: 0.125, safeIn: 0.3, gutterIn: 0.3, colorSpace: 'sRGB', format: 'JPEG', naming: 'page-{n}' }
];

// ============================================================
// HELPERS
// ============================================================

function createEmptyPage(kind: 'cover' | 'spread' = 'spread'): Page {
  const template = kind === 'cover'
    ? COVER_TEMPLATES[0]
    : BUILTIN_TEMPLATES.find(t => t.photoCount === 1 && t.style === 'Full Bleed')!;
  return {
    id: nanoid(10),
    kind,
    templateId: template.id,
    background: '#ffffff',
    texts: [],
    slots: template.slots.map((s, i) => ({
      id: nanoid(8),
      x: s.x, y: s.y, w: s.w, h: s.h,
      photoId: null, fit: 'cover',
      offsetX: 0, offsetY: 0, zoom: 1, rotation: 0,
      locked: false, z: i
    }))
  };
}

/**
 * Crea un proyecto nuevo.
 *
 * Acepta un `AlbumSize` completo en lugar de solo un `sizeId`, de modo que
 * los tamaños personalizados (con unidad, orientación y DPI propios) se
 * guarden en `customSize` y no dependan de `ALBUM_SIZES`.
 */
export function createProject(name: string, size: AlbumSize): Project {
  const isCustom = size.id === 'custom';
  return {
    id: nanoid(10),
    name,
    sizeId: size.id,
    customSize: isCustom ? size : undefined,
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    printProfileId: 'default',
    pages: [
      createEmptyPage('cover'),
      createEmptyPage('spread'),
      createEmptyPage('spread'),
    ],
    photos: [],
    currentPageIndex: 0
  };
}

/**
 * Devuelve el índice de la primera página del spread activo.
 */
function normalizePageIndex(index: number, pages: Page[]): number {
  if (index <= 0) return 0;
  if (pages[index]?.kind === 'cover') return 0;
  const offset = index - 1;
  if (offset % 2 === 0) return index;
  return index - 1;
}

function findPageIndexBySlot(pages: Page[], slotId: string): number {
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].slots.some(sl => sl.id === slotId)) return i;
  }
  return -1;
}

function findPageIndexByText(pages: Page[], textId: string): number {
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].texts.some(t => t.id === textId)) return i;
  }
  return -1;
}

// ============================================================
// TIPOS DEL STORE
// ============================================================

interface UIState {
  selectedSlotId: string | null;
  selectedSlotIds: string[];
  selectedTextId: string | null;
  showGuides: boolean;
  showGrid: boolean;
  showSlotBorders: boolean;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  zoom: number;
  panX: number;
  panY: number;
  templateGalleryOpen: boolean;
  preflightOpen: boolean;
  exportOpen: boolean;
  newProjectOpen: boolean;
  autosaveAt: number;
}

interface StoreState {
  history: HistoryState;
  ui: UIState;
  templates: Template[];
  profiles: PrintProfile[];

  // Cambia la firma: ahora recibe un AlbumSize completo
  newProject: (name: string, size: AlbumSize) => void;
  setProject: (p: Project) => void;
  renameProject: (name: string) => void;
  importPhotos: (photos: Photo[]) => void;
  removePhoto: (id: string) => void;
  toggleFavorite: (id: string) => void;
  reorderPhotos: (from: number, to: number) => void;
  replacePhoto: (slotId: string, photoId: string) => void;

  goToPage: (index: number) => void;
  nextSpread: () => void;
  prevSpread: () => void;
  addPage: (after?: number) => void;
  addSpread: () => void;
  duplicatePage: (index: number) => void;
  deletePage: (index: number) => void;
  togglePageSpan: (pageIndex: number) => void;

  assignPhoto: (slotId: string, photoId: string) => void;
  clearSlot: (slotId: string) => void;
  updateSlot: (slotId: string, patch: Partial<Slot>) => void;
  mergeSlots: (slotIds: string[]) => void;
  splitSlot: (slotId: string, direction: 'h' | 'v') => void;
  addSlot: (pageIndex?: number, init?: Partial<Slot>) => void;

  applyTemplateToPage: (templateId: string, pageIndex?: number) => void;
  shuffleCurrentPage: () => void;
  autoDesign: (photoIds: string[]) => Template[];

  addText: (text?: Partial<TextElement>) => void;
  updateText: (id: string, patch: Partial<TextElement>) => void;
  deleteText: (id: string) => void;

  undo: () => void;
  redo: () => void;

  setUI: (patch: Partial<UIState>) => void;
  select: (slotId: string | null, textId: string | null) => void;
  toggleSlotSelection: (slotId: string) => void;
  clearSlotSelection: () => void;

  saveLocal: () => void;
  loadLocal: () => boolean;
}

// ============================================================
// STORE
// ============================================================

export const useStore = create<StoreState>((set, get) => {
  // ------------------------------------------------------------
  // 4.2 / 4.3 — Proyecto inicial + newProject
  // Ahora `createProject` recibe un AlbumSize completo.
  // ------------------------------------------------------------
  const initialProject = createProject('Sin título', ALBUM_SIZES['10x10']);

  return {
    history: { past: [], present: initialProject, future: [] },
    ui: {
      selectedSlotId: null,
      selectedSlotIds: [],
      selectedTextId: null,
      showGuides: true,
      showGrid: false,
      showSlotBorders: true,
      leftPanelOpen: true,
      rightPanelOpen: true,
      zoom: 0.5,
      panX: 0,
      panY: 0,
      templateGalleryOpen: false,
      preflightOpen: false,
      exportOpen: false,
      newProjectOpen: false,
      autosaveAt: 0
    },
    templates: [...BUILTIN_TEMPLATES, ...COVER_TEMPLATES],
    profiles: DEFAULT_PROFILES,

    // -------------------------------------------------------------
    // 4.3 — NUEVO PROYECTO
    // Acepta un AlbumSize completo (preset o personalizado).
    // -------------------------------------------------------------
    newProject: (name, size) => set(s => ({
      history: pushHistory(s.history, createProject(name, size)),
      ui: {
        ...s.ui,
        selectedSlotId: null,
        selectedSlotIds: [],
        selectedTextId: null,
        zoom: 0.5,
        panX: 0,
        panY: 0
      }
    })),

    setProject: (p) => set(s => ({ history: pushHistory(s.history, { ...p, updatedAt: Date.now() }) })),

    renameProject: (name) => set(s => commit(s, { ...s.history.present, name })),

    importPhotos: (photos) => set(s => commit(s, {
      ...s.history.present,
      photos: [...s.history.present.photos, ...photos]
    })),

    removePhoto: (id) => set(s => commit(s, {
      ...s.history.present,
      photos: s.history.present.photos.filter(p => p.id !== id),
      pages: s.history.present.pages.map(pg => ({
        ...pg,
        slots: pg.slots.map(sl => sl.photoId === id ? { ...sl, photoId: null } : sl)
      }))
    })),

    toggleFavorite: (id) => set(s => commit(s, {
      ...s.history.present,
      photos: s.history.present.photos.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p)
    })),

    reorderPhotos: (from, to) => set(s => {
      const photos = [...s.history.present.photos];
      const [it] = photos.splice(from, 1);
      photos.splice(to, 0, it);
      return commit(s, { ...s.history.present, photos });
    }),

    // -------------------------------------------------------------
    // Asignación de fotos
    // -------------------------------------------------------------
    replacePhoto: (slotId, photoId) => set(s => {
      const project = s.history.present;
      const pageIndex = findPageIndexBySlot(project.pages, slotId);
      if (pageIndex < 0) return s;
      const page = project.pages[pageIndex];
      const updated = assignPhotoToSlot(page, slotId, photoId);
      const pages = project.pages.map((p, i) => i === pageIndex ? updated : p);
      return commit(s, { ...project, pages });
    }),

    // -------------------------------------------------------------
    // Navegación
    // -------------------------------------------------------------
    goToPage: (index) => set(s => {
      const project = s.history.present;
      const max = project.pages.length - 1;
      const idx = Math.max(0, Math.min(max, index));
      const normalized = normalizePageIndex(idx, project.pages);
      return {
        history: {
          ...s.history,
          present: { ...project, currentPageIndex: normalized }
        }
      };
    }),

    nextSpread: () => set(s => {
      const project = s.history.present;
      const cur = project.currentPageIndex;
      const next = cur === 0 ? 1 : cur + 2;
      const idx = Math.max(0, Math.min(project.pages.length - 1, next));
      const normalized = normalizePageIndex(idx, project.pages);
      return {
        history: {
          ...s.history,
          present: { ...project, currentPageIndex: normalized }
        }
      };
    }),

    prevSpread: () => set(s => {
      const project = s.history.present;
      const cur = project.currentPageIndex;
      const prev = cur <= 1 ? 0 : cur - 2;
      const normalized = normalizePageIndex(prev, project.pages);
      return {
        history: {
          ...s.history,
          present: { ...project, currentPageIndex: normalized }
        }
      };
    }),

    addPage: (after) => set(s => {
      const project = s.history.present;
      const pages = [...project.pages];
      const idx = after == null ? pages.length : after + 1;
      pages.splice(idx, 0, createEmptyPage('spread'));
      const newIndex = normalizePageIndex(idx, pages);
      return commit(s, { ...project, pages, currentPageIndex: newIndex });
    }),

    addSpread: () => set(s => {
      const project = s.history.present;
      const newPages = [...project.pages, createEmptyPage('spread'), createEmptyPage('spread')];
      const firstNew = project.pages.length;
      const newIndex = normalizePageIndex(firstNew, newPages);
      return commit(s, { ...project, pages: newPages, currentPageIndex: newIndex });
    }),

    duplicatePage: (index) => set(s => {
      const project = s.history.present;
      const src = project.pages[index];
      if (!src) return s;
      const copy: Page = {
        ...src,
        id: nanoid(10),
        slots: src.slots.map(sl => ({ ...sl, id: nanoid(8) })),
        texts: src.texts.map(t => ({ ...t, id: nanoid(8) }))
      };
      const pages = [...project.pages];
      pages.splice(index + 1, 0, copy);
      const newIndex = normalizePageIndex(index + 1, pages);
      return commit(s, { ...project, pages, currentPageIndex: newIndex });
    }),

    deletePage: (index) => set(s => {
      const project = s.history.present;
      if (project.pages.length <= 1) return s;
      if (project.pages[index]?.kind === 'cover') return s;
      const pages = project.pages.filter((_, i) => i !== index);
      const newIndex = normalizePageIndex(Math.min(index, pages.length - 1), pages);
      return commit(s, { ...project, pages, currentPageIndex: newIndex });
    }),

    // -------------------------------------------------------------
    // Unir / separar páginas (span)
    // -------------------------------------------------------------
    togglePageSpan: (pageIndex) => set(s => {
      const project = s.history.present;
      const page = project.pages[pageIndex];
      if (!page || page.kind === 'cover') return s;

      if (pageIndex % 2 === 0) return s;

      const prevPage = project.pages[pageIndex - 1];
      if (prevPage?.spanNext) return s;

      const updated: Page = { ...page, spanNext: !page.spanNext };
      const pages = project.pages.map((p, i) => i === pageIndex ? updated : p);
      return commit(s, { ...project, pages });
    }),

    // -------------------------------------------------------------
    // Slots
    // -------------------------------------------------------------
    assignPhoto: (slotId, photoId) => set(s => {
      const project = s.history.present;
      const pageIndex = findPageIndexBySlot(project.pages, slotId);
      if (pageIndex < 0) return s;
      const page = project.pages[pageIndex];
      const updated = assignPhotoToSlot(page, slotId, photoId);
      const pages = project.pages.map((p, i) => i === pageIndex ? updated : p);
      return commit(s, { ...project, pages });
    }),

    clearSlot: (slotId) => set(s => {
      const project = s.history.present;
      const pageIndex = findPageIndexBySlot(project.pages, slotId);
      if (pageIndex < 0) return s;
      const page = project.pages[pageIndex];
      const updated = { ...page, slots: page.slots.map(sl => sl.id === slotId ? { ...sl, photoId: null } : sl) };
      const pages = project.pages.map((p, i) => i === pageIndex ? updated : p);
      return commit(s, { ...project, pages });
    }),

    updateSlot: (slotId, patch) => set(s => {
      const project = s.history.present;
      const pageIndex = findPageIndexBySlot(project.pages, slotId);
      if (pageIndex < 0) return s;
      const page = project.pages[pageIndex];
      const updated = { ...page, slots: page.slots.map(sl => sl.id === slotId ? { ...sl, ...patch } : sl) };
      const pages = project.pages.map((p, i) => i === pageIndex ? updated : p);
      return commit(s, { ...project, pages });
    }),

    mergeSlots: (slotIds) => set(s => {
      const project = s.history.present;
      if (slotIds.length < 2) return s;
      const pageIndex = findPageIndexBySlot(project.pages, slotIds[0]);
      if (pageIndex < 0) return s;
      const page = project.pages[pageIndex];
      const targets = page.slots.filter(sl => slotIds.includes(sl.id));
      if (targets.length < 2) return s;

      const minX = Math.min(...targets.map(t => t.x));
      const minY = Math.min(...targets.map(t => t.y));
      const maxX = Math.max(...targets.map(t => t.x + t.w));
      const maxY = Math.max(...targets.map(t => t.y + t.h));

      const withPhoto = targets.find(t => t.photoId);
      const merged: Slot = {
        id: nanoid(8),
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY,
        photoId: withPhoto?.photoId ?? null,
        fit: withPhoto?.fit ?? 'cover',
        offsetX: withPhoto?.offsetX ?? 0,
        offsetY: withPhoto?.offsetY ?? 0,
        zoom: withPhoto?.zoom ?? 1,
        rotation: 0,
        locked: false,
        z: Math.min(...targets.map(t => t.z))
      };

      const remaining = page.slots.filter(sl => !slotIds.includes(sl.id));
      const updated: Page = { ...page, slots: [...remaining, merged] };
      const pages = project.pages.map((p, i) => i === pageIndex ? updated : p);
      return {
        history: pushHistory(s.history, { ...project, pages, updatedAt: Date.now() }),
        ui: { ...s.ui, selectedSlotId: merged.id, selectedSlotIds: [merged.id] }
      };
    }),

    splitSlot: (slotId, direction) => set(s => {
      const project = s.history.present;
      const pageIndex = findPageIndexBySlot(project.pages, slotId);
      if (pageIndex < 0) return s;
      const page = project.pages[pageIndex];
      const slot = page.slots.find(sl => sl.id === slotId);
      if (!slot) return s;

      const half1: Slot = { ...slot, id: nanoid(8) };
      const half2: Slot = {
        ...slot,
        id: nanoid(8),
        photoId: null,
        offsetX: 0,
        offsetY: 0,
        zoom: 1
      };

      if (direction === 'h') {
        half1.w = slot.w / 2;
        half2.x = slot.x + slot.w / 2;
        half2.y = slot.y;
        half2.w = slot.w / 2;
        half2.h = slot.h;
      } else {
        half1.h = slot.h / 2;
        half2.x = slot.x;
        half2.y = slot.y + slot.h / 2;
        half2.w = slot.w;
        half2.h = slot.h / 2;
      }

      const newSlots = page.slots.flatMap(sl => sl.id === slotId ? [half1, half2] : [sl]);
      const updated: Page = { ...page, slots: newSlots };
      const pages = project.pages.map((p, i) => i === pageIndex ? updated : p);
      return {
        history: pushHistory(s.history, { ...project, pages, updatedAt: Date.now() }),
        ui: { ...s.ui, selectedSlotId: half1.id, selectedSlotIds: [half1.id] }
      };
    }),

    addSlot: (pageIndex, init) => set(s => {
      const project = s.history.present;
      const idx = pageIndex ?? project.currentPageIndex;
      const page = project.pages[idx];
      if (!page) return s;

      const baseW = 40;
      const baseH = 30;

      const newSlot: Slot = {
        id: nanoid(8),
        x: 50 - baseW / 2,
        y: 50 - baseH / 2,
        w: baseW,
        h: baseH,
        photoId: null,
        fit: 'contain',
        offsetX: 0,
        offsetY: 0,
        zoom: 1,
        rotation: 0,
        locked: false,
        z: page.slots.length,
        ...init
      };

      const updated: Page = { ...page, slots: [...page.slots, newSlot] };
      const pages = project.pages.map((p, i) => i === idx ? updated : p);
      return {
        history: pushHistory(s.history, { ...project, pages, updatedAt: Date.now() }),
        ui: { ...s.ui, selectedSlotId: newSlot.id, selectedSlotIds: [newSlot.id] }
      };
    }),

    applyTemplateToPage: (templateId, pageIndex) => set(s => {
      const project = s.history.present;
      const idx = pageIndex ?? project.currentPageIndex;
      const template = s.templates.find(t => t.id === templateId);
      if (!template) return s;
      const page = project.pages[idx];
      if (!page) return s;
      if (page.kind === 'cover' && template.category !== 'cover') return s;
      if (page.kind !== 'cover' && template.category === 'cover') return s;
      const updated = applyTemplate(page, template);
      const pages = project.pages.map((p, i) => i === idx ? updated : p);
      return commit(s, { ...project, pages });
    }),

    // -------------------------------------------------------------
    // SHUFFLE
    // -------------------------------------------------------------
    shuffleCurrentPage: () => set(s => {
      const project = s.history.present;
      const cur = project.currentPageIndex;
      const pageA = project.pages[cur];
      const pageB = project.pages[cur + 1];
      if (!pageA) return s;

      if (pageA.kind === 'cover') {
        const shuffledA = shufflePhotos(pageA);
        const pages = project.pages.map((p, i) => i === cur ? shuffledA : p);
        return commit(s, { ...project, pages });
      }

      const photosA = pageA.slots.map(sl => sl.photoId).filter(Boolean) as string[];
      const photosB = pageB && pageB.kind !== 'cover'
        ? pageB.slots.map(sl => sl.photoId).filter(Boolean) as string[]
        : [];
      const pool = [...photosA, ...photosB].sort(() => Math.random() - 0.5);

      let idx = 0;
      const rebuiltA: Page = {
        ...pageA,
        slots: pageA.slots.map(sl => sl.photoId ? { ...sl, photoId: pool[idx++] ?? sl.photoId } : sl)
      };
      const rebuiltB: Page | null = pageB && pageB.kind !== 'cover'
        ? {
            ...pageB,
            slots: pageB.slots.map(sl => sl.photoId ? { ...sl, photoId: pool[idx++] ?? sl.photoId } : sl)
          }
        : null;

      const pages = project.pages.map((p, i) => {
        if (i === cur) return rebuiltA;
        if (i === cur + 1 && rebuiltB) return rebuiltB;
        return p;
      });
      return commit(s, { ...project, pages });
    }),

    // -------------------------------------------------------------
    // AUTO DESIGN
    // -------------------------------------------------------------
    autoDesign: (photoIds) => {
      const s = get();
      const photos = s.history.present.photos.filter(p => photoIds.includes(p.id));
      if (photos.length === 0) return [];

      const suggestions = suggestLayouts(photos, s.templates, 6, true);
      if (suggestions.length === 0) return [];

      set(state => {
        const project = state.history.present;
        const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);
        const spreadCount = Math.max(1, Math.ceil(shuffledPhotos.length / 6));
        const perSpread = Math.ceil(shuffledPhotos.length / spreadCount);

        const newPages: Page[] = [];

        for (let i = 0; i < spreadCount; i++) {
          const chunk = shuffledPhotos.slice(i * perSpread, (i + 1) * perSpread);
          if (chunk.length === 0) continue;

          const chunkSuggestions = suggestLayouts(chunk, s.templates, 3, true);
          const template = chunkSuggestions[0];
          if (!template) continue;

          let page = createEmptyPage('spread');
          page = applyTemplate(page, template);

          let pi = 0;
          page.slots = page.slots.map(sl => {
            if (pi < chunk.length) return { ...sl, photoId: chunk[pi++].id };
            return sl;
          });

          newPages.push(page);
        }

        const pages = [...project.pages, ...newPages];
        const firstNew = project.pages.length;
        const newIndex = normalizePageIndex(firstNew, pages);
        return commit(state, { ...project, pages, currentPageIndex: newIndex });
      });

      return suggestions;
    },

    // -------------------------------------------------------------
    // Texto
    // -------------------------------------------------------------
    addText: (patch) => set(s => {
      const project = s.history.present;
      const page = project.pages[project.currentPageIndex];
      const t: TextElement = {
        id: nanoid(8),
        x: 10, y: 45, w: 80, h: 10,
        text: 'Texto',
        fontFamily: 'Inter',
        fontSize: 24,
        fontWeight: 600,
        color: '#111111',
        align: 'center',
        tracking: 0,
        lineHeight: 1.2,
        rotation: 0,
        locked: false,
        z: page.texts.length,
        ...patch
      };
      const updated = { ...page, texts: [...page.texts, t] };
      return commit(s, replacePage(project, updated));
    }),

    updateText: (id, patch) => set(s => {
      const project = s.history.present;
      const pageIndex = findPageIndexByText(project.pages, id);
      if (pageIndex < 0) return s;
      const page = project.pages[pageIndex];
      const updated = { ...page, texts: page.texts.map(t => t.id === id ? { ...t, ...patch } : t) };
      const pages = project.pages.map((p, i) => i === pageIndex ? updated : p);
      return commit(s, { ...project, pages });
    }),

    deleteText: (id) => set(s => {
      const project = s.history.present;
      const pageIndex = findPageIndexByText(project.pages, id);
      if (pageIndex < 0) return s;
      const page = project.pages[pageIndex];
      const updated = { ...page, texts: page.texts.filter(t => t.id !== id) };
      const pages = project.pages.map((p, i) => i === pageIndex ? updated : p);
      return commit(s, { ...project, pages });
    }),

    undo: () => set(s => ({ history: undoH(s.history) })),
    redo: () => set(s => ({ history: redoH(s.history) })),

    setUI: (patch) => set(s => ({ ui: { ...s.ui, ...patch } })),

    // -------------------------------------------------------------
    // Selección
    // -------------------------------------------------------------
    select: (slotId, textId) => set(s => {
      const project = s.history.present;

      let newPageIndex = project.currentPageIndex;

      if (slotId) {
        const pageIdx = findPageIndexBySlot(project.pages, slotId);
        if (pageIdx >= 0) newPageIndex = pageIdx;
      } else if (textId) {
        const pageIdx = findPageIndexByText(project.pages, textId);
        if (pageIdx >= 0) newPageIndex = pageIdx;
      }

      const nextSelectedSlotIds = slotId ? [slotId] : [];

      return {
        ui: {
          ...s.ui,
          selectedSlotId: slotId,
          selectedSlotIds: nextSelectedSlotIds,
          selectedTextId: textId
        },
        history: {
          ...s.history,
          present: { ...project, currentPageIndex: newPageIndex }
        }
      };
    }),

    toggleSlotSelection: (slotId) => set(s => {
      const current = s.ui.selectedSlotIds;
      const isIn = current.includes(slotId);
      const next = isIn
        ? current.filter(id => id !== slotId)
        : [...current, slotId];

      const project = s.history.present;
      let newPageIndex = project.currentPageIndex;
      const pageIdx = findPageIndexBySlot(project.pages, slotId);
      if (pageIdx >= 0) newPageIndex = pageIdx;

      return {
        ui: {
          ...s.ui,
          selectedSlotIds: next,
          selectedSlotId: next.length > 0 ? next[next.length - 1] : null,
          selectedTextId: null
        },
        history: {
          ...s.history,
          present: { ...project, currentPageIndex: newPageIndex }
        }
      };
    }),

    clearSlotSelection: () => set(s => ({
      ui: { ...s.ui, selectedSlotIds: [], selectedSlotId: null }
    })),

    saveLocal: () => {
      const s = get();
      const project = s.history.present;
      const serializable = {
        ...project,
        photos: project.photos.map(p => ({ ...p, url: '', proxyUrl: '' }))
      };
      localStorage.setItem('evr:autosave', JSON.stringify({
        project: serializable,
        savedAt: Date.now()
      }));
      set(st => ({ ui: { ...st.ui, autosaveAt: Date.now() } }));
    },

    loadLocal: () => {
      const raw = localStorage.getItem('evr:autosave');
      if (!raw) return false;
      try {
        const data = JSON.parse(raw);
        set(s => ({
          history: pushHistory(s.history, data.project),
          ui: { ...s.ui, autosaveAt: Date.now() }
        }));
        return true;
      } catch { return false; }
    }
  };
});

// ============================================================
// HELPERS INTERNOS
// ============================================================

function commit(s: StoreState, next: Project): Partial<StoreState> {
  return { history: pushHistory(s.history, { ...next, updatedAt: Date.now() }) };
}

function replacePage(project: Project, page: Page): Project {
  return {
    ...project,
    pages: project.pages.map(p => p.id === page.id ? page : p)
  };
}

// ============================================================
// 4.1 — HOOK useAlbumSize
// Devuelve el AlbumSize activo, ya sea un preset o un customSize.
// ============================================================

export const useCurrentProject = () => useStore(s => s.history.present);

export const useCurrentPage = () =>
  useStore(s => s.history.present.pages[s.history.present.currentPageIndex]);

/**
 * Devuelve el `AlbumSize` activo.
 *
 * - Si el proyecto tiene `customSize` (tamaño personalizado), lo devuelve.
 * - Si no, busca el preset en `ALBUM_SIZES` por `sizeId`.
 *
 * Esto garantiza que el resto del código (Spread, preflight, export…)
 * funcione igual tanto con presets como con tamaños personalizados.
 */
export const useAlbumSize = (): AlbumSize => {
  const project = useStore(s => s.history.present);
  if (project.customSize) return project.customSize;
  const preset = ALBUM_SIZES[project.sizeId as Exclude<AlbumSizeId, 'custom'>];
  // Fallback defensivo por si el sizeId no existe
  return preset ?? ALBUM_SIZES['10x10'];
};
