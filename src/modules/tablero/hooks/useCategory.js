import { useState, useCallback } from 'react';
import categoryService from '../services/categoryService';

function useCategory(categoryId) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategory = useCallback(async () => {
    if (!categoryId) return null;
    setLoading(true);
    try {
      const data = await categoryService.getById(categoryId);
      setCategory(data);
      return data;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  return { category, loading, fetchCategory };
}

export default useCategory;
