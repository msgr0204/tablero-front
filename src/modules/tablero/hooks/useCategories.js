import { useState, useCallback } from 'react';
import categoryService from '../services/categoryService';

function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (payload) => {
    setMutating(true);
    setError(null);
    try {
      const newCategory = await categoryService.create(payload);
      setCategories((prev) => [newCategory, ...prev]);
      return newCategory;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const updateCategory = async (id, payload) => {
    setMutating(true);
    setError(null);
    try {
      const updated = await categoryService.update(id, payload);
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeCategory = async (id) => {
    setMutating(true);
    setError(null);
    try {
      await categoryService.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const reorderCategories = async (orderedIds) => {
    const previous = categories;
    setCategories((prev) => orderedIds.map((id) => prev.find((c) => c.id === id)).filter(Boolean));
    try {
      await categoryService.reorder(orderedIds);
    } catch (err) {
      setCategories(previous);
      setError(err.message);
      throw err;
    }
  };

  return {
    categories, loading, mutating, error,
    fetchCategories, createCategory, updateCategory, removeCategory, reorderCategories,
  };
}

export default useCategories;
