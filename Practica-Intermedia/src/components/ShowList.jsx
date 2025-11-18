import ShowCard from "./ShowCard.jsx";

// en este componente muestro una sección de series
// Lo uso tanto para la lista de favoritos como para la lista general
// Recibe el titulo, las series a mostrar y las funciones para favoritos y detalles
function ShowList({ title, shows, favorites, onToggleFavorite, onSelect, emptyMessage }) {
  return (
    <section className="show-section">
      <div className="section-header">
        {/* Título de la sección, por ejemplo Tus favoritas o Todas las series */}
        <h2>{title}</h2>

        {/* Contador de cuantas series hay en la lista */}
        <span className="count">{shows.length} series</span>
      </div>

      {/* Si no hay series, muestro un mensaje vacio (tipo no hay favoritas) */}
      {shows.length === 0 ? (
        <p className="empty-message">{emptyMessage}</p>
      ) : (
        // si si hay series, muestro un grid de tarjetas Show card
        <div className="show-grid">
          {shows.map((show) => (
            // Cada tarjeta es un componente Show card separado
            <ShowCard
              key={show.id}
              show={show}               // datos de la serie
              favorites={favorites}     // lista completa de favoritos
              onToggleFavorite={onToggleFavorite} // función para añadir oquitar favorito
              onSelect={onSelect}       // función para abrir el modal con detalles
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ShowList;
