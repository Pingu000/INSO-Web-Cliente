'use client';
export default function PopularityWidget({ popularity, onSelect }) {
  const ranges = [
    { label: 'Ocultas', value: [0, 50] },
    { label: 'Hits', value: [50, 80] },
    { label: 'Top 50', value: [80, 100] },
    { label: 'Todo', value: [0, 100] },
  ];
  // Comprobamos si el rango actual coincide con el botón renderizado
  const isActive = (v) => JSON.stringify(popularity) === JSON.stringify(v);

  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-lg">
      <h3 className="font-bold text-white mb-3">3. Popularidad</h3>
      <div className="grid grid-cols-2 gap-2">
        {/* Cada botón representa el intervalo de popularidad que se enviará a la búsqueda */}
        {ranges.map((range) => (
          <button
            key={range.label}
            onClick={() => onSelect(range.value)}
            className={`py-3 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
              isActive(range.value)
                ? 'bg-zinc-800 border-green-500 text-green-500'
                : 'bg-zinc-800/50 border-transparent text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}