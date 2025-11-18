const FALLBACK_IMAGE = "https://via.placeholder.com/210x295?text=Sin+imagen";

// en este componente represento una tarjeta individual de serie y muestro imagen, nombre, fecha, valoración y botones.
// también detecto si una serie está en favoritos o no
function ShowCard({ show, favorites, onToggleFavorite, onSelect }) {
  // compruebo si esta serie ya está marcada como favorita
  const isFavorite = favorites.some((fav) => fav.id === show.id);

  return (
    <article className="show-card">
      {/* Imagen de la serie (si no hay uso la de fallback) */}
      <img src={show.image || FALLBACK_IMAGE} alt={`Póster de ${show.name}`} />

      <div className="show-info">
        {/* Nombre de la serie */}
        <h3>{show.name}</h3>

        {/* Fecha de estreno o mensaje si falta */}
        <p className="meta">
          {show.premiered ? `Estreno: ${show.premiered}` : "Fecha desconocida"}
        </p>

        {/* Valoración si tiene */}
        {show.rating && <p className="meta">Valoración: {show.rating}/10</p>}

        <div className="card-buttons">
          {/* Boton para añadir o quitar de favoritos */}
          {/* Uso una clase distinta si ya es favorita para pintarlo diferente */}
          <button
            type="button"
            className={isFavorite ? "favorite active" : "favorite"}
            onClick={() => onToggleFavorite(show)}
          >
            {isFavorite ? "Quitar" : "Favorito"}
          </button>

          {/* boton para abrir el modal con los detalles */}
          <button type="button" className="outline" onClick={() => onSelect(show.id)}>
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
}

export default ShowCard;
