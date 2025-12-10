'use client';

import { getSpotifyAuthUrl } from '@/lib/auth';

export default function LoginPage() {
  // Redirige al usuario al flujo de OAuth de Spotify cuando pulsa el botón
  const handleLogin = () => {
    // Obtenemos la URL de autorización desde la librería proporcionada
    const url = getSpotifyAuthUrl();
    // Redirigimos al usuario a Spotify para que acepte los scopes solicitados
    window.location.href = url;
  };

  return (
    // Pantalla de inicio con CTA de login
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">Spotify Taste Mixer</h1>
          <p className="text-sm text-zinc-400">Crea playlists a partir de tus gustos con unos pocos clics.</p>
        </div>

        <div className="mt-8 w-full space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
          <p className="text-sm text-zinc-300">Usa tu cuenta de Spotify para acceder al panel y empezar a mezclar.</p>
          <button
            onClick={handleLogin}
            className="w-full rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-400"
          >
            Entrar con Spotify
          </button>
          <p className="text-xs text-zinc-500">Autenticación oficial de Spotify. No almacenamos tus credenciales.</p>
        </div>
      </div>
    </main>
  );
}