'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/src/store/projectStore';
import { TextElement } from '@/src/types';
import { FONT_OPTIONS, loadGoogleFont } from '@/src/engine/assets';

interface Props {
  text: TextElement;
  pageWidth: number;
  pageHeight: number;
  offsetX: number;
  selected: boolean;
}

export function TextElementView({ text, pageWidth, pageHeight, offsetX, selected }: Props) {
  const updateText = useStore(s => s.updateText);
  const select = useStore(s => s.select);

  // -------------------------------------------------------------
  // Cargar la fuente de este texto si aún no está cargada
  // -------------------------------------------------------------
  useEffect(() => {
    const font = FONT_OPTIONS.find(f => f.family === text.fontFamily);
    if (font) {
      loadGoogleFont(font.family, font.weights);
    }
  }, [text.fontFamily]);

  const left = (text.x / 100) * pageWidth;
  const top = (text.y / 100) * pageHeight;
  const w = (text.w / 100) * pageWidth;

  const onMouseDown = (e: React.MouseEvent) => {
    if (text.locked) return;
    e.stopPropagation();
    select(null, text.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const sx = text.x, sy = text.y;
    const onMove = (ev: MouseEvent) => {
      updateText(text.id, {
        x: sx + ((ev.clientX - startX) / pageWidth) * 100,
        y: sy + ((ev.clientY - startY) / pageHeight) * 100
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Construimos la lista de familias de respaldo para que el navegador
  // muestre algo coherente mientras la fuente de Google carga.
  const fontStack = `"${text.fontFamily}", system-ui, -apple-system, sans-serif`;

  return (
    <div
      className={`absolute ${selected ? 'ring-1 ring-evr-accent' : ''}`}
      style={{
        left,
        top,
        width: w,
        cursor: text.locked ? 'not-allowed' : 'move',
        color: text.color,
        fontFamily: fontStack,
        fontSize: `${(text.fontSize * 96) / 72}px`,
        fontWeight: text.fontWeight,
        textAlign: text.align,
        lineHeight: text.lineHeight,
        letterSpacing: `${text.tracking}px`,
        whiteSpace: 'pre-wrap',
        userSelect: 'none',
        // Mejora el renderizado de fuentes serif/display en pantallas
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        // Preserva mejor el aspecto visual de fuentes decorativas
        fontFeatureSettings: 'normal',
        fontKerning: 'normal'
      }}
      onMouseDown={onMouseDown}
    >
      {text.text}
    </div>
  );
}
