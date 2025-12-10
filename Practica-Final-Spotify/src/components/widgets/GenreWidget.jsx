'use client';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/auth';

export default function GenreWidget({ selectedGenres, onSelect }) {
  const [availableGenres, setAvailableGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargamos los géneros disponibles desde Spotify al montar el componente
    async function fetchGenres() {
      const token = getAccessToken();
      // Si no hay token, el componente no puede hacer la petición protegida
      if (!token) return setLoading(false);
      try {
        const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setAvailableGenres(data.genres ? data.genres.slice(0, 20) : []);
      } catch (error) {
        // En caso de error de red o token, mostramos un set de respaldo para continuar la demo
        setAvailableGenres(['pop', 'rock', 'hip-hop', 'electronic', 'latin', 'indie', 'metal', 'jazz']);
      } finally {
        setLoading(false);
      }
    }
    fetchGenres();
  }, []);

  const toggleGenre = (genre) => {
    // Permite seleccionar hasta 5 géneros y alternar su estado
    if (selectedGenres.includes(genre)) {
      onSelect(selectedGenres.filter(g => g !== genre));
    } else {
      if (selectedGenres.length >= 5) return;
      // Sumamos el nuevo género respetando el límite para acotar las llamadas a la API
      onSelect([...selectedGenres, genre]);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white">1. Géneros</h3>
        <span className="text-xs bg-zinc-800 px-2 py-1 rounded-md text-zinc-400">{selectedGenres.length}/5</span>
      </div>
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
        {loading ? <p className="text-xs text-zinc-500">Cargando...</p> : availableGenres.map(genre => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all duration-200 border ${
              selectedGenres.includes(genre)
                ? 'bg-green-500 text-black border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                : 'bg-zinc-800 text-zinc-300 border-transparent hover:bg-zinc-700 hover:border-zinc-600'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}