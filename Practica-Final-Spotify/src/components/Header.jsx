'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function Header() {
  const router = useRouter();

  // Limpia los tokens locales y vuelve a la pantalla de login
  const handleLogout = () => {
    logout();
    // Usamos el router de Next para reiniciar el flujo y evitar estados inconsistentes
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/20 text-lg font-bold text-green-200">
            ♪
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-green-300">Spotify</p>
            <h1 className="text-xl font-semibold text-white">Taste Mixer</h1>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-green-400 hover:text-green-200"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}