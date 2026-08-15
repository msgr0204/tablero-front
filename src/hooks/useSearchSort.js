import { useMemo, useState, useEffect } from 'react';

// El orden y los filtros se persisten en localStorage bajo persistKey para que
// sobrevivan a la navegación (salir a un módulo y volver) y a la recarga. La
// búsqueda de texto NO se persiste: una búsqueda vieja al volver confunde más
// que ayuda. Sin persistKey el hook funciona igual pero sin recordar nada.
function leerPersistido(persistKey) {
  if (!persistKey) return null;
  try {
    const saved = localStorage.getItem(`filtro_${persistKey}`);
    return saved !== null ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function useSearchSort(items, { searchKey = 'nombre', persistKey } = {}) {
  const persistido = leerPersistido(persistKey);

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(persistido?.sort ?? 'custom');
  const [filters, setFilters] = useState(persistido?.filters ?? {});

  useEffect(() => {
    if (!persistKey) return;
    localStorage.setItem(`filtro_${persistKey}`, JSON.stringify({ sort, filters }));
  }, [persistKey, sort, filters]);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({});

  const result = useMemo(() => {
    let list = items;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((item) => String(item[searchKey] ?? '').toLowerCase().includes(q));
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;
      list = list.filter((item) => (item[key] ?? '') === value);
    });

    if (sort === 'newest') {
      list = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sort === 'oldest') {
      list = [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sort === 'az') {
      list = [...list].sort((a, b) => String(a[searchKey]).localeCompare(String(b[searchKey])));
    } else if (sort === 'za') {
      list = [...list].sort((a, b) => String(b[searchKey]).localeCompare(String(a[searchKey])));
    }

    return list;
  }, [items, query, sort, searchKey, filters]);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return { result, query, setQuery, sort, setSort, filters, setFilter, clearFilters, hasActiveFilters };
}

export default useSearchSort;
