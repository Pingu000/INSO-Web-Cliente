function SearchBar({
  query,
  onQueryChange,
  onSearch,
  onClear,
  suggestions,
  onSuggestionSelect,
  isLoading,
}) {
  // Manejo del submit del formulario.
  // evito el comportamiento por defecto y llamo a la función de búsqueda.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    // Formulario principal de busqueda
    <form className="search-bar" onSubmit={handleSubmit} autoComplete="off">
      <label htmlFor="search-input">Busca una serie</label>

      {/* Input donde el usuario escribe el nombre de la serie */}
      {/* Cada vez que escribe actualizo el estadodel query */}
      <input
        id="search-input"
        type="text"
        placeholder="Ej. Dark, Friends..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      <div className="search-actions">
        {/* Boton para limpiar la búsqueda solo aparece si hay texto */}
        {query && (
          <button type="button" onClick={onClear} className="secondary">
            Limpiar
          </button>
        )}

        {/* Boton de buscar. Si está cargando, cambiar el texto */}
        <button type="submit" className="primary">
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* Lista de sugerencias mientras el usuario escribe */}
      {suggestions.length > 0 && (
        <ul className="search-suggestions" role="listbox">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              {/* Cada sugerencia es un boton que completa la busqueda directamente */}
              <button type="button" onClick={() => onSuggestionSelect(suggestion.name)}>
                <img src={suggestion.image} alt="" aria-hidden="true" />
                <span>{suggestion.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default SearchBar;
