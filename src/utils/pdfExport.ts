import jsPDF from 'jspdf';
import { Project, AlbumSize, PrintProfile, Page } from '@/src/types';

/**
 * Exporta el proyecto completo a PDF.
 *
 * Estrategia: cada página/spread se renderiza primero como un canvas
 * (con clipping perfecto por página), se convierte a JPEG y se inserta
 * en el PDF como imagen a tamaño completo. Esto garantiza que el PDF
 * sea 100% fiel al canvas del editor.
 *
 * Estructura:
 * - 1 página PDF para la portada
 * - 1 página PDF por SPREAD (normal o extendido con spanNext)
 */
export async function exportProjectToPdf(
  project: Project,
  size: AlbumSize,
  profile: PrintProfile,
  opts: { includeGuides?: boolean } = {}
): Promise<Blob> {
  const { includeGuides = false } = opts;
  const bleed = size.bleedIn;

  const coverW = size.widthIn + bleed * 2;
  const coverH = size.heightIn + bleed * 2;
  const spreadW = size.widthIn * 2 + bleed * 2;
  const spreadH = size.heightIn + bleed * 2;

  const pdf = new jsPDF({
    unit: 'in',
    format: [coverW, coverH],
    orientation: 'portrait',
    compress: true
  });

  let firstPdfPageHandled = false;

  // ---------------------------------------------------------
  // PORTADA
  // ---------------------------------------------------------
  if (project.pages[0]?.kind === 'cover') {
    const coverCanvas = await renderPageToCanvas(
      project,
      project.pages[0],
      size,
      150, // DPI base para el raster (subimos resolución después)
      'cover'
    );
    const dataUrl = coverCanvas.toDataURL('image/jpeg', 0.92);

    pdf.setFillColor('#ffffff');
    pdf.rect(0, 0, coverW, coverH, 'F');
    pdf.addImage(dataUrl, 'JPEG', 0, 0, coverW, coverH, undefined, 'FAST');

    firstPdfPageHandled = true;
  }

  // ---------------------------------------------------------
  // SPREADS
  // ---------------------------------------------------------
  let i = 1;
  while (i < project.pages.length) {
    const leftPage = project.pages[i];
    const rightPage = project.pages[i + 1];
    const isSpanned = leftPage?.spanNext === true;

    if (firstPdfPageHandled) {
      pdf.addPage([spreadW, spreadH], 'landscape');
    } else {
      pdf.deletePage(1);
      pdf.addPage([spreadW, spreadH], 'landscape');
      firstPdfPageHandled = true;
    }

    // Render del spread completo como un solo canvas
    const spreadCanvas = await renderSpreadToCanvas(
      project,
      leftPage,
      rightPage,
      size,
      150,
      isSpanned
    );
    const dataUrl = spreadCanvas.toDataURL('image/jpeg', 0.92);

    pdf.addImage(dataUrl, 'JPEG', 0, 0, spreadW, spreadH, undefined, 'FAST');

    // Guías opcionales del spread (se dibujan encima en el PDF)
    if (includeGuides) {
      pdf.setDrawColor(255, 0, 0);
      pdf.setLineWidth(0.005);
      pdf.rect(bleed, bleed, size.widthIn * 2, size.heightIn);

      pdf.setDrawColor(232, 176, 75);
      pdf.setLineWidth(0.005);
      const gutterX = bleed + size.widthIn;
      pdf.line(gutterX, bleed, gutterX, bleed + size.heightIn);
    }

    i += 2;
  }

  return pdf.output('blob');
}

/* ============================================================
 * RENDERING A CANVAS
 * ============================================================ */

/**
 * Renderiza una sola página (portada o página suelta) como canvas.
 */
async function renderPageToCanvas(
  project: Project,
  page: Page,
  size: AlbumSize,
  dpi: number,
  mode: 'cover' | 'page'
): Promise<HTMLCanvasElement> {
  const bleed = size.bleedIn * dpi;
  const pageW = size.widthIn * dpi;
  const pageH = size.heightIn * dpi;

  const wPx = pageW + bleed * 2;
  const hPx = pageH + bleed * 2;

  const canvas = document.createElement('canvas');
  canvas.width = wPx;
  canvas.height = hPx;
  const ctx = canvas.getContext('2d')!;

  // Fondo completo (incluye zona de bleed)
  ctx.fillStyle = page.background || '#ffffff';
  ctx.fillRect(0, 0, wPx, hPx);

  // Área de la página con clip
  ctx.save();
  ctx.beginPath();
  ctx.rect(bleed, bleed, pageW, pageH);
  ctx.clip();

  // Slots
  for (const slot of page.slots) {
    if (!slot.photoId) continue;
    const photo = project.photos.find(p => p.id === slot.photoId);
    if (!photo) continue;

    const img = await loadImage(photo.url);

    const sx = bleed + (slot.x / 100) * pageW;
    const sy = bleed + (slot.y / 100) * pageH;
    const sw = (slot.w / 100) * pageW;
    const sh = (slot.h / 100) * pageH;

    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, sy, sw, sh);
    ctx.clip();

    const slotAspect = sw / sh;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawW = sw, drawH = sh, drawX = sx, drawY = sy;

    if (imgAspect > slotAspect) {
      drawH = sh;
      drawW = sh * imgAspect;
      drawX = sx - (drawW - sw) / 2;
    } else {
      drawW = sw;
      drawH = sw / imgAspect;
      drawY = sy - (drawH - sh) / 2;
    }

    drawW /= slot.zoom;
    drawH /= slot.zoom;
    drawX -= (drawW - sw) * slot.offsetX * 0.5;
    drawY -= (drawH - sh) * slot.offsetY * 0.5;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  // Textos
  for (const t of page.texts) {
    const tx = bleed + (t.x / 100) * pageW;
    const ty = bleed + (t.y / 100) * pageH;
    ctx.fillStyle = t.color;
    ctx.font = `${t.fontWeight} ${(t.fontSize * dpi) / 72}px ${t.fontFamily}`;
    ctx.textAlign = t.align;
    ctx.textBaseline = 'top';
    const lines = t.text.split('\n');
    lines.forEach((ln, idx) => {
      ctx.fillText(ln, tx, ty + (idx * t.fontSize * t.lineHeight * dpi) / 72);
    });
  }

  ctx.restore(); // quitar clip de página

  return canvas;
}

/**
 * Renderiza un spread como canvas:
 * - Si `isSpanned`: un solo fondo + slots con coords 0-200 sobre doble ancho
 * - Si no: cada mitad con su fondo + clip por mitad
 */
async function renderSpreadToCanvas(
  project: Project,
  leftPage: Page | undefined,
  rightPage: Page | undefined,
  size: AlbumSize,
  dpi: number,
  isSpanned: boolean
): Promise<HTMLCanvasElement> {
  const bleed = size.bleedIn * dpi;
  const pageW = size.widthIn * dpi;
  const pageH = size.heightIn * dpi;

  const wPx = pageW * 2 + bleed * 2;
  const hPx = pageH + bleed * 2;

  const canvas = document.createElement('canvas');
  canvas.width = wPx;
  canvas.height = hPx;
  const ctx = canvas.getContext('2d')!;

  if (isSpanned && leftPage) {
    // =====================================================
    // CASO SPANNED: una sola "página" de doble ancho
    // =====================================================
    ctx.fillStyle = leftPage.background || '#ffffff';
    ctx.fillRect(0, 0, wPx, hPx);

    // Clip al área de la página extendida (sin bleed)
    ctx.save();
    ctx.beginPath();
    ctx.rect(bleed, bleed, pageW * 2, pageH);
    ctx.clip();

    // Slots sobre el doble ancho
    for (const slot of leftPage.slots) {
      if (!slot.photoId) continue;
      const photo = project.photos.find(p => p.id === slot.photoId);
      if (!photo) continue;
      const img = await loadImage(photo.url);

      const sx = bleed + (slot.x / 100) * (pageW * 2);
      const sy = bleed + (slot.y / 100) * pageH;
      const sw = (slot.w / 100) * (pageW * 2);
      const sh = (slot.h / 100) * pageH;

      ctx.save();
      ctx.beginPath();
      ctx.rect(sx, sy, sw, sh);
      ctx.clip();

      const slotAspect = sw / sh;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawW = sw, drawH = sh, drawX = sx, drawY = sy;

      if (imgAspect > slotAspect) {
        drawH = sh; drawW = sh * imgAspect;
        drawX = sx - (drawW - sw) / 2;
      } else {
        drawW = sw; drawH = sw / imgAspect;
        drawY = sy - (drawH - sh) / 2;
      }
      drawW /= slot.zoom; drawH /= slot.zoom;
      drawX -= (drawW - sw) * slot.offsetX * 0.5;
      drawY -= (drawH - sh) * slot.offsetY * 0.5;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    }

    // Textos sobre el doble ancho
    for (const t of leftPage.texts) {
      const tx = bleed + (t.x / 100) * (pageW * 2);
      const ty = bleed + (t.y / 100) * pageH;
      ctx.fillStyle = t.color;
      ctx.font = `${t.fontWeight} ${(t.fontSize * dpi) / 72}px ${t.fontFamily}`;
      ctx.textAlign = t.align;
      ctx.textBaseline = 'top';
      const lines = t.text.split('\n');
      lines.forEach((ln, idx) => {
        ctx.fillText(ln, tx, ty + (idx * t.fontSize * t.lineHeight * dpi) / 72);
      });
    }

    ctx.restore();
    return canvas;
  }

  // =====================================================
  // CASO NORMAL: dos páginas independientes
  // =====================================================

  // ----- Mitad IZQUIERDA -----
  if (leftPage) {
    // Fondo de la mitad izquierda
    ctx.fillStyle = leftPage.background || '#ffffff';
    ctx.fillRect(0, 0, bleed + pageW, hPx);

    // Clip al área de la página izquierda (incluyendo su bleed)
    ctx.save();
    ctx.beginPath();
    ctx.rect(bleed, bleed, pageW, pageH);
    ctx.clip();

    for (const slot of leftPage.slots) {
      if (!slot.photoId) continue;
      const photo = project.photos.find(p => p.id === slot.photoId);
      if (!photo) continue;
      const img = await loadImage(photo.url);

      const sx = bleed + (slot.x / 100) * pageW;
      const sy = bleed + (slot.y / 100) * pageH;
      const sw = (slot.w / 100) * pageW;
      const sh = (slot.h / 100) * pageH;

      ctx.save();
      ctx.beginPath();
      ctx.rect(sx, sy, sw, sh);
      ctx.clip();

      const slotAspect = sw / sh;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawW = sw, drawH = sh, drawX = sx, drawY = sy;

      if (imgAspect > slotAspect) {
        drawH = sh; drawW = sh * imgAspect;
        drawX = sx - (drawW - sw) / 2;
      } else {
        drawW = sw; drawH = sw / imgAspect;
        drawY = sy - (drawH - sh) / 2;
      }
      drawW /= slot.zoom; drawH /= slot.zoom;
      drawX -= (drawW - sw) * slot.offsetX * 0.5;
      drawY -= (drawH - sh) * slot.offsetY * 0.5;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    }

    for (const t of leftPage.texts) {
      const tx = bleed + (t.x / 100) * pageW;
      const ty = bleed + (t.y / 100) * pageH;
      ctx.fillStyle = t.color;
      ctx.font = `${t.fontWeight} ${(t.fontSize * dpi) / 72}px ${t.fontFamily}`;
      ctx.textAlign = t.align;
      ctx.textBaseline = 'top';
      const lines = t.text.split('\n');
      lines.forEach((ln, idx) => {
        ctx.fillText(ln, tx, ty + (idx * t.fontSize * t.lineHeight * dpi) / 72);
      });
    }
    ctx.restore();
  }

  // ----- Mitad DERECHA -----
  if (rightPage) {
    // Fondo de la mitad derecha
    ctx.fillStyle = rightPage.background || '#ffffff';
    ctx.fillRect(bleed + pageW, 0, bleed + pageW, hPx);

    ctx.save();
    ctx.beginPath();
    ctx.rect(bleed + pageW, bleed, pageW, pageH);
    ctx.clip();

    for (const slot of rightPage.slots) {
      if (!slot.photoId) continue;
      const photo = project.photos.find(p => p.id === slot.photoId);
      if (!photo) continue;
      const img = await loadImage(photo.url);

      const sx = bleed + pageW + (slot.x / 100) * pageW;
      const sy = bleed + (slot.y / 100) * pageH;
      const sw = (slot.w / 100) * pageW;
      const sh = (slot.h / 100) * pageH;

      ctx.save();
      ctx.beginPath();
      ctx.rect(sx, sy, sw, sh);
      ctx.clip();

      const slotAspect = sw / sh;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawW = sw, drawH = sh, drawX = sx, drawY = sy;

      if (imgAspect > slotAspect) {
        drawH = sh; drawW = sh * imgAspect;
        drawX = sx - (drawW - sw) / 2;
      } else {
        drawW = sw; drawH = sw / imgAspect;
        drawY = sy - (drawH - sh) / 2;
      }
      drawW /= slot.zoom; drawH /= slot.zoom;
      drawX -= (drawW - sw) * slot.offsetX * 0.5;
      drawY -= (drawH - sh) * slot.offsetY * 0.5;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    }

    for (const t of rightPage.texts) {
      const tx = bleed + pageW + (t.x / 100) * pageW;
      const ty = bleed + (t.y / 100) * pageH;
      ctx.fillStyle = t.color;
      ctx.font = `${t.fontWeight} ${(t.fontSize * dpi) / 72}px ${t.fontFamily}`;
      ctx.textAlign = t.align;
      ctx.textBaseline = 'top';
      const lines = t.text.split('\n');
      lines.forEach((ln, idx) => {
        ctx.fillText(ln, tx, ty + (idx * t.fontSize * t.lineHeight * dpi) / 72);
      });
    }
    ctx.restore();
  }

  return canvas;
}

/* ============================================================
 * HELPERS
 * ============================================================ */

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Exporta un spread (o portada) como JPEG usando el mismo motor de render.
 */
export async function exportPageToJpeg(
  project: Project,
  pageIndex: number,
  size: AlbumSize,
  dpi: number
): Promise<Blob> {
  const page = project.pages[pageIndex];
  if (!page) throw new Error('Página no encontrada');

  const isCover = page.kind === 'cover';
  const isSpanned = page.spanNext === true;

  let canvas: HTMLCanvasElement;

  if (isCover) {
    canvas = await renderPageToCanvas(project, page, size, dpi, 'cover');
  } else {
    const rightPage = isSpanned ? undefined : project.pages[pageIndex + 1];
    canvas = await renderSpreadToCanvas(project, page, rightPage, size, dpi, isSpanned);
  }

  return new Promise((resolve) => {
    canvas.toBlob(b => resolve(b!), 'image/jpeg', 0.92);
  });
}
