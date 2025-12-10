'use client';
export default function DecadeWidget({ selectedDecades, onSelect }) {
  const decades = ['1960', '1970', '1980', '1990', '2000', '2010', '2020'];

  const toggleDecade = (d) => {
    // Activa o desactiva la década seleccionada sin límite de cantidad
    if (selectedDecades.includes(d)) onSelect(selectedDecades.filter(x => x !== d));
    else onSelect([...selectedDecades, d]);
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-lg">
      <h3 className="font-bold text-white mb-3">2. Décadas</h3>
      <div className="grid grid-cols-4 gap-2">
        {decades.map(decade => (
          <button
            key={decade}
            onClick={() => toggleDecade(decade)}
            className={`py-2 rounded-md text-xs font-bold transition-all ${
              selectedDecades.includes(decade)
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {/* Añadimos la "s" para indicar que cubre toda la década */}
            {decade}s
          </button>
        ))}
      </div>
    </div>
  );
}