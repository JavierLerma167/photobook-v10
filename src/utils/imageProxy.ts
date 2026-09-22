import { Photo } from '@/src/types';
import { nanoid } from 'nanoid';

export async function fileToPhoto(file: File): Promise<Photo> {
  const originalUrl = URL.createObjectURL(file);
  const dims = await getImageDimensions(originalUrl);
  const proxyUrl = await createProxy(originalUrl, 400);

  return {
    id: nanoid(10),
    name: file.name,
    url: originalUrl,
    proxyUrl,
    width: dims.width,
    height: dims.height,
    sizeBytes: file.size,
    favorite: false,
    createdAt: Date.now()
  };
}

function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}

async function createProxy(url: string, maxSide: number): Promise<string> {
  const img = await loadImage(url);
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.8);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
