import { useMemo, useState } from 'react';

function useSearchSort(items, { searchKey = 'nombre' } = {}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('custom');
  const [filters, setFilters] = useState({});

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
