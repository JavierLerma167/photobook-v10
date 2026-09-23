// ============================================================
// TEXTURAS PREDEFINIDAS (SVG inline, sin archivos externos)
// ============================================================
export interface Texture {
  id: string;
  name: string;
  /** dataURL de la textura (se genera con SVG inline) */
  url: string;
  /** Preview pequeño para el selector (mismo dataURL, se ve bien a cualquier tamaño) */
  preview: string;
}

const svgToDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function makeTexture(id: string, name: string, svg: string): Texture {
  const url = svgToDataUrl(svg);
  return { id, name, url, preview: url };
}

export const TEXTURES: Texture[] = [
  makeTexture('tex-paper-white', 'Papel blanco', `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <defs>
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.98  0 0 0 0 0.96  0 0 0 0 0.93  0 0 0 0.15 0"/>
        </filter>
      </defs>
      <rect width="200" height="200" fill="#faf8f4"/>
      <rect width="200" height="200" filter="url(#n)"/>
    </svg>
  `),
  makeTexture('tex-paper-cream', 'Papel crema', `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <defs>
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.78  0 0 0 0 0.65  0 0 0 0.2 0"/>
        </filter>
      </defs>
      <rect width="200" height="200" fill="#f2ebdd"/>
      <rect width="200" height="200" filter="url(#n)"/>
    </svg>
  `),
  makeTexture('tex-linen', 'Lino', `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <pattern id="p" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#ece7dc"/>
        <line x1="0" y1="0" x2="4" y2="4" stroke="#d9d2c2" stroke-width="0.6"/>
        <line x1="0" y1="4" x2="4" y2="0" stroke="#e6e0d3" stroke-width="0.4"/>
      </pattern>
      <rect width="40" height="40" fill="url(#p)"/>
    </svg>
  `),
  makeTexture('tex-canvas', 'Canvas', `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
      <pattern id="c" width="3" height="3" patternUnits="userSpaceOnUse">
        <rect width="3" height="3" fill="#e8dcc4"/>
        <rect width="1.5" height="3" fill="#dfd1b3" opacity="0.6"/>
        <rect width="3" height="1.5" fill="#eadfc9" opacity="0.5"/>
      </pattern>
      <rect width="30" height="30" fill="url(#c)"/>
    </svg>
  `),
  makeTexture('tex-concrete', 'Concreto', `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <defs>
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="3"/>
          <feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.6  0 0 0 0 0.62  0 0 0 0.35 0"/>
        </filter>
      </defs>
      <rect width="300" height="300" fill="#c9c9cb"/>
      <rect width="300" height="300" filter="url(#g)"/>
    </svg>
  `),
  makeTexture('tex-marble', 'Mármol', `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <filter id="m">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="4" seed="7"/>
          <feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.75  0 0 0 0 0.78  0 0 0 0.5 0"/>
        </filter>
      </defs>
      <rect width="400" height="400" fill="#f3f2f0"/>
      <rect width="400" height="400" filter="url(#m)"/>
    </svg>
  `),
  makeTexture('tex-wood-light', 'Madera clara', `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <defs>
        <linearGradient id="w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#d5b184"/>
          <stop offset="0.5" stop-color="#c9a173"/>
          <stop offset="1" stop-color="#d9b98e"/>
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.9" numOctaves="2"/>
          <feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.25  0 0 0 0 0.1  0 0 0 0.15 0"/>
        </filter>
      </defs>
      <rect width="200" height="200" fill="url(#w)"/>
      <rect width="200" height="200" filter="url(#grain)"/>
    </svg>
  `),
  makeTexture('tex-wood-dark', 'Madera oscura', `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <defs>
        <linearGradient id="w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#5a3d28"/>
          <stop offset="0.5" stop-color="#4a3020"/>
          <stop offset="1" stop-color="#6a4830"/>
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.9" numOctaves="2"/>
          <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.08  0 0 0 0 0.03  0 0 0 0.25 0"/>
        </filter>
      </defs>
      <rect width="200" height="200" fill="url(#w)"/>
      <rect width="200" height="200" filter="url(#grain)"/>
    </svg>
  `),
  makeTexture('tex-gradient-sunset', 'Degradado atardecer', `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fad6a5"/>
          <stop offset="0.5" stop-color="#e8a598"/>
          <stop offset="1" stop-color="#a8a3c9"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)"/>
    </svg>
  `),
  makeTexture('tex-gradient-blue', 'Degradado azul', `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#dbeafe"/>
          <stop offset="0.5" stop-color="#93c5fd"/>
          <stop offset="1" stop-color="#1e3a5f"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)"/>
    </svg>
  `),
  makeTexture('tex-gradient-warm', 'Degradado cálido', `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fef3c7"/>
          <stop offset="0.5" stop-color="#fbbf24"/>
          <stop offset="1" stop-color="#78350f"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)"/>
    </svg>
  `),
  makeTexture('tex-noise-dark', 'Ruido oscuro', `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <defs>
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="11"/>
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.3 0"/>
        </filter>
      </defs>
      <rect width="200" height="200" fill="#1a1a1a"/>
      <rect width="200" height="200" filter="url(#n)"/>
    </svg>
  `),
];

// ============================================================
// FUENTES DISPONIBLES (cargadas dinámicamente desde Google Fonts)
// ============================================================
export interface FontOption {
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  weights: number[];
}

export const FONT_OPTIONS: FontOption[] = [
  // Serif
  { family: 'Playfair Display', category: 'serif', weights: [400, 500, 700, 900] },
  { family: 'Cormorant Garamond', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Libre Baskerville', category: 'serif', weights: [400, 700] },
  { family: 'EB Garamond', category: 'serif', weights: [400, 500, 600, 700] },
  { family: 'Lora', category: 'serif', weights: [400, 500, 600, 700] },
  { family: 'Merriweather', category: 'serif', weights: [300, 400, 700, 900] },
  { family: 'Crimson Text', category: 'serif', weights: [400, 600, 700] },
  { family: 'Bodoni Moda', category: 'serif', weights: [400, 500, 700, 900] },
  { family: 'DM Serif Display', category: 'serif', weights: [400] },
  { family: 'DM Serif Text', category: 'serif', weights: [400] },
  { family: 'Cormorant', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Spectral', category: 'serif', weights: [200, 300, 400, 500, 600, 700, 800] },
  { family: 'Newsreader', category: 'serif', weights: [200, 300, 400, 500, 600, 700, 800] },
  { family: 'Source Serif 4', category: 'serif', weights: [200, 300, 400, 500, 600, 700, 900] },
  { family: 'Frank Ruhl Libre', category: 'serif', weights: [300, 400, 500, 700, 900] },
  { family: 'Fraunces', category: 'serif', weights: [100, 300, 400, 500, 700, 900] },
  { family: 'Bitter', category: 'serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Zilla Slab', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Roboto Slab', category: 'serif', weights: [100, 300, 400, 500, 700, 900] },
  { family: 'Abril Fatface', category: 'serif', weights: [400] },

  // Sans-serif
  { family: 'Inter', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Poppins', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Montserrat', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Raleway', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Lato', category: 'sans-serif', weights: [100, 300, 400, 700, 900] },
  { family: 'Open Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Roboto', category: 'sans-serif', weights: [100, 300, 400, 500, 700, 900] },
  { family: 'Work Sans', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Nunito', category: 'sans-serif', weights: [200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Josefin Sans', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700] },
  { family: 'Quicksand', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Mulish', category: 'sans-serif', weights: [200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Karla', category: 'sans-serif', weights: [200, 300, 400, 500, 600, 700, 800] },
  { family: 'Manrope', category: 'sans-serif', weights: [200, 300, 400, 500, 600, 700, 800] },
  { family: 'Barlow', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Archivo', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Outfit', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { family: 'Space Grotesk', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Sora', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800] },

  // Display
  { family: 'Bebas Neue', category: 'display', weights: [400] },
  { family: 'Anton', category: 'display', weights: [400] },
  { family: 'Archivo Black', category: 'display', weights: [400] },
  { family: 'Oswald', category: 'display', weights: [200, 300, 400, 500, 600, 700] },
  { family: 'Bungee', category: 'display', weights: [400] },
  { family: 'Righteous', category: 'display', weights: [400] },
  { family: 'Cinzel', category: 'display', weights: [400, 500, 600, 700, 800, 900] },
  { family: 'Italiana', category: 'display', weights: [400] },

  // Handwriting
  { family: 'Dancing Script', category: 'handwriting', weights: [400, 500, 600, 700] },
  { family: 'Great Vibes', category: 'handwriting', weights: [400] },
  { family: 'Pacifico', category: 'handwriting', weights: [400] },
  { family: 'Satisfy', category: 'handwriting', weights: [400] },
  { family: 'Caveat', category: 'handwriting', weights: [400, 500, 600, 700] },
  { family: 'Sacramento', category: 'handwriting', weights: [400] },
  { family: 'Kalam', category: 'handwriting', weights: [300, 400, 700] },

  // Monospace
  { family: 'JetBrains Mono', category: 'monospace', weights: [100, 200, 300, 400, 500, 600, 700, 800] },
  { family: 'Space Mono', category: 'monospace', weights: [400, 700] },
  { family: 'IBM Plex Mono', category: 'monospace', weights: [100, 200, 300, 400, 500, 600, 700] },
];

/**
 * Carga una fuente de Google Fonts dinámicamente inyectando un <link>.
 * Evita duplicados.
 */
const loadedFonts = new Set<string>();

export function loadGoogleFont(family: string, weights: number[] = [400]) {
  if (typeof document === 'undefined') return;
  const key = `${family}:${weights.join(',')}`;
  if (loadedFonts.has(key)) return;
  loadedFonts.add(key);

  const familyParam = family.replace(/\s+/g, '+');
  const weightsParam = weights.sort((a, b) => a - b).join(';');
  const url = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weightsParam}&display=swap`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Carga todas las fuentes. Se llama una sola vez al inicio de la app.
 */
export function loadAllFonts() {
  FONT_OPTIONS.forEach(f => loadGoogleFont(f.family, f.weights));
}