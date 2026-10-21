'use client';
import { useStore } from '@/src/store/projectStore';
import { Loader2 } from 'lucide-react';

export function GlobalLoader() {
  const isLoading = useStore(s => s.ui.isLoading);
  const message = useStore(s => s.ui.loadingMessage);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex flex-col items-center justify-center backdrop-blur-sm">
      <Loader2 className="w-10 h-10 text-evr-accent animate-spin mb-4" />
      <p className="text-white text-sm font-medium">{message || 'Cargando...'}</p>
    </div>
  );
}