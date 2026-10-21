import { Photo } from '@/src/types';
import { nanoid } from 'nanoid';

/**
 * Convierte un archivo de imagen a un objeto Photo.
 * Utiliza Base64 en lugar de ObjectURL para garantizar que la imagen
 * sobreviva a recargas de página y se guarde correctamente en localStorage.
 */
export async function fileToPhoto(file: File): Promise<Photo> {
  // 1. Convertimos el archivo a Base64 (data:image/...)
  const base64Url = await fileToBase64(file);
  
  // 2. Obtenemos las dimensiones reales
  const dims = await getImageDimensions(base64Url);
  
  // 3. Creamos un proxy (miniatura) en Base64 para la biblioteca
  const proxyUrl = await createProxy(base64Url, 400);

  return {
    id: nanoid(10),
    name: file.name,
    url: base64Url, // Guardamos el Base64 completo
    proxyUrl,       // Guardamos la miniatura en Base64
    width: dims.width,
    height: dims.height,
    sizeBytes: file.size,
    favorite: false,
    createdAt: Date.now()
  };
}

/**
 * Lee un archivo local y lo devuelve como un string Base64.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Obtiene las dimensiones de una imagen a partir de su URL (Base64 o URL normal).
 */
function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Genera una versión reducida (miniatura) de la imagen usando un canvas.
 * El resultado también se devuelve en Base64.
 */
async function createProxy(url: string, maxSide: number): Promise<string> {
  const img = await loadImage(url);
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo obtener el contexto 2D del canvas');
  
  ctx.drawImage(img, 0, 0, w, h);
  
  // Exportamos como JPEG con calidad 0.8 para reducir el peso del Base64
  return canvas.toDataURL('image/jpeg', 0.8);
}

/**
 * Carga una imagen en memoria a partir de una URL.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}