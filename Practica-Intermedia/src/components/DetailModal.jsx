const FALLBACK_IMAGE = "https://via.placeholder.com/210x295?text=Sin+imagen";

// en este componente muestro el modal con la información detallada de una serie
// Solo se renderiza cuando "show" tiene datos. Si es null, no se ve nada
function DetailModal({ show, onClose }) {
  if (!show) return null; // Si no hay serie seleccionada, no mostramos el modal.

  return (
    // Fondo oscuro del modal
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        {/* Boton para cerrar el modal */}
        <button type="button" className="close" onClick={onClose}>
          Cerrar
        </button>

        {/* titulo principal con el nombre de la serie */}
        <h2>{show.name}</h2>

        <div className="modal-body">
          {/* Imagen grande de la serie. Si no tiene, uso fallback */}
          <img src={show.image?.original || FALLBACK_IMAGE} alt={show.name} />

          <div>
            {/* Generos si hay */}
            {show.genres?.length > 0 && (
              <p>
                <strong>Géneros:</strong> {show.genres.join(", ")}
              </p>
            )}

            {/* la fecha de estreno */}
            {show.premiered && (
              <p>
                <strong>Estreno:</strong> {show.premiered}
              </p>
            )}

            {/* valoración */}
            {show.rating?.average && (
              <p>
                <strong>Valoración:</strong> {show.rating.average}/10
              </p>
            )}

            {/* enlace a la web oficial si tiene */}
            {show.officialSite && (
              <p>
                <strong>Web oficial:</strong>{" "}
                <a href={show.officialSite} target="_blank" rel="noreferrer">
                  {show.officialSite}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* descripción de la serie */}
        {/* La API devuelve la sinopsis en HTML, así que la limpio. */}
        <p className="summary">
          {show.summary?.replace(/<[^>]+>/g, "") || "No hay descripción"}
        </p>
      </div>
    </div>
  );
}

export default DetailModal;
