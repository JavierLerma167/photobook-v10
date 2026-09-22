import { Photo, AlbumSize, Slot } from '@/src/types';

export type QualityLevel = 'excellent' | 'acceptable' | 'warning' | 'critical';

export interface ResolutionInfo {
  effectiveDpi: number;
  level: QualityLevel;
  requiredDpi: number;
}

export function computeEffectiveDpi(
  photo: Photo,
  slot: Slot,
  size: AlbumSize,
  requiredDpi = 300
): ResolutionInfo {
  const slotWidthIn = (slot.w / 100) * size.widthIn;
  const slotHeightIn = (slot.h / 100) * size.heightIn;

  const availW = slotWidthIn;
  const availH = slotHeightIn;

  const photoAspect = photo.width / photo.height;
  const slotAspect = availW / availH;
  let renderedW: number, renderedH: number;
  if (photoAspect > slotAspect) {
    renderedH = availH;
    renderedW = availH * photoAspect;
  } else {
    renderedW = availW;
    renderedH = availW / photoAspect;
  }

  renderedW /= slot.zoom;
  renderedH /= slot.zoom;

  const dpiX = photo.width / renderedW;
  const dpiY = photo.height / renderedH;
  const dpi = Math.min(dpiX, dpiY);

  let level: QualityLevel;
  if (dpi >= requiredDpi) level = 'excellent';
  else if (dpi >= requiredDpi * 0.8) level = 'acceptable';
  else if (dpi >= requiredDpi * 0.5) level = 'warning';
  else level = 'critical';

  return { effectiveDpi: Math.round(dpi), level, requiredDpi };
}

export const QUALITY_LABEL: Record<QualityLevel, string> = {
  excellent: 'Excelente',
  acceptable: 'Aceptable',
  warning: 'Advertencia',
  critical: 'Crítico'
};

export const QUALITY_COLOR: Record<QualityLevel, string> = {
  excellent: '#22c55e',
  acceptable: '#84cc16',
  warning: '#f59e0b',
  critical: '#ef4444'
};