import { useState, useEffect, useRef } from "react";
import SearchBar from "./components/SearchBar.jsx";
import ShowList from "./components/ShowList.jsx";
import DetailModal from "./components/DetailModal.jsx";
import "./styles/App.css";

// URLS principales para hacer las peticiones a la API 
const SEARCH_URL = "https://api.tvmaze.com/search/shows?q=";
const SHOWS_URL = "https://api.tvmaze.com/shows";
const SHOW_DETAIL_URL = "https://api.tvmaze.com/shows/";
const STORAGE_KEY = "favoritos";
const FALLBACK_IMAGE = "https://via.placeholder.com/210x295?text=Sin+imagen";

// Funcion para formatear cada serie que viene de la API
// dejo solo lo que yo necesito para mostrar en las tarjetas
const formatShow = (show) => ({
  id: show.id,
  name: show.name,
  image: show.image?.medium ?? FALLBACK_IMAGE,
  rating: show.rating?.average ?? null,
  premiered: show.premiered ?? "",
});

function App() {
  // Estados principales de la app
  const [shows, setShows] = useState([]);                 // series que muestro en la lista principal
  const [favorites, setFavorites] = useState([]);         // series guardadas por el usuario
  const [selectedShow, setSelectedShow] = useState(null); // serie seleccionada para ver detalles
  const [loading, setLoading] = useState(false);          // para mostrar el "cargando.....
  const [query, setQuery] = useState("");                 // texto que escribe el usuario en la barra
  const [suggestions, setSuggestions] = useState([]);     // sugerencias mientras escribe
  const [feedback, setFeedback] = useState("");           // mensajes tipo "no se encontraron series"

  // Cargo favoritos del local sorage cuando inicia la web
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Cada vez que cambian los favoritos los guardo en local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Cargar catalogo inicial de series populares
  useEffect(() => {
    loadAllShows();
  }, []);

  // Sistema de sugerencias mientras el usuario escribe
  // Si hay menos de 2 letras, no muestro nada
  // Uso un setTimeout para no hacer peticiones cada milisegundo
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(SEARCH_URL + encodeURIComponent(query.trim()));
        const data = await response.json();
        const clean = data.map((item) => formatShow(item.show)).slice(0, 5);
        setSuggestions(clean);
      } catch (error) {
        console.error("No han podido obtener sugerencias", error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // carga inicial de series populares
  const loadAllShows = async () => {
    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch(SHOWS_URL);
      const data = await response.json();
      const clean = data.slice(0, 60).map(formatShow); // limito el número para que la página cargue mas rapido
      setShows(clean);
    } catch (error) {
      console.error("Error al cargar las series iniciales", error);
      setFeedback("No se han podido cargar las series populares.");
    }

    setLoading(false);
  };

  // Buscar series cuando el usuario hace clic en el botón o selecciona una sugerencia
  const handleSearch = async (searchText) => {
    const term = typeof searchText === "string" ? searchText : query;
    const normalizedTerm = term.trim();
    setQuery(term);

    // Si limpia la busqueda, vuelvo a cargar las series iniciales
    if (!normalizedTerm) {
      setSuggestions([]);
      await loadAllShows();
      return;
    }

    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch(SEARCH_URL + encodeURIComponent(normalizedTerm));
      const data = await response.json();
      const clean = data.map((item) => formatShow(item.show));
      setShows(clean);

      if (clean.length === 0) {
        setFeedback("No hay series con ese nombre.");
      }
    } catch (error) {
      console.error("Error buscando las series", error);
      setFeedback("Hubo un problema con la búsqueda.");
    }

    setLoading(false);
  };

  // Añadir o quitar una serie de favoritos
  const handleFavorite = (show) => {
    const exists = favorites.some((fav) => fav.id === show.id);

    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== show.id));
    } else {
      setFavorites([...favorites, show]);
    }
  };

  // Abrir modal con detalles de una serie
  const openDetail = async (id) => {
    try {
      const res = await fetch(SHOW_DETAIL_URL + id);
      const data = await res.json();
      setSelectedShow(data);
    } catch (error) {
      console.error("Error cargando detalles", error);
    }
  };

  // Cerrar el modal
  const closeDetail = () => {
    setSelectedShow(null);
  };

  // Cuando el usuario pulsa una sugerencia del menú
  const handleSuggestionSelect = (name) => {
    setSuggestions([]);
    handleSearch(name);
  };

  // Boton de limpiar búsqueda
  const handleClearSearch = async () => {
    setQuery("");
    setSuggestions([]);
    await loadAllShows();
  };

  return (
    <div className="app">
      <header className="intro">
        <h1>Tus series</h1>
        <p>
          Busca tus series favoritas, lee sus descripciones y guarda las que más te gusten.
        </p>
      </header>

      {/* Barra de busqueda con sugerencias */}
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        suggestions={suggestions}
        onSuggestionSelect={handleSuggestionSelect}
        isLoading={loading}
      />

      {/* Lista de favoritos */}
      <ShowList
        title="Tus favoritas"
        shows={favorites}
        favorites={favorites}
        onToggleFavorite={handleFavorite}
        onSelect={openDetail}
        emptyMessage="Todavia no hay series guardadas."
      />

      {/* Mensajes de feedback como cargando o no hay resultados */}
      {loading && <p className="feedback">Cargando series...</p>}
      {feedback && !loading && <p className="feedback">{feedback}</p>}

      {/* Lista principal de todas las series */}
      <ShowList
        title="Todas las series"
        shows={shows}
        favorites={favorites}
        onToggleFavorite={handleFavorite}
        onSelect={openDetail}
        emptyMessage="Aun no hay series para mostrar."
      />

      {/* modal con la informacion detallada de una serie */}
      <DetailModal show={selectedShow} onClose={closeDetail} />
    </div>
  );
}

export default App;
