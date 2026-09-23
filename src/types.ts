export type AlbumSizeId = '8x8' | '10x10' | '12x12' | '11x14';

export interface AlbumSize {
  id: AlbumSizeId;
  label: string;
  widthIn: number;
  heightIn: number;
  bleedIn: number;
  safeIn: number;
  gutterIn: number;
}

export interface Photo {
  id: string;
  name: string;
  url: string;
  proxyUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  favorite: boolean;
  createdAt: number;
}

export type SlotFit = 'cover' | 'contain' | 'fill';

export interface Slot {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  photoId: string | null;
  fit: SlotFit;
  offsetX: number;
  offsetY: number;
  zoom: number;
  rotation: number;
  locked: boolean;
  z: number;
}

export interface TextElement {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: 'left' | 'center' | 'right';
  tracking: number;
  lineHeight: number;
  rotation: number;
  locked: boolean;
  z: number;
}

export type PageKind = 'cover' | 'spread';

export type BackgroundImageFit = 'cover' | 'contain' | 'repeat';

export interface Page {
  id: string;
  kind: PageKind;
  templateId: string | null;
  slots: Slot[];
  texts: TextElement[];
  /** Color base del fondo (hex) */
  background: string;
  /** Imagen o textura de fondo (dataURL o URL) */
  backgroundImage?: string | null;
  /** Opacidad de la imagen de fondo (0-1) */
  backgroundImageOpacity?: number;
  /** Cómo se ajusta la imagen al fondo */
  backgroundImageFit?: BackgroundImageFit;
  /** Color de superposición sobre la imagen (ej: 'rgba(0,0,0,0.35)') */
  backgroundOverlay?: string | null;
  label?: string;
  spanNext?: boolean;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  style: string;
  photoCount: number;
  builtin: boolean;
  slots: Array<Pick<Slot, 'x' | 'y' | 'w' | 'h'>>;
}

export interface Project {
  id: string;
  name: string;
  sizeId: AlbumSizeId;
  pages: Page[];
  photos: Photo[];
  currentPageIndex: number;
  version: number;
  createdAt: number;
  updatedAt: number;
  printProfileId: string;
}

export interface PrintProfile {
  id: string;
  name: string;
  sizeId: AlbumSizeId;
  dpi: number;
  bleedIn: number;
  safeIn: number;
  gutterIn: number;
  colorSpace: 'sRGB' | 'AdobeRGB' | 'CMYK';
  format: 'JPEG' | 'PDF';
  naming: string;
}

export type PreflightLevel = 'error' | 'warning' | 'ok';

export interface PreflightIssue {
  id: string;
  level: PreflightLevel;
  pageId?: string;
  slotId?: string;
  textId?: string;
  message: string;
  category: string;
}
