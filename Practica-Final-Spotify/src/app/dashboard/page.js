'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { generatePlaylist } from '@/lib/spotify';

import Header from '@/components/Header';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';

export default function Dashboard() {
  const router = useRouter();
  // Flags y datos para la vista
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  // Si está activo no se limpia la playlist anterior al mezclar de nuevo
  const [keepTracks, setKeepTracks] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  // Preferencias de búsqueda que alimentarán la generación de playlist
  const [preferences, setPreferences] = useState({
    artists: [],
    genres: [],
    decades: [],
    popularity: [0, 100]
  });

  useEffect(() => {
    // En cuanto cargue la página verificamos si hay sesión válida
    if (!isAuthenticated()) {
      router.push('/');
    } else {
      setLoading(false);
      // Recuperamos los favoritos almacenados en el navegador para persistencia local
      const savedFavs = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
      // Guardamos el resultado para que se pinte el contador de favoritos inicial
      setFavorites(savedFavs);
    }
  }, [router]);

  // Callbacks de widgets para actualizar el estado global de preferencias
  const updateGenres = (g) => setPreferences(p => ({ ...p, genres: g }));
  const updateDecades = (d) => setPreferences(p => ({ ...p, decades: d }));
  const updatePopularity = (pop) => setPreferences(p => ({ ...p, popularity: pop }));

  const toggleFavorite = (track) => {
    // Añade o quita un track de la lista local de favoritos
    const isFav = favorites.some(f => f.id === track.id);
    let newFavs;
    if (isFav) newFavs = favorites.filter(f => f.id !== track.id);
    else newFavs = [...favorites, track];

    setFavorites(newFavs);
    localStorage.setItem('favorite_tracks', JSON.stringify(newFavs));
  };

  const isFavorite = (id) => favorites.some(f => f.id === id);

  const handleGenerate = async () => {
    // Ejecuta el flujo principal que consulta Spotify y arma la playlist
    setIsGenerating(true);
    try {
      const newTracks = await generatePlaylist(preferences);
      if (keepTracks) {
        setPlaylist(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          // Solo anexamos canciones nuevas para evitar duplicados visibles
          const uniqueNewTracks = newTracks.filter(t => !existingIds.has(t.id));
          return [...prev, ...uniqueNewTracks];
        });
      } else {
        setPlaylist(newTracks);
      }
    } catch (error) {
      console.error(error);
      alert("Error generando playlist. Revisa la consola.");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeTrack = (trackId) => {
    setPlaylist(playlist.filter(t => t.id !== trackId));
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-green-500">Cargando...</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <Header />

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Resumen rápido de las preferencias activas */}
          {[{ title: 'Géneros elegidos', value: `${preferences.genres.length}/5` }, { title: 'Décadas activas', value: preferences.decades.length || 'Ninguna' }, { title: 'Popularidad', value: `${preferences.popularity[0]} - ${preferences.popularity[1]}` }].map((item) => (
            <div key={item.title} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{item.title}</p>
              <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-green-300">Preferencias</p>
                <h2 className="text-xl font-semibold">Ajusta tu mezcla</h2>
              </div>

              <GenreWidget selectedGenres={preferences.genres} onSelect={updateGenres} />
              <DecadeWidget selectedDecades={preferences.decades} onSelect={updateDecades} />
              <PopularityWidget popularity={preferences.popularity} onSelect={updatePopularity} />
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Mantener canciones previas</p>
                  <p className="text-xs text-zinc-400">Si está activo, añadirá las nuevas a la lista actual.</p>
                </div>
                <button
                  onClick={() => setKeepTracks(!keepTracks)}
                  className={`flex h-8 w-14 items-center rounded-full border border-neutral-700 px-1 transition-colors ${keepTracks ? 'bg-green-500/70' : 'bg-neutral-800'}`}
                  aria-pressed={keepTracks}
                >
                  <span className={`h-6 w-6 rounded-full bg-white transition-transform ${keepTracks ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <button
                onClick={handleGenerate}
                disabled={preferences.genres.length === 0 || isGenerating}
                className="w-full rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? 'Mezclando...' : 'Generar playlist'}
              </button>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-green-300">Playlist</p>
                  <h2 className="text-2xl font-semibold">Tu selección</h2>
                  <p className="text-sm text-zinc-400">{playlist.length} canciones en la lista</p>
                </div>

                {playlist.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPlaylist([])}
                      className="rounded-full border border-neutral-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-200 transition-colors hover:border-red-400 hover:text-white"
                    >
                      Borrar todo
                    </button>
                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-[11px] font-semibold text-green-200">Favoritos: {favorites.length}</span>
                  </div>
                )}
              </div>

              <div className="min-h-[360px]">
                {playlist.length === 0 ? (
                  <div className="flex h-[320px] flex-col items-center justify-center space-y-2 rounded-lg border border-dashed border-neutral-800 bg-neutral-950 text-center text-sm text-zinc-400">
                    <div className="text-3xl">🎧</div>
                    <p className="text-base font-semibold text-white">Aún no hay canciones</p>
                    <p>Elige tus preferencias y pulsa "Generar playlist".</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {playlist.map((track, index) => (
                      <div
                        key={`${track.id}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3"
                      >
                        <span className="w-6 text-center text-sm text-zinc-500">{index + 1}</span>

                        <img
                          src={track.album.images[0]?.url || ''}
                          alt={track.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-semibold ${isFavorite(track.id) ? 'text-green-300' : 'text-white'}`}>{track.name}</p>
                          <p className="truncate text-xs text-zinc-400">{track.artists.map(a => a.name).join(', ')}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFavorite(track)}
                            className={`h-8 w-8 rounded-full border text-sm transition-colors ${isFavorite(track.id) ? 'border-green-400 text-green-200' : 'border-neutral-800 text-zinc-300 hover:border-neutral-600'}`}
                            title="Favoritos"
                          >
                            {isFavorite(track.id) ? '❤️' : '♡'}
                          </button>
                          <button
                            onClick={() => removeTrack(track.id)}
                            className="h-8 w-8 rounded-full border border-neutral-800 text-sm text-zinc-300 transition-colors hover:border-red-400 hover:text-red-300"
                            title="Eliminar"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
