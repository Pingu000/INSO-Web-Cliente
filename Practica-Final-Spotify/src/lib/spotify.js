import { getAccessToken } from './auth';

// Genera una lista de canciones a partir de las preferencias seleccionadas en el dashboard
export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  // 1. Obtener top tracks de artistas seleccionados
  for (const artist of artists) {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await response.json();
    if (data.tracks) {
      // El endpoint devuelve 10 temas por artista; los añadimos al pool
      allTracks.push(...data.tracks);
    }
  }

  // 2. Buscar por géneros (Usando el endpoint de Search como pide el README)
  for (const genre of genres) {
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await response.json();
    if (data.tracks && data.tracks.items) {
      // Guardamos los resultados de búsqueda para mezclarlos con los top tracks de artistas
      allTracks.push(...data.tracks.items);
    }
  }

  // 3. Filtrar por década
  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      // Validamos que exista fecha
      if (!track.album.release_date) return false;
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // 4. Filtrar por popularidad
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Eliminar duplicados y limitar a 30 canciones
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  // Devolvemos la lista final, ya depurada, al dashboard
  return uniqueTracks;
}